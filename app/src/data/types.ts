/**
 * TypeScript types mirroring the canonical data schema
 * (research/schema-proposal.md, locked by ADR 0001 / ADR 0002).
 */

/** Ordered protection enum — iframe > super_armor > frontal_guard > none (ADR 0002). Never a boolean. */
export type Protection = "iframe" | "super_armor" | "frontal_guard" | "none";

export type Mode = "pve" | "pvp";

export type Role =
  | "dps"
  | "movement"
  | "repositioning"
  | "cc"
  | "buff"
  | "debuff"
  | "heal"
  | "utility"
  | "passive";

export type AbilityKind = "prime" | "preawk" | "rabam" | "passive";

export interface Provenance {
  source: string;
  source_url: string;
  pulled: string;
}

export interface AbilityProtection extends Provenance {
  /** null only for the passive (Predominance). */
  pve: Protection | null;
  pvp: Protection | null;
  tooltip_lines: string[];
  notes: string | null;
}

export interface AbilityTooltip {
  bdocodex_id: number;
  name_kr: string;
  input_text: string | null;
  required_level: number | null;
  mp_cost: string | null;
  cooldown: string | null;
  effects: string[];
  cc_lines: string[];
}

export interface Ability {
  id: string;
  name: string;
  short_name: string;
  kind: AbilityKind;
  shortcodes: string[];
  inputs: string[];
  roles: Role[];
  locked: boolean;
  rabam: { level: number; alternative: string } | null;
  protection: AbilityProtection;
  description: Provenance & { text: string };
  tooltip: AbilityTooltip | null;
  dps_row_count: number;
  notes: string[];
}

export interface AbilitiesFile {
  _meta: Record<string, unknown>;
  abilities: Ability[];
}

// ---- dps.json (locked PvE truth, 1:1 with the sheet — ADR 0001) ----

export interface DpsRow {
  input: string;
  sheet_label: string;
  /** 1–2 ability ids: cancel-pair rows span two abilities. */
  ability_refs: string[];
  variant: string | null;
  type: string;
  pve_dps_non_bsr: number | null;
  pve_dps_bsr: number | null;
  pvp_dps: number | null;
  pvp_dmg_pct: number | null;
}

export interface DpsFile {
  _meta: {
    source: string;
    sheet_url: string;
    stat_assumptions: {
      crit_damage_pct: number;
      attack_speed_pct: number;
      attack_speed_bsr_pct: number;
      crit_rate_pct: number;
    };
    note: string;
  };
  combo_summaries: { name: string; pve_dps_non_bsr: number; pve_dps_bsr: number }[];
  rows: DpsRow[];
}

// ---- combos.json ----

export interface ComboStep {
  ability?: string;
  choices?: string[];
  input: string;
  optional?: boolean;
  annotation?: string;
}

export interface Combo {
  id: string;
  mode: Mode;
  name: string;
  stage?: string;
  credit?: string;
  sources: string[];
  steps: ComboStep[];
  notes?: string[];
}

export interface PriorityEntry {
  ability?: string;
  /** Parts may be "a|b" meaning either ability. */
  sequence?: string[];
  note?: string;
}

export interface PriorityTier {
  tier: "buffs_debuffs" | "top" | "core" | "filler";
  entries: PriorityEntry[];
}

export interface PriorityList {
  sources: string[];
  instruction: string;
  tiers: PriorityTier[];
}

/** An observed-gameplay log (e.g. watching the rank 1 AOS Maegu) — a usage record, not a taught combo. */
export interface Observation {
  id: string;
  mode: Mode;
  name: string;
  observed: string;
  sources: string[];
  caveat: string;
  /** Labeled fragments of the session, each rendered as its own strip. */
  sequences: { label: string; steps: ComboStep[] }[];
  /** Distinct ability ids seen in the session. */
  abilities: string[];
  /** Suggested in-game UI/hotbar grouping derived from how the player used the kit. */
  ui_groups?: { label: string; why: string; abilities: string[] }[];
  /** Per-skill addon effects transcribed from a screenshot of the observed player's setup. */
  observed_addons?: { ability: string; effects: string[] }[];
  /** The reading of the session: what pattern the chaos follows, grounded in the sources. */
  analysis: string[];
  notes: string[];
}

export interface CombosFile {
  _meta: { schema: string; pve_truth: string; pvp_caveat: string; curated: string };
  combos: Combo[];
  observations: Observation[];
  priority_lists: { pve_discord: PriorityList; pve_video_freestyle: PriorityList };
}

// ---- cancels.json ----

export interface CancelsFile {
  _meta: {
    curated: string;
    sheet_url: string;
    sheet_semantics: string;
    color_caveat: string;
  };
  notable_cancels_pve: {
    sources: string[];
    /** Entries come in three shapes: faster_after, faster_into, or note-only. */
    entries: { skill: string; faster_after?: string[]; faster_into?: string[]; note?: string }[];
    slow_casts: { skill: string; note: string }[];
    input_traps: { skill: string; note: string }[];
  };
  primary_cancels_pvp: {
    sources: string[];
    caveat: string;
    /** Entries come in two shapes: cancelled_into_from or cancelled_out_into. */
    entries: {
      skill: string;
      cancelled_into_from?: string[];
      cancelled_out_into?: string[];
      note?: string;
    }[];
    note?: string;
  };
  general_rules: {
    sources: string[];
    instant_flows_from_everything: string[];
    fast_recovery_cancellers: string[];
    spirit_step_vs_chain: string;
    clone_mechanic: string;
  };
  sheet_blocks: {
    skill: string;
    sheet_name: string;
    sheet_input: string;
    entries: { before_input?: string; after_input?: string; description: string }[];
  }[];
}

// ---- setup.json ----

export interface SetupFile {
  _meta: { curated: string; pve_truth: string; pvp_caveat: string };
  skill_choices: {
    sources: string[];
    general: string;
    locked: { ability: string | null; name?: string; reason: string }[];
    do_not_learn: { ability: string; reason: string }[];
    /** Locked for grinding but learned in the AOS loadout (observed rank-1 play). */
    aos_unlock: { ability: string; reason: string }[];
    quickslot: { ability: string; reason: string }[];
  };
  rabams: {
    sources: string[];
    image: string;
    choices: {
      level: number;
      pve_pick: string;
      /** null = open gap: sources only settle the level-56 AOS pick (ADR 0004). */
      aos_pick: string | null;
      aos_pick_note?: string;
      alternative: string;
      rationale: string;
    }[];
    tree: string;
  };
  addons: {
    pve_general: {
      sources: string[];
      image: string;
      image_caveat: string;
      skills_with_addons: string[];
      notes: string[];
    };
    aos: { sources: string[]; image: string; caveat: string; notes: string[] };
  };
  reforge_stones: { sources: string[]; typical: string[]; rules: string[] };
  buffs_debuffs: {
    sources: string[];
    image: string;
    buffs: { effect: string; abilities: string[]; note: string }[];
    debuffs: { effect: string; abilities: string[]; note: string }[];
  };
  bsr: { sources: string[]; notes: string[] };
  earlygame: {
    sources: string[];
    summary: string;
    ranged: string[];
    big_frontal_aoe: string[];
    close_aoe: string[];
    between_packs: string[];
    advanced_between_packs: string[];
  };
  ui_reference: { sources: string[]; images: string[]; scheme: string };
}
