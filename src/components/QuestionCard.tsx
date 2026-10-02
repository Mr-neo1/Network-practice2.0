import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { isCorrect, type QItem, type Response } from "../data/bank";
import { usePrefs, useT } from "../lib/prefs";
import { rich } from "../lib/rich";
import { ui } from "../lib/ui";

type Props = {
  item: QItem;
  number: number;
  response?: Response;
  onRespond: (r: Response) => void;
  /** Show right/wrong and explanations. */
  revealed: boolean;
  /** Instant mode: single-choice reveals on click; other types need "Check". */
  onCheck?: () => void;
  source?: string;
};

function seededOrder(n: number, seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const j = Math.abs(h) % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function QuestionCard({ item, number, response, onRespond, revealed, onCheck, source }: Props) {
  const t = useT();
  const { lang } = usePrefs();
  const q = item;
  const right = revealed && isCorrect(q, response);
  const rightOrder = useMemo(() => seededOrder(q.pairs?.length ?? 0, q.id), [q]);
  const [cmd, setCmd] = useState(response?.kind === "command" ? response.text : "");
  const needCount = q.type === "multi" ? q.answer?.length ?? 0 : 0;

  const chosen = (i: number) => (response?.kind === "single" ? response.choice === i : response?.kind === "multi" ? response.choices.includes(i) : false);

  return (
    <div className={`q ${revealed ? (right ? "is-right" : "is-wrong") : ""}`}>
      <div className="q-head">
        <span className="q-num">{number}</span>
        <div className="q-text">
          {source && <div className="q-source">{source}</div>}
          <div className="q-body">{rich(t(q.text))}</div>
          {q.type === "multi" && <div className="q-hint">{lang === "hi" ? `${needCount} answers chuno` : `Choose ${needCount}`}</div>}
          {q.type === "command" && <div className="q-hint">{lang === "hi" ? "Command type karo (short form bhi chalega)" : "Type the command (abbreviations are fine)"}</div>}
          {q.type === "match" && <div className="q-hint">{lang === "hi" ? "Har item ke liye sahi match chuno" : "Pick the right match for each item"}</div>}
        </div>
      </div>

      {(q.type === "single" || q.type === "multi") && (
        <div className="q-options" role={q.type === "single" ? "radiogroup" : "group"}>
          {q.options!.map((o, oi) => {
            const isAns = q.answer!.includes(oi);
            const state = !revealed ? (chosen(oi) ? "is-picked" : "") : isAns ? "is-answer" : chosen(oi) ? "is-chosen" : "is-other";
            return (
              <button
                key={oi}
                role={q.type === "single" ? "radio" : "checkbox"}
                aria-checked={chosen(oi)}
                className={`q-option ${state} ${q.type === "multi" ? "is-multi" : ""}`}
                disabled={revealed}
                onClick={() => {
                  if (q.type === "single") onRespond({ kind: "single", choice: oi });
                  else {
                    const cur = response?.kind === "multi" ? response.choices : [];
                    onRespond({ kind: "multi", choices: cur.includes(oi) ? cur.filter((c) => c !== oi) : [...cur, oi] });
                  }
                }}
              >
                <span className="q-letter">{String.fromCharCode(65 + oi)}</span>
                <span className="q-option-text">
                  {rich(t(o))}
                  {revealed && chosen(oi) && !isAns && q.whyWrong?.[oi] && t(q.whyWrong[oi]) && <span className="q-why">{rich(t(q.whyWrong[oi]))}</span>}
                </span>
                {revealed && isAns && <Check size={16} className="q-mark" />}
                {revealed && chosen(oi) && !isAns && <X size={16} className="q-mark" />}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "match" && (
        <div className="q-match">
          {q.pairs!.map((p, li) => {
            const picked = response?.kind === "match" ? response.pairs[li] : undefined;
            const ok = revealed && picked === li;
            return (
              <label key={li} className={`match-row ${revealed ? (ok ? "is-ok" : "is-bad") : ""}`}>
                <span className="match-left">{rich(t(p.left))}</span>
                <select
                  value={picked ?? ""}
                  disabled={revealed}
                  onChange={(e) => {
                    const pairs = { ...(response?.kind === "match" ? response.pairs : {}) };
                    if (e.target.value === "") delete pairs[li];
                    else pairs[li] = Number(e.target.value);
                    onRespond({ kind: "match", pairs });
                  }}
                >
                  <option value="">{lang === "hi" ? "Chuno…" : "Choose…"}</option>
                  {rightOrder.map((ri) => (
                    <option key={ri} value={ri}>
                      {t(q.pairs![ri].right)}
                    </option>
                  ))}
                </select>
                {revealed && !ok && <span className="match-answer">→ {t(p.right)}</span>}
              </label>
            );
          })}
        </div>
      )}

      {q.type === "command" && (
        <div className="q-command">
          <span className="q-command-prompt mono">#</span>
          <input
            className="text-input mono"
            value={cmd}
            disabled={revealed}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            onChange={(e) => {
              setCmd(e.target.value);
              onRespond({ kind: "command", text: e.target.value });
            }}
            onKeyDown={(e) => e.key === "Enter" && onCheck?.()}
            aria-label="Command"
          />
          {revealed && <div className="q-command-answer mono">{q.commandAnswer}</div>}
        </div>
      )}

      {onCheck && !revealed && q.type !== "single" && (
        <div className="q-check">
          <button className="btn btn-ghost" onClick={onCheck} disabled={!response}>
            {t(ui.checkAnswers)}
          </button>
        </div>
      )}

      {revealed && (
        <div className="q-explain">
          <b>{!response ? (lang === "hi" ? "Answer nahi diya" : "Not answered") : right ? t(ui.correct) : t(ui.notQuite)}.</b> {rich(t(q.explanation))}
        </div>
      )}
    </div>
  );
}
