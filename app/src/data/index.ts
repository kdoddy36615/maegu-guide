/**
 * Data plumbing: loads the canonical data/*.json, indexes it, and derives the
 * presentation groupings the pages need (loadouts per ADR 0004, sections per
 * ADR 0003, CC badges, DPS ordering). Content itself is never hardcoded here —
 * only the rules the ADRs lock down.
 */
import abilitiesJson from "../../../data/abilities.json";
import dpsJson from "../../../data/dps.json";
import combosJson from "../../../data/combos.json";
import cancelsJson from "../../../data/cancels.json";
import setupJson from "../../../data/setup.json";
import type {
  AbilitiesFile,
  Ability,
  CancelsFile,
  Combo,
  CombosFile,
  DpsFile,
  DpsRow,
  Mode,
  PriorityTier,
  Protection,
  SetupFile,
} from "./types";

export const abilitiesFile = abilitiesJson as unknown as AbilitiesFile;
export const dps = dpsJson as unknown as DpsFile;
export const combosFile = combosJson as unknown as CombosFile;
export const cancels = cancelsJson as unknown as CancelsFile;
export const setup = setupJson as unknown as SetupFile;

export const abilities: Ability[] = abilitiesFile.abilities;

export const abilityById = new Map<string, Ability>(abilities.map((a) => [a.id, a]));

export function ability(id: string): Ability {
  const a = abilityById.get(id);
  if (!a) throw new Error(`Unknown ability id: ${id}`);
  return a;
}

// ---- DPS rows per ability (1 ability ↔ N rows; cancel pairs ref 2 — ADR 0001) ----

export const dpsRowsByAbility = new Map<string, DpsRow[]>();
for (const row of dps.rows) {
  for (const ref of row.ability_refs) {
    const list = dpsRowsByAbility.get(ref) ?? [];
    list.push(row);
    dpsRowsByAbility.set(ref, list);
  }
}

/** Best (max) DPS for ordering within a mode. PvE uses non-BSR; PvP uses the sheet's PvP DPS. */
export function bestDps(abilityId: string, mode: Mode): number | null {
  const rows = dpsRowsByAbility.get(abilityId) ?? [];
  const values = rows
    .map((r) => (mode === "pve" ? r.pve_dps_non_bsr : r.pvp_dps))
    .filter((v): v is number => v != null);
  return values.length ? Math.max(...values) : null;
}

// ---- Protection (graded enum, per mode — ADR 0002) ----

export const PROTECTION_LABEL: Record<Protection, string> = {
  iframe: "i-frame",
  super_armor: "Super Armor",
  frontal_guard: "FG",
  none: "Unprotected",
};

export function protectionIn(a: Ability, mode: Mode): Protection | null {
  return a.protection[mode];
}

/** Graded fill counts for the 4-dot protection meter (design spec: i-frame 4 … none 1). */
export const PROT_RANK: Record<Protection, number> = {
  iframe: 4,
  super_armor: 3,
  frontal_guard: 2,
  none: 1,
};

/** Mono micro-labels for the protection meter cell. */
export const PROT_SHORT: Record<Protection, string> = {
  iframe: "IFRAME",
  super_armor: "SA",
  frontal_guard: "FG",
  none: "UNPROT",
};

/** DPS-bar fill percentage. PvE scale is a fixed 100k; AOS scales to the sheet's max PvP DPS. */
const PVP_DPS_MAX = Math.max(...dps.rows.map((r) => r.pvp_dps ?? 0));
export function dpsBarPct(abilityId: string, mode: Mode): number | null {
  const v = bestDps(abilityId, mode);
  if (v == null) return null;
  const scale = mode === "pve" ? 100000 : PVP_DPS_MAX;
  return Math.min(100, (v / scale) * 100);
}

// ---- CC badges (KD / Stun / Float / Stiff / Bound — CONTEXT.md) ----

export interface CcBadge {
  label: "KD" | "Stun" | "Float" | "Stiff" | "Bound";
  pveOnly: boolean;
  line: string;
}

const CC_PATTERNS: [RegExp, CcBadge["label"]][] = [
  [/knockdown/i, "KD"],
  [/stun/i, "Stun"],
  [/floating/i, "Float"],
  [/stiffness/i, "Stiff"],
  [/bound/i, "Bound"],
];

export function ccBadges(a: Ability, mode: Mode): CcBadge[] {
  const lines = a.tooltip?.cc_lines ?? [];
  const badges: CcBadge[] = [];
  for (const line of lines) {
    const pveOnly = /\(PvE only\)/i.test(line);
    if (mode === "pvp" && pveOnly) continue;
    for (const [re, label] of CC_PATTERNS) {
      if (re.test(line) && !badges.some((b) => b.label === label)) {
        badges.push({ label, pveOnly, line });
      }
    }
  }
  return badges;
}

// ---- Loadouts (ADR 0004: Grinding vs AOS are different specs) ----

export interface Loadout {
  mode: Mode;
  /** Ability ids available in this mode's spec (locked skills excluded). */
  ids: Set<string>;
  /** Rabam picks that are an open gap in the sources (AOS 57/58) — both candidates shown, flagged. */
  unknownRabamIds: Set<string>;
}

function buildLoadout(mode: Mode): Loadout {
  const excluded = new Set<string>();
  const unknownRabamIds = new Set<string>();

  // do_not_learn entries are the PvE/grinding spec; AOS learns them (ADR 0004).
  if (mode === "pve") {
    for (const d of setup.skill_choices.do_not_learn) excluded.add(d.ability);
  }

  for (const choice of setup.rabams.choices) {
    const pick = mode === "pve" ? choice.pve_pick : choice.aos_pick;
    const candidates = [choice.pve_pick, choice.alternative];
    if (pick) {
      for (const c of candidates) if (c !== pick) excluded.add(c);
    } else {
      // Open gap (AOS 57/58): keep both candidates, flagged as unknown.
      for (const c of candidates) unknownRabamIds.add(c);
    }
  }

  const ids = new Set(
    abilities
      .filter((a) => a.kind !== "passive" && !a.locked && !excluded.has(a.id))
      .map((a) => a.id),
  );
  return { mode, ids, unknownRabamIds };
}

export const loadouts: Record<Mode, Loadout> = {
  pve: buildLoadout("pve"),
  pvp: buildLoadout("pvp"),
};

// ---- Sections (ADR 0003: Movement / Protected (FG badged) / Unprotected, DPS-ordered) ----

export interface ModeSections {
  movement: Ability[];
  protected: Ability[];
  unprotected: Ability[];
}

function isDpsSectionAbility(a: Ability): boolean {
  return a.roles.includes("dps") && a.dps_row_count > 0;
}

function byDpsDesc(mode: Mode) {
  return (x: Ability, y: Ability) => {
    const dx = bestDps(x.id, mode);
    const dy = bestDps(y.id, mode);
    if (dx == null && dy == null) return x.short_name.localeCompare(y.short_name);
    if (dx == null) return 1;
    if (dy == null) return -1;
    return dy - dx;
  };
}

/**
 * Sections for a mode, built from its loadout. The BSR Heavenward Dance variant
 * is not a hotbar skill, so it stays out of sections (covered by the BSR explainer).
 */
export function sectionsFor(mode: Mode, opts?: { includeLocked?: boolean }): ModeSections {
  const loadout = loadouts[mode];
  const pool = abilities.filter(
    (a) =>
      a.kind !== "passive" &&
      a.id !== "bsr-heavenward-dance" &&
      (loadout.ids.has(a.id) || (opts?.includeLocked && a.locked)),
  );
  const movementRank = (a: Ability) =>
    a.roles.includes("movement") ? 0 : a.roles.includes("repositioning") ? 1 : 2;
  const movement = pool
    .filter((a) => !isDpsSectionAbility(a))
    .sort((x, y) => movementRank(x) - movementRank(y));
  const dpsPool = pool.filter(isDpsSectionAbility).sort(byDpsDesc(mode));
  return {
    movement,
    protected: dpsPool.filter((a) => protectionIn(a, mode) !== "none"),
    unprotected: dpsPool.filter((a) => protectionIn(a, mode) === "none"),
  };
}

// ---- DPS Priority List tiers (PvE only — the Discord list is THE list) ----

export type TierName = PriorityTier["tier"];

export const TIER_LABEL: Record<TierName, string> = {
  buffs_debuffs: "Buffs/Debuffs",
  top: "Top",
  core: "Core",
  filler: "Filler",
};

/** abilityId → highest tier it appears in on the Discord DPS Priority List. */
export const priorityTierByAbility = new Map<string, TierName>();
for (const tier of combosFile.priority_lists.pve_discord.tiers) {
  for (const entry of tier.entries) {
    const ids: string[] = [];
    if (entry.ability) ids.push(entry.ability);
    for (const part of entry.sequence ?? []) ids.push(...part.split("|"));
    for (const id of ids) {
      if (!priorityTierByAbility.has(id)) priorityTierByAbility.set(id, tier.tier);
    }
  }
}

// ---- Combos ----

export const combos: Combo[] = combosFile.combos;
export const comboById = new Map(combos.map((c) => [c.id, c]));

/** Ideal combos (CONTEXT.md): PvE = the Infinite Combo; AOS = one drill per family. */
export const IDEAL_COMBOS: Record<Mode, string[]> = {
  pve: ["pve-infinite"],
  pvp: ["pvp-flower-shroud-1", "pvp-bristling-1", "pvp-hanpuri-1", "pvp-stiff-foxflare-1"],
};

/** PvP combo families (CONTEXT.md: opener + situation). Order matters: Flower Shroud first = the ideal family. */
export const COMBO_FAMILIES: { prefix: string; name: string; situation: string }[] = [
  { prefix: "pvp-flower-shroud", name: "Flower Shroud", situation: "isolated burst" },
  { prefix: "pvp-bristling", name: "Bristling", situation: "stay-in-SA" },
  { prefix: "pvp-hanpuri", name: "Hanpuri", situation: "backpedal CC" },
  { prefix: "pvp-stiff-foxflare", name: "Stiff/Foxflare", situation: "off a stiff or clone bait" },
];

// ---- Cancels lookup for ability detail views ----

export interface AbilityCancelInfo {
  /** Notable PvE cancel entry — faster_after, faster_into, or note-only shape. */
  notable?: { faster_after?: string[]; faster_into?: string[]; note?: string };
  slowCast?: string;
  inputTrap?: string;
  pvp?: { cancelled_into_from?: string[]; cancelled_out_into?: string[]; note?: string };
  sheetBlock?: CancelsFile["sheet_blocks"][number];
}

export function cancelInfo(abilityId: string): AbilityCancelInfo {
  const info: AbilityCancelInfo = {};
  const n = cancels.notable_cancels_pve;
  const entry = n.entries.find((e) => e.skill === abilityId);
  if (entry) info.notable = entry;
  info.slowCast = n.slow_casts.find((e) => e.skill === abilityId)?.note;
  info.inputTrap = n.input_traps.find((e) => e.skill === abilityId)?.note;
  const pvp = cancels.primary_cancels_pvp.entries.find((e) => e.skill === abilityId);
  if (pvp) info.pvp = pvp;
  info.sheetBlock = cancels.sheet_blocks.find((b) => b.skill === abilityId);
  return info;
}

export function hasPveAddons(abilityId: string): boolean {
  return setup.addons.pve_general.skills_with_addons.includes(abilityId);
}

// ---- Dev-time referential check (canonical validator is scripts/validate_data.py) ----

if (import.meta.env.DEV) {
  const missing: string[] = [];
  const check = (id: string | null | undefined, where: string) => {
    if (id && !abilityById.has(id)) missing.push(`${where}: ${id}`);
  };
  for (const row of dps.rows) row.ability_refs.forEach((r) => check(r, `dps ${row.sheet_label}`));
  for (const c of combos)
    c.steps.forEach((s, i) => {
      check(s.ability, `${c.id}[${i}]`);
      s.choices?.forEach((ch) => check(ch, `${c.id}[${i}]`));
    });
  if (missing.length) console.error("Data reference errors:", missing);
}
