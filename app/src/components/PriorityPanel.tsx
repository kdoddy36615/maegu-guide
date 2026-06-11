import type { Mode, PriorityList } from "../data/types";
import { TIER_LABEL } from "../data";
import { AbilityLink } from "./badges";

function EntryParts({ part, mode }: { part: string; mode: Mode }) {
  const options = part.split("|");
  return (
    <>
      {options.map((id, i) => (
        <span key={id}>
          {i > 0 && <span className="dim"> or </span>}
          <AbilityLink id={id} mode={mode} />
        </span>
      ))}
    </>
  );
}

export default function PriorityPanel({ list, mode }: { list: PriorityList; mode: Mode }) {
  return (
    <div className="priority-panel">
      <p className="small dim" style={{ margin: "0 0 6px" }}>
        {list.instruction}
      </p>
      {list.tiers.map((tier) => (
        <div className="priority-tier" key={tier.tier}>
          <span className={`badge tier-${tier.tier}`}>{TIER_LABEL[tier.tier]}</span>
          <span className="entries">
            {tier.entries.map((e, i) => (
              <span className="priority-entry" key={i}>
                {e.ability && <EntryParts part={e.ability} mode={mode} />}
                {e.sequence &&
                  e.sequence.map((part, j) => (
                    <span key={j}>
                      {j > 0 && <span className="dim"> → </span>}
                      <EntryParts part={part} mode={mode} />
                    </span>
                  ))}
                {e.note && <span className="dim small"> — {e.note}</span>}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
