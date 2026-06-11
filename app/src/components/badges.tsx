import { Link, useParams } from "react-router-dom";
import AbilityIcon from "./AbilityIcon";
import type { Mode, Protection } from "../data/types";
import {
  PROTECTION_LABEL,
  PROT_RANK,
  PROT_SHORT,
  TIER_LABEL,
  ability,
  ccBadges,
  priorityTierByAbility,
} from "../data";
import type { CcBadge, TierName } from "../data";

/** Protection colors (unchanged palette) as CSS vars, for meters and DPS bars. */
export const PROT_COLOR: Record<Protection, string> = {
  iframe: "var(--iframe)",
  super_armor: "var(--sa)",
  frontal_guard: "var(--fg)",
  none: "var(--none)",
};

/**
 * The graded, rankable protection rendering: a 4-dot meter (filled = tier rank)
 * plus a mono label, all in the tier's color. FG renders as its own middle
 * tier — never merged into SA/i-frame.
 */
export function ProtMeter({ prot, title }: { prot: Protection; title?: string }) {
  const rank = PROT_RANK[prot];
  const color = PROT_COLOR[prot];
  return (
    <span className="prot" style={{ color }} title={title || PROTECTION_LABEL[prot]}>
      <span className="meter" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <i key={n} style={n <= rank ? { background: color } : undefined} />
        ))}
      </span>
      {PROT_SHORT[prot]}
    </span>
  );
}

export function CcBadges({ badges }: { badges: CcBadge[] }) {
  return (
    <>
      {badges.map((b) => (
        <span key={b.label} className="badge cc" title={b.line}>
          {b.label}
          {b.pveOnly ? " (PvE)" : ""}
        </span>
      ))}
    </>
  );
}

export function TierBadge({ tier }: { tier: TierName | undefined }) {
  if (!tier) return null;
  return (
    <span className={`badge tier-${tier}`} title="DPS Priority List tier (Discord)">
      {tier === "buffs_debuffs" ? "Buffs" : TIER_LABEL[tier]}
    </span>
  );
}

/** All the badges an ability row shows: tier (PvE only), CC, locked. */
export function AbilityBadges({ id, mode, showTier }: { id: string; mode: Mode; showTier?: boolean }) {
  const a = ability(id);
  return (
    <>
      {showTier && mode === "pve" && <TierBadge tier={priorityTierByAbility.get(id)} />}
      <CcBadges badges={ccBadges(a, mode)} />
      {a.locked && <span className="badge locked" title="Deliberately locked in the skill window">Locked</span>}
    </>
  );
}

/** Mode from the current route (global PVE|PVP toggle scopes every page). */
export function useRouteMode(): Mode {
  const params = useParams();
  return params.mode === "pvp" ? "pvp" : "pve";
}

/** Inline link to an ability's ledger row on the mode's Abilities page. */
export function AbilityLink({ id, mode }: { id: string; mode?: Mode }) {
  const routeMode = useRouteMode();
  const a = ability(id);
  const m = mode ?? routeMode;
  return (
    <Link className="ability-link" to={`/${m}/abilities#${id}`}>
      <AbilityIcon id={id} />
      {a.short_name}
    </Link>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="kbd">{children}</span>;
}
