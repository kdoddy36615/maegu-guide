import type { Combo } from "../data/types";
import { IDEAL_COMBOS, cancels, combos, combosFile, dps } from "../data";
import ComboSteps from "../components/ComboSteps";
import PriorityPanel from "../components/PriorityPanel";
import { AbilityLink } from "../components/badges";

/** PvP combo families (CONTEXT.md: opener + situation). Order matters: Flower Shroud first = the ideal family. */
const FAMILIES: { prefix: string; name: string; situation: string }[] = [
  { prefix: "pvp-flower-shroud", name: "Flower Shroud", situation: "isolated burst" },
  { prefix: "pvp-bristling", name: "Bristling", situation: "stay-in-SA" },
  { prefix: "pvp-hanpuri", name: "Hanpuri", situation: "backpedal CC" },
  { prefix: "pvp-stiff-foxflare", name: "Stiff/Foxflare", situation: "off a stiff or clone bait" },
];

function ComboCard({ combo }: { combo: Combo }) {
  const drilled = IDEAL_COMBOS[combo.mode].includes(combo.id);
  const theIdeal = combo.id === "pvp-flower-shroud-1" || combo.id === "pve-infinite";
  return (
    <div className="combo-card" id={combo.id}>
      <h3 style={{ margin: "0 0 2px" }}>
        {combo.name}{" "}
        {theIdeal && <span className="badge tier-top" title="The ideal combo for this mode">Ideal</span>}{" "}
        {drilled && !theIdeal && (
          <span className="badge tier-core" title="Drilled in the practice tool">Drilled</span>
        )}
      </h3>
      <p className="small dim" style={{ margin: 0 }}>
        {combo.stage && <>Stage: {combo.stage}. </>}
        {combo.credit && <>Credit: {combo.credit}. </>}
        {combo.sources.join(", ")}
      </p>
      <ComboSteps steps={combo.steps} mode={combo.mode} />
      {combo.notes && combo.notes.length > 0 && (
        <ul className="notes small">
          {combo.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CombosPage() {
  const pveCombos = combos.filter((c) => c.mode === "pve");
  const fmt = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const rules = cancels.general_rules;

  return (
    <div>
      <h1>Combos</h1>
      <p className="page-sub">
        All {combos.length} combos from the locked sources — PvE first, then the AOS (Bantalope)
        combos by family. Dashed steps are optional.
      </p>

      <h2>PvE</h2>
      <p className="section-desc">{combosFile._meta.pve_truth} — locked truth.</p>
      {pveCombos.map((c) => (
        <ComboCard key={c.id} combo={c} />
      ))}

      <div className="callout">
        <b>Sheet combo summaries</b> (locked DPS data, same stat assumptions as the ability rows):{" "}
        {dps.combo_summaries.map((s, i) => (
          <span key={s.name}>
            {i > 0 && " · "}
            {s.name}: {fmt(s.pve_dps_non_bsr)} DPS ({fmt(s.pve_dps_bsr)} in BSR)
          </span>
        ))}
      </div>

      <h2>AOS (PvP)</h2>
      <div className="callout warn">
        <b>Staleness disclaimer:</b> {combosFile._meta.pvp_caveat}
      </div>
      {FAMILIES.map((fam) => (
        <div key={fam.prefix}>
          <h3>
            {fam.name} family <span className="dim small">— {fam.situation}</span>
          </h3>
          {combos
            .filter((c) => c.id.startsWith(fam.prefix))
            .map((c) => (
              <ComboCard key={c.id} combo={c} />
            ))}
        </div>
      ))}

      <h2>Cancel fundamentals</h2>
      <p className="section-desc">
        General rules from the cancels sheet — per-ability cancels live on each ability card in the
        study guide.
      </p>
      <div className="setup-grid">
        <div className="setup-card">
          <b>Instant flows from everything</b>
          <p className="small">
            {rules.instant_flows_from_everything.map((id, i) => (
              <span key={id}>
                {i > 0 && ", "}
                <AbilityLink id={id} />
              </span>
            ))}
          </p>
        </div>
        <div className="setup-card">
          <b>Fast recovery cancellers</b>
          <p className="small">
            {rules.fast_recovery_cancellers.map((id, i) => (
              <span key={id}>
                {i > 0 && ", "}
                <AbilityLink id={id} />
              </span>
            ))}
          </p>
        </div>
        <div className="setup-card">
          <b>Spirit Step vs Chain: Spirit Step</b>
          <p className="small">{rules.spirit_step_vs_chain}</p>
        </div>
        <div className="setup-card">
          <b>Clone swap</b>
          <p className="small">{rules.clone_mechanic}</p>
        </div>
      </div>
      <p className="small dim">
        {cancels._meta.color_caveat} Full sheet:{" "}
        <a href={cancels._meta.sheet_url} target="_blank" rel="noreferrer">
          cancels reference sheet
        </a>
        .
      </p>

      <h2>DPS Priority List — video freestyle variant</h2>
      <p className="section-desc">
        The Discord list (the canonical one) lives on the Study → PvE page; this is the guide video's
        freestyle variant for comparison.
      </p>
      <PriorityPanel list={combosFile.priority_lists.pve_video_freestyle} mode="pve" />
    </div>
  );
}
