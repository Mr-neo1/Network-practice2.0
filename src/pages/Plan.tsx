import { Check, ChevronDown, CircleDot, FlaskConical, ListChecks, Repeat, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "../components/Layout";
import { lessonMeta, lessonNumber } from "../content/curriculum";
import type { PlanDay } from "../data/types";
import { handoff } from "../lib/handoff";
import { useT } from "../lib/prefs";
import { isDone, progress, useProgress } from "../lib/progress";
import { DAY, dayKey } from "../lib/progress-model";

export default function Plan() {
  const t = useT();
  const prog = useProgress();
  const [, navigate] = useLocation();
  const [plan, setPlan] = useState<PlanDay[] | null>(null);
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  useEffect(() => {
    import("../data/plan.json").then((m) => setPlan(m.default as unknown as PlanDay[]));
  }, []);

  const start = prog.settings.planStart;
  const status = (id: string) => {
    const e = prog.plan[id];
    return e && e.status !== "cleared" ? e.status : null;
  };
  const today = plan?.find((d) => !status(d.id));
  const dayIndex = start ? Math.floor((new Date(dayKey()).getTime() - new Date(start).getTime()) / DAY) : 0;
  const scheduled = plan?.[Math.min(Math.max(dayIndex, 0), (plan?.length ?? 1) - 1)];
  const behind = today && scheduled && plan ? plan.indexOf(scheduled) - plan.indexOf(today) : 0;
  const doneDays = plan?.filter((d) => status(d.id) === "done").length ?? 0;

  useEffect(() => {
    if (today && openWeek === null) setOpenWeek(today.week);
  }, [today, openWeek]);

  const launchQuiz = (d: PlanDay) => {
    const q = d.quiz;
    if (!q) return;
    if (q.mode === "mock") return navigate("/exam");
    if (q.mode === "lessons") handoff.set({ lessons: q.lessons, count: q.count ?? 15, label: t(d.title) });
    else if (q.mode === "weak") handoff.set({ mode: "weak", count: q.count ?? 15 });
    else handoff.set({ domains: q.domains, count: q.count ?? 25, label: t(d.title) });
    navigate("/practice");
  };

  const weeks = plan ? [...new Set(plan.map((d) => d.week))] : [];

  return (
    <Layout>
      <div className="page">
        <header className="page-head">
          <h1>{t({ en: "8-week study plan", hi: "8 hafte ka study plan" })}</h1>
          <p className="lede">
            {t({
              en: "One focused session a day: lessons, a lab, a quiz, and flashcards. Day 7 of each week is review and a weekly exam; week 8 is mock exams. Miss a day and the plan simply waits for you.",
              hi: "Roz ek focused session: lessons, ek lab, ek quiz, aur flashcards. Har hafte ka din 7 review aur weekly exam ka hai; hafta 8 mock exams ka. Koi din chhoot jaaye toh plan bas tumhara intezaar karta hai.",
            })}
          </p>
        </header>

        <section className="plan-top">
          <label className="setup-group">
            <span className="setup-label">{t({ en: "Plan start date", hi: "Plan shuru hone ki date" })}</span>
            <input type="date" className="text-input" value={start ?? ""} onChange={(e) => progress.setSettings({ planStart: e.target.value || undefined })} />
          </label>
          <div className="plan-stat">
            <b>
              {doneDays}/{plan?.length ?? 56}
            </b>
            <span>{t({ en: "days done", hi: "din complete" })}</span>
            <div className="bar small">
              <span style={{ width: `${(doneDays / (plan?.length ?? 56)) * 100}%` }} />
            </div>
          </div>
          {start && behind > 0 && <p className="plan-behind">{t({ en: `You are ${behind} day(s) behind the dates. Do today's session, or double up on a lighter day.`, hi: `Tum dates se ${behind} din peeche ho. Aaj ka session karo, ya kisi halke din do sessions kar lo.` })}</p>}
          {!start && <p className="muted">{t({ en: "Set a start date to see where you should be. Without one the plan just follows your progress.", hi: "Start date set karo taaki pata chale tumhe kahan hona chahiye. Bina date ke plan sirf tumhari progress follow karta hai." })}</p>}
        </section>

        {today && (
          <section className="plan-today">
            <div className="kicker">{t({ en: "Next up", hi: "Agla" })} · {t({ en: "Week", hi: "Hafta" })} {today.week}, {t({ en: "day", hi: "din" })} {today.day}</div>
            <DayCard day={today} status={null} onQuiz={() => launchQuiz(today)} highlight />
          </section>
        )}

        <section className="plan-weeks">
          {weeks.map((w) => {
            const days = plan!.filter((d) => d.week === w);
            const done = days.filter((d) => status(d.id) === "done").length;
            const isOpen = openWeek === w;
            return (
              <article key={w} className="plan-week">
                <button className="plan-week-head" onClick={() => setOpenWeek(isOpen ? null : w)} aria-expanded={isOpen}>
                  <b>
                    {t({ en: "Week", hi: "Hafta" })} {w}
                  </b>
                  <span className="muted">{t(days[0].title)} …</span>
                  <span className="muted">
                    {done}/{days.length}
                  </span>
                  <ChevronDown size={16} className="outline-chevron" />
                </button>
                {isOpen && (
                  <div className="plan-days">
                    {days.map((d) => (
                      <DayCard key={d.id} day={d} status={status(d.id)} onQuiz={() => launchQuiz(d)} />
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}

function DayCard({ day, status, onQuiz, highlight }: { day: PlanDay; status: "done" | "skipped" | null; onQuiz: () => void; highlight?: boolean }) {
  const t = useT();
  const prog = useProgress();
  const quizLabel =
    day.quiz?.mode === "mock"
      ? t({ en: "Take the mock exam", hi: "Mock exam do" })
      : day.quiz?.mode === "weekly"
        ? t({ en: "Weekly exam", hi: "Weekly exam" })
        : day.quiz?.mode === "weak"
          ? t({ en: "Drill weak spots", hi: "Weak spots ki practice" })
          : t({ en: "Quiz on today's topics", hi: "Aaj ke topics par quiz" });
  return (
    <div className={`day-card ${status ? `is-${status}` : ""} ${highlight ? "is-today" : ""}`}>
      <div className="day-head">
        <span className="day-num">{status === "done" ? <Check size={15} /> : status === "skipped" ? <SkipForward size={14} /> : <CircleDot size={15} />}</span>
        <div>
          <b>
            {t({ en: "Day", hi: "Din" })} {day.day} · {t(day.title)}
          </b>
          <p>{t(day.focus)}</p>
        </div>
      </div>
      <ul className="day-tasks">
        {day.lessons.map((s) => (
          <li key={s}>
            <Link href={`/lesson/${s}`} className={isDone(prog, s) ? "is-done" : ""}>
              {isDone(prog, s) ? <Check size={13} /> : <span className="dot" />} {lessonNumber(s)} {t(lessonMeta(s)?.title)}
            </Link>
          </li>
        ))}
        {day.lab && (
          <li>
            <Link href="/labs">
              <FlaskConical size={13} /> {t({ en: "Packet Tracer lab", hi: "Packet Tracer lab" })} {day.lab.replace("lab-", "")} {prog.labs[`pt:${day.lab}`]?.done ? "✓" : ""}
            </Link>
          </li>
        )}
        {day.drill && (
          <li>
            <Link href="/labs">
              <Repeat size={13} /> {t({ en: "Subnetting drill: 10 questions", hi: "Subnetting drill: 10 questions" })}
            </Link>
          </li>
        )}
        {day.quiz && (
          <li>
            <button className="link-btn" onClick={onQuiz}>
              <ListChecks size={13} /> {quizLabel}
            </button>
          </li>
        )}
        <li>
          <Link href="/flashcards">
            <Repeat size={13} /> {t({ en: "Flashcards due today", hi: "Aaj ke due flashcards" })}
          </Link>
        </li>
      </ul>
      <div className="day-actions">
        {status !== "done" && (
          <button className="btn btn-primary" onClick={() => progress.setPlanDay(day.id, "done")}>
            {t({ en: "Mark day done", hi: "Din complete mark karo" })}
          </button>
        )}
        {!status && (
          <button className="btn btn-ghost" onClick={() => progress.setPlanDay(day.id, "skipped")}>
            {t({ en: "Skip", hi: "Skip" })}
          </button>
        )}
        {status && (
          <button className="btn btn-ghost" onClick={() => progress.setPlanDay(day.id, null)}>
            {t({ en: "Undo", hi: "Undo" })}
          </button>
        )}
      </div>
    </div>
  );
}
