import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { usePrefs, useReducedMotion, useT } from "../lib/prefs";
import { rich } from "../lib/rich";
import { ui } from "../lib/ui";
import { BitsView } from "./BitsView";
import { dwellFor, stepDuration } from "./engine";
import { LayersView } from "./LayersView";
import { SequenceView } from "./SequenceView";
import { TerminalView } from "./TerminalView";
import { TopologyView } from "./TopologyView";
import type { Scene } from "./types";

const SPEEDS = [0.5, 1, 1.5, 2];

type Props = {
  scene: Scene;
  /** Render one step, fully settled, with no playback (used for previews and screenshots). */
  still?: number;
  /** Start playing on mount (development previews). */
  autoplay?: boolean;
};

export function Player({ scene, still, autoplay }: Props) {
  const t = useT();
  const { lang } = usePrefs();
  const reduced = useReducedMotion();
  const total = scene.steps.length;

  const [step, setStep] = useState(still ?? 0);
  const [elapsed, setElapsed] = useState(still !== undefined ? Number.MAX_SAFE_INTEGER : 0);
  const [running, setRunning] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [started, setStarted] = useState(still !== undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  const dur = stepDuration(scene, step);
  const current = scene.steps[step];
  const caption = t(current.text);
  const dwell = dwellFor(caption.length);
  const settled = reduced || elapsed >= dur;
  const viewT = reduced ? dur : Math.min(elapsed, dur);

  // Restart from the top if the scene itself changes (navigating between lessons).
  useEffect(() => {
    setStep(still ?? 0);
    setElapsed(still !== undefined ? Number.MAX_SAFE_INTEGER : 0);
    setRunning(false);
    setPlaying(false);
    setStarted(still !== undefined || Boolean(autoplay));
    if (autoplay && still === undefined) {
      setPlaying(true);
      setRunning(true);
    }
  }, [scene, still, autoplay]);

  // The clock.
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setElapsed((e) => e + dt * speed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);

  const goTo = useCallback(
    (i: number, keepPlaying?: boolean) => {
      const next = Math.max(0, Math.min(total - 1, i));
      setStep(next);
      setStarted(true);
      setElapsed(reduced ? stepDuration(scene, next) : 0);
      setRunning(!reduced || Boolean(keepPlaying));
      if (!keepPlaying) setPlaying(false);
    },
    [total, reduced, scene],
  );

  // Phase transitions: stop at the end of a step, or move on after the reading pause while playing.
  useEffect(() => {
    if (!running || elapsed < dur) return;
    if (!playing) {
      setRunning(false);
      return;
    }
    if (elapsed >= dur + dwell) {
      if (step < total - 1) goTo(step + 1, true);
      else {
        setPlaying(false);
        setRunning(false);
      }
    }
  }, [elapsed, dur, dwell, running, playing, step, total, goTo]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      setRunning(false);
      return;
    }
    setStarted(true);
    setPlaying(true);
    if (step === total - 1 && elapsed >= dur) {
      goTo(0, true);
      return;
    }
    setRunning(true);
  };

  const replay = () => goTo(step, playing);

  const onKey = (e: KeyboardEvent) => {
    if (still !== undefined) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(step + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(step - 1);
    } else if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    }
  };

  const view =
    scene.kind === "topology" ? (
      <TopologyView scene={scene} index={step} t={viewT} settled={settled} />
    ) : scene.kind === "sequence" ? (
      <SequenceView scene={scene} index={step} t={viewT} settled={settled} />
    ) : scene.kind === "layers" ? (
      <LayersView scene={scene} index={step} />
    ) : scene.kind === "bits" ? (
      <BitsView scene={scene} index={step} />
    ) : (
      <TerminalView scene={scene} index={step} t={viewT} />
    );

  const dwellPct = playing && elapsed > dur ? Math.min(100, ((elapsed - dur) / dwell) * 100) : 0;

  return (
    <div className={`player kind-${scene.kind}`} ref={rootRef} tabIndex={still !== undefined ? -1 : 0} onKeyDown={onKey} aria-roledescription="animation">
      <div className="player-head">
        <span className="kicker">{t(ui.animation)}</span>
        <h3>{t(scene.title)}</h3>
      </div>

      <div className="player-stage">
        {view}
        {!started && (
          <button className="player-start" onClick={togglePlay}>
            <Play size={18} fill="currentColor" /> {lang === "hi" ? "Animation chalao" : "Play the animation"}
          </button>
        )}
      </div>

      <div className="player-caption" aria-live="polite">
        <div className="caption-meta">
          {t(ui.step)} {step + 1} / {total}
        </div>
        <h4>{t(current.title)}</h4>
        <p>{rich(caption)}</p>
        <div className="dwell" aria-hidden>
          <span style={{ width: `${dwellPct}%` }} />
        </div>
      </div>

      {still === undefined && (
        <div className="player-controls">
          <div className="pc-buttons">
            <button className="icon-btn" onClick={() => goTo(0)} title={t(ui.restart)} aria-label={t(ui.restart)}>
              <RotateCcw size={17} />
            </button>
            <button className="icon-btn" onClick={() => goTo(step - 1)} disabled={step === 0} title={t(ui.previous)} aria-label={t(ui.previous)}>
              <ChevronLeft size={19} />
            </button>
            <button className="play-btn" onClick={togglePlay} aria-label={playing ? t(ui.pause) : t(ui.play)}>
              {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              <span>{playing ? t(ui.pause) : t(ui.play)}</span>
            </button>
            <button className="icon-btn" onClick={() => goTo(step + 1)} disabled={step === total - 1} title={t(ui.next)} aria-label={t(ui.next)}>
              <ChevronRight size={19} />
            </button>
            <button className="icon-btn" onClick={replay} title={t(ui.replayStep)} aria-label={t(ui.replayStep)}>
              <RotateCw size={16} />
            </button>
          </div>
          <div className="pc-dots" role="tablist" aria-label={t(ui.step)}>
            {scene.steps.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === step}
                className={i === step ? "is-on" : i < step ? "is-done" : ""}
                onClick={() => goTo(i)}
                title={`${i + 1}. ${t(s.title)}`}
              />
            ))}
          </div>
          <label className="pc-speed">
            <span>{t(ui.speed)}</span>
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              {SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}×
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
