import { ArrowRight, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "../components/Layout";
import { Quiz } from "../components/Quiz";
import { lessonMeta, lessonNumber } from "../content/curriculum";
import { lessonOfQuestion, shuffle, useBank, type QItem } from "../data/bank";
import { DOMAINS } from "../data/domains";
import { dueQuestionIds, weakLessons } from "../lib/analytics";
import { handoff, type PracticeRequest } from "../lib/handoff";
import { usePrefs, useT } from "../lib/prefs";
import { progress, useProgress } from "../lib/progress";

type Mode = "custom" | "weak" | "review";
type Run = { id: number; items: QItem[]; label: string; startedAt: number };

export default function Practice() {
  const t = useT();
  const { lang } = usePrefs();
  const bank = useBank();
  const prog = useProgress();
  const [request] = useState<PracticeRequest | null>(() => handoff.take());
  const [mode, setMode] = useState<Mode>(request?.mode ?? "custom");
  const [domains, setDomains] = useState<Set<number>>(() => new Set(request?.domains ?? [1, 2, 3, 4, 5, 6]));
  const [count, setCount] = useState(request?.count ?? 20);
  const [types, setTypes] = useState<Set<string>>(() => new Set(["single", "multi", "match", "command"]));
  const [session, setSession] = useState<Run | null>(null);
  const [summary, setSummary] = useState<{ correct: number; total: number; byDomain: [string, number, number][] } | null>(null);

  const due = useMemo(() => new Set(dueQuestionIds(prog)), [prog]);
  const weak = useMemo(() => weakLessons(prog, lessonOfQuestion, 6), [prog]);

  const pool = useMemo(() => {
    if (!bank) return [];
    if (request?.lessons?.length) return bank.filter((q) => request.lessons!.includes(q.lesson));
    if (mode === "review") return bank.filter((q) => due.has(q.id));
    if (mode === "weak") {
      const slugs = new Set(weak.map((w) => w.slug));
      return bank.filter((q) => slugs.has(q.lesson) || (prog.answers[q.id] && !prog.answers[q.id].lastRight));
    }
    return bank.filter((q) => (q.domain ? domains.has(q.domain) : domains.has(0)) && types.has(q.type));
  }, [bank, mode, domains, types, due, weak, prog.answers, request]);

  const start = (items = pool, label?: string) => {
    // Favour questions you haven't seen or got wrong.
    const ranked = shuffle(items).sort((a, b) => score(a) - score(b));
    const chosen = shuffle(ranked.slice(0, count));
    setSummary(null);
    setSession({ id: Date.now(), items: chosen, label: label ?? request?.label ?? (mode === "review" ? "Review" : mode === "weak" ? "Weak spots" : "Practice"), startedAt: Date.now() });
    window.scrollTo({ top: 0 });
  };

  function score(q: QItem) {
    const a = prog.answers[q.id];
    if (!a) return 0;
    return a.lastRight ? 2 + a.right : 1;
  }

  useEffect(() => {
    if (request?.lessons?.length && bank) start(pool, request.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank]);

  const finish = (correct: number, total: number, results: boolean[]) => {
    if (!session) return;
    const per: Record<string, [number, number]> = {};
    session.items.forEach((q, i) => {
      const k = String(q.domain || 0);
      per[k] ??= [0, 0];
      per[k][1]++;
      if (results[i]) per[k][0]++;
    });
    progress.recordSession({ kind: mode === "review" ? "review" : "practice", label: session.label, total, correct, seconds: Math.round((Date.now() - session.startedAt) / 1000), perDomain: per });
    setSummary({ correct, total, byDomain: Object.entries(per).map(([d, [c, n]]) => [d, c, n]) });
  };

  const toggle = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    setter(n);
  };

  const typeNames: Record<string, { en: string; hi: string }> = {
    single: { en: "Single answer", hi: "Single answer" },
    multi: { en: "Multiple answers", hi: "Multiple answers" },
    match: { en: "Match", hi: "Match" },
    command: { en: "Type the command", hi: "Command type karo" },
  };

  return (
    <Layout>
      <div className="page">
        <header className="page-head">
          <h1>{t({ en: "Practice", hi: "Practice" })}</h1>
          <p className="lede">
            {t({
              en: "Over 700 questions: the 300-question CCNA bank plus every lesson's quiz. Wrong answers come back for review after 1, 3 and 7 days until you get them right.",
              hi: "700 se zyada questions: 300 questions ka CCNA bank aur har lesson ka quiz. Galat answers 1, 3 aur 7 din baad review ke liye wapas aate hain, jab tak sahi na ho jaayein.",
            })}
          </p>
        </header>

        {!session && (
          <>
            <Link href="/exam" className="exam-banner">
              <Clock size={20} />
              <div>
                <b>{t({ en: "Exam simulator", hi: "Exam simulator" })}</b>
                <span>{t({ en: "100 questions, 120 minutes, weighted like the real exam, no going back.", hi: "100 questions, 120 minute, real exam jaise weight ke saath, peeche nahi ja sakte." })}</span>
              </div>
              <ArrowRight size={18} />
            </Link>

            <section className="setup">
              {request?.lessons?.length ? (
                <p>{t({ en: "Questions from:", hi: "In lessons se questions:" })} {request.lessons.map((s) => `${lessonNumber(s)} ${t(lessonMeta(s)?.title)}`).join(", ")}</p>
              ) : (
                <>
                  <div className="setup-group">
                    <div className="setup-label">{t({ en: "What to practise", hi: "Kya practice karna hai" })}</div>
                    <div className="segmented">
                      <button className={mode === "custom" ? "is-on" : ""} onClick={() => setMode("custom")}>
                        {t({ en: "Choose topics", hi: "Topics chuno" })}
                      </button>
                      <button className={mode === "weak" ? "is-on" : ""} onClick={() => setMode("weak")}>
                        {t({ en: "My weak spots", hi: "Meri weak spots" })}
                      </button>
                      <button className={mode === "review" ? "is-on" : ""} onClick={() => setMode("review")}>
                        {t({ en: "Due for review", hi: "Review ke liye due" })} ({due.size})
                      </button>
                    </div>
                  </div>
                  {mode === "custom" && (
                    <>
                      <div className="setup-group">
                        <div className="setup-label">{t({ en: "Exam domains", hi: "Exam domains" })}</div>
                        <div className="chips">
                          {DOMAINS.map((d) => (
                            <button key={d.id} className={`chip ${domains.has(d.id) ? "is-on" : ""}`} aria-pressed={domains.has(d.id)} onClick={() => toggle(domains, d.id as number, setDomains)}>
                              {d.id}. {t(d.name)} · {d.weight}%
                            </button>
                          ))}
                          <button className={`chip ${domains.has(0) ? "is-on" : ""}`} aria-pressed={domains.has(0)} onClick={() => toggle(domains, 0, setDomains)}>
                            {t({ en: "Beyond the CCNA", hi: "CCNA ke aage" })}
                          </button>
                        </div>
                      </div>
                      <div className="setup-group">
                        <div className="setup-label">{t({ en: "Question types", hi: "Question types" })}</div>
                        <div className="chips">
                          {Object.entries(typeNames).map(([k, v]) => (
                            <button key={k} className={`chip ${types.has(k) ? "is-on" : ""}`} aria-pressed={types.has(k)} onClick={() => toggle(types, k, setTypes)}>
                              {t(v)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {mode === "weak" && (
                    <div className="weak-list">
                      {weak.length ? (
                        weak.map((w) => (
                          <Link key={w.slug} href={`/lesson/${w.slug}`}>
                            {lessonNumber(w.slug)} {t(lessonMeta(w.slug)?.title)} <span className="muted">· {w.accuracy}%</span>
                          </Link>
                        ))
                      ) : (
                        <p className="muted">{t({ en: "No weak spots yet: answer a few more questions first.", hi: "Abhi koi weak spot nahi: pehle thode aur questions karo." })}</p>
                      )}
                    </div>
                  )}
                </>
              )}
              <div className="setup-row">
                <div className="setup-group">
                  <div className="setup-label">{t({ en: "Questions", hi: "Questions" })}</div>
                  <div className="segmented">
                    {[10, 20, 40, 60].map((n) => (
                      <button key={n} className={count === n ? "is-on" : ""} onClick={() => setCount(n)}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="setup-go">
                <button className="btn btn-primary" onClick={() => start()} disabled={!bank || pool.length === 0}>
                  {t({ en: "Start", hi: "Shuru karo" })}
                </button>
                <span className="muted">{bank ? `${pool.length} ${lang === "hi" ? "questions available" : "questions available"}` : t({ en: "Loading…", hi: "Load ho raha hai…" })}</span>
              </div>
            </section>
          </>
        )}

        {session && (
          <section>
            <div className="session-head">
              <span className="muted">
                {session.label} · {session.items.length}
              </span>
              <button className="btn btn-ghost" onClick={() => setSession(null)}>
                {t({ en: "New session", hi: "Naya session" })}
              </button>
            </div>
            <Quiz key={session.id} items={session.items} sourceOf={(q) => `${lessonNumber(q.lesson)} ${t(lessonMeta(q.lesson)?.title)}`} onFinish={finish} onRetry={() => start(session.items, session.label)} />
            {summary && (
              <div className="breakdown">
                <h2 className="h-small">{t({ en: "By exam domain", hi: "Exam domain ke hisaab se" })}</h2>
                <table>
                  <tbody>
                    {summary.byDomain.map(([d, c, n]) => (
                      <tr key={d}>
                        <td>{d === "0" ? t({ en: "Beyond the CCNA", hi: "CCNA ke aage" }) : `${d}. ${t(DOMAINS.find((x) => String(x.id) === d)!.name)}`}</td>
                        <td className="num">
                          {c}/{n}
                        </td>
                        <td className="bar-cell">
                          <div className="bar small">
                            <span style={{ width: `${(c / n) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
}

