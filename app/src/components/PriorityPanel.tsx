import { Fragment } from "react";
import type { Mode, PriorityList, PriorityTier } from "../data/types";
import { TIER_LABEL } from "../data";
import { AbilityLink } from "./badges";

const TIER_COLOR: Record<PriorityTier["tier"], string> = {
  top: "var(--tier-top)",
  core: "var(--tier-core)",
  filler: "var(--tier-filler)",
  buffs_debuffs: "var(--tier-buffs)",
};

function EntryParts({ part, mode }: { part: string; mode: Mode }) {
  const options = part.split("|");
  return (
    <>
      {options.map((id, i) => (
        <Fragment key={id}>
          {i > 0 && <span className="nt">or</span>}
          <AbilityLink id={id} mode={mode} />
        </Fragment>
      ))}
    </>
  );
}

/** Bordered tier panel: mono tier cell (tier color) + flex-wrapped entries with icon links. */
export default function PriorityPanel({ list, mode }: { list: PriorityList; mode: Mode }) {
  return (
    <>
      <p className="section-desc">{list.instruction}</p>
      <div className="prio">
        {list.tiers.map((tier) => (
          <div className="prio-row" key={tier.tier}>
            <span className="t" style={{ color: TIER_COLOR[tier.tier] }}>
              {TIER_LABEL[tier.tier]}
            </span>
            <span className="e">
              {tier.entries.map((e, i) => (
                <span className="ent" key={i}>
                  {e.ability && <EntryParts part={e.ability} mode={mode} />}
                  {e.sequence &&
                    e.sequence.map((part, j) => (
                      <Fragment key={j}>
                        {j > 0 && <span className="ar">→</span>}
                        <EntryParts part={part} mode={mode} />
                      </Fragment>
                    ))}
                  {e.note && <span className="nt">— {e.note}</span>}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
