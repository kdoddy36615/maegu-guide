import { Fragment } from "react";
import type { Combo, ComboStep, Mode } from "../data/types";
import { ability, bestDps } from "../data";
import AbilityIcon from "./AbilityIcon";

const fmt = (v: number | null) =>
  v == null ? null : v.toLocaleString("en-US", { maximumFractionDigits: 0 });

/**
 * In-game-style combo reference: input above icon, skill after skill, "or" stacks
 * for choice steps, OPTIONAL captions — meant to be pulled up next to the game
 * while practicing. Glanceable, never denser (ADR 0003 amendment).
 */

function Choice({ id, input, dpsMode }: { id: string; input?: string; dpsMode?: Mode }) {
  const dps = dpsMode ? fmt(bestDps(id, dpsMode)) : null;
  return (
    <span className="strip-choice">
      {input && <span className="strip-input">{input}</span>}
      <span title={ability(id).short_name}>
        <AbilityIcon id={id} size="xl" />
      </span>
      {dps && <span className="strip-dps">{dps}</span>}
    </span>
  );
}

function Step({ step, dpsMode }: { step: ComboStep; dpsMode?: Mode }) {
  const title = step.annotation;
  if (step.choices && step.choices.length > 1) {
    // Pair each choice with its part of the input ("W/S+E or A/D+LMB" → per-icon labels).
    const parts = step.input.split(" or ");
    const labels = parts.length === step.choices.length ? parts : null;
    return (
      <div className="strip-step" title={title}>
        {step.choices.map((id, j) => (
          <Fragment key={id}>
            {j > 0 && <span className="strip-or">OR</span>}
            <Choice
              id={id}
              input={labels ? labels[j] : j === 0 ? step.input : undefined}
              dpsMode={dpsMode}
            />
          </Fragment>
        ))}
        {step.optional && <span className="strip-optional">OPTIONAL</span>}
      </div>
    );
  }
  return (
    <div className="strip-step" title={title}>
      <Choice id={step.ability!} input={step.input} dpsMode={dpsMode} />
      {step.optional && <span className="strip-optional">OPTIONAL</span>}
    </div>
  );
}

export default function ComboStrip({
  combo,
  dpsMode,
}: {
  combo: Pick<Combo, "steps" | "notes">;
  /** Show each skill's sheet DPS for this mode under its icon. */
  dpsMode?: Mode;
}) {
  return (
    <div>
      <div className="combo-strip">
        {combo.steps.map((step, i) => (
          <Step key={i} step={step} dpsMode={dpsMode} />
        ))}
      </div>
      {combo.notes && combo.notes.length > 0 && (
        <ul className="notes strip-notes">
          {combo.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
