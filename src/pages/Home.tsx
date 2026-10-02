import { ArrowRight, BarChart3, BookOpen, CalendarDays, CheckCircle2, Clapperboard, Clock, Layers, ListChecks, PlayCircle, Terminal } from "lucide-react";
import { Link } from "wouter";
import { allLessons, lessonMeta, lessonNumber, modules } from "../content/curriculum";
import { Layout } from "../components/Layout";
import { useT } from "../lib/prefs";
import { isDone, useProgress } from "../lib/progress";
import { ui } from "../lib/ui";

const levelName = {
  zero: { en: "Foundations", hi: "Foundations" },
  ccna: { en: "CCNA", hi: "CCNA" },
  expert: { en: "Beyond CCNA", hi: "CCNA ke aage" },
};

export default function Home() {
  const t = useT();
  const prog = useProgress();
  const doneCount = allLessons.filter((l) => isDone(prog, l.slug)).length;
  const pct = Math.round((doneCount / allLessons.length) * 100);
  const nextUp = allLessons.find((l) => !isDone(prog, l.slug));
  const resume = prog.last && !isDone(prog, prog.last) ? lessonMeta(prog.last) : nextUp;
  const started = doneCount > 0 || Boolean(prog.last);
  const totalMinutes = allLessons.reduce((s, l) => s + l.minutes, 0);

  return (
    <Layout>
      <div className="home">
        <section className="intro">
          <p className="kicker">Cisco CCNA 200-301 · v1.1</p>
          <h1>{t({ en: "Learn networking from zero to CCNA, and past it.", hi: "Networking zero se CCNA tak seekho, aur usse aage bhi." })}</h1>
          <p className="lede">
            {t({
              en: "Each lesson explains one topic in plain English or in Hinglish, shows it working in a step-by-step animation, points you to a good video in English and in Hindi, and ends with questions that check you really understood. New to networking? Start at lesson 0.1. Already know the basics? Jump to any module.",
              hi: "Har lesson ek topic ko simple English ya Hinglish mein samjhata hai, use step-by-step animation mein chalta hua dikhata hai, English aur Hindi dono mein ek achha video batata hai, aur end mein questions se check karta hai ki baat sach mein samajh aayi. Networking bilkul naya hai? Lesson 0.1 se shuru karo. Basics aate hain? Seedha kisi bhi module par jao.",
            })}
          </p>
          <div className="intro-actions">
            {resume && (
              <Link href={`/lesson/${resume.slug}`} className="btn btn-primary">
                {started ? `${t(ui.continue)}: ${lessonNumber(resume.slug)} ${t(resume.title)}` : t(ui.start)} <ArrowRight size={17} />
              </Link>
            )}
            <Link href="/practice" className="btn btn-ghost">
              {t({ en: "Practice questions", hi: "Practice questions" })}
            </Link>
          </div>
          <dl className="facts">
            <div>
              <dt>{allLessons.length}</dt>
              <dd>{t({ en: "lessons in 8 modules", hi: "lessons, 8 modules mein" })}</dd>
            </div>
            <div>
              <dt>~{Math.round(totalMinutes / 60)} h</dt>
              <dd>{t({ en: "of reading and animations", hi: "reading aur animations" })}</dd>
            </div>
            <div>
              <dt>2</dt>
              <dd>{t({ en: "languages: English, Hinglish", hi: "bhashayein: English, Hinglish" })}</dd>
            </div>
          </dl>
          {started && (
            <div className="overall">
              <div className="overall-row">
                <span>{t(ui.progress)}</span>
                <span>
                  {doneCount} / {allLessons.length} · {pct}%
                </span>
              </div>
              <div className="bar">
                <span style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </section>

        <section className="how" aria-label="How lessons work">
          <div>
            <BookOpen size={20} />
            <h3>{t({ en: "Read", hi: "Padho" })}</h3>
            <p>{t({ en: "Short sections with real addresses and real Cisco commands. Switch between English and Hinglish at the top, any time.", hi: "Chhote sections, real addresses aur real Cisco commands ke saath. Upar se kabhi bhi English aur Hinglish ke beech switch karo." })}</p>
          </div>
          <div>
            <PlayCircle size={20} />
            <h3>{t({ en: "See it happen", hi: "Hote hue dekho" })}</h3>
            <p>{t({ en: "Every topic has its own animation: packets moving, tables filling, ports blocking. Step through it at your own pace.", hi: "Har topic ka apna animation hai: packets chalte hue, tables bharti hui, ports block hote hue. Apni speed se step by step dekho." })}</p>
          </div>
          <div>
            <Clapperboard size={20} />
            <h3>{t({ en: "Watch", hi: "Video dekho" })}</h3>
            <p>{t({ en: "Hand-picked YouTube videos for the exact topic, from Jeremy's IT Lab in English and Hindi channels like Network Nuggets.", hi: "Usi topic ke chune hue YouTube videos: English mein Jeremy's IT Lab, aur Hindi mein Network Nuggets jaise channels." })}</p>
          </div>
          <div>
            <ListChecks size={20} />
            <h3>{t({ en: "Check yourself", hi: "Khud ko check karo" })}</h3>
            <p>{t({ en: "Six questions per lesson with explanations, plus a practice mode that mixes topics and brings back the ones you got wrong.", hi: "Har lesson mein explanation ke saath chhe questions, aur ek practice mode jo topics mix karta hai aur galat hue questions wapas laata hai." })}</p>
          </div>
        </section>

        <section className="tools" aria-label="Study tools">
          <h2>{t({ en: "Everything else you need", hi: "Baaki sab jo chahiye" })}</h2>
          <div className="tool-grid">
            <Link href="/plan">
              <CalendarDays size={19} />
              <b>{t({ en: "8-week plan", hi: "8 hafte ka plan" })}</b>
              <span>{t({ en: "A daily schedule of lessons, labs, quizzes and reviews.", hi: "Roz ka schedule: lessons, labs, quizzes aur review." })}</span>
            </Link>
            <Link href="/labs">
              <Terminal size={19} />
              <b>{t({ en: "30 CLI labs", hi: "30 CLI labs" })}</b>
              <span>{t({ en: "Configure real IOS in the browser; tasks check themselves.", hi: "Browser mein real IOS configure karo; tasks khud check hote hain." })}</span>
            </Link>
            <Link href="/exam">
              <Clock size={19} />
              <b>{t({ en: "Exam simulator", hi: "Exam simulator" })}</b>
              <span>{t({ en: "100 questions in 120 minutes, weighted like the real exam.", hi: "120 minute mein 100 questions, real exam jaise weight." })}</span>
            </Link>
            <Link href="/flashcards">
              <Layers size={19} />
              <b>{t({ en: "210 flashcards", hi: "210 flashcards" })}</b>
              <span>{t({ en: "Ports, timers and defaults with spaced repetition.", hi: "Ports, timers aur defaults, spaced repetition ke saath." })}</span>
            </Link>
            <Link href="/progress">
              <BarChart3 size={19} />
              <b>{t({ en: "Progress tracker", hi: "Progress tracker" })}</b>
              <span>{t({ en: "Readiness by domain, streak, study time and weak spots.", hi: "Domain-wise readiness, streak, study time aur weak spots." })}</span>
            </Link>
          </div>
        </section>

        <section className="path" aria-label="Course">
          <h2>{t({ en: "The course", hi: "Course" })}</h2>
          {modules.map((m) => {
            const done = m.lessons.filter((l) => isDone(prog, l.slug)).length;
            const minutes = m.lessons.reduce((s, l) => s + l.minutes, 0);
            return (
              <article key={m.id} className={`module-card level-${m.level}`}>
                <header>
                  <div className="module-num">{m.num}</div>
                  <div className="module-headings">
                    <div className="module-kicker">
                      {t(levelName[m.level])}
                      {m.domain ? ` · ${m.domain}` : ""}
                    </div>
                    <h3>{t(m.title)}</h3>
                    <p>{t(m.blurb)}</p>
                  </div>
                  <div className="module-stats">
                    <span>
                      {done}/{m.lessons.length} {t(ui.lessons)}
                    </span>
                    <span>~{Math.round(minutes / 6) / 10} h</span>
                    <div className="bar small">
                      <span style={{ width: `${(done / m.lessons.length) * 100}%` }} />
                    </div>
                  </div>
                </header>
                <ol className="module-lessons">
                  {m.lessons.map((l) => {
                    const lessonDone = isDone(prog, l.slug);
                    return (
                      <li key={l.slug}>
                        <Link href={`/lesson/${l.slug}`} className={lessonDone ? "is-done" : ""}>
                          <span className="ml-num">{lessonDone ? <CheckCircle2 size={16} /> : lessonNumber(l.slug)}</span>
                          <span className="ml-title">{t(l.title)}</span>
                          <span className="ml-min">
                            {l.minutes} {t(ui.minutes)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </article>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}
