import type { Combo, ComboStep } from "../data/types";
import { ability } from "../data";
import AbilityIcon from "./AbilityIcon";

/**
 * In-game-style combo reference: input above icon, skill after skill, "or" stacks
 * for choice steps, OPTIONAL captions — meant to be pulled up next to the game
 * while practicing (mirrors the guide author's hotbar strip look).
 */

function StripIcon({ id }: { id: string }) {
  return (
    <span title={ability(id).short_name}>
      <AbilityIcon id={id} size="xl" />
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
        <span className="strip-input">{labels ? labels[0] : step.input}</span>
        <StripIcon id={step.choices[0]} />
        <span className="strip-or">or</span>
        {step.choices.slice(1).map((id, i) => (
          <span key={id} className="strip-choice">
            <StripIcon id={id} />
            {labels && <span className="strip-input">{labels[i + 1]}</span>}
          </span>
        ))}
        {step.optional && <span className="strip-optional">optional</span>}
      </div>
    );
  }
  return (
    <div className="strip-step" title={title}>
      <span className="strip-input">{step.input}</span>
      <StripIcon id={step.ability!} />
      {step.optional && <span className="strip-optional">optional</span>}
    </div>
  );
}

export default function ComboStrip({ combo }: { combo: Combo }) {
  return (
    <div>
      <div className="combo-strip">
        {combo.steps.map((step, i) => (
          <Step key={i} step={step} />
        ))}
      </div>
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
