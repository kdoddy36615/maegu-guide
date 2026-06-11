import { Link } from "react-router-dom";
import AbilityIcon from "./AbilityIcon";
import type { Mode, Protection } from "../data/types";
import { PROTECTION_LABEL, TIER_LABEL, ability, ccBadges, priorityTierByAbility } from "../data";
import type { CcBadge, TierName } from "../data";

export function ProtBadge({ prot, title }: { prot: Protection | null; title?: string }) {
  if (!prot) return null;
  return (
    <span className={`badge prot-${prot}`} title={title}>
      {PROTECTION_LABEL[prot]}
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
      {TIER_LABEL[tier]}
    </span>
  );
}

/** All the badges an ability row shows: protection, FG handled by color, tier (PvE only), CC. */
export function AbilityBadges({ id, mode, showTier }: { id: string; mode: Mode; showTier?: boolean }) {
  const a = ability(id);
  return (
    <>
      <ProtBadge prot={a.protection[mode]} title={a.protection.tooltip_lines.join("; ")} />
      {showTier && mode === "pve" && <TierBadge tier={priorityTierByAbility.get(id)} />}
      <CcBadges badges={ccBadges(a, mode)} />
      {a.locked && <span className="badge locked" title="Deliberately locked in the skill window">Locked</span>}
    </>
  );
}

/** Inline link to an ability's card on the mode's study page. */
export function AbilityLink({ id, mode = "pve" }: { id: string; mode?: Mode }) {
  const a = ability(id);
  return (
    <Link className="ability-link" to={`/study/${mode === "pvp" ? "aos" : "pve"}#${id}`}>
      <AbilityIcon id={id} />
      {a.short_name}
    </Link>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="kbd">{children}</span>;
}
