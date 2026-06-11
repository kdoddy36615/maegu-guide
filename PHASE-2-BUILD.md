# Phase 2 — Build (charter)

> You are the **Phase 2** instance. Prerequisites: you have read `BRIEF.md` and `HANDOFF.md` (and
> `HANDOFF.md` has no `TODO`s — if it does, you are actually Phase 1; go to `PHASE-1-RESEARCH.md`).
> **Your mission: build the study-guide + UI-practice-tool app from the canonical data and the
> domain docs Phase 1 produced.**

## Before you write any code
1. Read `HANDOFF.md` fully — it points you to the canonical data, schema, `CONTEXT.md`, and ADRs.
2. Read `CONTEXT.md` and `docs/adr/` — these are binding decisions; do not silently contradict them.
   If you believe an ADR is wrong, raise it with the user rather than quietly diverging.
3. Skim the canonical data files so you know the real shape before designing components.

## Tasks
1. **Confirm the tech stack.** If an ADR already decided it, follow it. Otherwise decide
   (TypeScript/React vs single HTML file — the user leans away from single HTML for maintainability)
   and explain the choice before scaffolding.
2. **Scaffold** the project.
3. **Build the study guide** — ability descriptions + DPS data, organized to be digestible. Pull from
   the canonical data; do not hardcode ability stats inline.
4. **Build the UI practice tool** — per the layout(s) settled in `HANDOFF.md` §5: PvE and PvP (AOS)
   combo practice, with the protection-tiered sections (movement / protected / partial / unprotected,
   and any CC section that was decided).
5. **Iterate with the user** on UX. The practice tool was exploratory in Phase 1 — expect refinement.

## Guardrails
- **The canonical data is the single source of truth for content.** Don't re-derive facts from the
  raw `sources/` or re-fetch the internet for things already captured. If data is missing, flag it
  against `HANDOFF.md` §8 rather than inventing it.
- **Respect the domain vocabulary** in `CONTEXT.md` — use the canonical term for each concept in UI
  copy and code (variable names, labels).
- **PvE facts are locked** (see `BRIEF.md` source-of-truth hierarchy). **PvP = AOS/capped only.**
- Keep ability content data-driven so a future data refresh doesn't require code changes.

## Definition of Done
- [ ] App runs locally (document how to start it).
- [ ] Study guide renders all abilities with descriptions + DPS, grouped/sortable usefully.
- [ ] Practice tool implements the layouts + protection-tiered sections from `HANDOFF.md`.
- [ ] No content hardcoded that should live in the canonical data.
- [ ] Verified against the user's expectations (don't claim done without showing it working).
