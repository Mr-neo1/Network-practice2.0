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

  const canHelp = !session.pending && !session.net.devices[session.dev].host;

  const complete = () => {
    const done = tab(session, input);
    if (done) setInput(done);
  };

  const help = (line: string) => {
    const r = run(session, `${line}?`);
    push([{ kind: "in", text: `${p}${line}?` }, { kind: "out", text: r.output }]);
    setInput(r.keep ?? line);
  };

  const walkHistory = (dir: "up" | "down") => {
    const h = session.history;
    if (!h.length) return;
    const next = dir === "up" ? (hist === null ? h.length - 1 : Math.max(0, hist - 1)) : hist === null ? null : hist + 1 >= h.length ? null : hist + 1;
    setHist(next);
    setInput(next === null ? "" : h[next]);
  };

  const cancel = () => {
    push([{ kind: "in", text: `${p}${input}^C` }]);
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "?" && canHelp) {
      e.preventDefault();
      help(input);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      walkHistory(e.key === "ArrowUp" ? "up" : "down");
    } else if (e.key === "z" && e.ctrlKey) {
      e.preventDefault();
      submit("end");
    } else if (e.key === "c" && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      cancel();
    }
  };

  // Phone keyboards don't report "?" as a key press, so catch it as typed text instead.
  const onChange = (value: string) => {
    if (canHelp && value === `${input}?`) help(input);
    else setInput(value);
  };

  // On-screen keys for phones, which have no Tab, arrows or Ctrl. pointerdown + preventDefault keeps
  // the text box focused, so the keyboard stays open.
  const key = (label: string, action: () => void, title: string) => (
    <button
      type="button"
      title={title}
      onPointerDown={(e) => {
        e.preventDefault();
        action();
        inputRef.current?.focus();
      }}
    >
      {label}
    </button>
  );

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
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKey}
            enterKeyHint="send"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label={`Command line, ${p}`}
          />
        </div>
      </div>
      <div className="term-keys" role="toolbar" aria-label="Terminal keys">
        {key("Tab", complete, "Complete the command (Tab)")}
        {key("?", () => canHelp && help(input), "Show help (?)")}
        {key("↑", () => walkHistory("up"), "Previous command")}
        {key("↓", () => walkHistory("down"), "Next command")}
        {key("end", () => submit("end"), "Back to privileged EXEC (Ctrl+Z)")}
        {key("^C", cancel, "Clear the line (Ctrl+C)")}
      </div>
    </div>
  );
}
