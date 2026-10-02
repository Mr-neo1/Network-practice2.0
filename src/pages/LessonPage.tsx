import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Player } from "../anim/Player";
import { BlockView } from "../components/Blocks";
import { Layout } from "../components/Layout";
import { Quiz } from "../components/Quiz";
import { VideoPanel } from "../components/VideoPanel";
import { lessonMeta, lessonNumber, moduleOf, neighbours } from "../content/curriculum";
import { useLesson, useScene } from "../content/load";
import { useT } from "../lib/prefs";
import { isDone, progress, useProgress } from "../lib/progress";
import { lessonQuestion } from "../data/bank";
import { rich } from "../lib/rich";
import { ui } from "../lib/ui";
import NotFound from "./NotFound";

export default function LessonPage({ slug }: { slug: string }) {
  const t = useT();
  const meta = lessonMeta(slug);
  const mod = moduleOf(slug);
  const lesson = useLesson(slug);
  const scene = useScene(meta?.scene);
  const prog = useProgress();
  const { prev, next } = neighbours(slug);
  const done = isDone(prog, slug);

  useEffect(() => {
    if (meta) progress.visit(slug);
  }, [slug, meta]);

  useEffect(() => {
    if (meta) document.title = `${lessonNumber(slug)} ${meta.title.en} · Network Zero2Hero`;
    return () => {
      document.title = "Network Zero2Hero · CCNA from zero";
    };
  }, [slug, meta]);

  const quizItems = useMemo(() => (lesson.data?.quiz ?? []).map((q, i) => lessonQuestion(slug, q, i)), [lesson.data, slug]);

  const toc = useMemo(() => {
    const l = lesson.data;
    if (!l) return [];
    const items: { id: string; label: string }[] = [];
    if (scene.data) items.push({ id: "animation", label: t(ui.animation) });
    if (l.videos.length) items.push({ id: "watch", label: t(ui.watch) });
    l.sections.forEach((s) => items.push({ id: s.id, label: t(s.heading) }));
    if (l.commands?.length) items.push({ id: "commands", label: t(ui.commands) });
    items.push({ id: "mistakes", label: t(ui.mistakes) });
    items.push({ id: "recap", label: t(ui.recap) });
    if (l.lab) items.push({ id: "lab", label: t(ui.lab) });
    items.push({ id: "quiz", label: t(ui.quiz) });
    return items;
  }, [lesson.data, scene.data, t]);

  if (!meta || !mod) return <NotFound />;

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const score = prog.quiz[slug];

  return (
    <Layout outlineFor={slug}>
      <div className="lesson-grid">
        <article className="lesson">
          <header className="lesson-head">
            <Link href="/" className="crumb">
              {t(ui.module)} {mod.num} · {t(mod.title)}
            </Link>
            <h1>{t(meta.title)}</h1>
            <div className="lesson-meta">
              <span>
                {t(ui.lesson)} {lessonNumber(slug)}
              </span>
              <span>
                <Clock size={14} /> {meta.minutes} {t(ui.minutes)}
              </span>
              {meta.exam && <span>CCNA {meta.exam}</span>}
              {done && (
                <span className="meta-done">
                  <CheckCircle2 size={14} /> {t(ui.completed)}
                </span>
              )}
            </div>
          </header>

          {lesson.loading && <div className="loading">{t(ui.loading)}</div>}

          {!lesson.loading && !lesson.data && (
            <div className="pending-note">
              <p>{t(ui.notWritten)}</p>
              <p className="muted">{t(meta.summary)}</p>
            </div>
          )}

          {lesson.data && (
            <>
              <p className="lede">{rich(t(lesson.data.intro))}</p>
              <section className="outcomes">
                <h2 className="h-small">{t(ui.youWillBeAble)}</h2>
                <ul>
                  {lesson.data.outcomes.map((o, i) => (
                    <li key={i}>{rich(t(o))}</li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {scene.data && (
            <section id="animation" className="lesson-anim">
              <Player scene={scene.data} />
            </section>
          )}

          {lesson.data && (
            <>
              {lesson.data.videos.length > 0 && (
                <section id="watch" className="lesson-section">
                  <h2>{t(ui.watch)}</h2>
                  <VideoPanel videos={lesson.data.videos} />
                </section>
              )}

              {lesson.data.sections.map((s) => (
                <section key={s.id} id={s.id} className="lesson-section">
                  <h2>{t(s.heading)}</h2>
                  {s.blocks.map((b, i) => (
                    <BlockView key={i} block={b} />
                  ))}
                </section>
              ))}

              {lesson.data.commands && lesson.data.commands.length > 0 && (
                <section id="commands" className="lesson-section">
                  <h2>{t(ui.commands)}</h2>
                  <div className="table-scroll">
                    <table className="cmd-table">
                      <thead>
                        <tr>
                          <th>Command</th>
                          <th>Mode</th>
                          <th>{t({ en: "What it does", hi: "Kya karta hai" })}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lesson.data.commands.map((c) => (
                          <tr key={c.cmd + c.mode}>
                            <td>
                              <code>{c.cmd}</code>
                            </td>
                            <td className="muted">{c.mode}</td>
                            <td>{rich(t(c.does))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <section id="terms" className="lesson-section">
                <h2>{t(ui.terms)}</h2>
                <dl className="terms">
                  {lesson.data.terms.map((term) => (
                    <div key={term.term}>
                      <dt>{term.term}</dt>
                      <dd>{rich(t(term.def))}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section id="mistakes" className="lesson-section">
                <h2>{t(ui.mistakes)}</h2>
                <ul className="mistakes">
                  {lesson.data.mistakes.map((m, i) => (
                    <li key={i}>{rich(t(m))}</li>
                  ))}
                </ul>
              </section>

              <section id="recap" className="lesson-section recap">
                <h2>{t(ui.recap)}</h2>
                <ul>
                  {lesson.data.recap.map((m, i) => (
                    <li key={i}>{rich(t(m))}</li>
                  ))}
                </ul>
              </section>

              {lesson.data.lab && (
                <section id="lab" className="lesson-section lab">
                  <h2>
                    {t(ui.lab)}: {t(lesson.data.lab.title)}
                  </h2>
                  <ol className="steps">
                    {lesson.data.lab.steps.map((s, i) => (
                      <li key={i}>{rich(t(s))}</li>
                    ))}
                  </ol>
                </section>
              )}

              <section id="quiz" className="lesson-section">
                <h2>{t(ui.quiz)}</h2>
                {score && (
                  <p className="muted">
                    {t({ en: "Best so far", hi: "Ab tak ka best" })}: {score.best}/{score.total}
                  </p>
                )}
                <Quiz
                  key={slug}
                  items={quizItems}
                  onFinish={(correct, total) => {
                    progress.recordQuiz(slug, correct, total);
                    progress.recordSession({ kind: "lesson", label: `${lessonNumber(slug)} ${meta.title.en}`, total, correct, seconds: 0 });
                  }}
                />
              </section>

              <section className="finish">
                <button className={`btn ${done ? "btn-ghost" : "btn-primary"}`} onClick={() => progress.setDone(slug, !done)}>
                  {done ? <CheckCircle2 size={17} /> : <Circle size={17} />} {done ? t(ui.completed) : t(ui.markComplete)}
                </button>
              </section>
            </>
          )}

          <nav className="pager" aria-label="Lesson navigation">
            {prev ? (
              <Link href={`/lesson/${prev.slug}`} className="pager-link">
                <ArrowLeft size={16} />
                <span>
                  <small>{t(ui.previous)}</small>
                  {lessonNumber(prev.slug)} {t(prev.title)}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/lesson/${next.slug}`} className="pager-link is-next">
                <span>
                  <small>{t(ui.next)}</small>
                  {lessonNumber(next.slug)} {t(next.title)}
                </span>
                <ArrowRight size={16} />
              </Link>
            )}
          </nav>
        </article>

        {toc.length > 0 && (
          <aside className="toc" aria-label={t(ui.onThisPage)}>
            <div className="toc-title">{t(ui.onThisPage)}</div>
            <ul>
              {toc.map((i) => (
                <li key={i.id}>
                  <button onClick={() => jump(i.id)}>{i.label}</button>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </Layout>
  );
}
