# Succession Maegu (BDO) Study & Practice App

A study guide + UI practice tool for learning succession Maegu in Black Desert Online
(PvE grinding and capped AOS PvP).

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
render straight from `data/*.json`. A data refresh needs no code changes.

## Layout

```
data/                 Canonical dataset (abilities, dps, combos, cancels, setup)
app/                  The app (Vite + React + TS; vite.config.ts/tsconfig at repo root)
docs/adr/             Architecture decision records (binding)
docs/screenshots/     Full-page screenshots of the app (node scripts/shoot.mjs)
CONTEXT.md            Domain glossary (canonical terms + Avoid lists)
scripts/              Data build/validation + headless verification scripts
sources/              Ingested source material (PvE = source of truth)
  ├── video-guide.md + video-screenshots/   Guide video (transcribed)
  ├── dps-data.md + dps-sheet-raw.csv        Per-ability DPS
  ├── discord-pve.md / discord-pvp.md        Discord (PvP currency uncertain)
  └── discord-images/                        Discord screenshots + manifest
research/             Working notes + BDO Codex tooltip pulls (provenance for data/)
```

## Data refresh

The dataset reconciles locked community sources with live game text. To refresh:

- **Live facts (descriptions/protections):** re-pull
  `curl "https://bdocodex.com/tip.php?id=skill--<ID>&l=us" -o research/bdocodex/raw/skill-<ID>.html`
  for the ids in `research/bdocodex/raw/`, then `python research/bdocodex/parse_tooltips.py`,
  then `python scripts/build_abilities.py`. A changed protection line requires re-reviewing the
  curated enum in the script's REGISTRY.
- **Cancels sheet:** re-export CSV (URL in `scripts/build_cancels.py` docstring), then
  `python scripts/build_cancels.py`.
- **DPS sheet:** re-export per `sources/dps-data.md` footer, update that file, then
  `python scripts/build_abilities.py`.
- Always finish with `python scripts/validate_data.py` (must exit 0).

**PvE numbers are locked** — never recompute or "correct" DPS values; they trace 1:1 to
`sources/dps-data.md` at its stated stat assumptions (relative priority, not absolute output).

## Known gaps

- AOS rabam picks for levels 57/58 are unknown — sources only settle level 56 (Spirit Parade);
  the app surfaces these as "unknown" rather than guessing (ADR 0004).
- PvP (Discord) material currency is uncertain — AOS pages carry a staleness disclaimer.
- Addon image transcriptions are untrusted by design — the UI shows/links the images instead
  (`data/setup.json` carries the paths and caveats).
