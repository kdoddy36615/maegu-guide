import { Fragment } from "react";
import { Navigate } from "react-router-dom";
import type { Ability, Mode } from "../data/types";
import { ability, bestDps, ccBadges, observations, setup } from "../data";
import { AbilityLink, CcBadges, Kbd, ProtMeter } from "../components/badges";
import AbilityIcon from "../components/AbilityIcon";
import ComboStrip from "../components/ComboStrip";
import SourceImage from "../components/SourceImage";
import { Callout, PageHeader, Section } from "../components/Section";

const fmt = (v: number | null) =>
  v == null ? null : v.toLocaleString("en-US", { maximumFractionDigits: 0 });

/** Kit slot: the ability's PvP facts at a glance — protection, CC, inputs, sheet DPS. */
function KitSlot({ a }: { a: Ability }) {
  const prot = a.protection.pvp;
  const dps = fmt(bestDps(a.id, "pvp"));
  return (
    <div className="hotbar-slot sec-observed">
      <span className="slot-name">
        <AbilityIcon id={a.id} />
        {a.short_name}
      </span>
      {a.inputs.map((inp) => (
        <Kbd key={inp}>{inp}</Kbd>
      ))}
      <span className="slot-badges">
        {prot && <ProtMeter prot={prot} title={a.protection.tooltip_lines.join("; ")} />}
        <CcBadges badges={ccBadges(a, "pvp")} />
        {dps && <span className="mono dim">{dps} DPS</span>}
      </span>
    </div>
  );
}

/**
 * The observed kit arranged as a suggested in-game hotbar: the data's usage-derived
 * groups (movement / frequent pool / burst punish), DPS-sorted within each group so
 * higher-priority skills sit left — mirroring the in-game hotbar scheme.
 */
function KitGroups({ groups }: { groups: { label: string; why: string; abilities: string[] }[] }) {
  const byDps = (x: Ability, y: Ability) =>
    (bestDps(y.id, "pvp") ?? -1) - (bestDps(x.id, "pvp") ?? -1);
  return (
    <>
      {groups.map((g) => (
        <div key={g.label} className="hotbar-section">
          <h4 className="micro">{g.label}</h4>
          <p className="note">{g.why}</p>
          <div className="hotbar-row">
            {g.abilities
              .map(ability)
              .sort(byDps)
              .map((a) => (
                <KitSlot key={a.id} a={a} />
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * PvP-only: what the rank 1 AOS Succession Maegu actually plays. Reading order:
 * the conclusions first (analysis → setup → suggested UI), the raw log as the
 * reference behind them, and the drillable chains at the bottom.
 */
export default function Rank1Page({ mode }: { mode: Mode }) {
  if (mode === "pve") return <Navigate to="/pvp/rank1" replace />;
  const obs = observations.filter((o) => o.mode === "pvp");
  const aosRabams = setup.rabams.choices.filter((c) => c.aos_pick);

  return (
    <div>
      <PageHeader title="Rank 1" mode={mode}>
        What the rank 1 AOS Succession Maegu was actually seen playing — the pattern, the setup
        worth copying, and the chains worth drilling. Everything traces to the observed session.
      </PageHeader>

      {obs.map((o) => (
        <Fragment key={o.id}>
          <Callout tag="OBSERVED" warn>
            {o.caveat}
          </Callout>

          <Section
            id={`${o.id}-summary`}
            title="The order in the chaos"
            count="§1"
            desc="The session read against the Discord playstyle guidance and the protection data."
          >
            <ul className="notes">
              {o.analysis.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Section>

          <Section
            id={`${o.id}-setup`}
            title="Setup takeaways"
            count="§2"
            desc="Already applied to the AOS loadout — the Setup page carries the same picks."
          >
            <div className="rabams">
              {aosRabams.map((c) => (
                <div className="rabam" key={c.level}>
                  <span className="lv">LV {c.level}</span>
                  <span className="pick">
                    <AbilityIcon id={c.aos_pick!} size="row" />
                    {ability(c.aos_pick!).short_name}
                  </span>
                  <span className="rnote">{c.aos_pick_note}</span>
                </div>
              ))}
            </div>
            <ul className="notes">
              {setup.skill_choices.aos_unlock.map((u) => (
                <li key={u.ability}>
                  Unlocked for AOS: <AbilityLink id={u.ability} mode="pvp" /> — {u.reason}
                </li>
              ))}
            </ul>
            {o.observed_addons && (
              <div className="hotbar-section">
                <h4 className="micro">Addons (screenshot transcription)</h4>
                {o.addons_label && <p className="note">{o.addons_label}</p>}
                <div className="hotbar-row">
                  {o.observed_addons.map((row) => (
                    <div key={row.ability} className="hotbar-slot sec-observed">
                      <span className="slot-name">
                        <AbilityIcon id={row.ability} />
                        {ability(row.ability).short_name}
                      </span>
                      {row.effects.map((e) => (
                        <div key={e} className="note">
                          {e}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {setup.rabams.aos_image && (
              <SourceImage
                path={setup.rabams.aos_image}
                alt="The rank 1 player's skill enhancement tree (observed)"
              />
            )}
          </Section>

          <Section
            id={`${o.id}-kit`}
            title="Suggested in-game UI"
            count={o.abilities.length}
            desc="The observed kit grouped by how he used it — set your hotbar rows to these groups, higher DPS left."
          >
            {o.ui_groups ? <KitGroups groups={o.ui_groups} /> : null}
          </Section>

          <Section
            id={`${o.id}-log`}
            title="Observed log"
            count={o.sequences.length}
            desc={`Observed ${o.observed}. Order faithful; some Spirit Steps omitted.`}
          >
            {o.sequences.map((s) => (
              <div key={s.label} className="hotbar-section">
                <h4 className="micro">{s.label}</h4>
                <ComboStrip combo={{ steps: s.steps }} dpsMode="pvp" />
              </div>
            ))}
            <ul className="notes strip-notes">
              {o.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </Section>

          {o.practice_chains && (
            <Section
              id={`${o.id}-chains`}
              title="Chains to practice"
              count={o.practice_chains.length}
              desc="The only sequences that repeated — drill these cells, weave Spirit Step between everything else."
            >
              {o.practice_chains.map((c) => (
                <div key={c.label} className="hotbar-section">
                  <h4 className="micro">{c.label}</h4>
                  <ComboStrip combo={{ steps: c.steps }} dpsMode="pvp" />
                  {c.note && <p className="note">{c.note}</p>}
                </div>
              ))}
            </Section>
          )}
        </Fragment>
      ))}
    </div>
  );
}
