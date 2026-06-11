import { useState } from "react";
import type { Ability, Mode } from "../data/types";
import {
  IDEAL_COMBOS,
  ccBadges,
  comboById,
  combos,
  combosFile,
  loadouts,
  sectionsFor,
  setup,
} from "../data";
import { CcBadges, Kbd, ProtBadge } from "../components/badges";
import AbilityIcon from "../components/AbilityIcon";
import ComboStrip from "../components/ComboStrip";

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
  const modeCombos = combos.filter((c) => c.mode === mode);
  const [comboId, setComboId] = useState(IDEAL_COMBOS[mode][0]);
  const combo = comboById.get(comboId)!;
  const ideal = IDEAL_COMBOS[mode];

  return (
    <div>
      <h1>{MODE_TITLE[mode]}</h1>
      <p className="page-sub">
        Pick a combo and keep the strip up next to the game while you practice — input above, skill
        icon below, skill after skill. It never captures key input; the keys happen in-game.
      </p>

      {mode === "pvp" && (
        <div className="callout warn">
          <b>Staleness disclaimer:</b> {combosFile._meta.pvp_caveat}
        </div>
      )}

      <h2>Combos</h2>
      <div className="drill-select">
        {modeCombos.map((c) => (
          <button
            key={c.id}
            className={c.id === comboId ? "active" : ""}
            onClick={() => setComboId(c.id)}
          >
            {c.name}
            {c.id === ideal[0] && <span className="badge tier-top" style={{ marginLeft: 6 }}>Ideal</span>}
          </button>
        ))}
      </div>
      <ComboStrip combo={combo} />

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
    </div>
  );
}
