# Succession Maegu Study & Practice

A study guide + practice tool for Succession Maegu in Black Desert Online, covering PvE grinding
and capped AOS PvP. The canonical dataset reconciles locked community sources with live game text.

## Language

### Abilities

**Ability**:
One skill in the kit, identified by its canonical kebab-case id (e.g. `spirited-away`). One
ability may have many DPS measurements and many input routes.
_Avoid_: spell, move (the sources mix these freely)

**Short name**:
The display name without the in-game rank prefix — "Spirited Away", not "Prime: Spirited Away".
UI uses short names everywhere; official names live in the data for detail views.

**Prime skill**:
The Succession-enhanced version of a main-weapon skill ("Prime:" prefix in game). Succession
Maegu takes all Prime skills.

**Pre-awakening skill** (preawk):
A skill shared with the pre-56 kit, used at its Absolute rank where one exists.

**Rabam**:
A level 56/57/58 skill enhancement where you pick one of two skills. Picks are per loadout:
Grinding takes Heavenly Return at 56; AOS takes Spirit Parade. 57 = Constricting Charm,
58 = Spirit Sparks for grinding; AOS picks for 57/58 are an open gap.
_Avoid_: skill enhancement (use only when explaining what a rabam is)

**Loadout**:
The per-mode character spec: which skills are learned (Magnus learned for AOS, unlearned for
grinding), rabam picks, and addons. The user re-specs when switching between grinding and AOS,
so every mode view reflects its loadout.
_Avoid_: build (reserve for gear: DR/evasion builds)

**Clone swap**:
Maegu's unique succession mechanic: Q (Foxspirit: Deceiver) swaps position with the illusory
double spawned by Bared Claws, Soul Tear, or W+E Flower Shroud. One clone, 3 seconds.
_Avoid_: deceiver (alone), double

### Protection

**Protection**:
What an ability shields you with while animating. A graded scale stored per mode (PvE/PvP):
`iframe` > `super_armor` > `frontal_guard` > `none`. Never a boolean.

**i-frame**:
Invincibility — ignores all hits. Full protection.
_Avoid_: invincible (in prose; tooltips say "Invincible" and that's fine in quoted text)

**Super Armor (SA)**:
Ignores CC but takes damage. Full protection tier alongside i-frame.

**Frontal Guard (FG)**:
Blocks hits from the front only. Partial protection — its own middle tier, written "FG" in most
contexts. In-game tooltip text spells it "Forward Guard"; same thing.
_Avoid_: block

**Unprotected**:
No i-frame, no SA, no FG during the animation.
_Avoid_: naked, free

### Practice tool

**Section**:
A group in the practice-tool layout. Three per mode: Movement, Protected DPS (i-frame/SA *and*
FG — FG abilities carry a badge), Unprotected DPS. DPS sections are ordered by DPS, mirroring the
in-game hotbar scheme (movement/utility top, DPS priority below).

**FG badge**:
The visual marker on a Frontal Guard ability inside the Protected section (FG is shown, never
silently merged).

**CC badge**:
The visual marker (KD / Stun / Float / Stiff / Bound) on any ability that crowd-controls. There
is no separate CC section.

**Combo strip**:
The practice-tool's in-game-style rendering of a combo: input above skill icon, skill after
skill, "or" stacks for choice steps, OPTIONAL captions — pulled up next to the game while
practicing. No keyboard/mouse input capture — actual key practice happens in-game.
_Avoid_: drill (the v1 flashcard quiz this replaced; see ADR 0003 amendment)

**Ideal combo**:
The combo a mode's practice page selects by default. PvE: the Infinite Combo. PvP: one
representative per combo family (Flower Shroud #1 is *the* single ideal if only one is shown).

**Priority drill** (planned, later):
A drill over the DPS Priority List ordering itself, built from the Discord tier list.

### Combat vocabulary

**Combo family**:
A group of PvP combos sharing an opener and situation: Flower Shroud (isolated burst), Bristling
(stay-in-SA), Hanpuri (backpedal CC), Stiff/Foxflare (off a stiff or clone bait).

**Infinite Combo**:
The loopable lazy/beginner PvE combo both locked sources teach. Optional skills (Heavenly Return,
Foxflare) join the loop at high attack speed (BSR / Shai buffs).

**DPS Priority List**:
The Discord tier list (Top / Core / Filler + buffs-debuffs first) that governs freestyle PvE play.
_Avoid_: rotation (BDO play is priority-driven, not a fixed rotation)

**Cancel**:
Using one ability to cut another's animation short (faster version of the second ability, or
cutting recovery frames). The cancelled version of a skill is the optimized one.

**Flow**:
An in-game follow-up input chain (e.g. Flow: Hanpuri after E/F/Ghost Bomb). A flow is a kind of
ability, not a cancel.

**AOS**:
Arena of Solare — capped 3v3. The ONLY PvP mode in scope; "PvP" in this project always means AOS.
_Avoid_: uncapped, open-world PvP framing

**Locked skill**:
A skill deliberately locked in the skill window so it cannot trigger by accident (Petalblast,
Evasion, Rage Transfer).

**-DP / -DR**:
Foxspirit Tag's defense debuff (apply at fight start) / damage-reduction debuff from addons.
The sources write both; they stack.
