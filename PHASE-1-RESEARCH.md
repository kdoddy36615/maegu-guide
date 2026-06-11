# Phase 1 — Research & Documentation (charter)

> You are the **Phase 1** instance. Prerequisite: you have already read `BRIEF.md`.
> **Your mission: produce the canonical content + domain documentation that Phase 2 will build the
> app from. You write NO application code in this phase.** Your deliverable is data + docs, not a UI.

## Why this phase exists
The build instance (Phase 2) needs a single, trustworthy, normalized dataset and a settled domain
vocabulary to build against. Mixing research and implementation in one instance produces a messy
data model and burns context. Phase 1 ends with a clean contract (`HANDOFF.md`) so Phase 2 starts
cold but fully equipped.

## Tasks

### 1. Ability-description source (research)
- Find a **maintained, up-to-date** source for Succession Maegu ability descriptions (PvE + PvP).
  Candidates to evaluate (not an endorsement — verify currency): Garmoth skill builder, BDFoundry,
  official in-game skill text, community guides. Pick one (or a primary + fallback).
- Pull descriptions for **every** ability already keyed in `sources/dps-data.md` and the Discord
  shortcodes in `sources/discord-pve.md` / `discord-pvp.md`.
- Record the source URL and the date you pulled it. Descriptions change with patches.

### 2. Ability protection type (research — patch-sensitive)
- For each ability, determine its **protection** as an ordered enum:
  `iframe` (invincibility) / `super_armor` / `frontal_guard` / `none`. See `BRIEF.md` → Domain notes
  for the graded scale (full = iframe/SA, partial = FG, none = unprotected).
- This is **not** in our existing sources — it must be researched from an up-to-date source and is
  per-ability and patch-dependent. Record source + date. Flag any ability you can't confidently
  classify (don't guess silently).

### 3. Canonical content data model (the core deliverable)
Reconcile ALL of `sources/` into one normalized dataset the app consumes. Suggested shape (refine,
then lock it in an ADR):
- **Ability registry** — one record per ability: canonical `id`, display name, input(s), type
  (Prime/Preawk/Mixed), `protection` enum, description (+source/date), DPS fields from
  `dps-data.md` (non-BSR DPS, BSR DPS, PvP DPS, PvP Dmg%), and role tags
  (movement / dps / cc / buff / debuff).
- **Combos** — PvE and PvP (AOS) combos referencing ability `id`s, with input sequences, mode
  (pve/pvp), and notes. Source them from `discord-*.md` and `video-guide.md`.
- **Cancels / buffs / debuffs / setup** (rabams, addons, reforge) — structured from the sources.
- Store as structured data (JSON or YAML) so Phase 2 can consume it directly, plus a human-readable
  study-guide markdown if helpful. **Do not invent PvE values** — every PvE fact traces to a source.

### 4. Resolve open design questions
- Using task 2, produce the **protected / partial / unprotected** classification that the UI sections
  depend on.
- These are decisions for the user, surfaced during grilling (next task): how FG-tier abilities
  surface in the UI; whether a CC-DPS section exists; what the "ideal" PvE and PvP (AOS) combos are.

### 5. Grill — `/grill-with-docs` (interactive, with the user)
- Run the `grill-with-docs` skill **with the user present**. It is interactive and belongs here while
  the domain is fresh.
- Outcomes it should produce: `CONTEXT.md` (sharpened terminology — Maegu-specific glossary) and
  ADRs in `docs/adr/` for the hard, surprising, hard-to-reverse decisions (canonical data schema,
  protection model, UI-section model, ideal-combo choices).

### 6. Fill `HANDOFF.md`
- Complete every `TODO` in `HANDOFF.md`. That file becomes Phase 2's entry contract.
- Then tell the user to **start a fresh Claude instance** for Phase 2 and point it at `BRIEF.md`.

## Definition of Done (Phase 1 is complete only when ALL are true)
- [ ] Ability-description source chosen + justified; descriptions pulled for all abilities (source + date recorded).
- [ ] Protection type (`iframe`/`super_armor`/`frontal_guard`/`none`) researched per ability (source + date recorded; unknowns flagged).
- [ ] Canonical dataset exists (abilities + combos + cancels/buffs/debuffs/setup), every PvE fact traceable to a source.
- [ ] Data schema locked in an ADR.
- [ ] `CONTEXT.md` + relevant ADRs written via the grilling session.
- [ ] UI-section / protection / ideal-combo design questions resolved (or explicitly left open with rationale) in ADRs.
- [ ] `HANDOFF.md` fully filled (no `TODO`s).

## Guardrails
- **No app code in Phase 1.** No framework, no components, no scaffold. (Project files like the
  canonical data and docs are fine — those ARE the deliverable.)
- Never override PvE source of truth with online info. For PvP, online info may supplement but flag
  staleness.
- Don't over-engineer the data model before grilling confirms the UI shape — propose, grill, then lock.
