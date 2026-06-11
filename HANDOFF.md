# Handoff: Phase 1 → Phase 2

> **This file is the contract between the research instance (Phase 1) and the build instance
> (Phase 2).**
>
> - If you are reading this and it still contains `TODO` markers → Phase 1 is not finished. You are
>   the **Phase 1** instance; go finish `PHASE-1-RESEARCH.md`, then fill this in.
> - If every `TODO` below is replaced with real content → you are the **Phase 2** instance. Read this
>   top to bottom, then open `PHASE-2-BUILD.md` and build.
>
> Phase 1 completed 2026-06-11. No TODOs remain.

## 1. Canonical data — where it lives & its schema
- **Data file(s):** `data/abilities.json` (35 abilities), `data/dps.json` (54 locked DPS rows +
  combo summaries), `data/combos.json` (6 PvE + 11 PvP combos + both priority lists),
  `data/cancels.json` (curated cancels + 28 cancels-sheet blocks), `data/setup.json`
  (locks/rabams/addons/reforge/buffs/BSR/earlygame/UI reference).
- **Schema / field reference:** `research/schema-proposal.md` (field-level), locked by
  `docs/adr/0001-canonical-data-schema.md` and `docs/adr/0002-protection-model.md`.
  Combo step shape: `{ ability | choices: [...], input, optional?, annotation? }`.
- **How to regenerate / refresh from sources:**
  - Live facts (descriptions/protections): re-pull
    `curl "https://bdocodex.com/tip.php?id=skill--<ID>&l=us" -o research/bdocodex/raw/skill-<ID>.html`
    for the ids in `research/bdocodex/raw/`, then `python research/bdocodex/parse_tooltips.py`,
    then `python scripts/build_abilities.py`. A changed protection line requires re-reviewing the
    curated enum in the script's REGISTRY.
  - Cancels sheet: re-export CSV (URL in `scripts/build_cancels.py` docstring), then
    `python scripts/build_cancels.py`.
  - DPS sheet: re-export per `sources/dps-data.md` footer, update that file, then
    `python scripts/build_abilities.py`.
  - Always finish with `python scripts/validate_data.py` (referential integrity; must exit 0).

## 2. Live-fact sources chosen (with dates)
- **Ability descriptions — source + date pulled:** BDO Codex (mirrors live in-game text),
  pulled **2026-06-11**, per-ability URL recorded in each record. Justification + rejected
  candidates (BDFoundry stale 2023; Garmoth/bdolytics block bots): `research/source-decisions.md`.
- **Protection type — source + date pulled:** same source/date — in-game tooltips state
  protections; corroborated by the community cancels sheet and every protection hint in the
  locked sources. Patch-currency verified (Feb 2026 patch touched Awakening only).
- **Any abilities with uncertain/unverified data:**
  - Prime: Spirited Away — tooltip FG vs a loose "fully SA" Discord-PvP claim (resolved as
    combo-tail SA; see `research/source-decisions.md` flag 1). Data follows the tooltip.
  - Tooltip granularity: gap frames / lingering windows aren't in tooltips; the cancels sheet
    notes cover Spirit Step vs Chain. Stored in `protection.notes`.
  - Optional (never done): in-game spot-check of 2–3 tooltips against live text.

## 3. Domain vocabulary
- **`CONTEXT.md` location + summary:** repo root. Glossary covering abilities (ability/short
  name/Prime/preawk/rabam/clone swap/Loadout), protection (graded enum, i-frame/SA/FG/
  Unprotected), practice tool (Section/FG badge/CC badge/Drill/Ideal combo), combat vocab
  (combo family, Infinite Combo, DPS Priority List, cancel, flow, AOS, locked skill).
- **Terms Phase 2 must use exactly (and terms to avoid):** follow CONTEXT.md `_Avoid_` lists.
  Highlights: "Frontal Guard"/FG (not the in-game "Forward Guard" spelling) — never treat
  protection as a boolean; **short names** in UI ("Spirited Away", not "Prime: Spirited Away");
  "PvP" always means **AOS (capped)**; "priority list" not "rotation"; "Loadout" for per-mode
  spec, "build" reserved for gear.

## 4. Decisions made (ADRs)
- `docs/adr/0001-canonical-data-schema.md` — generated + curated JSON keyed by canonical ability
  ids; DPS sheet preserved 1:1 as its own table referencing ids.
- `docs/adr/0002-protection-model.md` — graded enum (`iframe > super_armor > frontal_guard >
  none`), stored separately for PvE and PvP; nuances in notes; patch-sensitive with provenance.
- `docs/adr/0003-practice-tool-model.md` — flashcard recall, **no input capture**; sections =
  Movement / Protected (FG badged) / Unprotected, DPS-ordered; CC is a badge, not a section;
  drill choices.
- `docs/adr/0004-per-mode-loadouts.md` — Grinding vs AOS are different specs (Magnus, rabam 56,
  addons); PvP drills teach Fling variants; PvE views must not show Foxflare Fling.

## 5. UI / practice-tool design (as settled in grilling)
- **Study-guide shape:** mirrors the practice sections — one page per mode (PvE / AOS):
  Movement → Protected → Unprotected, DPS-ordered, priority tiers overlaid; each ability expands
  to description, DPS rows, protection detail, cancels, addon notes. Plus a **Setup chapter**
  (locks/rabams/addons/reforge/buffs — include a short **BSR explainer**: user is unfamiliar with
  BSR abilities; see `data/setup.json` → `bsr`) and a **Combos chapter** (all 17, including the 7
  non-drilled PvP variants).
- **Practice-tool layout(s) — PvE and PvP (AOS):** same three-section skeleton per mode,
  mirroring the in-game hotbar scheme (movement/utility top, DPS-priority below — reference image
  `sources/discord-images/pve/ui-setup-example.png`). Mode views reflect their Loadout (ADR 0004).
- **UI sections & how protection tiers map:** FG abilities sit **inside Protected with an FG
  badge** (user's call, vs BRIEF's leaning to a separate tier — presentational, data stays graded).
  Unprotected is its own section. CC shown as badges (KD/Stun/Float/Stiff/Bound) everywhere.
- **Ideal PvE combo / ideal PvP (AOS) combo(s) chosen:** PvE = `pve-infinite` (optionals marked).
  PvP = one per family: `pvp-flower-shroud-1`, `pvp-bristling-1`, `pvp-hanpuri-1`,
  `pvp-stiff-foxflare-1`; **`pvp-flower-shroud-1` is the single ideal** if only one is surfaced.
  Priority-order drills (from the Discord tier list) are a later addition, not v1.
- **Is there a CC-DPS section?:** No — CC badges only (decided in grill; Maegu's CC skills are
  nearly all also top DPS skills, a section would duplicate them).

## 6. Scope for Phase 2 (what to build, in priority order)
1. Data plumbing: load/validate `data/*.json`, types generated from the schema.
2. **Study guide, PvE page** (sections + expandable abilities + priority overlay) — the user's
   primary content.
3. Study guide: Setup chapter (incl. BSR explainer) + Combos chapter.
4. **Practice tool, PvE**: section layout reference + flashcard drill of `pve-infinite`.
5. Study guide + practice tool, **AOS** (loadout-aware; 4 family drills; FG/CC badges identical).
6. Drill stats/persistence (localStorage), priority-order drill — stretch.

## 7. Tech-stack guidance
- **Recommendation + rationale (or "Phase 2 decides"):** Phase 2 decides and justifies, with
  guidance from the grill: the shape (static JSON, two modes, no backend/auth, optional
  localStorage) points to a **static TypeScript/React app (e.g. Vite)** consuming `data/*.json`.
  Avoid the single-HTML-file route (maintainability; user preference). No ADR — deliberately left
  to the build instance per BRIEF.

## 8. Known gaps / deferred / missing assets
- PvP combo "Variation" clips (GIFs) never collected — text notation in `sources/discord-pvp.md`
  is the reliable record (`sources/discord-images/README.md`).
- **AOS rabam picks for levels 57/58 unknown** — sources only settle level 56 (Spirit Parade).
  Flagged in ADR 0004; surface as "unknown" rather than guessing.
- DR / Evasion / Capped standalone addon profiles intentionally out of scope (user plays AOS
  only); `addons-aos-eva-vs-dr.png` is the only PvP addon reference.
- Addon image transcriptions untrusted by design — UI should show/link the images
  (`data/setup.json` carries the paths and caveats).
- Cancels-sheet cell colors (Avoid/Unusable/Impractical) lost in CSV export; read the sheet
  directly if that nuance is ever needed.
- PvP (Bantalope) material currency still uncertain — every PvP record carries a caveat field;
  display a staleness disclaimer on AOS pages.
- Optional: in-game tooltip spot-check (section 2) never performed.

## 9. Anything else Phase 2 must know before starting
- **PvE numbers are locked.** Never recompute or "correct" DPS values; they trace 1:1 to
  `sources/dps-data.md` at its stated stat assumptions (relative priority, not absolute output).
- DPS rows are measurement variants — multiple rows per ability and cancel-pair rows spanning two
  abilities are intentional (ADR 0001). Don't collapse them.
- `python scripts/validate_data.py` must pass after any data change; run it in CI/pre-commit if
  you set one up.
- The video transcription contained one error (infinite-combo `W+Q` → actually `Shift+Q`),
  corrected 2026-06-11 against the slide screenshot — combos in `data/combos.json` are the
  reconciled truth. The three video lock-list items are identified inline in `sources/video-guide.md`
  (Petalblast / Evasion / Rage Transfer).
- Repo is not a git repository yet — consider `git init` as your first move.
- Phase 1 deliberately wrote **no app code** — nothing to inherit but data, docs, and scripts.
