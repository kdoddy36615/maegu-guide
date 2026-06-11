# Canonical data schema: generated + curated JSON keyed by ability ids

The app consumes `data/*.json` keyed by canonical kebab-case ability ids that reconcile three
keying systems (Discord emoji shortcodes, DPS-sheet inputs, official in-game names). The DPS
sheet is preserved 1:1 as its own table (`data/dps.json`, 54 rows) referencing ability ids rather
than being embedded per-ability, because sheet rows measure *variants* (cancelled/uncancelled,
hit counts) and cancel-*pairs* spanning two abilities — 1 ability ↔ N rows, 1 row ↔ 1–2 abilities
— and PvE numbers must stay traceable to the locked source. Files split by maintenance model:
`abilities.json`/`dps.json`/`cancels.json` are **generated** (`scripts/build_*.py`, re-runnable
when live facts refresh), `combos.json`/`setup.json` are **hand-curated**;
`scripts/validate_data.py` enforces referential integrity. Decided 2026-06-11 in the Phase 1
grill; schema details in `research/schema-proposal.md`.
