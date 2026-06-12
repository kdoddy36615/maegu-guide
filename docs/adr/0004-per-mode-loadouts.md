# Per-mode loadouts: Grinding and AOS are different character specs

The user re-specs when switching between grinding and AOS, so the app models a **Loadout** per
mode rather than one character state: Grinding = Magnus unlearned (keeps Soulflame on E),
Heavenly Return at rabam 56, PvE addons; AOS = Magnus (Foxflare Fling) learned, Spirit Parade at
56, AOS addons. Consequences: PvP drills teach the Fling variants of combos (Hanpuri combos still
require Charmed — not interchangeable there); PvE views must not show Foxflare Fling as
available. Open gap: the sources never state AOS picks for rabams 57/58. Decided 2026-06-11 in
the Phase 1 grill.

**Amendment (2026-06-12):** the 57/58 gap is resolved by the rank-1 observation
(`sources/rank1-aos-observation.md`): AOS rabams are Spirit Parade / Petal Snare / Soul Charm
(56 and 57 seen in play; 58 read off the player's skill-enhancement tree screenshot). The same
observation added an AOS-only unlock: Petalblast (locked for grinding) is learned in AOS as an
SA-protected ranged poke — "locked" is now a per-mode fact (`isLockedIn`), not a global flag.
