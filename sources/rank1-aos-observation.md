# Rank 1 AOS Gameplay — Observation (user, 2026-06-12)

> The user watched the rank 1 AOS Succession Maegu play and logged every ability they saw, in
> order. This is an **observation of one session**, not a taught combo: order is faithful but
> some Spirit Steps between entries were left out of the log, absences are weak evidence (one
> sitting), identifications of abbreviated names are flagged below, and the exact step boundaries
> between engagements are not recorded. The user noted they could not tell whether the play was
> ordered/prioritised or improvised ("can't tell if there is order to the chaos").

## Verbatim log (main)

> spirit step, petalblast, petal snare, chain spirit step, flow sh, spirit step 2, bristling,
> spirit parade, nukduri d, spirit step x2, bared claw, petal play, spirit step, foxflare,
> foxspirit:, spirit step, spirit parade, spirit step, flower sh, spirit step, bristling,
> ghost bo, soul tear, petal play, foxflare, foxspirit:, flower shroud, bristling,
> (caught -> high dps) -> charmed, foxflare, heavenward, moved away then bared, petal play,
> flower shr, bunch of same stuff with a lot of spirit steps in between stuff
>
> these are the only abilities i saw the rank 1 succ maegu use.

## Verbatim follow-ups (same session)

> saw him use petal play -> soul tear -> lurking claw -> heavenward at one point, so he used
> lurking claw as well, but only once unless i noted it in previous prompt. [...] the abilities
> i gave you in the previous prompt were all in the order he was doing them, but then i started
> leaving out the spirit steps inbetween some of them

> petalblast - lurking claw - soulsn - flow: hanpuri - heavenward - spirit step - spirit swirl
> i just saw him do

> bared claw - flow: nether river - spirit step i just saw

> [addons screenshot] this was his addons. at start of match he does spirit step - petalblast -
> spirit step - bared claw - spirited away - bristling - with a lot of spirit steps inbetween

> i saw him use W+F at some point as well for movement

> i think he might have done that match opener just to apply skill addon buffs

> i think in my initial prompt with his inputs i wrote, every time i wrote "foxspirit:" that was
> likely foxspirit: tag

> [skill enhancement tree screenshot] ok so this is rank 1 skill enhancments.

## Skill enhancement tree (screenshot: `rank1-images/skill-enhancements.png`)

The rank-1 player's own rabam tree, all three picks visible directly:

| Level | Selected | Locked out |
|---|---|---|
| 56 | **Spirit Parade** (from Soulsnare III) | Heavenly Return |
| 57 | **Petal Snare** (from Petalblast III) | Constricting Charm |
| 58 | **Soul Charm** (from Spirited Away IV) | Spirit Sparks |

(Resolved — hypothesis retracted by the user: the opener skills carry no self-buff addons (only
Bared Claws has one, a to-target debuff), so addon application wasn't the motive. The opener
stands as ranged CC fishing while the gap closes.)

## Observed addons (screenshot transcription — text was clearly legible)

| Skill | Add-on effects |
|---|---|
| Bared Claws I | All Damage Reduction −20 for 7 sec to target · All Evasion −20 for 7 sec to target |
| Foxflare I | All Accuracy +20 for 12 sec · Attack/Casting Speed +10% for 12 sec |
| Spirit Swirl I | All Damage Reduction +20 for 25 sec · Critical Hit Rate +30% for 20 sec |
| Flower Shroud I | Critical Hit Rate +30% for 12 sec · Attack/Casting Speed +10% for 12 sec |
| Lurking Claws I | Back Attack damage +5% for 7 sec · Critical Hit Damage +5% for 7 sec |
| Heavenward Dance I | Back Attack damage +5% for 7 sec · Critical Hit Damage +5% for 7 sec |

## Identification mapping

| Logged as | Canonical id | Confidence |
|---|---|---|
| spirit step / spirit step 2 / x2 | `spirit-step` | high ("2"/"x2" = repeated dashes; could include `chain-spirit-step`) |
| petalblast | `petalblast` | high |
| petal snare | `petal-snare` | high — **implies rabam 57 = Petal Snare** (mutually exclusive with Constricting Charm) |
| chain spirit step | `chain-spirit-step` | high |
| flow sh / flower sh / flower shr(oud) | `flower-shroud` | "flower sh*" high; "flow sh" probable (no other "sh" flow exists in kit) |
| bristling | `bristling-sparks` | high |
| spirit parade | `spirit-parade` | high — consistent with the known AOS 56 pick |
| nukduri d | `nukduri-dance` | high |
| bared claw | `bared-claws` | high |
| petal play | `petal-play` | high |
| foxflare | `foxflare` | high (`foxflare-fling` was never logged as such) |
| foxspirit: | `foxspirit-tag` | **user-corrected 2026-06-12** — initially read as Foxspirit: Deceiver; the user identified it as Foxspirit Tag |
| ghost bo | `ghost-bomb` | high |
| soul tear | `soul-tear` | high |
| charmed | `charmed` | high |
| heavenward | `heavenward-dance` | high |
| lurking claw | `lurking-claws` | high |
| soulsn / flow: hanpuri | `soulsnare` → `hanpuri` | high |
| spirit swirl | `spirit-swirl` | high |
| flow: nether river | `nether-river` | high |
| spirited away | `spirited-away` | high |
| W+F | `path-of-petals` | high (movement only; not logged in a sequence) |

## What the observation implies

- **Rabam 56 = Spirit Parade** (seen in play; confirmed by the tree screenshot) — matches the
  locked AOS pick.
- **Rabam 57 = Petal Snare** (seen in play; confirmed by the tree screenshot; matches
  BDFoundry). **Applied** to `data/setup.json` on 2026-06-12.
- **Rabam 58 = Soul Charm** (tree screenshot — never seen cast, as expected for a downtime
  quickslot heal; matches BDFoundry). **Applied** to `data/setup.json` on 2026-06-12. The
  AOS rabam gap from ADR 0004 is fully resolved.
- **Petalblast is unlocked and used** — the grinding loadout locks it, but at rank 1 AOS it
  earns a slot as a Super-Armor-protected long-range AoE poke (note: its Bound is **PvE-only**
  per the tooltip, so the "only Bound in kit" lock reasoning doesn't carry to AOS); the match
  opener and fragment 3 both start with it. **Applied** as an `aos_unlock` in `data/setup.json`
  (2026-06-12).
- **Constant Spirit Step weaving** between casts — in PvP, Spirit Step is Invincible → Super
  Armor (nullified during cooldown), so the weaving is rolling protection, not just movement.
- The punish after a catch was Charmed → Foxflare → Heavenward Dance. Foxspirit Tag's -20 DP
  was applied right after Foxflare attempts (2×). The clone swap (Foxspirit: Deceiver) was
  never logged — initially misread from "foxspirit:", corrected by the user.
- Lurking Claws, Soulsnare → Flow: Hanpuri, Spirit Swirl, Flow: Nether River, and Spirited Away
  appeared only in the later fragments, not the first-logged rotation pool.
- **Not observed** (weak evidence, one session): Foxspirit: Deceiver (clone swap), Foxflare
  Fling, Heavenly Return, Spirit Sparks.
