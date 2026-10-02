import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { prompt, run, tab, type Session } from "../sim/cli";

export type TermLine = { kind: "in" | "out"; text: string };

type Props = {
  session: Session;
  lines: TermLine[];
  onLines: (lines: TermLine[]) => void;
  /** Called after every command so the page can save state and re-check tasks. */
  onCommand?: (cmd: string) => void;
  title?: string;
};

const MAX_LINES = 600;

/**
 * A console window for one simulated device. Enter runs a line, ↑/↓ walk history,
 * Tab completes, "?" shows help immediately (like IOS), Ctrl+Z leaves config mode.
 */
export function Terminal({ session, lines, onLines, onCommand, title }: Props) {
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const p = prompt(session);
  const secret = Boolean(session.pending?.secret);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, input]);

  const push = (add: TermLine[]) => onLines([...lines, ...add].slice(-MAX_LINES));

  const submit = (text: string) => {
    const shown = session.pending?.secret ? "" : text;
    const before = prompt(session);
    const r = run(session, text);
    const add: TermLine[] = [{ kind: "in", text: `${before}${shown}` }];
    if (r.output) add.push({ kind: "out", text: r.output });
    push(add);
    setInput(r.keep ?? "");
    setHist(null);
    onCommand?.(text);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const done = tab(session, input);
      if (done) setInput(done);
    } else if (e.key === "?" && !session.pending && !session.net.devices[session.dev].host) {
      e.preventDefault();
      const r = run(session, `${input}?`);
      push([{ kind: "in", text: `${p}${input}?` }, { kind: "out", text: r.output }]);
      setInput(r.keep ?? input);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = session.history;
      if (!h.length) return;
      const next = e.key === "ArrowUp" ? (hist === null ? h.length - 1 : Math.max(0, hist - 1)) : hist === null ? null : hist + 1 >= h.length ? null : hist + 1;
      setHist(next);
      setInput(next === null ? "" : h[next]);
    } else if (e.key === "z" && e.ctrlKey) {
      e.preventDefault();
      submit("end");
    } else if (e.key === "c" && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      push([{ kind: "in", text: `${p}${input}^C` }]);
      setInput("");
    }
  };

  return (
    <div className="term lab-term" onClick={() => inputRef.current?.focus()}>
      {title && (
        <div className="term-bar">
          <span className="term-dot" />
          {title}
        </div>
      )}
      <div className="term-body" ref={bodyRef}>
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "in" ? "t-line" : "t-out"}>
            {l.text}
          </div>
        ))}
        <div className="t-line t-input-line">
          <span className="t-prompt">{p}</span>
          <input
            ref={inputRef}
            className="t-input"
            value={input}
            type={secret ? "password" : "text"}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label={`Command line, ${p}`}
          />
        </div>
      </div>
    </div>
  );
}
