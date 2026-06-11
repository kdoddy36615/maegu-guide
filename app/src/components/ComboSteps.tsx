import { Fragment } from "react";
import type { ComboStep, Mode } from "../data/types";
import { AbilityLink, Kbd } from "./badges";

export default function ComboSteps({ steps, mode }: { steps: ComboStep[]; mode: Mode }) {
  return (
    <div className="combo-steps">
      {steps.map((step, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="step-arrow">→</span>}
          <span className={`combo-step${step.optional ? " optional" : ""}`}>
            <span className="step-abilities">
              {step.ability && <AbilityLink id={step.ability} mode={mode} />}
              {step.choices &&
                step.choices.map((id, j) => (
                  <span key={id}>
                    {j > 0 && <span className="dim"> or </span>}
                    <AbilityLink id={id} mode={mode} />
                  </span>
                ))}
            </span>
            {step.optional && (
              <>
                {" "}
                <span className="badge optional">optional</span>
              </>
            )}
            <span className="step-input">
              <Kbd>{step.input}</Kbd>
            </span>
            {step.annotation && <span className="ann">{step.annotation}</span>}
          </span>
        </Fragment>
      ))}
    </div>
  );
}
