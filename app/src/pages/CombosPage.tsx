import type { Combo, Mode } from "../data/types";
import { COMBO_FAMILIES, IDEAL_COMBOS, cancels, combos, combosFile, dps } from "../data";
import ComboSteps from "../components/ComboSteps";
import PriorityPanel from "../components/PriorityPanel";
import { AbilityLink } from "../components/badges";
import { Callout, PageHeader, Section, Staleness } from "../components/Section";

function ComboCard({ combo }: { combo: Combo }) {
  const drilled = IDEAL_COMBOS[combo.mode].includes(combo.id);
  const theIdeal = combo.id === "pvp-flower-shroud-1" || combo.id === "pve-infinite";
  return (
    <div className="combo-card" id={combo.id}>
      <h3>
        {combo.name}{" "}
        {theIdeal && (
          <span className="badge tier-top" title="The ideal combo for this mode">
            Ideal
          </span>
        )}{" "}
        {drilled && !theIdeal && (
          <span className="badge tier-core" title="Drilled in the practice tool">
            Drilled
          </span>
        )}
      </h3>
      <p className="combo-meta">
        {combo.stage && <>Stage: {combo.stage}. </>}
        {combo.credit && <>Credit: {combo.credit}. </>}
        {combo.sources.join(", ")}
      </p>
      <ComboSteps steps={combo.steps} mode={combo.mode} />
      {combo.notes && combo.notes.length > 0 && (
        <ul className="notes">
          {combo.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CombosPage({ mode }: { mode: Mode }) {
  const modeCombos = combos.filter((c) => c.mode === mode);
  const fmt = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const rules = cancels.general_rules;

  return (
    <div>
      <PageHeader title="Combos" mode={mode}>
        {mode === "pve" ? (
          <>All {modeCombos.length} PvE combos from the locked sources. Dashed steps are optional.</>
        ) : (
          <>The AOS (Bantalope) combos by family. Dashed steps are optional.</>
        )}
      </PageHeader>

      {mode === "pvp" && <Staleness />}

      {mode === "pve" ? (
        <Section
          id="sec-combos"
          title="PvE combos"
          count={modeCombos.length}
          desc={`${combosFile._meta.pve_truth} — locked truth.`}
        >
          {modeCombos.map((c) => (
            <ComboCard key={c.id} combo={c} />
          ))}
          <Callout tag="SHEET">
            Combo summaries (locked DPS data, same stat assumptions as the ability rows):{" "}
            {dps.combo_summaries.map((sum, i) => (
              <span key={sum.name}>
                {i > 0 && " · "}
                {sum.name}: <span className="mono">{fmt(sum.pve_dps_non_bsr)}</span> DPS (
                <span className="mono">{fmt(sum.pve_dps_bsr)}</span> in BSR)
              </span>
            ))}
          </Callout>
        </Section>
      ) : (
        COMBO_FAMILIES.map((fam) => {
          const famCombos = combos.filter((c) => c.id.startsWith(fam.prefix));
          return (
            <Section
              key={fam.prefix}
              id={`fam-${fam.prefix}`}
              title={`${fam.name} family`}
              count={famCombos.length}
              desc={fam.situation}
            >
              {famCombos.map((c) => (
                <ComboCard key={c.id} combo={c} />
              ))}
            </Section>
          );
        })
      )}

      <Section
        id="sec-cancels"
        title="Cancel fundamentals"
        desc="General rules from the cancels sheet — per-ability cancels live in each ability's expanded row."
      >
        <div className="cards">
          <div className="card">
            <h3>Instant flows from everything</h3>
            <p>
              {rules.instant_flows_from_everything.map((id, i) => (
                <span key={id}>
                  {i > 0 && ", "}
                  <AbilityLink id={id} />
                </span>
              ))}
            </p>
          </div>
          <div className="card">
            <h3>Fast recovery cancellers</h3>
            <p>
              {rules.fast_recovery_cancellers.map((id, i) => (
                <span key={id}>
                  {i > 0 && ", "}
                  <AbilityLink id={id} />
                </span>
              ))}
            </p>
          </div>
          <div className="card">
            <h3>Spirit Step vs Chain: Spirit Step</h3>
            <p>{rules.spirit_step_vs_chain}</p>
          </div>
          <div className="card">
            <h3>Clone swap</h3>
            <p>{rules.clone_mechanic}</p>
          </div>
        </div>
        <p className="note">
          {cancels._meta.color_caveat} Full sheet:{" "}
          <a href={cancels._meta.sheet_url} target="_blank" rel="noreferrer">
            cancels reference sheet
          </a>
          .
        </p>
      </Section>

      {mode === "pve" && (
        <Section
          id="sec-priority-video"
          title="DPS Priority List — video freestyle variant"
          desc="The canonical Discord list lives on the Abilities page; this is the guide video's variant."
        >
          <PriorityPanel list={combosFile.priority_lists.pve_video_freestyle} mode="pve" />
        </Section>
      )}
    </div>
  );
}
