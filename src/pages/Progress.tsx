import { AlertCircle, CalendarDays, CheckCircle2, Clock, Flame, Layers, Target, XCircle } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "../components/Layout";
import { allLessons, lessonMeta, lessonNumber, modules } from "../content/curriculum";
import { ccnaLessonSlugs, lessonOfQuestion } from "../data/bank";
import { DOMAINS } from "../data/domains";
import { domainScores, dueCardIds, dueQuestionIds, exams, heatmap, minutesBetween, readiness, readyToBook, streak, totalMinutes, weakLessons } from "../lib/analytics";
import { useAuth } from "../lib/auth";
import { handoff } from "../lib/handoff";
import { usePrefs, useT } from "../lib/prefs";
import { isDone, progress, useProgress, useSyncStatus } from "../lib/progress";
import { DAY, dayKey } from "../lib/progress-model";
import { cliLabs } from "../sim/labs";

function Ring({ pct }: { pct: number }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 110 110" className="ring" aria-hidden>
      <circle cx="55" cy="55" r={r} className="ring-bg" />
      <circle cx="55" cy="55" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 55 55)" />
      <text x="55" y="60" textAnchor="middle" className="ring-text">
        {pct}%
      </text>
    </svg>
  );
}

const hours = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} m` : `${m} min`);

export default function Progress() {
  const t = useT();
  const { lang } = usePrefs();
  const prog = useProgress();
  const { user, serverAvailable } = useAuth();
  const sync = useSyncStatus();
  const [, navigate] = useLocation();
  const now = Date.now();

  const scores = useMemo(() => domainScores(prog), [prog]);
  const ready = readiness(prog);
  const book = readyToBook(prog, ccnaLessonSlugs);
  const weak = weakLessons(prog, lessonOfQuestion, 5);
  const dueQ = dueQuestionIds(prog).length;
  const dueC = dueCardIds(prog).length;
  const days = streak(prog);
  const weekStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.getTime();
  })();
  const thisWeek = minutesBetween(prog, weekStart, now);
  const today = Math.round(prog.activity[dayKey()] ?? 0);
  const goal = prog.settings.dailyGoal;
  const grid = heatmap(prog, 20);
  const lessonsDone = allLessons.filter((l) => isDone(prog, l.slug)).length;
  const cliDone = cliLabs.filter((l) => prog.labs[`cli:${l.id}`]?.done).length;
  const ptDone = Object.entries(prog.labs).filter(([k, v]) => k.startsWith("pt:") && v.done).length;
  const recent = [...prog.sessions].reverse().slice(0, 8);
  const examList = exams(prog);
  const examDate = prog.settings.examDate;
  const daysToExam = examDate ? Math.ceil((new Date(examDate).getTime() - new Date(dayKey()).getTime()) / DAY) : null;
  const answered = Object.keys(prog.answers).length;

  const drill = (slug: string) => {
    handoff.set({ lessons: [slug], count: 10, label: `${lessonNumber(slug)} ${t(lessonMeta(slug)?.title)}` });
    navigate("/practice");
  };

  const level = (m: number) => (m <= 0 ? 0 : m < 15 ? 1 : m < 30 ? 2 : m < 60 ? 3 : 4);

  return (
    <Layout>
      <div className="page progress-page">
        <header className="page-head">
          <h1>{user ? (lang === "hi" ? `${user.name.split(" ")[0]}, tumhari progress` : `${user.name.split(" ")[0]}'s progress`) : t({ en: "Your progress", hi: "Tumhari progress" })}</h1>
          <p className="muted">
            {user
              ? sync === "error"
                ? t({ en: "Couldn't reach the server; your progress is safe here and will sync when it's back.", hi: "Server tak nahi pahunch paaye; progress yahan safe hai aur server wapas aate hi sync ho jaayegi." })
                : t({ en: "Synced to your account, so it follows you to any device.", hi: "Tumhare account se synced hai, toh kisi bhi device par milegi." })
              : serverAvailable
                ? (
                  <>
                    {t({ en: "Saved in this browser only.", hi: "Sirf is browser mein saved hai." })} <Link href="/login">{t({ en: "Sign in to keep it on every device.", hi: "Har device par rakhne ke liye sign in karo." })}</Link>
                  </>
                )
                : t({ en: "Saved in this browser.", hi: "Is browser mein saved hai." })}
          </p>
        </header>

        <section className="stat-row">
          <div className="stat stat-ready">
            <Ring pct={ready} />
            <div>
              <b>{t({ en: "Exam readiness", hi: "Exam readiness" })}</b>
              <p className="muted">{t({ en: "Mastery in each domain, weighted like the exam. Mastery needs both accuracy and enough questions answered.", hi: "Har domain ki mastery, exam ke weight ke hisaab se. Mastery ke liye accuracy aur kaafi questions dono chahiye." })}</p>
            </div>
          </div>
          <div className="stat">
            <Flame size={18} />
            <b>
              {days} {t({ en: days === 1 ? "day" : "days", hi: "din" })}
            </b>
            <span>{t({ en: "study streak", hi: "study streak" })}</span>
          </div>
          <div className="stat">
            <Clock size={18} />
            <b>{hours(thisWeek)}</b>
            <span>
              {t({ en: "this week", hi: "is hafte" })} · {t({ en: "today", hi: "aaj" })} {today}/{goal} min
            </span>
            <div className="bar small">
              <span style={{ width: `${Math.min(100, (today / goal) * 100)}%` }} />
            </div>
          </div>
          <div className="stat">
            <CalendarDays size={18} />
            {daysToExam !== null ? (
              <>
                <b>{daysToExam >= 0 ? `${daysToExam} ${t({ en: "days", hi: "din" })}` : t({ en: "Exam date passed", hi: "Exam date nikal gayi" })}</b>
                <span>{t({ en: "to your exam", hi: "exam tak" })}</span>
              </>
            ) : (
              <>
                <b>{t({ en: "No exam date", hi: "Exam date nahi" })}</b>
                <Link href="/settings">{t({ en: "Set it", hi: "Set karo" })}</Link>
              </>
            )}
          </div>
        </section>

        <div className="dash-grid">
          <section className="dash-card">
            <h2 className="h-small">{t({ en: "Mastery by exam domain", hi: "Exam domain ke hisaab se mastery" })}</h2>
            <table className="domain-table">
              <tbody>
                {scores.map((s) => {
                  const d = DOMAINS.find((x) => x.id === s.id)!;
                  return (
                    <tr key={s.id}>
                      <td>
                        {d.id}. {t(d.name)} <span className="muted">· {d.weight}%</span>
                      </td>
                      <td className="bar-cell wide">
                        <div className={`bar ${s.mastery < 75 ? "is-low" : ""}`}>
                          <span style={{ width: `${s.mastery}%` }} />
                        </div>
                      </td>
                      <td className="num">{s.mastery}%</td>
                      <td className="num muted" title={t({ en: "accuracy · questions answered", hi: "accuracy · answer kiye questions" })}>
                        {s.answered ? `${s.accuracy}% · ${s.answered}q` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="muted small">{t({ en: `${answered} different questions answered so far. Full mastery credit needs about 40 per domain.`, hi: `Ab tak ${answered} alag questions answer kiye. Poori mastery ke liye har domain mein lagbhag 40 chahiye.` })}</p>
          </section>

          <section className={`dash-card book ${book.ready ? "is-ready" : ""}`}>
            <h2 className="h-small">{t({ en: "Ready to book the exam?", hi: "Exam book karne ke liye ready?" })}</h2>
            <ul className="check-list">
              <li className={book.lessonsOk ? "ok" : ""}>
                {book.lessonsOk ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {t({ en: "90% of CCNA lessons completed", hi: "CCNA lessons ka 90% complete" })} <span className="muted">({Math.round(book.lessonsDone * 100)}%)</span>
              </li>
              <li className={book.mocksOk ? "ok" : ""}>
                {book.mocksOk ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {t({ en: "Last two mock exams at 85% or more", hi: "Pichle do mock exams 85% ya zyada" })}{" "}
                <span className="muted">({book.mocks.map((m) => `${Math.round((m.correct / m.total) * 100)}%`).join(", ") || "—"})</span>
              </li>
              <li className={book.domainsOk ? "ok" : ""}>
                {book.domainsOk ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {t({ en: "Every domain at 75% mastery or more", hi: "Har domain 75% mastery ya zyada" })}
              </li>
            </ul>
            <p className="muted small">{book.ready ? t({ en: "All three are true. Book it.", hi: "Teeno sahi hain. Book kar lo." }) : t({ en: "These come from the original CCNA Sprint plan: they are a strong sign you will pass, not a guarantee.", hi: "Yeh original CCNA Sprint plan se hain: pass hone ka strong sign hain, guarantee nahi." })}</p>
          </section>

          <section className="dash-card">
            <h2 className="h-small">{t({ en: "Do next", hi: "Aage yeh karo" })}</h2>
            <ul className="todo-list">
              <li>
                <Target size={15} /> {dueQ} {t({ en: "questions due for review", hi: "questions review ke liye due" })}{" "}
                {dueQ > 0 && (
                  <button
                    className="link-btn"
                    onClick={() => {
                      handoff.set({ mode: "review", count: Math.min(40, dueQ) });
                      navigate("/practice");
                    }}
                  >
                    {t({ en: "Review now", hi: "Abhi review karo" })}
                  </button>
                )}
              </li>
              <li>
                <Layers size={15} /> {dueC} {t({ en: "flashcards due", hi: "flashcards due" })} {dueC > 0 && <Link href="/flashcards">{t({ en: "Open", hi: "Kholo" })}</Link>}
              </li>
              {weak.length > 0 && (
                <li className="weak">
                  <AlertCircle size={15} /> {t({ en: "Weakest lessons", hi: "Sabse weak lessons" })}:
                  <ul>
                    {weak.map((w) => (
                      <li key={w.slug}>
                        <Link href={`/lesson/${w.slug}`}>
                          {lessonNumber(w.slug)} {t(lessonMeta(w.slug)?.title)}
                        </Link>{" "}
                        <span className="muted">{w.accuracy}%</span>{" "}
                        <button className="link-btn" onClick={() => drill(w.slug)}>
                          {t({ en: "Drill", hi: "Drill" })}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              <li>
                <CalendarDays size={15} /> <Link href="/plan">{t({ en: "Today's plan", hi: "Aaj ka plan" })}</Link>
              </li>
            </ul>
          </section>

          <section className="dash-card">
            <h2 className="h-small">{t({ en: "Study time", hi: "Study time" })}</h2>
            <div className="heatmap" aria-label="Daily study minutes">
              {grid.map((col, i) => (
                <div key={i} className="hm-col">
                  {col.map((c) => (
                    <span key={c.date} className={`hm-cell l${level(c.minutes)} ${c.future ? "is-future" : ""}`} title={`${c.date}: ${c.minutes} min`} />
                  ))}
                </div>
              ))}
            </div>
            <p className="muted small">
              {t({ en: "Total", hi: "Total" })} {hours(totalMinutes(prog))}. {t({ en: "Counted only while you are active on the site.", hi: "Sirf tab gina jaata hai jab tum site par active ho." })}
            </p>
          </section>

          <section className="dash-card">
            <h2 className="h-small">{t({ en: "Course and labs", hi: "Course aur labs" })}</h2>
            <table className="domain-table">
              <tbody>
                {modules.map((m) => {
                  const done = m.lessons.filter((l) => isDone(prog, l.slug)).length;
                  return (
                    <tr key={m.id}>
                      <td>
                        {m.num}. {t(m.title)}
                      </td>
                      <td className="bar-cell wide">
                        <div className="bar small">
                          <span style={{ width: `${(done / m.lessons.length) * 100}%` }} />
                        </div>
                      </td>
                      <td className="num">
                        {done}/{m.lessons.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="small">
              {lessonsDone}/{allLessons.length} {t({ en: "lessons", hi: "lessons" })} · {cliDone}/{cliLabs.length} {t({ en: "CLI labs", hi: "CLI labs" })} · {ptDone}/43 Packet Tracer · {prog.subnet.attempts ? `${t({ en: "subnetting", hi: "subnetting" })} ${Math.round((prog.subnet.correct / prog.subnet.attempts) * 100)}% / ${Math.round(prog.subnet.seconds / prog.subnet.attempts)}s` : ""}
            </p>
          </section>

          <section className="dash-card">
            <h2 className="h-small">{t({ en: "Recent activity", hi: "Recent activity" })}</h2>
            {recent.length === 0 ? (
              <p className="muted">{t({ en: "Nothing yet. Finish a lesson quiz, a practice set or a lab and it shows up here.", hi: "Abhi kuch nahi. Koi lesson quiz, practice set ya lab khatam karo, yahan dikhega." })}</p>
            ) : (
              <table className="domain-table">
                <tbody>
                  {recent.map((s) => (
                    <tr key={s.id}>
                      <td className="muted">{new Date(s.at).toLocaleDateString()}</td>
                      <td>{s.label}</td>
                      <td className="num">
                        {s.correct}/{s.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {examList.length > 0 && (
              <p className="small">
                {t({ en: "Mock exams", hi: "Mock exams" })}: {examList.slice(-5).map((e) => `${Math.round((e.correct / e.total) * 100)}%`).join(" → ")}
              </p>
            )}
          </section>
        </div>

        <p className="muted small dash-foot">
          <Link href="/settings">{t({ en: "Settings, backup and reset", hi: "Settings, backup aur reset" })}</Link>
          {!user && serverAvailable && (
            <>
              {" · "}
              <Link href="/login">{t({ en: "Sign in", hi: "Sign in" })}</Link>
            </>
          )}
          {" · "}
          <button className="link-btn" onClick={() => progress.addMinutes(0)}>
            {t({ en: "Refresh", hi: "Refresh" })}
          </button>
        </p>
      </div>
    </Layout>
  );
}
