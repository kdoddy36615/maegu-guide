"""Build data/abilities.json and data/dps.json from:
  - the curated REGISTRY below (canonical ids, shortcodes, inputs, roles, protection enums)
  - research/bdocodex/tooltips.json (descriptions + protection lines; live, patch-sensitive)
  - sources/dps-data.md (locked PvE DPS table)

Refresh flow for live facts (descriptions / protections):
  1. re-pull raw tooltips:  curl "https://bdocodex.com/tip.php?id=skill--<ID>&l=us" -o research/bdocodex/raw/skill-<ID>.html
  2. cd research/bdocodex && python parse_tooltips.py
  3. python scripts/build_abilities.py   (run from repo root)
  4. review diffs — a changed protection line means the curated enum below needs re-review.

Every PvE DPS number traces to sources/dps-data.md (which traces to the author's sheet).
Protection enums were curated 2026-06-11 from the tooltip lines (see research/source-decisions.md).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PULL_DATE = "2026-06-11"
TOOLTIP_SOURCE = "BDO Codex (mirrors live in-game skill text)"

# protection enums: ordered iframe > super_armor > frontal_guard > none.
# pve/pvp split because several protections are "(PvE only)" in the tooltip.
# fmt: off
REGISTRY = [
    # --- Prime (succession) core kit ---
    dict(id="spirited-away", bdocodex_id=7285, shortcodes=[":P_Spirited_Away:"], inputs=["S+LMB"],
         kind="prime", roles=["dps", "cc"], protection_pve="frontal_guard", protection_pvp="frontal_guard",
         protection_notes="Tooltip says Forward Guard; discord-pvp loosely calls the Spirited Away engage "
                          "'fully SA' — read as the combo tail being SA, flagged for grill."),
    dict(id="heavenward-dance", bdocodex_id=7280, shortcodes=[":P_Heavenward_Dance:"], inputs=["W+RMB"],
         kind="prime", roles=["dps", "repositioning"], protection_pve="super_armor", protection_pvp="super_armor"),
    dict(id="spirit-swirl", bdocodex_id=7306, shortcodes=[":P_Spirit_Swirl:"], inputs=["Shift+F"],
         kind="prime", roles=["dps"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Slow when cast from idle — use anything before it (discord-pve).",
                "All skills flow into it instantly (cancels sheet)."]),
    dict(id="foxflare", bdocodex_id=7293, shortcodes=[":P_Foxflare:"], inputs=["Shift+Q"],
         kind="prime", roles=["dps", "cc"], protection_pve="none", protection_pvp="none",
         notes=["Knockdown in PvP — the only reliable re-CC after it is Petal Play (discord-pvp)."]),
    dict(id="petal-play", bdocodex_id=7303, shortcodes=[":P_Petal_Play:"], inputs=["Shift+LMB"],
         kind="prime", roles=["dps", "cc"], protection_pve="none", protection_pvp="none",
         notes=["Much faster (cancelled) after Spirited Away or Bared Claws — see cancels."]),
    dict(id="nukduri-dance", bdocodex_id=7252, shortcodes=[":P_Nukduri_Dance:"], inputs=["Shift+C"],
         kind="prime", roles=["dps", "buff"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["+20 AP buff (does not stack with Charmed / Nether River).",
                "HP-regen addon notably strong on evasion AOS builds (discord-pvp)."]),
    dict(id="bristling-sparks", bdocodex_id=7289, shortcodes=[":P_Bristling_Sparks:"], inputs=["Shift+RMB"],
         kind="prime", roles=["dps", "cc"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Big frontal AoE; short-midrange CC in PvP.",
                "All skills flow into it instantly (cancels sheet)."]),
    dict(id="lurking-claws", bdocodex_id=7282, shortcodes=[":P_Lurking_Claws:"], inputs=["S+F"],
         kind="prime", roles=["dps", "movement", "repositioning"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Targeted teleport behind target on hit 2 — hold the input until you teleport (input trap).",
                "DPS sheet names it 'Lurking Claw' (singular); official name is plural."]),
    dict(id="foxspirit-tag", bdocodex_id=7284, shortcodes=[":P_Foxspirit_Tag:"], inputs=["RMB"],
         kind="prime", roles=["dps", "debuff"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["-20 DP debuff — apply at the start of fights (stacks with addon -DR)."]),
    dict(id="flower-shroud", bdocodex_id=7297, shortcodes=[":P_Flower_Shroud:", ":Flower_Shroud:"], inputs=["W+E", "S+E"],
         kind="prime", roles=["dps", "repositioning", "cc"], protection_pve="frontal_guard", protection_pvp="frontal_guard",
         notes=["Only W+E places a clone; S+E does not (video + cancels sheet).",
                "First hit can whiff if dragged onto the enemy — PvP combos can start from hit 2 (discord-pvp)."]),
    dict(id="bared-claws", bdocodex_id=7281, shortcodes=[":P_Bared_Claws:"], inputs=["A+LMB", "D+LMB"],
         kind="prime", roles=["dps", "repositioning"], protection_pve="frontal_guard", protection_pvp="frontal_guard",
         protection_notes="Forward Guard is nullified during cooldown.",
         notes=["Asymmetrical cancel: D+LMB cancels after attack 1, A+LMB after attack 2.",
                "Spawns a clone to the side. Eats stamina if spammed."]),
    dict(id="ghost-bomb", bdocodex_id=7283, shortcodes=[":P_Ghost_Bomb:"], inputs=["A+RMB", "D+RMB"],
         kind="prime", roles=["dps", "movement"], protection_pve="iframe", protection_pvp="iframe",
         protection_notes="Invincible while moving (the dash portion).",
         notes=["Short side dash; best Hanpuri entry for movement."]),
    dict(id="soul-tear", bdocodex_id=7300, shortcodes=[":P_Soul_Tear:"], inputs=["W+Q"],
         kind="prime", roles=["dps", "movement", "cc"], protection_pve="super_armor", protection_pvp="super_armor",
         protection_notes="Super Armor before the attack hits (not the full animation).",
         notes=["Fastest, most stamina-efficient medium-distance movement in the kit.",
                "Spawns a clone behind you. Used as clone bait in PvP."]),
    dict(id="fan-of-flames", bdocodex_id=7251, shortcodes=[], inputs=["W+C"],
         kind="prime", roles=["utility"], protection_pve="none", protection_pvp="none",
         notes=["Appears in no source rotation; cancels sheet only lists ways to cancel its recovery."]),

    # --- Pre-awakening kit (Absolute where it exists) ---
    dict(id="soulflame", bdocodex_id=7234, shortcodes=[":Soulflame:"], inputs=["E"],
         kind="preawk", roles=["dps"], protection_pve="none", protection_pvp="none",
         notes=["Kept usable by leaving the Magnus skill unlearned (discord-pve)."]),
    dict(id="soulsnare", bdocodex_id=7238, shortcodes=[":Soulsnare:"], inputs=["F"],
         kind="preawk", roles=["dps"], protection_pve="none", protection_pvp="none",
         notes=["Fast into Bared Claws or Flow: Hanpuri (discord-pve)."]),
    dict(id="hanpuri", bdocodex_id=7228, shortcodes=[":Flow_Hanpuri:"], inputs=["E (flow)", "F (flow)"],
         kind="preawk", roles=["dps", "movement"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Flow after Soulflame (E), Soulsnare (F) or Ghost Bomb (A/D+RMB): targeted teleport to target.",
                "Flows into Heavenly Return / Spirit Parade via Shift+X or E/F (cancels sheet)."]),
    dict(id="charmed", bdocodex_id=7217, shortcodes=[":Charmed:"], inputs=["Space"],
         kind="preawk", roles=["dps", "buff", "cc"], protection_pve="none", protection_pvp="none",
         notes=["+20 AP backup buff (does not stack with Nukduri Dance / Nether River).",
                "Input trap: Space without a preceding skill makes you jump.",
                "PvP: stiffness opener; interchangeable with Foxflare Fling except after Hanpuri (discord-pvp)."]),
    dict(id="nether-river", bdocodex_id=7215, shortcodes=[":Flow_Nether_River:"], inputs=["LMB (flow)"],
         kind="preawk", roles=["dps", "buff"], protection_pve="frontal_guard", protection_pvp="frontal_guard",
         notes=["+AP buff with frontal guard — rarely useful but protected (video)."]),
    dict(id="foxflare-fling", bdocodex_id=7388, shortcodes=[":foxflare_fling:"], inputs=["E (Magnus)"],
         kind="preawk", roles=["dps", "cc"], protection_pve="frontal_guard", protection_pvp="frontal_guard",
         protection_notes="Forward Guard only at the start (the windup).",
         notes=["Magnus skill. LEAVE UNLEARNED for PvE — inconsistent multi-hit, and learning it replaces Soulflame use (discord-pve, video).",
                "Used in PvP combos (higher damage than Charmed, but no verticality — use Charmed on uneven terrain)."]),
    dict(id="petalblast", bdocodex_id=7178, shortcodes=[":Petal_Blast:"], inputs=["S+RMB"],
         kind="preawk", roles=["dps", "cc"], protection_pve="super_armor", protection_pvp="super_armor",
         locked=True,
         notes=["LOCKED (both sources). Only Bound in kit (PvE only) — unlock if a fight needs Bound, e.g. Pig King (video)."]),
    dict(id="spirit-step", bdocodex_id=7213, shortcodes=[":Spirit_Step:"], inputs=["Shift+A", "Shift+S", "Shift+D"],
         kind="preawk", roles=["movement"], protection_pve="iframe", protection_pvp="iframe",
         protection_notes="PvP: Invincible -> Super Armor, nullified during cooldown. PvE: invincible during the skill.",
         notes=["iFrame into standing SA recovery; recovery fully cancellable — better protection than Chain: Spirit Step (cancels sheet)."]),
    dict(id="chain-spirit-step", bdocodex_id=7214, shortcodes=[":Chain_Spirit_Step:"], inputs=["Shift+W"],
         kind="preawk", roles=["movement"], protection_pve="iframe", protection_pvp="super_armor",
         protection_notes="SA into iframe while vanished, rolling SA recovery; very long lingering SA if not cancelled (cancels sheet). PvE: invincible during the skill.",
         notes=["More distance than Spirit Step but always has a rolling SA recovery."]),
    dict(id="path-of-petals", bdocodex_id=7230, shortcodes=[":Path_Of_Petals:"], inputs=["W+F"],
         kind="preawk", roles=["movement"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Good long-distance movement; descends ledges without the fall animation.",
                "Can cancel most things; Soul Tear / Ghost Bomb can cancel any point of it."]),
    dict(id="evasion", bdocodex_id=7155, shortcodes=[":Evasion:"], inputs=["W+W", "Shift+A/S/D (shared)"],
         kind="preawk", roles=["movement"], protection_pve="iframe", protection_pvp="none",
         locked=True,
         notes=["LOCKED (both sources; video: 'Unnecessary'). Invincible is PvE-only."]),

    # --- Rabams (Skill Enhancements) ---
    dict(id="heavenly-return", bdocodex_id=7245, shortcodes=[":Heavenly_Return:"], inputs=["Shift+X", "E/F during Flow: Hanpuri"],
         kind="rabam", rabam_level=56, rabam_alternative="spirit-parade",
         roles=["dps", "cc", "repositioning"], protection_pve="none", protection_pvp="none",
         notes=["PvE pick at 56: fast, decent damage, quick backstep; fast enough that no protection is rarely an issue (discord-pve).",
                "Slightly faster into Heavenward Dance (cancels a small linger)."]),
    dict(id="spirit-parade", bdocodex_id=7246, shortcodes=[":Spirit_Parade:"], inputs=["Shift+X", "E/F during Flow: Hanpuri"],
         kind="rabam", rabam_level=56, rabam_alternative="heavenly-return",
         roles=["dps", "repositioning"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Protected alternative at 56; PvP combos use it over Heavenly Return for protection (discord-pvp).",
                "Can move you behind the opponent for guaranteed back attacks on Heavenward Dance (discord-pvp)."]),
    dict(id="petal-snare", bdocodex_id=7247, shortcodes=[":Petal_Snare:"], inputs=["Shift+Z"],
         kind="rabam", rabam_level=57, rabam_alternative="constricting-charm",
         roles=["dps"], protection_pve="frontal_guard", protection_pvp="frontal_guard",
         notes=["Long animation, low DPS (discord-pve) — not the chosen rabam."]),
    dict(id="constricting-charm", bdocodex_id=7248, shortcodes=[":Constricting_Charm:"], inputs=["Shift+Z"],
         kind="rabam", rabam_level=57, rabam_alternative="petal-snare",
         roles=["dps"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Chosen at 57: decent filler with very high attack speed; flows into Spirit Sparks."]),
    dict(id="spirit-sparks", bdocodex_id=7249, shortcodes=[":Spirit_Sparks:"], inputs=["LMB (flow)", "Quickslot"],
         kind="rabam", rabam_level=58, rabam_alternative="soul-charm",
         roles=["dps"], protection_pve="frontal_guard", protection_pvp="frontal_guard",
         notes=["Chosen at 58: weak alone, decent follow-up from Constricting Charm; filler only."]),
    dict(id="soul-charm", bdocodex_id=7250, shortcodes=[":Soul_Charm:"], inputs=["Quickslot"],
         kind="rabam", rabam_level=58, rabam_alternative="spirit-sparks",
         roles=["heal"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["Not useful in PvE: small out-of-combat HP recovery for stamina (discord-pve). 'If taken' → quickslot."]),

    # --- Utility / passives / special ---
    dict(id="foxspirit-deceiver", bdocodex_id=7312, shortcodes=[":13Foxspirit_Deceiver:"], inputs=["Q (while clone active)"],
         kind="prime", roles=["repositioning", "utility"], protection_pve="none", protection_pvp="none",
         notes=["Clone swap — THE unique succession mechanic. Clone spawns after Bared Claws (A/D+LMB), Soul Tear (W+Q), or W+E Flower Shroud (S+E does NOT spawn one).",
                "One clone at a time, lasts 3s; swap usable during most other animations (cancels sheet, video).",
                "PvP: kite grabs and bait skills onto the clone; don't default to Bared Claws spam (discord-pvp)."]),
    dict(id="foxspirit-form", bdocodex_id=7279, shortcodes=[":Foxspirit_Form:"], inputs=["Quickslot only"],
         kind="prime", roles=["buff"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["+25 AP, 3-min CD; overwrites the +20 AP buffs (effectively +5 over them).",
                "Weak vs other classes' 3-min buffs (video). Quickslot-only."]),
    dict(id="bsr-heavenward-dance", bdocodex_id=7324, shortcodes=[], inputs=["W+RMB (100% BSR)"],
         kind="prime", roles=["dps"], protection_pve="super_armor", protection_pvp="super_armor",
         notes=["100% Black Spirit's Rage version: lower DPS than normal Heavenward Dance but larger AoE (video).",
                "Z absorb is typically preferred — absorb animation is fast (video)."]),
    dict(id="predominance", bdocodex_id=7278, shortcodes=[], inputs=["Passive"],
         kind="passive", roles=["passive"], protection_pve=None, protection_pvp=None,
         notes=["The succession unlock passive — prerequisite of all Prime skills."]),
]
# fmt: on

# DPS table row label -> (ability id refs, variant note or None)
DPS_ROW_MAP = {
    "Spirited Away": (["spirited-away"], None),
    "Heavenward Dance": (["heavenward-dance"], None),
    "Spirit Swirl": (["spirit-swirl"], None),
    "Spirited Away → Petal Play": (["spirited-away", "petal-play"], "cancel pair"),
    "Foxflare": (["foxflare"], None),
    "Petal Play (Cancelled)": (["petal-play"], "cancelled"),
    "Nukduri Dance": (["nukduri-dance"], None),
    "Bristling Sparks": (["bristling-sparks"], None),
    "Lurking Claw": (["lurking-claws"], None),
    "Foxspirit Tag (Cancelled)": (["foxspirit-tag"], "cancelled"),
    "Bared Claws (1) → Petal Play": (["bared-claws", "petal-play"], "cancel pair, claws attack 1"),
    "Flower Shroud (1) → Tag (Cancelled)": (["flower-shroud", "foxspirit-tag"], "cancel pair, shroud attack 1"),
    "Flower Shroud (1) Back": (["flower-shroud"], "attack 1 only, backward"),
    "Flower Shroud (1) Forward": (["flower-shroud"], "attack 1 only, forward"),
    "Flower Shroud Back": (["flower-shroud"], "full, backward"),
    "Flower Shroud Forward": (["flower-shroud"], "full, forward"),
    "BSR: Heavenward Dance": (["bsr-heavenward-dance"], None),
    "Bared Claws (1) → Tag (Cancelled)": (["bared-claws", "foxspirit-tag"], "cancel pair, claws attack 1"),
    "Flow: Hanpuri (Soulflame, Ghost Bomb)": (["hanpuri"], "after Soulflame / Ghost Bomb"),
    "Bared Claws → Tag (Cancelled)": (["bared-claws", "foxspirit-tag"], "cancel pair, full claws"),
    "Petal Play": (["petal-play"], "uncancelled"),
    "Soulsnare (Bared Claws, Hanpuri)": (["soulsnare"], "cancelled by Bared Claws / Hanpuri"),
    "Foxspirit Tag": (["foxspirit-tag"], "uncancelled"),
    "Foxflare Fling (3 hit, cancelled fast)": (["foxflare-fling"], "3 hits, cancelled fast"),
    "Soulflame → Hanpuri": (["soulflame", "hanpuri"], "flow pair"),
    "Bared Claws": (["bared-claws"], "full"),
    "Soulsnare → Hanpuri": (["soulsnare", "hanpuri"], "flow pair"),
    "Heavenly Return (fast)": (["heavenly-return"], "fast (cancelled)"),
    "Soulsnare → Bared Claws (1)": (["soulsnare", "bared-claws"], "cancel pair"),
    "Soul Tear": (["soul-tear"], None),
    "Foxflare Fling (3 hit, cancelled)": (["foxflare-fling"], "3 hits, cancelled"),
    "Spirit Sparks (2+3)": (["spirit-sparks"], "hits 2+3 (from flow)"),
    "Spirit Parade (fast)": (["spirit-parade"], "fast (cancelled)"),
    "Flow: Hanpuri (Soulsnare)": (["hanpuri"], "after Soulsnare"),
    "Soulflame": (["soulflame"], None),
    "Constricting Charm → Spirit Sparks": (["constricting-charm", "spirit-sparks"], "flow pair"),
    "Spirit Parade": (["spirit-parade"], "uncancelled"),
    "Heavenly Return": (["heavenly-return"], "uncancelled"),
    "Ghost Bomb": (["ghost-bomb"], None),
    "Petal Snare": (["petal-snare"], None),
    "Constricting Charm": (["constricting-charm"], None),
    "Bared Claws (1)": (["bared-claws"], "attack 1 only"),
    "Charmed": (["charmed"], None),
    "Foxflare Fling (2 hit, cancelled fast)": (["foxflare-fling"], "2 hits, cancelled fast"),
    "Soulsnare": (["soulsnare"], None),
    "Spirit Sparks (full from slot)": (["spirit-sparks"], "full, from quickslot"),
    "Foxflare Fling (2 hit, cancelled)": (["foxflare-fling"], "2 hits, cancelled"),
    "Flow: Nether River": (["nether-river"], None),
    "Foxflare Fling (1 hit, cancelled fast)": (["foxflare-fling"], "1 hit, cancelled fast"),
    "Petalblast": (["petalblast"], None),
    "Foxflare Fling (3 hit)": (["foxflare-fling"], "3 hits, uncancelled"),
    "Foxflare Fling (1 hit, cancelled)": (["foxflare-fling"], "1 hit, cancelled"),
    "Foxflare Fling (2 hit)": (["foxflare-fling"], "2 hits, uncancelled"),
    "Foxflare Fling (1 hit)": (["foxflare-fling"], "1 hit, uncancelled"),
}


def parse_dps_table():
    md = (ROOT / "sources" / "dps-data.md").read_text(encoding="utf-8")
    rows = []
    in_table = False
    for line in md.splitlines():
        if line.startswith("| Input | Skill |"):
            in_table = True
            continue
        if in_table:
            if not line.startswith("|"):
                break
            if line.startswith("|---"):
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) != 7:
                continue
            inp, skill, typ, nb, b, pvp, pct = cells

            def num(s):
                s = s.replace(",", "").replace("%", "").strip()
                return None if s in ("—", "-", "") else float(s)

            refs, variant = DPS_ROW_MAP[skill]
            rows.append({
                "input": inp,
                "sheet_label": skill,
                "ability_refs": refs,
                "variant": variant,
                "type": typ,
                "pve_dps_non_bsr": num(nb),
                "pve_dps_bsr": num(b),
                "pvp_dps": num(pvp),
                "pvp_dmg_pct": num(pct),
            })
    return rows


CC_WORDS = re.compile(r"Bound|Knockdown|Stun|Stiffness|Floating|Knockback|Push", re.I)


def main():
    tooltips = json.loads(
        (ROOT / "research" / "bdocodex" / "tooltips.json").read_text(encoding="utf-8"))
    dps_rows = parse_dps_table()

    abilities = []
    for entry in REGISTRY:
        tip = tooltips[str(entry["bdocodex_id"])]
        cc_lines = [l for l in tip["effects"] if CC_WORDS.search(l)]
        rec = {
            "id": entry["id"],
            "name": tip["name"],
            "short_name": re.sub(r"^(Prime: |Absolute: |Black Spirit: Prime: |Flow: )", "", tip["name"]),
            "kind": entry["kind"],
            "shortcodes": entry["shortcodes"],
            "inputs": entry["inputs"],
            "roles": entry["roles"],
            "locked": entry.get("locked", False),
            "rabam": ({"level": entry["rabam_level"], "alternative": entry["rabam_alternative"]}
                      if entry["kind"] == "rabam" else None),
            "protection": {
                "pve": entry["protection_pve"],
                "pvp": entry["protection_pvp"],
                "tooltip_lines": tip["protection_lines"],
                "notes": entry.get("protection_notes"),
                "source": TOOLTIP_SOURCE,
                "source_url": tip["url"],
                "pulled": PULL_DATE,
            },
            "description": {
                "text": tip["description"],
                "source": TOOLTIP_SOURCE,
                "source_url": tip["url"],
                "pulled": PULL_DATE,
            },
            "tooltip": {
                "bdocodex_id": tip["bdocodex_id"],
                "name_kr": tip["name_kr"],
                "input_text": tip["input"],
                "required_level": tip["required_level"],
                "mp_cost": tip["mp_cost"],
                "cooldown": tip["cooldown"],
                "effects": tip["effects"],
                "cc_lines": cc_lines,
            },
            "dps_row_count": sum(1 for r in dps_rows if entry["id"] in r["ability_refs"]),
            "notes": entry.get("notes", []),
        }
        abilities.append(rec)

    data_dir = ROOT / "data"
    data_dir.mkdir(exist_ok=True)
    (data_dir / "abilities.json").write_text(
        json.dumps({
            "_meta": {
                "generated_by": "scripts/build_abilities.py",
                "live_facts_source": TOOLTIP_SOURCE,
                "live_facts_pulled": PULL_DATE,
                "protection_enum": ["iframe", "super_armor", "frontal_guard", "none"],
                "pve_truth": "sources/ (locked)",
            },
            "abilities": abilities,
        }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    md = (ROOT / "sources" / "dps-data.md").read_text(encoding="utf-8")
    combo_summaries = []
    for m in re.finditer(r"\| (Long Combo|Medium Combo|BSR Medium Combo) \| ([\d,]+) \| ([\d,]+) \|", md):
        combo_summaries.append({
            "name": m.group(1),
            "pve_dps_non_bsr": float(m.group(2).replace(",", "")),
            "pve_dps_bsr": float(m.group(3).replace(",", "")),
        })
    (data_dir / "dps.json").write_text(
        json.dumps({
            "_meta": {
                "source": "sources/dps-data.md (locked PvE truth; author's sheet, tab '11/6/26')",
                "sheet_url": "https://docs.google.com/spreadsheets/d/1F6D6zCWd7w0hgTnKrtvrPxVEqMj5qT2-sXdbXvXc1UQ/edit?gid=513999560",
                "stat_assumptions": {"crit_damage_pct": 279.5, "attack_speed_pct": 37,
                                     "attack_speed_bsr_pct": 62, "crit_rate_pct": 63},
                "note": "DPS values are for relative priority at the sheet's stat assumptions, not absolute output.",
            },
            "combo_summaries": combo_summaries,
            "rows": dps_rows,
        }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"abilities.json: {len(abilities)} abilities")
    print(f"dps.json: {len(dps_rows)} rows, {len(combo_summaries)} combo summaries")
    unmapped = [r["sheet_label"] for r in dps_rows if not r["ability_refs"]]
    if unmapped:
        print("UNMAPPED:", unmapped)


if __name__ == "__main__":
    main()
