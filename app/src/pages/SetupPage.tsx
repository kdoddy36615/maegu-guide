import { setup } from "../data";
import { AbilityLink } from "../components/badges";
import SourceImage from "../components/SourceImage";

function IdList({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && ", "}
          <AbilityLink id={id} />
        </span>
      ))}
    </>
  );
}

export default function SetupPage() {
  const s = setup;
  return (
    <div>
      <h1>Setup</h1>
      <p className="page-sub">
        Skill choices, rabams, addons, reforge stones, buffs/debuffs, BSR, and the in-game UI scheme —
        all from the locked PvE sources (AOS addon guidance carries the usual currency caveat).
      </p>

      <h2>Skill choices</h2>
      <p>{s.skill_choices.general}</p>
      <div className="setup-grid">
        <div className="setup-card">
          <b>Locked skills</b>
          <p className="small dim" style={{ margin: "2px 0" }}>
            Deliberately locked in the skill window so they cannot trigger by accident.
          </p>
          <ul className="notes small">
            {s.skill_choices.locked.map((l, i) => (
              <li key={i}>
                {l.ability ? <AbilityLink id={l.ability} /> : <b>{l.name}</b>} — {l.reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="setup-card">
          <b>Do not learn (Grinding loadout)</b>
          <ul className="notes small">
            {s.skill_choices.do_not_learn.map((l) => (
              <li key={l.ability}>
                <AbilityLink id={l.ability} mode="pvp" /> — {l.reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="setup-card">
          <b>Quickslot-only</b>
          <ul className="notes small">
            {s.skill_choices.quickslot.map((l) => (
              <li key={l.ability}>
                <AbilityLink id={l.ability} /> — {l.reason}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2>Rabams (skill enhancements)</h2>
      <p className="small dim">{s.rabams.tree}</p>
      {s.rabams.choices.map((c) => (
        <div className="combo-card" key={c.level}>
          <b>Level {c.level}</b>
          <p className="small" style={{ margin: "4px 0" }}>
            Grinding pick: <AbilityLink id={c.pve_pick} />
            {" · "}
            AOS pick:{" "}
            {c.aos_pick ? (
              <AbilityLink id={c.aos_pick} mode="pvp" />
            ) : (
              <span className="badge unknown" title={c.aos_pick_note}>
                unknown
              </span>
            )}
            {" · "}
            Alternative: <AbilityLink id={c.alternative} />
          </p>
          <p className="small dim" style={{ margin: 0 }}>
            {c.rationale}
          </p>
        </div>
      ))}
      <SourceImage path={s.rabams.image} alt="Rabam choices, levels 56–58" />

      <h2>Addons</h2>
      <h3>PvE (general purpose)</h3>
      <p className="small">
        Skills with addons: <IdList ids={s.addons.pve_general.skills_with_addons} />
      </p>
      <div className="callout warn">
        <b>Read the image for exact values:</b> {s.addons.pve_general.image_caveat}
      </div>
      <SourceImage path={s.addons.pve_general.image} alt="PvE general-purpose addons" />
      <ul className="notes small">
        {s.addons.pve_general.notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      <h3>AOS</h3>
      <div className="callout warn">{s.addons.aos.caveat}</div>
      <SourceImage path={s.addons.aos.image} alt="AOS addons — Evasion vs DR builds" />
      <ul className="notes small">
        {s.addons.aos.notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      <h2>Reforge stones</h2>
      <p className="small">
        Typical picks: <b>{s.reforge_stones.typical.join(" · ")}</b>
      </p>
      <ul className="notes small">
        {s.reforge_stones.rules.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      <h2>Buffs & debuffs</h2>
      {s.buffs_debuffs.buffs.map((b, i) => (
        <div className="combo-card" key={i}>
          <b>{b.effect}</b> — <IdList ids={b.abilities} />
          <p className="small dim" style={{ margin: "4px 0 0" }}>
            {b.note}
          </p>
        </div>
      ))}
      {s.buffs_debuffs.debuffs.map((b, i) => (
        <div className="combo-card" key={i}>
          <b>{b.effect}</b> — <IdList ids={b.abilities} />
          <p className="small dim" style={{ margin: "4px 0 0" }}>
            {b.note}
          </p>
        </div>
      ))}
      <SourceImage path={s.buffs_debuffs.image} alt="Buffs and debuffs overview" />

      <h2>Black Spirit's Rage (BSR)</h2>
      <ul className="notes">
        {s.bsr.notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      <h2>Earlygame (one-shot spots)</h2>
      <p>{s.earlygame.summary}</p>
      <div className="setup-grid">
        <div className="setup-card">
          <b>Ranged</b>
          <p className="small">
            <IdList ids={s.earlygame.ranged} />
          </p>
        </div>
        <div className="setup-card">
          <b>Big frontal AoE</b>
          <p className="small">
            <IdList ids={s.earlygame.big_frontal_aoe} />
          </p>
        </div>
        <div className="setup-card">
          <b>Close AoE</b>
          <p className="small">
            <IdList ids={s.earlygame.close_aoe} />
          </p>
        </div>
        <div className="setup-card">
          <b>Between packs</b>
          <p className="small">
            <IdList ids={s.earlygame.between_packs} />{" "}
            <span className="dim">
              (advanced: <IdList ids={s.earlygame.advanced_between_packs} />)
            </span>
          </p>
        </div>
      </div>

      <h2>In-game UI reference</h2>
      <p>{s.ui_reference.scheme}</p>
      {s.ui_reference.images.map((img) => (
        <SourceImage key={img} path={img} alt="In-game UI reference" />
      ))}
    </div>
  );
}
