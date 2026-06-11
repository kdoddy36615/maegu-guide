# Phase 3 — Design (charter)

> You are the **design instance**. Phases 1 (research/data) and 2 (build) are complete: the app
> works, is verified, and every feature renders from the canonical data. **Your mission: a
> visual/UX design pass — make it look and feel great without breaking the domain rules below.**
> Read `BRIEF.md` first if you haven't (shared context), then this file. You do NOT need to read
> the Phase 1/2 charters.

## Current state (what you're restyling)

A static Vite + React + TypeScript app (no backend) with six routes:

| Route | Page |
|---|---|
| `/#/study/pve` | Study guide, PvE — priority list + Movement / Protected / Unprotected sections, expandable ability cards |
| `/#/study/aos` | Study guide, AOS — same skeleton, AOS loadout, staleness disclaimer |
| `/#/study/setup` | Setup chapter — locks, rabams, addons (source images), reforge, buffs, BSR explainer, earlygame, UI reference |
| `/#/study/combos` | Combos chapter — all 17 combos, cancel fundamentals, secondary priority list |
| `/#/practice/pve` | Practice — combo strips (the user's main in-game companion view) + hotbar-style section layout |
| `/#/practice/aos` | Practice — same, AOS loadout |

**Screenshots of the current state: `docs/screenshots/`** (regenerate with
`node scripts/shoot.mjs` while the dev server runs).

Run & verify:

```sh
npm install
npm run dev                     # http://localhost:5173
npm run build                   # typecheck + production build — must stay green
node scripts/smoke.mjs          # every route renders, no console errors
node scripts/practice-test.mjs  # every combo renders its strip
```

## Where the UI lives

- `app/src/styles.css` — the **single plain-CSS stylesheet**; design tokens are CSS custom
  properties at the top (colors incl. the protection-tier palette). No CSS framework.
- `app/src/components/` — `AbilityCard` (expandable study row), `ComboStrip` (in-game-style
  practice strip), `ComboSteps` (annotated step chips on the Combos page), `badges.tsx`
  (protection / CC / tier badges, `AbilityLink`, `Kbd`), `AbilityIcon`, `DpsTable`,
  `PriorityPanel`, `SourceImage`.
- `app/src/pages/` — one file per route (`StudyModePage` and `PracticePage` are parameterized by
  mode).
- `app/src/data/` — types + all derivations (sections, loadouts, badges, ordering). **You should
  not need to touch this**; if a design needs new derived data, extend `app/src/data/index.ts`
  rather than hardcoding content in components.
- Skill icons: `app/src/assets/icons/<ability-id>.webp` (refetch: `python scripts/fetch_icons.py`).

## Binding constraints — do not design these away

These come from `CONTEXT.md` (domain glossary) and `docs/adr/` (decision records), which are
binding. Highlights:

1. **Vocabulary**: all UI copy uses the glossary's canonical terms and respects its _Avoid_ lists
   — short names everywhere ("Spirited Away", never "Prime: Spirited Away"); "FG"/"Frontal
   Guard"; "priority list", not "rotation"; "PvP" always means AOS.
2. **Protection is a graded, per-mode enum** (`iframe > super_armor > frontal_guard > none`),
   never a boolean. Restyle the palette freely, but the tiers must stay visually distinct and
   rankable, and **FG abilities stay inside Protected sections with a visible FG badge** — never
   silently merged (ADR 0002/0003).
3. **CC badges** are exactly KD / Stun / Float / Stiff / Bound.
4. **DPS values render verbatim** from `data/dps.json` (locked source) — never recompute or hide
   the per-variant rows / cancel-pair rows (ADR 0001).
5. **Loadout rules** (ADR 0004): PvE views never show Foxflare Fling; AOS rabam 57/58 picks
   surface as "unknown", not guessed; AOS pages keep the staleness disclaimer.
6. **Practice tool**: no keyboard/mouse input capture. The combo strip's job is glanceability
   next to the running game — input above icon, skill after skill, "or" stacks, OPTIONAL
   captions (see the amendment in ADR 0003; reference look:
   `sources/discord-images/pve/ui-setup-example.png`).

## Free to change

Everything presentational: layout, navigation, typography, color, spacing, animation, component
structure, even the routing shape. The data layer guarantees correctness; design owns the rest.

## Known rough edges (fair game, in rough priority order)

- No mobile/responsive pass at all — desktop-only so far.
- Navigation is a bare top bar; Setup and Combos pages are long with no in-page nav.
- Ability links that point to an ability outside the current page's loadout scroll nowhere.
- Setup page shows raw source images full-width — could be lightboxed/thumbnailed.
- User-floated idea: a compact print view of all combo strips for a second monitor.
