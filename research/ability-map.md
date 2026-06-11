# Ability Reconciliation Map (working doc — Phase 1)

> Reconciles the three keying systems across `sources/`:
> Discord emoji shortcode (`:P_Foxspirit_Tag:`) ↔ DPS-sheet input (`RMB`) ↔ display name.
> Canonical `id` = kebab-case of the display name (proposed; lock at grill).
> "Prime" = Succession skill; "Preawk" = pre-awakening skill (per dps-data.md `Type`).
>
> DPS-sheet rows like "Petal Play (Cancelled)" are *measurement variants* of one ability, not
> separate abilities — the registry keys one ability and attaches variant DPS rows to it.

## Core kit

| Canonical id | Display name | Shortcode(s) | Input | Type | In DPS sheet? | Notes |
|---|---|---|---|---|---|---|
| `spirited-away` | Prime: Spirited Away | `:P_Spirited_Away:` | S+LMB | Prime | ✅ | Top non-BSR DPS |
| `heavenward-dance` | Prime: Heavenward Dance | `:P_Heavenward_Dance:` | W+RMB | Prime | ✅ (also `BSR:` row) | Repositioning + top DPS |
| `spirit-swirl` | Prime: Spirit Swirl | `:P_Spirit_Swirl:` | Shift+F | Prime | ✅ | Slow from idle |
| `foxflare` | Prime: Foxflare | `:P_Foxflare:` | Shift+Q | Prime | ✅ | Ranged AoE; KD in PvP |
| `petal-play` | Prime: Petal Play | `:P_Petal_Play:` | Shift+LMB | Prime | ✅ (+ Cancelled row) | Cancel after Spirited Away / Bared Claws |
| `nukduri-dance` | Prime: Nukduri Dance | `:P_Nukduri_Dance:` | Shift+C | Prime | ✅ | +20 AP buff |
| `bristling-sparks` | Prime: Bristling Sparks | `:P_Bristling_Sparks:` | Shift+RMB | Prime | ✅ | Big frontal AoE; PvP CC |
| `lurking-claws` | Prime: Lurking Claws | `:P_Lurking_Claws:` | S+F | Prime | ✅ (sheet: "Lurking Claw") | Targeted teleport behind; hold input |
| `foxspirit-tag` | Prime: Foxspirit Tag | `:P_Foxspirit_Tag:` | RMB | Prime | ✅ (+ Cancelled row) | −20 DP debuff |
| `flower-shroud` | Prime: Flower Shroud | `:P_Flower_Shroud:`, `:Flower_Shroud:` | W/S+E | Prime | ✅ (4 rows: (1)/full × F/B) | W+E spawns clone |
| `bared-claws` | Prime: Bared Claws | `:P_Bared_Claws:` | A/D+LMB | Prime | ✅ (+ (1) row) | Asymmetric cancel; spawns clone; stamina hungry |
| `ghost-bomb` | Prime: Ghost Bomb | `:P_Ghost_Bomb:` | A/D+RMB | Prime | ✅ | Side dash, iframe (per Discord PvE) |
| `soul-tear` | Prime: Soul Tear | `:P_Soul_Tear:` | W+Q | Prime | ✅ | Best medium movement; spawns clone |
| `soulflame` | Soulflame | `:Soulflame:` | E | Preawk | ✅ | Kept instead of Magnus |
| `soulsnare` | Soulsnare | `:Soulsnare:` | F | Preawk | ✅ (+ combo rows) | a.k.a. "Bared Claws, Hanpuri" row variants |
| `hanpuri` | Flow: Hanpuri | `:Flow_Hanpuri:` | HOLD E (after E/F/A­/D+RMB) | Preawk | ✅ (2 rows by entry skill) | Targeted teleport to target |
| `charmed` | Charmed | `:Charmed:` | Space | Preawk | ✅ | +20 AP backup; input trap (jump) |
| `nether-river` | Flow: Nether River | `:Flow_Nether_River:` | LMB (flow) | Preawk | ✅ | +AP w/ frontal guard (video) |
| `foxflare-fling` | Foxflare Fling (Magnus) | `:foxflare_fling:` | E (hold) | Preawk | ✅ (per-hit-count rows) | **Leave unlearned for PvE**; used in PvP combos |
| `petalblast` | Petalblast | `:Petal_Blast:` | S+RMB | Preawk | ✅ | **Locked** (preference) |

## Rabams (skill enhancements)

| Canonical id | Display name | Shortcode | Input | Level | In DPS sheet? | Notes |
|---|---|---|---|---|---|---|
| `heavenly-return` | Heavenly Return | `:Heavenly_Return:` | Shift+X | 56 | ✅ (+ fast row) | PvE pick |
| `spirit-parade` | Spirit Parade | `:Spirit_Parade:` | Shift+X | 56 | ✅ (+ fast row) | Protected alternative; PvP pick |
| `petal-snare` | Petal Snare | `:Petal_Snare:` | Shift+Z | 57 | ✅ | Long, low DPS |
| `constricting-charm` | Constricting Charm | `:Constricting_Charm:` | Shift+Z | 57 | ✅ (+ →Sparks row) | PvE pick; flows into Spirit Sparks |
| `spirit-sparks` | Spirit Sparks | `:Spirit_Sparks:` | LMB | 58 | ✅ (2 rows) | PvE pick (filler) |
| `soul-charm` | Soul Charm | `:Soul_Charm:` | Quickslot | 58 | ❌ | "If taken"; not useful in PvE |

## Movement / utility / non-DPS

| Canonical id | Display name | Shortcode | Input | In DPS sheet? | Notes |
|---|---|---|---|---|---|
| `spirit-step` | Spirit Step | `:Spirit_Step:` | Shift+Dir | ❌ | PvE iframe dash |
| `chain-spirit-step` | Chain: Spirit Step | `:Chain_Spirit_Step:` | Shift+Dir (chained) | ❌ | Chained dash |
| `path-of-petals` | Path of Petals | `:Path_Of_Petals:` | W+F | ❌ | Long-distance; ledge-safe |
| `foxspirit-deceiver` | Foxspirit Deceiver (clone swap) | `:13Foxspirit_Deceiver:` | Q | ❌ | Swap with clone, usable mid-animation |
| `foxspirit-form` | Foxspirit Form | `:Foxspirit_Form:` | Quickslot | ❌ | +25 AP, 3-min CD |
| `evasion` | Evasion | `:Evasion:` | — | ❌ | **Locked** |
| `pig-king` | (Pig King skill) | — | — | ❌ | **Locked** per video; only Bound in kit. Exact skill name TBD from description source |

## Open reconciliation questions — status after research (2026-06-11)
1. ~~"Lurking Claw" vs "Lurking Claws"~~ → official name is **Prime: Lurking Claws** (BDO Codex 7282).
2. Video lock list: "Unnecessary" = **Evasion** (icon match). "Input-conflicts with Shift+X" =
   **UNIDENTIFIED** (teal pentagon icon, corner gems, upright white closed fan — matched against
   all Maegu kit/rabam/passive/awakening/common icons on BDO Codex without a hit). **Ask user.**
3. ~~"Pig King" skill~~ → not a skill: the locked Bound skill is **Absolute: Petalblast** (only
   Bound in kit, PvE only); "Pig King" is the *boss* you'd unlock it for.
4. ~~`:13Foxspirit_Deceiver:`~~ → official name **Prime: Foxspirit: Deceiver** (7312), the Q clone swap.
5. `Prime:`/`Absolute:` prefix in UI display names — still a grill/CONTEXT decision
   (data carries both `name` and `short_name`).
