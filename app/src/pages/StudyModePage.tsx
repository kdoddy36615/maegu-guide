import type { Mode } from "../data/types";
import { combosFile, dps, sectionsFor } from "../data";
import AbilityCard from "../components/AbilityCard";
import PriorityPanel from "../components/PriorityPanel";

const MODE_TITLE: Record<Mode, string> = { pve: "Study guide — PvE", pvp: "Study guide — AOS" };

export default function StudyModePage({ mode }: { mode: Mode }) {
  const sections = sectionsFor(mode, { includeLocked: true });
  const assume = dps._meta.stat_assumptions;

  return (
    <div>
      <h1>{MODE_TITLE[mode]}</h1>
      {mode === "pve" ? (
        <p className="page-sub">
          The Grinding loadout: Magnus unlearned (keeps Soulflame on E), Heavenly Return at rabam 56.
          DPS values are locked sheet data ({assume.crit_damage_pct}% crit dmg, {assume.attack_speed_pct}%
          attack speed / {assume.attack_speed_bsr_pct}% in BSR, {assume.crit_rate_pct}% crit rate) —
          relative priority, not absolute output.
        </p>
      ) : (
        <p className="page-sub">
          The AOS loadout: Foxflare Fling (Magnus) learned, Spirit Parade at rabam 56. PvP always means
          AOS (capped 3v3) here.
        </p>
      )}

      {mode === "pvp" && (
        <div className="callout warn">
          <b>Staleness disclaimer:</b> {combosFile._meta.pvp_caveat}
        </div>
      )}

      {mode === "pve" && (
        <>
          <h2>DPS Priority List</h2>
          <p className="section-desc">
            The Discord tier list that governs freestyle PvE play — tier badges below come from it.
          </p>
          <PriorityPanel list={combosFile.priority_lists.pve_discord} mode={mode} />
        </>
      )}

      <div className="section-block">
        <h2>Movement & utility</h2>
        <p className="section-desc">
          Non-DPS abilities — movement, buffs, the clone swap. Mirrors the top hotbar rows in the
          in-game scheme.
        </p>
        {sections.movement.map((a) => (
          <AbilityCard key={a.id} a={a} mode={mode} />
        ))}
      </div>

      <div className="section-block">
        <h2>Protected DPS</h2>
        <p className="section-desc">
          DPS-ordered. Full protection (i-frame / Super Armor) and Frontal Guard — FG abilities carry
          their badge, never silently merged.
        </p>
        {sections.protected.map((a) => (
          <AbilityCard key={a.id} a={a} mode={mode} />
        ))}
      </div>

      <div className="section-block">
        <h2>Unprotected DPS</h2>
        <p className="section-desc">DPS-ordered. No i-frame, no SA, no FG during the animation.</p>
        {sections.unprotected.map((a) => (
          <AbilityCard key={a.id} a={a} mode={mode} />
        ))}
      </div>
    </div>
  );
}
