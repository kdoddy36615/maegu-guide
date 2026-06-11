# Project Brief: Succession Maegu (BDO) Study & Practice App

> **Shared context — read by EVERY instance, first.** This file is stable: it describes WHAT we're
> building, the source material, and the rules. It deliberately contains **no phase tasks**. After
> reading it, open the document for your phase using the router immediately below.

## 📍 Which document do I read? (router)
This project runs across multiple Claude instances, in phases. Locate yourself:

| If... | You are | Read next | Your job |
|---|---|---|---|
| `HANDOFF.md` still contains unfilled `TODO` markers (or doesn't exist) | **Phase 1 — Research & Docs** | `PHASE-1-RESEARCH.md` | Produce canonical content + domain docs, then fill `HANDOFF.md`. **Write no app code.** |
| `HANDOFF.md` is fully filled in (no `TODO`s) and `app/` does not exist | **Phase 2 — Build** | `HANDOFF.md`, then `PHASE-2-BUILD.md` | Build the app from the canonical data + docs. |
| `app/` exists (the app is built and verified) | **Phase 3 — Design** | `PHASE-3-DESIGN.md` | Visual/UX design pass within the domain rules. |

When in doubt: `HANDOFF.md` has `TODO`s → Phase 1; otherwise `app/` missing → Phase 2, present → Phase 3.

---

## Goal
A website/app to help the user learn the intricate specifics of **succession Maegu** in Black Desert
Online, for both **PvE** and **PvP**. Two jobs:
1. **Study guide** — ability descriptions + DPS data, organized to be digestible to study.
2. **UI practice tool** — help the user design and drill ideal combos (see "UI practice tool" below).

## Source-of-truth hierarchy (non-negotiable)
- **PvE is locked.** The Discord PvE info, the guide video, and the DPS sheet are 100% source of
  truth for PvE. Do **not** override them with anything found online.
- **PvP is uncertain.** Discord PvP info is a strong starting point but currency is unknown — flag
  anything that looks stale. PvP scope is **AOS (capped) only** — no uncapped/open-world.
- **Live, patch-sensitive facts** (ability descriptions; ability protection type) change over time
  and must come from a *maintained, up-to-date* source, with the source + date recorded. See the
  domain notes.

## Domain notes
- **Ability identity:** the Discord encodes abilities as emoji shortcodes (e.g. `:P_Foxspirit_Tag:`)
  and the DPS sheet keys them by input (e.g. `S+LMB`, `W+RMB`). These must be reconciled to one
  canonical id per ability.
- **Protection classification (drives the practice-tool UI sections) — a graded scale, not binary:**
  - **Full protection** = **i-frame (invincibility)** or **Super Armor (SA)**.
  - **Partial protection** = **Frontal Guard (FG)** — blocks frontal hits only. More protected than
    unprotected, but less protected than i-frame/SA. It is its own middle tier.
  - **Unprotected** = no i-frame, no SA, no FG (fully vulnerable during the animation).
  - So the canonical model should store protection as an **ordered enum** (e.g.
    `iframe` / `super_armor` / `frontal_guard` / `none`) rather than a boolean, so the UI can rank
    or group by protection level. How FG-tier abilities surface in the UI sections (own section vs
    grouped with full-protection) is a grilling decision.
  - ⚠️ Protection type is **per-ability and changes with patches**, so it must be researched from an
    up-to-date source, not assumed. This is NOT in our existing sources (the DPS sheet has no
    protection column).

## Sources already collected (`sources/`)
All PvE source material is ingested. Inventory:
- `sources/video-guide.md` — full transcription of the guide video (PvE source of truth). Backed by
  `sources/video-screenshots/` (26 renamed screenshots).
- `sources/dps-data.md` — full per-ability DPS table (PvE source of truth), from the "11/6/26" sheet
  tab. Raw export in `sources/dps-sheet-raw.csv`.
- `sources/discord-pve.md` — verbatim PvE Discord (source of truth). Includes the **DPS Priority
  List**, combos, cancels, buffs/debuffs, rabams, addons.
- `sources/discord-pvp.md` — verbatim PvP Discord (currency uncertain). Bantalope combos + cancels.
- `sources/discord-images/` — Discord screenshots downloaded locally + `README.md` manifest.
- **Cancels reference sheet (external):**
  https://docs.google.com/spreadsheets/d/115Q8_SoUFiCCZzoiWgkOeNKf0ERQk23ZFElSv6WC22s/edit#gid=864274794
- **Guide video:** https://www.youtube.com/watch?v=IhLoxr07buM
- **DPS sheet:**
  https://docs.google.com/spreadsheets/d/1F6D6zCWd7w0hgTnKrtvrPxVEqMj5qT2-sXdbXvXc1UQ/edit?gid=513999560

## What is NOT yet done (the remaining work)
This is Phase 1's mission (details in `PHASE-1-RESEARCH.md`):
1. Research + pick a maintained source for **ability descriptions** (PvE + PvP).
2. Research up-to-date **ability protection type** (i-frame / SA / FG / none) per ability.
3. Build the **canonical content data model** reconciling all `sources/`.
4. Run `/grill-with-docs` with the user → `CONTEXT.md` + ADRs; resolve open design questions.
5. Fill `HANDOFF.md` for Phase 2.

Then Phase 2 builds the app (details in `PHASE-2-BUILD.md`).

## UI practice tool — design intent (still exploratory; settle during grilling)
Don't over-build before the grill confirms the shape. Rough intent:
- One UI layout to practice an **ideal PvE combo**, and one (or more) for **ideal PvP (AOS) combo(s)**.
- Reference: the guide author lays out movement/utility in the top 8 hotbar slots, DPS abilities in
  DPS-priority order in the bottom 12 (left→right, top→bottom). See
  `sources/video-screenshots/ui-setup-example.png`.
- Once a combo is in muscle memory, break the UI into sections:
  1. Movement
  2. **Protected** DPS abilities (i-frame/SA), ordered by DPS
  3. **Unprotected** DPS abilities, ordered by DPS
  4. (Maybe) DPS abilities used for CC — unsure if this is its own section
- This is the user's to shape — bring recommendations, don't unilaterally decide.

## Tech stack — decided in Phase 2, not now
TypeScript/React vs a single HTML file. The right choice depends on the data model and UI design
that come out of Phase 1, so it is deliberately deferred to Phase 2 (the user leans away from a
single HTML file for maintainability, but it's the build instance's call to make and justify).
