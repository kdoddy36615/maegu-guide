# Succession Maegu (BDO) Study & Practice App

A study guide + UI practice tool for learning succession Maegu in Black Desert Online (PvE and PvP).

## Running the app

```sh
npm install     # once
npm run dev     # dev server at http://localhost:5173
```

Other commands:

```sh
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run validate   # data referential-integrity check (python scripts/validate_data.py)
node scripts/smoke.mjs          # headless render check of every route (needs Chrome/Edge; dev server running)
node scripts/practice-test.mjs  # headless check that every combo renders its practice strip
```

The app is fully static (Vite + React + TypeScript, no backend): the study guide (PvE / AOS /
Setup / Combos) and the practice tool (per-mode section layouts + in-game-style combo strips)
render straight from `data/*.json`. A data refresh (see `HANDOFF.md` §1) needs no code changes.

## 👉 Start here
**Read [`BRIEF.md`](./BRIEF.md) first.** It's the shared context for every Claude instance and
contains a router that tells you which phase you're in and which document to read next.

This project is built across multiple Claude instances in phases:

| Phase | Doc | Status |
|---|---|---|
| **1 — Research & Docs** | [`PHASE-1-RESEARCH.md`](./PHASE-1-RESEARCH.md) | ✅ Done — canonical dataset (`data/`), glossary (`CONTEXT.md`), ADRs (`docs/adr/`) |
| **Handoff** | [`HANDOFF.md`](./HANDOFF.md) | ✅ Filled in (the Phase 1 → 2 contract) |
| **2 — Build** | [`PHASE-2-BUILD.md`](./PHASE-2-BUILD.md) | ✅ Done — working, verified app in `app/` |
| **3 — Design** | [`PHASE-3-DESIGN.md`](./PHASE-3-DESIGN.md) | 👈 **Current.** Visual/UX pass; current-state screenshots in `docs/screenshots/` |

**Which phase am I in?** `HANDOFF.md` has `TODO`s → Phase 1; otherwise `app/` missing → Phase 2,
present → Phase 3 (design).

## Layout
```
BRIEF.md              Shared context + router (read first)
PHASE-1-RESEARCH.md   Phase 1 charter
HANDOFF.md            Phase 1 → Phase 2 contract
PHASE-2-BUILD.md      Phase 2 charter
PHASE-3-DESIGN.md     Phase 3 charter (design pass: constraints + file map)
data/                 Canonical dataset (abilities, dps, combos, cancels, setup)
app/                  The app (Vite + React + TS; vite.config.ts/tsconfig at repo root)
docs/adr/             Architecture decision records (binding)
docs/screenshots/     Full-page screenshots of the current app (node scripts/shoot.mjs)
CONTEXT.md            Domain glossary (canonical terms + Avoid lists)
scripts/              Data build/validation + headless verification scripts
sources/              Ingested source material (PvE = source of truth)
  ├── video-guide.md + video-screenshots/   Guide video (transcribed)
  ├── dps-data.md + dps-sheet-raw.csv        Per-ability DPS
  ├── discord-pve.md / discord-pvp.md        Discord (PvP currency uncertain)
  └── discord-images/                        Discord screenshots + manifest
.claude/skills/grill-with-docs/   The grilling skill used at the end of Phase 1
```
