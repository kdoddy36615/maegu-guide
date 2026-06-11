# Protection is a graded enum, stored separately for PvE and PvP

Protection is `iframe > super_armor > frontal_guard > none` (ordered, never a boolean), stored
as **two values per ability** (`protection.pve`, `protection.pvp`) because live game text grants
some protections "(PvE only)" — e.g. Spirit Step and Evasion are i-frames in PvE but not in PvP.
Partial-window nuances ("SA before the attack hits", "FG at the start") stay in
`protection.notes` rather than extra enum values, keeping the enum rankable for UI grouping.
Values derive from in-game tooltip lines (BDO Codex mirror, pulled 2026-06-11, per-ability source
URL recorded); they are patch-sensitive and must be re-reviewed when tooltips are refreshed.
Provenance and the one known source conflict (Spirited Away FG vs a loose "fully SA" Discord
claim) are recorded in `research/source-decisions.md`.
