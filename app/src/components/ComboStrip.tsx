import { Fragment } from "react";
import type { Combo, ComboStep } from "../data/types";
import { ability } from "../data";
import AbilityIcon from "./AbilityIcon";

/**
 * In-game-style combo reference: input above icon, skill after skill, "or" stacks
 * for choice steps, OPTIONAL captions — meant to be pulled up next to the game
 * while practicing. Glanceable, never denser (ADR 0003 amendment).
 */

function Choice({ id, input }: { id: string; input?: string }) {
  return (
    <span className="strip-choice">
      {input && <span className="strip-input">{input}</span>}
      <span title={ability(id).short_name}>
        <AbilityIcon id={id} size="xl" />
      </span>
    </span>
  );
}

function Step({ step }: { step: ComboStep }) {
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
            <Choice id={id} input={labels ? labels[j] : j === 0 ? step.input : undefined} />
          </Fragment>
        ))}
        {step.optional && <span className="strip-optional">OPTIONAL</span>}
      </div>
    );
  }
  return (
    <div className="strip-step" title={title}>
      <Choice id={step.ability!} input={step.input} />
      {step.optional && <span className="strip-optional">OPTIONAL</span>}
    </div>
  );
}

export default function ComboStrip({ combo }: { combo: Pick<Combo, "steps" | "notes"> }) {
  return (
    <div>
      <div className="combo-strip">
        {combo.steps.map((step, i) => (
          <Step key={i} step={step} />
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
