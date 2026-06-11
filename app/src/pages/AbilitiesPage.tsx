import type { Mode } from "../data/types";
import { combosFile, dps, sectionsFor } from "../data";
import AbilityRow from "../components/AbilityRow";
import PriorityPanel from "../components/PriorityPanel";
import { PageHeader, Section, Staleness } from "../components/Section";

/** Column-header row for the first DPS-ordered ledger section. */
function LedgerHead() {
  return (
    <div className="cols thead">
      <span />
      <span>Ability</span>
      <span>Inputs</span>
      <span>Protection</span>
      <span>Badges</span>
      <span className="r">DPS scale</span>
      <span className="r">DPS</span>
      <span />
    </div>
  );
}

export default function AbilitiesPage({ mode }: { mode: Mode }) {
  const sections = sectionsFor(mode, { includeLocked: true });
  const assume = dps._meta.stat_assumptions;

  return (
    <div>
      <PageHeader title="Abilities" mode={mode}>
        {mode === "pve" ? (
          <>
            The Grinding loadout: Magnus unlearned (keeps Soulflame on E), Heavenly Return at rabam
            56. DPS values are locked sheet data ({assume.crit_damage_pct}% crit dmg,{" "}
            {assume.attack_speed_pct}% attack speed / {assume.attack_speed_bsr_pct}% in BSR,{" "}
            {assume.crit_rate_pct}% crit rate) — relative priority, not absolute output.
          </>
        ) : (
          <>
            The AOS loadout: Foxflare Fling (Magnus) learned, Spirit Parade at rabam 56. PvP always
            means AOS (capped 3v3) here.
          </>
        )}
      </PageHeader>

      {mode === "pvp" && <Staleness />}

      {mode === "pve" && (
        <Section
          id="sec-priority"
          title="DPS Priority List"
          count="§1"
          desc="The Discord tier list that governs freestyle PvE play."
        >
          <PriorityPanel list={combosFile.priority_lists.pve_discord} mode={mode} />
        </Section>
      )}

      <Section
        id="sec-movement"
        title="Movement & utility"
        count={sections.movement.length}
        desc="Non-DPS abilities — movement, buffs, the clone swap. Mirrors the top hotbar rows."
      >
        <div>
          {sections.movement.map((a) => (
            <AbilityRow key={a.id} a={a} mode={mode} />
          ))}
        </div>
      </Section>

      <Section
        id="sec-protected"
        title="Protected DPS"
        count={sections.protected.length}
        desc="DPS-ordered. Full protection (i-frame / SA) and FG — FG abilities carry their badge."
      >
        <div>
          <LedgerHead />
          {sections.protected.map((a) => (
            <AbilityRow key={a.id} a={a} mode={mode} />
          ))}
        </div>
      </Section>

      <Section
        id="sec-unprotected"
        title="Unprotected DPS"
        count={sections.unprotected.length}
        desc="No i-frame, no SA, no FG during the animation."
      >
        <div>
          {sections.unprotected.map((a) => (
            <AbilityRow key={a.id} a={a} mode={mode} />
          ))}
        </div>
      </Section>
    </div>
  );
}
