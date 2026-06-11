import { useState } from "react";
import type { Ability, Mode } from "../data/types";
import { IDEAL_COMBOS, ccBadges, comboById, combos, loadouts, sectionsFor, setup } from "../data";
import { CcBadges, Kbd, ProtMeter } from "../components/badges";
import AbilityIcon from "../components/AbilityIcon";
import ComboStrip from "../components/ComboStrip";
import { PageHeader, Section, Staleness } from "../components/Section";

function Slot({ a, mode, section }: { a: Ability; mode: Mode; section: string }) {
  const unknownRabam = loadouts[mode].unknownRabamIds.has(a.id);
  const prot = a.protection[mode];
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
        {prot && <ProtMeter prot={prot} title={a.protection.tooltip_lines.join("; ")} />}
        <CcBadges badges={ccBadges(a, mode)} />
        {unknownRabam && <span className="badge unknown">Unknown</span>}
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
      <PageHeader title="Practice" mode={mode}>
        Pick a combo and keep the strip up next to the game while you practice — input above, skill
        icon below, skill after skill. It never captures key input; the keys happen in-game.
      </PageHeader>

      {mode === "pvp" && <Staleness />}

      <Section id="sec-combos" title="Combos" count={modeCombos.length}>
        <div className="drill-select">
          {modeCombos.map((c) => (
            <button
              key={c.id}
              className={c.id === comboId ? "active" : ""}
              onClick={() => setComboId(c.id)}
            >
              {c.name}
              {ideal.includes(c.id) && <span className="ideal mono">IDEAL</span>}
            </button>
          ))}
        </div>
        <ComboStrip combo={combo} />
      </Section>

      <Section id="sec-layout" title="Section layout">
        <p className="note">{setup.ui_reference.scheme}</p>
        <div className="hotbar-section">
          <h4 className="micro">Movement &amp; utility</h4>
          <div className="hotbar-row">
            {sections.movement.map((a) => (
              <Slot key={a.id} a={a} mode={mode} section="movement" />
            ))}
          </div>
        </div>
        <div className="hotbar-section">
          <h4 className="micro">Protected DPS</h4>
          <div className="hotbar-row">
            {sections.protected.map((a) => (
              <Slot key={a.id} a={a} mode={mode} section="protected" />
            ))}
          </div>
        </div>
        <div className="hotbar-section">
          <h4 className="micro">Unprotected DPS</h4>
          <div className="hotbar-row">
            {sections.unprotected.map((a) => (
              <Slot key={a.id} a={a} mode={mode} section="unprotected" />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
