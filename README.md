# Succession Maegu (BDO) Study & Practice App

A study guide + UI practice tool for learning succession Maegu in Black Desert Online (PvE and PvP).

## 👉 Start here
**Read [`BRIEF.md`](./BRIEF.md) first.** It's the shared context for every Claude instance and
contains a router that tells you which phase you're in and which document to read next.

This project is built across multiple Claude instances in phases:

| Phase | Doc | What happens |
|---|---|---|
| **1 — Research & Docs** | [`PHASE-1-RESEARCH.md`](./PHASE-1-RESEARCH.md) | Research + build the canonical dataset + domain docs. No app code. |
| **Handoff** | [`HANDOFF.md`](./HANDOFF.md) | The contract Phase 1 fills in for Phase 2. (TODOs left = Phase 1 unfinished.) |
| **2 — Build** | [`PHASE-2-BUILD.md`](./PHASE-2-BUILD.md) | Build the app from the canonical data + docs. |

**Which phase am I in?** If `HANDOFF.md` still has `TODO` markers → Phase 1. If it's fully filled
in → Phase 2.

## Layout
```
BRIEF.md              Shared context + router (read first)
PHASE-1-RESEARCH.md   Phase 1 charter
HANDOFF.md            Phase 1 → Phase 2 contract
PHASE-2-BUILD.md      Phase 2 charter
sources/              Ingested source material (PvE = source of truth)
  ├── video-guide.md + video-screenshots/   Guide video (transcribed)
  ├── dps-data.md + dps-sheet-raw.csv        Per-ability DPS
  ├── discord-pve.md / discord-pvp.md        Discord (PvP currency uncertain)
  └── discord-images/                        Discord screenshots + manifest
.claude/skills/grill-with-docs/   The grilling skill used at the end of Phase 1
```
