import { memo, useEffect, useMemo, useRef } from "react";
import { CHAR_MS, terminalHistory, terminalTimeline } from "./engine";
import type { TermLine, TerminalScene } from "./types";

type Props = { scene: TerminalScene; index: number; t: number };

function Line({ line, typed, cursor }: { line: TermLine; typed?: number; cursor?: boolean }) {
  if (line.cmd === undefined && !line.prompt) return <div className="t-out">{line.out}</div>;
  const cmd = line.cmd ?? "";
  const shown = typed === undefined ? cmd : cmd.slice(0, typed);
  return (
    <>
      <div className="t-line">
        <span className="t-prompt">{line.prompt}</span>
        <span className="t-cmd">{shown}</span>
        {cursor && <span className="t-cursor" aria-hidden />}
      </div>
      {line.out && (typed === undefined || typed >= cmd.length) && <div className="t-out">{line.out}</div>}
    </>
  );
}

function TerminalViewInner({ scene, index, t }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const history = useMemo(() => terminalHistory(scene.steps, index), [scene, index]);
  const timeline = useMemo(() => terminalTimeline(scene.steps[index].lines), [scene, index]);

  const visible = timeline.events.filter((e) => e.start <= t);
  const typingIndex = visible.findIndex((e) => t < e.typeEnd);
  const lastIndex = visible.length - 1;

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    // Web fonts can change line heights after first paint; keep the newest line in view.
    let alive = true;
    document.fonts?.ready.then(() => alive && (el.scrollTop = el.scrollHeight));
    return () => {
      alive = false;
    };
  }, [t, index]);

  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dot" />
        {scene.device}
      </div>
      <div className="term-body" ref={bodyRef}>
        {history.map((line, i) => (
          <Line key={`h${i}`} line={line} />
        ))}
        {visible.map((e, i) => {
          const typing = typingIndex === i;
          const chars = typing ? Math.floor((t - e.start) / CHAR_MS) : undefined;
          const isPromptOnly = e.line.prompt && !e.line.cmd;
          const cursor = typing || (typingIndex === -1 && i === lastIndex && (isPromptOnly || (!e.line.out && e.line.cmd !== undefined)));
          return <Line key={`c${i}`} line={e.line} typed={chars} cursor={cursor} />;
        })}
        {visible.length === 0 && history.length === 0 && <span className="t-cursor" aria-hidden />}
      </div>
    </div>
  );
}

export const TerminalView = memo(TerminalViewInner);
