# Live-fact source decisions (Phase 1)

Pulled: **2026-06-11** (all URLs below fetched this date).

## Chosen source: BDO Codex (primary, for BOTH ability descriptions and protection type)

- Class skill list: https://bdocodex.com/us/skills/maegu/
- Per-skill tooltip endpoint (scriptable refresh): `https://bdocodex.com/tip.php?id=skill--<ID>&l=us`
- Raw pulls: `research/bdocodex/raw/skill-<ID>.html` (36 skills); parsed: `research/bdocodex/tooltips.json`
  via `research/bdocodex/parse_tooltips.py`.

### Why BDO Codex
1. **Mirrors live in-game skill text** (the authoritative source for descriptions AND stated
   protections — tooltips carry "Invincible / Super Armor / Forward Guard" lines).
2. **Patch-current**: site lists game patches through 04-06-2026 (within a week of pull date).
   Verified against official patch notes: the 2026-02-12 patch changed only Maegu *Awakening*
   (Foxflare Stroke AP buff 20→18 + damage compensation); no Succession changes since —
   https://www.naeu.playblackdesert.com/en-us/News/Detail?groupContentNo=9706&countryType=en-us
3. Stable per-skill IDs + KR names + machine-readable endpoint → refresh is one curl per skill.

### Rejected candidates
- **BDFoundry skills list** — last updated 2023-01-18 (release-era). Stale. ❌
- **Garmoth / bdolytics** — hard-block automated access (HTTP 403); could not verify content. ❌
- **Sportskeeda / blog guides** — release-era or undated. ❌

## Corroboration (protection)
- **Cancels sheet** (community, same circle as locked sources):
  https://docs.google.com/spreadsheets/d/115Q8_SoUFiCCZzoiWgkOeNKf0ERQk23ZFElSv6WC22s/edit#gid=864274794
  — export saved `research/cancels-sheet-raw.csv`. Confirms Spirit Step (iframe → standing SA
  recovery) vs Chain: Spirit Step (SA → iframe while vanished → rolling SA recovery), matching
  tooltips.
- **Locked PvE sources** (Discord/video): every protection hint matches the tooltips —
  Ghost Bomb iframe ✓, Spirit Step "PvE iframes" ✓ (tooltip: Invincible *PvE only*),
  Spirit Parade protected vs Heavenly Return unprotected ✓, Nether River FG ✓.

## Flags / residual uncertainty
1. **Prime: Spirited Away = Forward Guard** (tooltip), but `discord-pvp.md` calls the
   Spirited-Away engage "fully SA until you choose to leave". Reading: the *combo's tail*
   (Lurking/Nukduri/Heavenward/Swirl) is SA, not Spirited Away itself — but PvP Discord currency
   is uncertain anyway. Tooltip wins per-ability; flagged for the grill.
2. **Tooltip granularity**: tooltips state protection *presence*, not gap frames or lingering
   windows (e.g. Chain: Spirit Step's "very long lingering SA" is cancels-sheet knowledge, not
   tooltip text). The ordered enum classification is from tooltips; nuances stored as notes.
3. **Charmed / Soulflame / Soulsnare / Heavenly Return / Foxflare / Petal Play /
   Fan of Flames / Deceiver: no protection stated in tooltip** → classified `none`
   (consistent with Discord: Heavenly Return "no protection is rarely an issue").
4. ~~Unidentified third locked skill~~ → **RESOLVED in grill (2026-06-11): Rage Transfer**
   (common BSR skill, id 91, input X — icon matches exactly). Locked because Shift+X misfires
   would transfer 50% of Black Spirit's Rage to another player.
5. Recommended final check (user, 30s in-game): spot-check 2–3 tooltips (e.g. Spirited Away FG
   line, Ghost Bomb "Invincible while moving") against live game text.

## Protection classification (tooltip-derived, 2026-06-11)

Enum: `iframe` > `super_armor` > `frontal_guard` > `none`. PvE-only protections noted.

| Ability | Tooltip line(s) | Enum (PvP-relevant) | Notes |
|---|---|---|---|
| Evasion | Invincible during the skill (PvE only) | `none` (PvE: iframe) | locked anyway |
| Spirit Step | Invincible → Super Armor (nullified during CD); Invincible (PvE only) | `iframe` | PvE: full iframe |
| Chain: Spirit Step | Super Armor; Invincible when character disappears; Invincible (PvE only) | `super_armor` (iframe segment) | lingering SA per cancels sheet |
| Prime: Ghost Bomb | Invincible while moving | `iframe` | |
| Prime: Heavenward Dance | Super Armor during the skill | `super_armor` | |
| Prime: Lurking Claws | Super Armor during the skill | `super_armor` | |
| Prime: Foxspirit: Tag | Super Armor during the skill | `super_armor` | |
| Prime: Bristling Sparks | Super Armor during the skill | `super_armor` | |
| Prime: Spirit Swirl | Super Armor during the skill | `super_armor` | |
| Prime: Nukduri Dance | Super Armor during the skill | `super_armor` | |
| Prime: Soul Tear | Super Armor before the attack hits | `super_armor` | partial window |
| Prime: Foxspirit: Form | Super Armor during the skill | `super_armor` | |
| Flow: Hanpuri | Super Armor | `super_armor` | |
| Absolute: Path of Petals | Super Armor during the skill | `super_armor` | |
| Absolute: Petalblast | Super Armor during the skill | `super_armor` | locked |
| Spirit Parade | Super Armor during the skill | `super_armor` | |
| Constricting Charm | Super Armor during the skill | `super_armor` | |
| Soul Charm | Super Armor during the skill | `super_armor` | |
| Black Spirit: Prime: Heavenward Dance | Super Armor | `super_armor` | BSR version |
| Prime: Spirited Away | Forward Guard during the skill | `frontal_guard` | see flag 1 |
| Prime: Bared Claws | Forward Guard (nullified during cooldown) | `frontal_guard` | conditional |
| Prime: Flower Shroud | Forward Guard | `frontal_guard` | |
| Flow: Nether River | Forward Guard during the skill | `frontal_guard` | |
| Petal Snare | Forward Guard during the skill | `frontal_guard` | |
| Spirit Sparks | Forward Guard during the skill | `frontal_guard` | |
| Foxflare Fling | Forward Guard at the start of the skill | `frontal_guard` | windup only |
| Prime: Foxflare | — | `none` | |
| Prime: Petal Play | — | `none` | |
| Absolute: Charmed | — | `none` | |
| Absolute: Soulflame | — | `none` | |
| Absolute: Soulsnare | — | `none` | |
| Heavenly Return | — | `none` | |
| Prime: Fan of Flames | — | `none` | |
| Prime: Foxspirit: Deceiver | — (passive/swap) | `none` | |
| Predominance / Foxspirit: Phantom | — (passives) | n/a | |

> Terminology note for CONTEXT.md: in-game text says **"Forward Guard"**; the community/BRIEF
> says **"Frontal Guard"** — same thing, enum value stays `frontal_guard`.

## Identifications made from research
- Video lock "only Bound in kit, e.g. Pig King" = **Absolute: Petalblast** (only Bound effect in
  kit, PvE only; "Pig King" is the boss you'd want Bound for). Matches Discord locking `:Petal_Blast:`.
- Video lock "Unnecessary" = **Evasion** (icon match; Discord locks `:Evasion:` too).
- Video "Quickslot: can only be used from quickslot" = **Prime: Foxspirit: Form** (tooltip input
  is quickslot-only). Discord adds **Soul Charm** "(if taken)".
- `:13Foxspirit_Deceiver:` = **Prime: Foxspirit: Deceiver** (Q clone swap; passive granting
  illusory double after Bared Claws / Soul Tear / W+E Flower Shroud; clone lasts 3s — cancels sheet).
- "BSR: Heavenward Dance" (DPS sheet) = **Black Spirit: Prime: Heavenward Dance** (id 7324).
- Sheet's "Lurking Claw" → official name **Prime: Lurking Claws**.
