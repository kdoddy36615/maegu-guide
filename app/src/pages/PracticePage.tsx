import { useState } from "react";
import type { Ability, Mode } from "../data/types";
import {
  IDEAL_COMBOS,
  ccBadges,
  comboById,
  combosFile,
  loadouts,
  sectionsFor,
  setup,
} from "../data";
import { CcBadges, Kbd, ProtBadge } from "../components/badges";
import AbilityIcon from "../components/AbilityIcon";
import Drill from "../components/Drill";
import ComboSteps from "../components/ComboSteps";

const MODE_TITLE: Record<Mode, string> = { pve: "Practice — PvE", pvp: "Practice — AOS" };

function Slot({ a, mode, section }: { a: Ability; mode: Mode; section: string }) {
  const unknownRabam = loadouts[mode].unknownRabamIds.has(a.id);
  return (
    <div className={`hotbar-slot sec-${section}`}>
      <span className="slot-name">
        <AbilityIcon id={a.id} />
        {a.short_name}
      </span>
      {a.inputs.map((inp) => (
        <Kbd key={inp}>{inp}</Kbd>
      ))}
      <span className="slot-badges">
        <ProtBadge prot={a.protection[mode]} />
        <CcBadges badges={ccBadges(a, mode)} />
        {unknownRabam && <span className="badge unknown">pick unknown</span>}
      </span>
    </div>
  );
}

export default function PracticePage({ mode }: { mode: Mode }) {
  const sections = sectionsFor(mode);
  const drillIds = IDEAL_COMBOS[mode];
  const [drillId, setDrillId] = useState(drillIds[0]);
  const combo = comboById.get(drillId)!;

  return (
    <div>
      <h1>{MODE_TITLE[mode]}</h1>
      <p className="page-sub">
        Visual reference + recall trainer — it never captures key input; actual key practice happens
        in-game. The layout mirrors the in-game hotbar scheme: movement/utility on top, DPS abilities
        in DPS-priority order below.
      </p>

      {mode === "pvp" && (
        <div className="callout warn">
          <b>Staleness disclaimer:</b> {combosFile._meta.pvp_caveat}
        </div>
      )}

      <h2>Section layout</h2>
      <p className="section-desc">{setup.ui_reference.scheme}</p>

      <div className="hotbar-section">
        <h3>Movement & utility</h3>
        <div className="hotbar-row">
          {sections.movement.map((a) => (
            <Slot key={a.id} a={a} mode={mode} section="movement" />
          ))}
        </div>
      </div>
      <div className="hotbar-section">
        <h3>Protected DPS</h3>
        <div className="hotbar-row">
          {sections.protected.map((a) => (
            <Slot key={a.id} a={a} mode={mode} section="protected" />
          ))}
        </div>
      </div>
      <div className="hotbar-section">
        <h3>Unprotected DPS</h3>
        <div className="hotbar-row">
          {sections.unprotected.map((a) => (
            <Slot key={a.id} a={a} mode={mode} section="unprotected" />
          ))}
        </div>
      </div>

      <h2>Drill</h2>
      {mode === "pve" ? (
        <p className="section-desc">
          The Infinite Combo — the loopable lazy/beginner loop. Optional steps (high attack speed:
          BSR / Shai buffs) are marked.
        </p>
      ) : (
        <p className="section-desc">
          One drill per combo family. Flower Shroud #1 is <i>the</i> ideal if you only learn one.
        </p>
      )}

      {drillIds.length > 1 && (
        <div className="drill-select">
          {drillIds.map((id) => (
            <button
              key={id}
              className={id === drillId ? "active" : ""}
              onClick={() => setDrillId(id)}
            >
              {comboById.get(id)!.name}
            </button>
          ))}
        </div>
      )}

      <Drill combo={combo} mode={mode} />

      <details className="sub">
        <summary>Peek at the full sequence ({combo.name})</summary>
        <ComboSteps steps={combo.steps} mode={mode} />
        {combo.notes && (
          <ul className="notes small">
            {combo.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}
      </details>
    </div>
  );
}
