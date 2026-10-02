import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { lessonNumber, moduleOf, modules } from "../content/curriculum";
import { lessonExists } from "../content/load";
import { useT } from "../lib/prefs";
import { isDone, useProgress } from "../lib/progress";

/** The course outline: every module and lesson, with completion ticks. */
export function Outline({ current, onNavigate }: { current?: string; onNavigate?: () => void }) {
  const t = useT();
  const prog = useProgress();
  const currentModule = current ? moduleOf(current)?.id : undefined;
  const [open, setOpen] = useState<Record<string, boolean>>(() => (currentModule ? { [currentModule]: true } : { m0: true }));

  useEffect(() => {
    if (currentModule) setOpen((o) => ({ ...o, [currentModule]: true }));
  }, [currentModule]);

  return (
    <nav className="outline" aria-label="Course outline">
      {modules.map((m) => {
        const done = m.lessons.filter((l) => isDone(prog, l.slug)).length;
        const isOpen = open[m.id];
        return (
          <div key={m.id} className={`outline-module ${isOpen ? "is-open" : ""}`}>
            <button className="outline-module-head" onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))} aria-expanded={isOpen}>
              <span className="outline-num">{m.num}</span>
              <span className="outline-title">{t(m.title)}</span>
              <span className="outline-count">
                {done}/{m.lessons.length}
              </span>
              <ChevronDown size={15} className="outline-chevron" />
            </button>
            {isOpen && (
              <ol className="outline-lessons">
                {m.lessons.map((l) => {
                  const lessonDone = isDone(prog, l.slug);
                  const ready = lessonExists(l.slug);
                  return (
                    <li key={l.slug}>
                      <Link
                        href={`/lesson/${l.slug}`}
                        className={`outline-lesson ${current === l.slug ? "is-current" : ""} ${lessonDone ? "is-done" : ""} ${ready ? "" : "is-pending"}`}
                        onClick={onNavigate}
                        aria-current={current === l.slug ? "page" : undefined}
                      >
                        <span className="outline-tick">{lessonDone ? <Check size={12} strokeWidth={3} /> : lessonNumber(l.slug)}</span>
                        <span>{t(l.title)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        );
      })}
    </nav>
  );
}
