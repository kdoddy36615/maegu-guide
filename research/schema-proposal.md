# Canonical data schema — PROPOSAL (to be grilled, then locked in an ADR)

## Files

| File | Content | Produced by |
|---|---|---|
| `data/abilities.json` | One record per ability: identity, inputs, roles, protection (pve/pvp enums + tooltip lines + provenance), description (+provenance), tooltip details (cooldown, MP, effects, CC lines), notes | **generated** — `scripts/build_abilities.py` (curated registry + `research/bdocodex/tooltips.json` + `sources/dps-data.md`) |
| `data/dps.json` | The locked DPS table 1:1 (54 rows), each row mapped to canonical ability id(s); combo summaries; stat assumptions | **generated** — same script |
| `data/combos.json` | PvE combos (3 short + infinite + 2 movement), PvP/AOS combos (11, Bantalope), and both DPS priority lists | hand-curated |
| `data/cancels.json` | Notable PvE cancels, slow casts, input traps, PvP primary cancels, general rules, full cancels-sheet blocks (28 skills) | **generated** — `scripts/build_cancels.py` (curated + sheet CSV) |
| `data/setup.json` | Locks/do-not-learn/quickslot, rabams, addons (PvE + AOS), reforge stones, buffs/debuffs, BSR tips, earlygame, UI reference | hand-curated |

Validation: `scripts/validate_data.py` — every ability reference anywhere must resolve to
`abilities.json` (35 canonical ids).

## Key design decisions already embodied (grill should confirm or amend)

1. **Canonical id = kebab-case short name** (`spirited-away`), reconciling Discord shortcode ↔
   sheet input ↔ official name. Official names (with `Prime:`/`Absolute:` prefixes) kept in `name`;
   `short_name` strips the prefix for UI.
2. **Protection is an ordered enum** `iframe > super_armor > frontal_guard > none`, stored
   **separately for PvE and PvP** because several protections are "(PvE only)" in game text
   (Evasion, Spirit Step family). Tooltip lines + source + pull date attached. Partial-window
   nuances (e.g. Soul Tear "SA before the attack hits", Fling "FG at start") live in
   `protection.notes`, not extra enum values.
3. **DPS rows are their own table** (`dps.json`) referencing abilities, not embedded per-ability —
   the sheet measures *variants* (cancelled/uncancelled, hit counts, cancel-pairs spanning two
   abilities), so 1 ability ↔ N rows and 1 row ↔ 1–2 abilities. Keeps the locked source 1:1
   traceable.
4. **Combo step shape**: `{ ability | choices: [...], input, optional?, annotation? }` —
   handles the sources' "(A or B)" steps and `{optional}` skills directly.
5. **Roles** (`dps`, `movement`, `repositioning`, `cc`, `buff`, `debuff`, `heal`, `utility`,
   `passive`) are multi-tags, not a single category — Heavenward Dance is both top DPS and
   repositioning; Charmed is buff + CC + dps filler.
6. **Provenance everywhere**: PvE facts cite `sources/...`; live facts cite BDO Codex URL +
   2026-06-11; PvP carries an explicit currency caveat.

## Open questions FOR THE GRILL (decisions that shape UI/ADRs)

- How FG-tier abilities surface in practice-tool sections (own middle section vs grouped) — BRIEF
  says this is a grilling decision.
- Whether a CC-DPS section exists (PvE? PvP-only?).
- Which combos are "the ideal" PvE and PvP (AOS) ones to drill (candidates: `pve-infinite` and/or
  DPS-priority freestyle drill; one or more Bantalope combos per situation).
- The Spirited Away FG-vs-"fully SA" flag (research/source-decisions.md #1).
- The unidentified third locked skill (Shift+X input conflict) — user can check in-game.
- Magnus trade-off: PvE says leave unlearned; PvP combos use Foxflare Fling. The app should
  probably surface this as a per-mode loadout difference — confirm.
- Whether `Prime:`/`Absolute:` prefixes appear in the UI (`name` vs `short_name`).
- In-game spot-check of 2–3 tooltips to validate BDO Codex currency.
