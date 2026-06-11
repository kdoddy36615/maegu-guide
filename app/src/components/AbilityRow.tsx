import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Ability, Mode } from "../data/types";
import {
  TIER_LABEL,
  bestDps,
  cancelInfo,
  ccBadges,
  dpsBarPct,
  dpsRowsByAbility,
  hasPveAddons,
  loadouts,
  priorityTierByAbility,
} from "../data";
import { AbilityBadges, AbilityLink, Kbd, PROT_COLOR, ProtMeter } from "./badges";
import AbilityIcon from "./AbilityIcon";
import DpsTable from "./DpsTable";

const fmt = (v: number | null) =>
  v == null ? null : v.toLocaleString("en-US", { maximumFractionDigits: 0 });

// preawk displays as "Absolute skill": in a Succession guide "Pre-awakening" reads
// as if the whole kit qualifies — the Absolute rank is the distinguishing fact.
const KIND_LABEL: Record<Ability["kind"], string> = {
  prime: "Prime skill",
  preawk: "Absolute skill",
  rabam: "Rabam",
  passive: "Passive",
};

/** Mono-labelled fact pair for the expanded panel. */
function Fact({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <span>
      <span className="k">{k}</span>
      {children}
    </span>
  );
}

/**
 * Ledger row: icon · name · inputs · graded protection meter · badges ·
 * DPS bar · DPS number · chevron. Click expands the detail panel with the
 * per-mode protection facts and the verbatim DPS-sheet rows (ADR 0001/0002).
 */
export default function AbilityRow({ a, mode }: { a: Ability; mode: Mode }) {
  const location = useLocation();
  const targeted = location.hash === `#${a.id}`;
  const [open, setOpen] = useState(targeted);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targeted) {
      setOpen(true);
      ref.current?.scrollIntoView({ block: "start" });
    }
  }, [targeted]);

  const rows = dpsRowsByAbility.get(a.id) ?? [];
  const best = fmt(bestDps(a.id, mode));
  const barPct = dpsBarPct(a.id, mode);
  const prot = a.protection[mode];
  const cancel = cancelInfo(a.id);
  const cc = ccBadges(a, mode);
  const tier = priorityTierByAbility.get(a.id);
  const unknownRabam = loadouts[mode].unknownRabamIds.has(a.id);
  const protLine = [
    a.protection.tooltip_lines.length > 0 ? `Tooltip: “${a.protection.tooltip_lines.join("; ")}”` : null,
    a.protection.notes,
  ].filter(Boolean);

  return (
    <div id={a.id} ref={ref}>
      <button className="cols lrow" onClick={() => setOpen(!open)} aria-expanded={open}>
        <AbilityIcon id={a.id} size="row" />
        <span className="nm">{a.short_name}</span>
        <span className="inp">
          {a.inputs.map((inp) => (
            <Kbd key={inp}>{inp}</Kbd>
          ))}
        </span>
        {prot ? <ProtMeter prot={prot} title={a.protection.tooltip_lines.join("; ")} /> : <span />}
        <span className="bdgs">
          <AbilityBadges id={a.id} mode={mode} showTier />
          {unknownRabam && (
            <span
              className="badge unknown"
              title="AOS rabam pick for this level is unknown — sources only settle level 56"
            >
              Unknown
            </span>
          )}
        </span>
        <span className="barcell">
          {barPct != null && (
            <span className="bar">
              <i style={{ width: `${barPct}%`, background: PROT_COLOR[prot ?? "none"] }} />
            </span>
          )}
        </span>
        <span className="dpsv">{best}</span>
        <span className="chev">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="lexp">
          <div className="facts">
            <Fact k="Protection · PvE">
              {a.protection.pve ? <ProtMeter prot={a.protection.pve} /> : "—"}
            </Fact>
            <Fact k="Protection · PvP">
              {a.protection.pvp ? <ProtMeter prot={a.protection.pvp} /> : "—"}
            </Fact>
            <Fact k="CC">{cc.length ? cc.map((b) => b.label).join(" / ") : "—"}</Fact>
            <Fact k="Priority tier">{tier ? TIER_LABEL[tier] : "—"}</Fact>
            <Fact k="DPS (sheet)">
              <span className="mono">{best ?? "—"}</span>
            </Fact>
            <Fact k="Official">{a.name}</Fact>
            <Fact k="Kind">
              {KIND_LABEL[a.kind]}
              {a.rabam && ` · level ${a.rabam.level}`}
            </Fact>
            {a.tooltip?.cooldown && <Fact k="Cooldown">{a.tooltip.cooldown}</Fact>}
            {a.tooltip?.mp_cost && <Fact k="MP">{a.tooltip.mp_cost}</Fact>}
            {a.tooltip?.required_level && <Fact k="Level">{a.tooltip.required_level}</Fact>}
            {hasPveAddons(a.id) && <Fact k="Addons">PvE addons — see Setup</Fact>}
          </div>

          <p className="note desc">{a.description.text}</p>
          {protLine.length > 0 && <p className="note">{protLine.join(" — ")}</p>}

          {rows.length > 0 && (
            <>
              <h4 className="micro">DPS rows — locked sheet data</h4>
              <DpsTable rows={rows} mode={mode} />
            </>
          )}

          {(cancel.notable || cancel.slowCast || cancel.inputTrap || (mode === "pvp" && cancel.pvp)) && (
            <>
              <h4 className="micro">Cancels</h4>
              <ul className="notes">
                {cancel.notable?.faster_after && (
                  <li>
                    Faster (cancelled) after{" "}
                    {cancel.notable.faster_after.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ", "}
                        <AbilityLink id={id} />
                      </span>
                    ))}
                    {cancel.notable.note && <span className="dim"> — {cancel.notable.note}</span>}
                  </li>
                )}
                {cancel.notable?.faster_into && (
                  <li>
                    Faster (cancelled) into{" "}
                    {cancel.notable.faster_into.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ", "}
                        <AbilityLink id={id} />
                      </span>
                    ))}
                    {cancel.notable.note && <span className="dim"> — {cancel.notable.note}</span>}
                  </li>
                )}
                {cancel.notable &&
                  !cancel.notable.faster_after &&
                  !cancel.notable.faster_into &&
                  cancel.notable.note && <li>{cancel.notable.note}</li>}
                {cancel.slowCast && <li>{cancel.slowCast}</li>}
                {cancel.inputTrap && <li>Input trap: {cancel.inputTrap}</li>}
                {mode === "pvp" && cancel.pvp?.cancelled_into_from && (
                  <li>
                    PvP: cancelled into from{" "}
                    {cancel.pvp.cancelled_into_from.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ", "}
                        <AbilityLink id={id} />
                      </span>
                    ))}
                    {cancel.pvp.note && <span className="dim"> — {cancel.pvp.note}</span>}
                  </li>
                )}
                {mode === "pvp" && cancel.pvp?.cancelled_out_into && (
                  <li>
                    PvP: cancel out into{" "}
                    {cancel.pvp.cancelled_out_into.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ", "}
                        <AbilityLink id={id} />
                      </span>
                    ))}
                    {cancel.pvp.note && <span className="dim"> — {cancel.pvp.note}</span>}
                  </li>
                )}
              </ul>
            </>
          )}

          {a.notes.length > 0 && (
            <>
              <h4 className="micro">Notes</h4>
              <ul className="notes">
                {a.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </>
          )}

          {a.tooltip && a.tooltip.effects.length > 0 && (
            <details className="sub">
              <summary>Full tooltip effects ({a.tooltip.effects.length})</summary>
              <ul className="notes">
                {a.tooltip.effects.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </details>
          )}

          {cancel.sheetBlock && (
            <details className="sub">
              <summary>Cancels-sheet entries ({cancel.sheetBlock.entries.length})</summary>
              <ul className="notes">
                {cancel.sheetBlock.entries.map((e, i) => (
                  <li key={i}>
                    {e.before_input && (
                      <>
                        from <Kbd>{e.before_input}</Kbd>{" "}
                      </>
                    )}
                    {e.after_input && (
                      <>
                        into <Kbd>{e.after_input}</Kbd>{" "}
                      </>
                    )}
                    <span className="dim" style={{ whiteSpace: "pre-line" }}>
                      {e.description}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="prov">
            Description &amp; protection: {a.description.source}, pulled {a.description.pulled} —{" "}
            <a href={a.description.source_url} target="_blank" rel="noreferrer">
              {a.description.source_url}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
