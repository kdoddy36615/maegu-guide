"""Build data/cancels.json from:
  - research/cancels-sheet-raw.csv (export of the community cancels sheet — refresh with:
    curl -sL "https://docs.google.com/spreadsheets/d/115Q8_SoUFiCCZzoiWgkOeNKf0ERQk23ZFElSv6WC22s/export?format=csv&gid=864274794")
  - curated cancel notes from sources/discord-pve.md, sources/video-guide.md, sources/discord-pvp.md

Sheet CSV layout: col0 = input that flows INTO the skill ("before"), col1 = skill block header
(name + input), col2 = input the skill flows into ("after"), col3 = description, col5 = side notes.
NOTE: the sheet uses cell colors for "Avoid Using / Unusable / Impractical" — colors do not
survive CSV export; read the sheet directly if that nuance is needed.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SHEET_NAME_TO_ID = {
    "Prime: Foxspirit: Tag": "foxspirit-tag",
    "Prime: Bared Claws": "bared-claws",
    "Flow: Nether River": "nether-river",
    "Prime: Ghost Bomb": "ghost-bomb",
    "Absolute: Soulflame": "soulflame",
    "Flow: Hanpuri": "hanpuri",
    "Absolute: Soulsnare": "soulsnare",
    "Prime: Soul Tear": "soul-tear",
    "Absolute: Petalblast": "petalblast",
    "Prime: Petal Play": "petal-play",
    "Prime: Foxflare": "foxflare",
    "Prime: Spirit Swirl": "spirit-swirl",
    "Prime: Flower Shroud": "flower-shroud",
    "Prime: Bristling Sparks": "bristling-sparks",
    "Prime: Spirited Away": "spirited-away",
    "Absolute: Charmed": "charmed",
    "Prime: Lurking Claws": "lurking-claws",
    "Prime: Heavenward Dance": "heavenward-dance",
    "Prime: Fan of Flames": "fan-of-flames",
    "Prime: Nukduri Dance": "nukduri-dance",
    "Heavenly Return": "heavenly-return",
    "Spirit Parade": "spirit-parade",
    "Petal Snare": "petal-snare",
    "Constricting Charm": "constricting-charm",
    "Spirit Sparks": "spirit-sparks",
    "Spirit Step": "spirit-step",
    "Chain: Spirit Step": "chain-spirit-step",
    "Absolute: Path of Petals": "path-of-petals",
}

CURATED = {
    "notable_cancels_pve": {
        "sources": ["sources/discord-pve.md#notable-cancels", "sources/video-guide.md#animation-cancels"],
        "entries": [
            {"skill": "petal-play", "faster_after": ["spirited-away", "bared-claws"],
             "note": "Bared Claws is asymmetrical: D+LMB attack 1 / A+LMB attack 2."},
            {"skill": "foxspirit-tag", "faster_after": ["flower-shroud", "bared-claws"],
             "note": "Flower Shroud attack 1; Bared Claws asymmetrical as above."},
            {"skill": "heavenly-return", "faster_into": ["heavenward-dance"],
             "note": "Cancels a small linger; minor speedup."},
            {"skill": "soulsnare", "faster_into": ["bared-claws", "hanpuri"]},
            {"skill": "flower-shroud",
             "note": "Attack 2 cancellable by many skills — used to reposition or accelerate Foxspirit Tag."},
            {"skill": "spirit-swirl",
             "note": "Cancellable midway by Heavenward Dance, but generally not advisable (high DPS skill)."},
            {"skill": "bared-claws",
             "note": "Can cancel most things — notably Bristling Sparks."},
            {"skill": "soul-tear",
             "note": "Can cancel most things — notably any point of Path of Petals."},
            {"skill": "ghost-bomb",
             "note": "Can cancel most things — notably any point of Path of Petals."},
            {"skill": "path-of-petals",
             "note": "Can cancel most things."}
        ],
        "slow_casts": [
            {"skill": "spirit-swirl", "note": "Slow when cast from idle — use anything before it."}
        ],
        "input_traps": [
            {"skill": "charmed", "note": "Space without a skill before it makes you jump."},
            {"skill": "lurking-claws",
             "note": "Hold the input until you teleport behind the target of attack 2, or the teleport fails."}
        ]
    },
    "primary_cancels_pvp": {
        "sources": ["sources/discord-pvp.md#primary-cancels-pvp"],
        "caveat": "Currency uncertain (PvP source).",
        "entries": [
            {"skill": "foxspirit-tag", "cancelled_into_from": ["bared-claws", "flower-shroud", "spirit-step"],
             "note": "Bared Claws: one hit to the right or two hits to the left. Spirit Step: one dash left."},
            {"skill": "petal-play", "cancelled_into_from": ["bared-claws", "spirited-away"]},
            {"skill": "foxflare-fling",
             "cancelled_into_from": ["foxspirit-tag", "spirited-away", "foxflare", "petal-play", "flower-shroud"]},
            {"skill": "ghost-bomb", "cancelled_out_into": ["spirit-step", "chain-spirit-step", "bared-claws", "soul-tear"]},
            {"skill": "bristling-sparks", "cancelled_out_into": ["spirit-step", "chain-spirit-step", "bared-claws", "soul-tear"]}
        ],
        "note": "Many smaller cancels occur naturally (most skills flow into Spirit Swirl and Bristling Sparks)."
    },
    "general_rules": {
        "sources": ["cancels sheet (research/cancels-sheet-raw.csv)"],
        "instant_flows_from_everything": ["spirit-swirl", "bristling-sparks", "charmed", "spirit-step"],
        "fast_recovery_cancellers": ["bared-claws", "ghost-bomb", "soul-tear", "charmed", "spirit-step", "path-of-petals"],
        "spirit_step_vs_chain": "Spirit Step: iFrame into standing SA recovery, recovery fully cancellable (better protection). Chain: Spirit Step: SA into iframe while vanished into rolling SA recovery — always has the rolling recovery, but more distance and very long lingering SA if not cancelled. All skills flow into shift+W as Spirit Step (not Chain); holding LMB with W+shift forces Spirit Step forward.",
        "clone_mechanic": "Clone spawns after Bared Claws (A/D+LMB), Soul Tear (W+Q), Flower Shroud W+E only (S+E does NOT work). One clone, lasts 3s; Q (Prime: Foxspirit: Deceiver) swaps position, usable during most animations."
    }
}


def parse_sheet():
    rows = list(csv.reader(open(ROOT / "research" / "cancels-sheet-raw.csv", encoding="utf-8-sig")))
    blocks = []
    current = None
    for r in rows[1:]:
        r = (r + [""] * 6)[:6]
        before, skill_header, after, desc = (c.strip() for c in r[:4])
        if skill_header:
            name = skill_header.split("\n")[0].strip()
            input_m = re.search(r"\(([^)]+)\)", skill_header.replace("\n", " "))
            current = {
                "skill": SHEET_NAME_TO_ID.get(name, name),
                "sheet_name": name,
                "sheet_input": input_m.group(1) if input_m else None,
                "entries": [],
            }
            blocks.append(current)
        if current is None:
            continue
        entry = {}
        if before and before != "-":
            entry["before_input"] = before
        if after and after != "-":
            entry["after_input"] = after
        if desc and desc != "-":
            entry["description"] = desc
        if entry:
            current["entries"].append(entry)
    return blocks


def main():
    blocks = parse_sheet()
    unmapped = sorted({b["skill"] for b in blocks if b["skill"] == b["sheet_name"]})
    out = {
        "_meta": {
            "curated": "2026-06-11",
            "sheet_url": "https://docs.google.com/spreadsheets/d/115Q8_SoUFiCCZzoiWgkOeNKf0ERQk23ZFElSv6WC22s/edit#gid=864274794",
            "sheet_semantics": "before_input = input that flows INTO the skill; after_input = input the skill flows into; descriptions are verbatim sheet text.",
            "color_caveat": "Sheet cell colors (Avoid Using / Unusable / Impractical) are lost in CSV export.",
        },
        **CURATED,
        "sheet_blocks": blocks,
    }
    (ROOT / "data" / "cancels.json").write_text(
        json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"cancels.json: {len(blocks)} sheet blocks; unmapped skill names: {unmapped or 'none'}")


if __name__ == "__main__":
    main()
