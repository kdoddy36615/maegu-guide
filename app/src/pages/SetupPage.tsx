import type { Mode } from "../data/types";
import { ability, setup } from "../data";
import { AbilityLink } from "../components/badges";
import AbilityIcon from "../components/AbilityIcon";
import SourceImage from "../components/SourceImage";
import { Callout, PageHeader, Section, Staleness } from "../components/Section";

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

/**
 * Setup is loudly per-mode — it's where PvE/PvP differ most (locked skills,
 * rabams, addons). PvE keeps the full grinding reference (reforge, buffs, BSR,
 * earlygame, UI scheme); PvP carries only the AOS-relevant sections.
 */
export default function SetupPage({ mode }: { mode: Mode }) {
  const s = setup;
  const pve = mode === "pve";

  return (
    <div>
      <PageHeader title="Setup" mode={mode}>
        {pve ? (
          <>
            The Grinding loadout: which skills to lock, rabam picks, addons, reforge stones — from
            the locked PvE sources.
          </>
        ) : (
          <>
            The AOS loadout: Magnus learned, Spirit Parade at rabam 56 — re-spec when switching
            from grinding.
          </>
        )}
      </PageHeader>

      {!pve && <Staleness />}

      <Section id="sec-skills" title="Skill choices" count="§1" desc={s.skill_choices.general}>
        <div className="cards">
          <div className="card">
            <h3>Locked skills</h3>
            <ul>
              {s.skill_choices.locked.map((l, i) => (
                <li key={i}>
                  {l.ability ? <AbilityLink id={l.ability} /> : <b>{l.name}</b>}
                  <span className="why">{l.reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>{pve ? "Do not learn" : "Magnus — learned"}</h3>
            <ul>
              {s.skill_choices.do_not_learn.map((l) => (
                <li key={l.ability}>
                  <AbilityLink id={l.ability} mode="pvp" />
                  <span className="why">{l.reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Quickslot-only</h3>
            <ul>
              {s.skill_choices.quickslot.map((l) => (
                <li key={l.ability}>
                  <AbilityLink id={l.ability} />
                  <span className="why">{l.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="sec-rabams"
        title="Rabams"
        count="§2"
        desc="Level 56 / 57 / 58 — pick one of two. Picks are per loadout."
      >
        <div className="rabams">
          {s.rabams.choices.map((c) => {
            const pick = pve ? c.pve_pick : c.aos_pick;
            return (
              <div className="rabam" key={c.level}>
                <span className="lv">LV {c.level}</span>
                {pick ? (
                  <span className="pick">
                    <AbilityIcon id={pick} size="row" />
                    {ability(pick).short_name}
                  </span>
                ) : (
                  <span className="pick">
                    <span className="badge unknown" title={c.aos_pick_note}>
                      Unknown
                    </span>
                  </span>
                )}
                <span className="rnote">
                  {pick ? (
                    c.rationale
                  ) : (
                    <>
                      {c.aos_pick_note} Alternative: <AbilityLink id={c.alternative} mode="pvp" />.
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="note">{s.rabams.tree}</p>
        <SourceImage path={s.rabams.image} alt="Rabam choices, levels 56–58" />
      </Section>

      <Section
        id="sec-addons"
        title="Addons"
        count="§3"
        desc={pve ? "General purpose (PvE)." : "AOS — Evasion vs DR builds."}
      >
        {pve ? (
          <>
            <p className="note">
              Skills with addons: <IdList ids={s.addons.pve_general.skills_with_addons} />
            </p>
            <Callout tag="READ IMAGE" warn>
              {s.addons.pve_general.image_caveat}
            </Callout>
            <SourceImage path={s.addons.pve_general.image} alt="PvE general-purpose addons" />
            <ul className="notes">
              {s.addons.pve_general.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <Callout tag="READ IMAGE" warn>
              {s.addons.aos.caveat}
            </Callout>
            <SourceImage path={s.addons.aos.image} alt="AOS addons — Evasion vs DR builds" />
            <ul className="notes">
              {s.addons.aos.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {pve && (
        <>
          <Section id="sec-reforge" title="Reforge stones" count="§4">
            <p className="note">
              Typical picks: <b>{s.reforge_stones.typical.join(" · ")}</b>
            </p>
            <ul className="notes">
              {s.reforge_stones.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Section>

          <Section id="sec-buffs" title="Buffs & debuffs" count="§5">
            <div className="cards">
              {s.buffs_debuffs.buffs.map((b, i) => (
                <div className="card" key={`b${i}`}>
                  <h3>{b.effect}</h3>
                  <ul>
                    <li>
                      <IdList ids={b.abilities} />
                      <span className="why">{b.note}</span>
                    </li>
                  </ul>
                </div>
              ))}
              {s.buffs_debuffs.debuffs.map((b, i) => (
                <div className="card" key={`d${i}`}>
                  <h3>{b.effect}</h3>
                  <ul>
                    <li>
                      <IdList ids={b.abilities} />
                      <span className="why">{b.note}</span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
            <SourceImage path={s.buffs_debuffs.image} alt="Buffs and debuffs overview" />
          </Section>

          <Section id="sec-bsr" title="Black Spirit's Rage (BSR)" count="§6">
            <ul className="notes">
              {s.bsr.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </Section>

          <Section id="sec-earlygame" title="Earlygame (one-shot spots)" count="§7" desc={s.earlygame.summary}>
            <div className="cards">
              <div className="card">
                <h3>Ranged</h3>
                <p>
                  <IdList ids={s.earlygame.ranged} />
                </p>
              </div>
              <div className="card">
                <h3>Big frontal AoE</h3>
                <p>
                  <IdList ids={s.earlygame.big_frontal_aoe} />
                </p>
              </div>
              <div className="card">
                <h3>Close AoE</h3>
                <p>
                  <IdList ids={s.earlygame.close_aoe} />
                </p>
              </div>
              <div className="card">
                <h3>Between packs</h3>
                <p>
                  <IdList ids={s.earlygame.between_packs} />{" "}
                  <span className="dim">
                    (advanced: <IdList ids={s.earlygame.advanced_between_packs} />)
                  </span>
                </p>
              </div>
            </div>
          </Section>

          <Section id="sec-ui" title="In-game UI reference" count="§8">
            <p className="note">{s.ui_reference.scheme}</p>
            {s.ui_reference.images.map((img) => (
              <SourceImage key={img} path={img} alt="In-game UI reference" />
            ))}
          </Section>
        </>
      )}
    </div>
  );
}
