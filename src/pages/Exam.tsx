import { Clock, Flag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Layout } from "../components/Layout";
import { QuestionCard } from "../components/QuestionCard";
import { lessonMeta, lessonNumber } from "../content/curriculum";
import { isCorrect, shuffle, useBank, type QItem, type Response } from "../data/bank";
import { DOMAINS, examDistribution } from "../data/domains";
import type { Domain } from "../data/types";
import { exams } from "../lib/analytics";
import { usePrefs, useT } from "../lib/prefs";
import { progress, useProgress } from "../lib/progress";

const SIZES = [{ n: 100, min: 120 }, { n: 50, min: 60 }, { n: 25, min: 30 }];
const TARGET = 85;

type Run = { items: QItem[]; endsAt: number; startedAt: number; index: number; responses: Record<number, Response>; flagged: number[] };
type Result = { items: QItem[]; responses: Record<number, Response>; correct: number; seconds: number; per: Record<string, [number, number]> };

function fmt(sec: number) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Exam() {
  const t = useT();
  const { lang } = usePrefs();
  const bank = useBank();
  const prog = useProgress();
  const [size, setSize] = useState(SIZES[0]);
  const [run, setRun] = useState<Run | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [now, setNow] = useState(Date.now());
  const finishing = useRef(false);
  const history = exams(prog).slice(-6).reverse();

  const pool = useMemo(() => (bank ?? []).filter((q) => q.domain >= 1 && q.domain <= 6), [bank]);

  const start = () => {
    const want = examDistribution(size.n);
    const items: QItem[] = [];
    for (const d of DOMAINS) {
      // Prefer the CCNA bank, then lesson questions, never repeating within one exam.
      const ds = pool.filter((q) => q.domain === d.id);
      const ordered = [...shuffle(ds.filter((q) => q.source === "bank")), ...shuffle(ds.filter((q) => q.source === "lesson"))];
      items.push(...ordered.slice(0, want[d.id as Domain]));
    }
    finishing.current = false;
    setResult(null);
    setRun({ items: shuffle(items), endsAt: Date.now() + size.min * 60_000, startedAt: Date.now(), index: 0, responses: {}, flagged: [] });
  };

  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [run]);

  const finish = (r: Run) => {
    if (finishing.current) return;
    finishing.current = true;
    const per: Record<string, [number, number]> = {};
    let correct = 0;
    r.items.forEach((q, i) => {
      const ok = isCorrect(q, r.responses[i]);
      if (ok) correct++;
      per[q.domain] ??= [0, 0];
      per[q.domain][1]++;
      if (ok) per[q.domain][0]++;
      progress.recordAnswer(q.id, ok, q.domain);
    });
    const seconds = Math.round((Math.min(Date.now(), r.endsAt) - r.startedAt) / 1000);
    progress.recordSession({ kind: "exam", label: `Exam ${r.items.length}`, total: r.items.length, correct, seconds, perDomain: per });
    setResult({ items: r.items, responses: r.responses, correct, seconds, per });
    setRun(null);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (run && now >= run.endsAt) finish(run);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  useEffect(() => {
    if (!run) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [run]);

  if (run) {
    const q = run.items[run.index];
    const left = Math.max(0, Math.round((run.endsAt - now) / 1000));
    const answered = Boolean(run.responses[run.index]);
    const last = run.index === run.items.length - 1;
    return (
      <Layout>
        <div className="page exam-page">
          <div className="exam-bar">
            <span>
              {t({ en: "Question", hi: "Question" })} {run.index + 1} / {run.items.length}
            </span>
            <span className={`exam-time ${left < 300 ? "is-low" : ""}`}>
              <Clock size={15} /> {fmt(left)}
            </span>
          </div>
          <div className="bar small exam-progress">
            <span style={{ width: `${(run.index / run.items.length) * 100}%` }} />
          </div>
          <QuestionCard key={run.index} item={q} number={run.index + 1} response={run.responses[run.index]} onRespond={(r) => setRun({ ...run, responses: { ...run.responses, [run.index]: r } })} revealed={false} />
          <div className="exam-nav">
            <button className={`btn btn-ghost ${run.flagged.includes(run.index) ? "is-flagged" : ""}`} onClick={() => setRun({ ...run, flagged: run.flagged.includes(run.index) ? run.flagged.filter((x) => x !== run.index) : [...run.flagged, run.index] })}>
              <Flag size={15} /> {t({ en: "Flag for review later", hi: "Baad mein review ke liye flag karo" })}
            </button>
            <button
              className="btn btn-primary"
              disabled={!answered}
              onClick={() => {
                if (last) finish(run);
                else setRun({ ...run, index: run.index + 1 });
              }}
            >
              {last ? t({ en: "Finish exam", hi: "Exam khatam karo" }) : t({ en: "Next", hi: "Agla" })}
            </button>
          </div>
          <p className="muted exam-note">
            {t({
              en: "Like the real CCNA, you can't go back to earlier questions. Answer, then move on. Flags are only for your review afterwards.",
              hi: "Real CCNA ki tarah, pichle questions par wapas nahi ja sakte. Answer do, phir aage badho. Flag sirf baad ke review ke liye hai.",
            })}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <header className="page-head">
          <h1>{t({ en: "Exam simulator", hi: "Exam simulator" })}</h1>
          <p className="lede">
            {t({
              en: "Questions are drawn by the official domain weights (20/20/25/10/15/10), one at a time, with no going back. Aim for 85% or more twice in a row before you book the real exam.",
              hi: "Questions official domain weights (20/20/25/10/15/10) ke hisaab se aate hain, ek-ek karke, aur peeche nahi ja sakte. Real exam book karne se pehle lagatar do baar 85% ya zyada laao.",
            })}
          </p>
        </header>

        {result && (
          <section className="exam-result">
            <div className={`exam-score ${(result.correct / result.items.length) * 100 >= TARGET ? "is-pass" : ""}`}>
              <b>{Math.round((result.correct / result.items.length) * 100)}%</b>
              <span>
                {result.correct} / {result.items.length} · {fmt(result.seconds)}
              </span>
              <span>{(result.correct / result.items.length) * 100 >= TARGET ? t({ en: "Above the 85% target.", hi: "85% target se upar." }) : t({ en: "Below the 85% target. Study the weakest domain below, then try again.", hi: "85% target se neeche. Neeche sabse weak domain padho, phir dobara try karo." })}</span>
            </div>
            <table className="domain-table">
              <tbody>
                {DOMAINS.map((d) => {
                  const [c, n] = result.per[d.id] ?? [0, 0];
                  const pct = n ? Math.round((c / n) * 100) : 0;
                  return (
                    <tr key={d.id}>
                      <td>
                        {d.id}. {t(d.name)}
                      </td>
                      <td className="num">
                        {c}/{n}
                      </td>
                      <td className="bar-cell">
                        <div className={`bar small ${pct < TARGET ? "is-low" : ""}`}>
                          <span style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="num">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h2 className="h-small">{t({ en: "Questions you missed", hi: "Jo questions galat hue" })}</h2>
            <div className="quiz">
              {result.items.map((q, i) =>
                isCorrect(q, result.responses[i]) ? null : (
                  <QuestionCard key={i} item={q} number={i + 1} response={result.responses[i]} onRespond={() => undefined} revealed source={`${lessonNumber(q.lesson)} ${t(lessonMeta(q.lesson)?.title)}`} />
                ),
              )}
            </div>
          </section>
        )}

        <section className="setup">
          <div className="setup-group">
            <div className="setup-label">{t({ en: "Length", hi: "Length" })}</div>
            <div className="segmented">
              {SIZES.map((s) => (
                <button key={s.n} className={size.n === s.n ? "is-on" : ""} onClick={() => setSize(s)}>
                  {s.n} {lang === "hi" ? "questions" : "questions"} · {s.min} min
                </button>
              ))}
            </div>
          </div>
          <div className="setup-go">
            <button className="btn btn-primary" onClick={start} disabled={!bank}>
              {result ? t({ en: "Start another exam", hi: "Ek aur exam shuru karo" }) : t({ en: "Start the exam", hi: "Exam shuru karo" })}
            </button>
            {!bank && <span className="muted">{t({ en: "Loading questions…", hi: "Questions load ho rahe hain…" })}</span>}
          </div>
        </section>

        {history.length > 0 && (
          <section className="breakdown">
            <h2 className="h-small">{t({ en: "Your recent exams", hi: "Tumhare recent exams" })}</h2>
            <table>
              <tbody>
                {history.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.at).toLocaleDateString()}</td>
                    <td className="num">
                      {e.correct}/{e.total}
                    </td>
                    <td className="num">{Math.round((e.correct / e.total) * 100)}%</td>
                    <td className="num">{fmt(e.seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted">
              <Link href="/progress">{t({ en: "See all progress", hi: "Poori progress dekho" })}</Link>
            </p>
          </section>
        )}
      </div>
    </Layout>
  );
}
