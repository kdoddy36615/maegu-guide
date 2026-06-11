import { useEffect, useMemo, useState } from "react";
import type { Combo, ComboStep, Mode } from "../data/types";
import { ability, loadouts } from "../data";
import { Kbd } from "./badges";
import AbilityIcon from "./AbilityIcon";

function NameWithIcon({ id }: { id: string }) {
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <AbilityIcon id={id} />
      {ability(id).short_name}
    </span>
  );
}

function NameList({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && <span className="dim"> or </span>}
          <NameWithIcon id={id} />
        </span>
      ))}
    </>
  );
}

/**
 * Flashcard recall drill over a combo's sequence ("what comes next?") — ADR 0003.
 * Deliberately no keyboard/mouse input capture; actual key practice happens in-game.
 */

function acceptedIds(step: ComboStep): string[] {
  return step.ability ? [step.ability] : (step.choices ?? []);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(combo: Combo, stepIndex: number, mode: Mode): string[] {
  const accepted = acceptedIds(combo.steps[stepIndex]);
  const correct = accepted[Math.floor(Math.random() * accepted.length)];
  // Distractors: other abilities from this combo first (harder), then the rest of the loadout.
  const inCombo = combo.steps.flatMap(acceptedIds).filter((id) => !accepted.includes(id));
  const inLoadout = [...loadouts[mode].ids].filter(
    (id) => !accepted.includes(id) && !inCombo.includes(id),
  );
  const distractors = [...shuffle([...new Set(inCombo)]), ...shuffle(inLoadout)].slice(0, 3);
  return shuffle([correct, ...distractors]);
}

// ---- localStorage drill stats ----

interface DrillStats {
  attempts: number;
  bestPct: number;
  lastPct: number;
}

const statsKey = (comboId: string) => `maegu-drill-stats:${comboId}`;

function loadStats(comboId: string): DrillStats | null {
  try {
    const raw = localStorage.getItem(statsKey(comboId));
    return raw ? (JSON.parse(raw) as DrillStats) : null;
  } catch {
    return null;
  }
}

function saveRun(comboId: string, pct: number): DrillStats {
  const prev = loadStats(comboId);
  const next: DrillStats = {
    attempts: (prev?.attempts ?? 0) + 1,
    bestPct: Math.max(prev?.bestPct ?? 0, pct),
    lastPct: pct,
  };
  try {
    localStorage.setItem(statsKey(comboId), JSON.stringify(next));
  } catch {
    /* private mode etc. — stats are a stretch feature, drill works without them */
  }
  return next;
}

// ---- component ----

export default function Drill({ combo, mode }: { combo: Combo; mode: Mode }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [round, setRound] = useState(0); // bump to reshuffle options on restart
  const [stats, setStats] = useState<DrillStats | null>(() => loadStats(combo.id));

  useEffect(() => {
    setStepIndex(0);
    setPicked(null);
    setWrongCount(0);
    setStats(loadStats(combo.id));
  }, [combo.id]);

  const step = combo.steps[stepIndex] as ComboStep | undefined;
  const options = useMemo(
    () => (step ? buildOptions(combo, stepIndex, mode) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [combo.id, stepIndex, round],
  );

  const finished = stepIndex >= combo.steps.length;
  useEffect(() => {
    if (finished && combo.steps.length > 0) {
      const pct = Math.round((100 * combo.steps.length) / (combo.steps.length + wrongCount));
      setStats(saveRun(combo.id, pct));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const accepted = step ? acceptedIds(step) : [];
  const answeredCorrectly = picked != null && accepted.includes(picked);

  function pick(id: string) {
    if (picked != null) return;
    setPicked(id);
    if (!accepted.includes(id)) setWrongCount((w) => w + 1);
  }

  function next() {
    setPicked(null);
    setStepIndex((i) => i + 1);
  }

  function restart() {
    setStepIndex(0);
    setPicked(null);
    setWrongCount(0);
    setRound((r) => r + 1);
  }

  return (
    <div className="drill">
      <div className="drill-progress">
        {finished
          ? `Done — ${combo.steps.length} steps, ${wrongCount} miss${wrongCount === 1 ? "" : "es"}`
          : `Step ${stepIndex + 1} of ${combo.steps.length} · ${wrongCount} miss${wrongCount === 1 ? "" : "es"}`}
      </div>

      <div className="drill-sequence">
        {combo.steps.slice(0, stepIndex).map((s, i) => (
          <span key={i} className={`combo-step${s.optional ? " optional" : ""}`}>
            <span className="step-abilities">
              <NameList ids={acceptedIds(s)} />
            </span>
            <span className="step-input">
              <Kbd>{s.input}</Kbd>
            </span>
          </span>
        ))}
        {!finished && <span className="combo-step dim">? what comes next ?</span>}
      </div>

      {!finished && step && (
        <>
          {step.optional && (
            <p className="small dim" style={{ margin: "4px 0" }}>
              <span className="badge optional">optional</span> The next step is an optional addition.
            </p>
          )}
          <div className="drill-options">
            {options.map((id) => {
              const cls =
                picked == null
                  ? ""
                  : accepted.includes(id)
                    ? " correct"
                    : id === picked
                      ? " wrong"
                      : "";
              return (
                <button
                  key={id}
                  className={`drill-option${cls}`}
                  onClick={() => pick(id)}
                  disabled={picked != null}
                >
                  <NameWithIcon id={id} />
                </button>
              );
            })}
          </div>
          <div className="drill-feedback small">
            {picked != null && (
              <>
                {answeredCorrectly ? (
                  <span style={{ color: "var(--ok)" }}>Correct.</span>
                ) : (
                  <span style={{ color: "var(--none)" }}>
                    Not quite — it's <NameList ids={accepted} />.
                  </span>
                )}{" "}
                Input: <Kbd>{step.input}</Kbd>
                {step.annotation && <span className="dim"> — {step.annotation}</span>}
              </>
            )}
          </div>
          {picked != null && (
            <button className="primary" onClick={next}>
              Next step
            </button>
          )}
        </>
      )}

      {finished && (
        <button className="primary" onClick={restart}>
          Run it again
        </button>
      )}

      {stats && (
        <div className="drill-stats">
          Attempts: {stats.attempts} · best run {stats.bestPct}% · last run {stats.lastPct}%
        </div>
      )}
    </div>
  );
}
