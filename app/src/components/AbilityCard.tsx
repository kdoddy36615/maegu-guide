import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Ability, Mode } from "../data/types";
import {
  PROTECTION_LABEL,
  abilityById,
  bestDps,
  cancelInfo,
  dpsRowsByAbility,
  hasPveAddons,
  loadouts,
} from "../data";
import { AbilityBadges, AbilityLink, Kbd } from "./badges";
import AbilityIcon from "./AbilityIcon";
import DpsTable from "./DpsTable";

const fmt = (v: number | null) =>
  v == null ? null : v.toLocaleString("en-US", { maximumFractionDigits: 0 });

const KIND_LABEL: Record<Ability["kind"], string> = {
  prime: "Prime skill",
  preawk: "Pre-awakening skill",
  rabam: "Rabam",
  passive: "Passive",
};

export default function AbilityCard({ a, mode }: { a: Ability; mode: Mode }) {
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
  const cancel = cancelInfo(a.id);
  const unknownRabam = loadouts[mode].unknownRabamIds.has(a.id);

  return (
    <div className="ability-card" id={a.id} ref={ref}>
      <button className="ability-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <AbilityIcon id={a.id} size="lg" />
        <span className="name">{a.short_name}</span>
        {a.inputs.map((inp) => (
          <Kbd key={inp}>{inp}</Kbd>
        ))}
        <AbilityBadges id={a.id} mode={mode} showTier />
        {unknownRabam && (
          <span className="badge unknown" title="AOS rabam pick for this level is unknown — sources only settle level 56">
            Rabam pick unknown
          </span>
        )}
        <span className="spacer" />
        {best && <span className="dps-val">{best} DPS</span>}
        <span className="dim">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="ability-body">
          <p className="desc">{a.description.text}</p>

          <div className="facts">
            <span>
              Official: <b>{a.name}</b>
            </span>
            <span>
              Kind: <b>{KIND_LABEL[a.kind]}</b>
              {a.rabam && <b> (level {a.rabam.level})</b>}
            </span>
            {a.tooltip?.cooldown && (
              <span>
                Cooldown: <b>{a.tooltip.cooldown}</b>
              </span>
            )}
            {a.tooltip?.mp_cost && (
              <span>
                MP: <b>{a.tooltip.mp_cost}</b>
              </span>
            )}
            {a.tooltip?.required_level && (
              <span>
                Level: <b>{a.tooltip.required_level}</b>
              </span>
            )}
            {hasPveAddons(a.id) && (
              <span>
                Addons: <b>has PvE addons</b> (see Setup)
              </span>
            )}
          </div>

          <h4 className="small dim">Protection</h4>
          <p className="small">
            PvE: <b>{a.protection.pve ? PROTECTION_LABEL[a.protection.pve] : "—"}</b>
            {" · "}
            PvP (AOS): <b>{a.protection.pvp ? PROTECTION_LABEL[a.protection.pvp] : "—"}</b>
            {a.protection.tooltip_lines.length > 0 && (
              <>
                {" — tooltip: "}
                <span className="dim">“{a.protection.tooltip_lines.join("; ")}”</span>
              </>
            )}
          </p>
          {a.protection.notes && <p className="small dim">{a.protection.notes}</p>}

          {rows.length > 0 && (
            <>
              <h4 className="small dim">DPS rows (locked sheet data)</h4>
              <DpsTable rows={rows} mode={mode} />
            </>
          )}

          {(cancel.fasterAfter || cancel.slowCast || cancel.inputTrap || (mode === "pvp" && cancel.pvp)) && (
            <>
              <h4 className="small dim">Cancels</h4>
              <ul className="notes small">
                {cancel.fasterAfter && (
                  <li>
                    Faster (cancelled) after{" "}
                    {cancel.fasterAfter.faster_after.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ", "}
                        <AbilityLink id={id} mode={mode} />
                      </span>
                    ))}
                    {cancel.fasterAfter.note && <span className="dim"> — {cancel.fasterAfter.note}</span>}
                  </li>
                )}
                {cancel.slowCast && <li>{cancel.slowCast}</li>}
                {cancel.inputTrap && <li>Input trap: {cancel.inputTrap}</li>}
                {mode === "pvp" && cancel.pvp && (
                  <li>
                    PvP: cancelled into from{" "}
                    {cancel.pvp.cancelled_into_from.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ", "}
                        <AbilityLink id={id} mode={mode} />
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
              <h4 className="small dim">Notes</h4>
              <ul className="notes small">
                {a.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </>
          )}

          {a.tooltip && a.tooltip.effects.length > 0 && (
            <details className="sub">
              <summary>Full tooltip effects ({a.tooltip.effects.length})</summary>
              <ul className="notes small">
                {a.tooltip.effects.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </details>
          )}

          {cancel.sheetBlock && (
            <details className="sub">
              <summary>Cancels-sheet entries ({cancel.sheetBlock.entries.length})</summary>
              <ul className="notes small">
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

          <p className="provenance">
            Description & protection: {a.description.source}, pulled {a.description.pulled} —{" "}
            <a href={a.description.source_url} target="_blank" rel="noreferrer">
              {a.description.source_url}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export function abilityShortName(id: string): string {
  return abilityById.get(id)?.short_name ?? id;
}
