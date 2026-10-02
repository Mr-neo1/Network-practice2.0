import { AlertTriangle, BookmarkCheck, Lightbulb, MessageCircle } from "lucide-react";
import type { Block, Cell } from "../content/types";
import { useT } from "../lib/prefs";
import { rich } from "../lib/rich";

const calloutIcon = { tip: Lightbulb, warn: AlertTriangle, exam: BookmarkCheck, analogy: MessageCircle };
const calloutName = {
  tip: { en: "Tip", hi: "Tip" },
  warn: { en: "Watch out", hi: "Dhyan do" },
  exam: { en: "For the exam", hi: "Exam ke liye" },
  analogy: { en: "Analogy", hi: "Misaal" },
};

export function BlockView({ block }: { block: Block }) {
  const t = useT();
  const cell = (c: Cell) => rich(t(c));
  switch (block.type) {
    case "p":
      return <p>{rich(t(block.text))}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{rich(t(it))}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="steps">
          {block.items.map((it, i) => (
            <li key={i}>{rich(t(it))}</li>
          ))}
        </ol>
      );
    case "callout": {
      const Icon = calloutIcon[block.tone];
      return (
        <aside className={`callout callout-${block.tone}`}>
          <div className="callout-head">
            <Icon size={16} />
            <span>{block.title ? t(block.title) : t(calloutName[block.tone])}</span>
          </div>
          <p>{rich(t(block.text))}</p>
        </aside>
      );
    }
    case "table":
      return (
        <figure className="table-wrap">
          {block.caption && <figcaption>{rich(t(block.caption))}</figcaption>}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {block.columns.map((c, i) => (
                    <th key={i}>{cell(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((c, ci) => (
                      <td key={ci}>{cell(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case "cli":
      return (
        <figure className="cli">
          {block.title && <figcaption>{t(block.title)}</figcaption>}
          <div className="cli-body">
            {block.lines.map((ln, i) => (
              <div key={i} className="cli-line">
                {ln.cmd !== undefined || ln.prompt ? (
                  <div>
                    <span className="cli-prompt">{ln.prompt}</span>
                    <span className="cli-cmd">{ln.cmd}</span>
                  </div>
                ) : null}
                {ln.out && <div className="cli-out">{ln.out}</div>}
                {ln.comment && <div className="cli-comment">↳ {rich(t(ln.comment))}</div>}
              </div>
            ))}
          </div>
          {block.note && <p className="cli-note">{rich(t(block.note))}</p>}
        </figure>
      );
    case "code":
      return (
        <figure className="code">
          <figcaption>
            <span>{block.title ? t(block.title) : ""}</span>
            <span className="code-lang">{block.lang}</span>
          </figcaption>
          <pre>
            <code>{block.code}</code>
          </pre>
        </figure>
      );
  }
}
