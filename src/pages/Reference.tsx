import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "../components/Layout";
import { lessonMeta, lessonNumber } from "../content/curriculum";
import { useAllLessons } from "../content/load";
import type { CommandRef } from "../data/types";
import { useT } from "../lib/prefs";
import { plain, rich } from "../lib/rich";
import { ui } from "../lib/ui";

export default function Reference() {
  const t = useT();
  const all = useAllLessons();
  const [tab, setTab] = useState<"ios" | "commands" | "terms">("ios");
  const [ios, setIos] = useState<CommandRef[] | null>(null);
  useEffect(() => {
    import("../data/commands.json").then((m) => setIos(m.default as unknown as CommandRef[]));
  }, []);
  const MODES: Record<string, string> = { user: "User EXEC", priv: "Privileged EXEC", global: "Global config", interface: "Interface config", line: "Line config", vlan: "VLAN config", router: "Router config", other: "Other" };
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  // One row per command; every lesson that uses it is linked.
  const commands = useMemo(() => {
    const seen = new Map<string, { cmd: string; mode: string; does: string; slugs: string[] }>();
    for (const l of all.data ?? []) {
      for (const c of l.commands ?? []) {
        const key = c.cmd.trim().toLowerCase();
        const row = seen.get(key);
        if (!row) seen.set(key, { cmd: c.cmd, mode: c.mode, does: t(c.does), slugs: [l.slug] });
        else if (!row.slugs.includes(l.slug)) row.slugs.push(l.slug);
      }
    }
    return [...seen.values()];
  }, [all.data, t]);

  const terms = useMemo(() => {
    const seen = new Map<string, { term: string; def: string; slug: string }>();
    for (const l of all.data ?? []) for (const term of l.terms) if (!seen.has(term.term.toLowerCase())) seen.set(term.term.toLowerCase(), { term: term.term, def: t(term.def), slug: l.slug });
    return [...seen.values()].sort((a, b) => a.term.localeCompare(b.term));
  }, [all.data, t]);

  const shownCommands = commands.filter((c) => !query || c.cmd.toLowerCase().includes(query) || plain(c.does).toLowerCase().includes(query) || c.mode.toLowerCase().includes(query));
  const shownTerms = terms.filter((x) => !query || x.term.toLowerCase().includes(query) || plain(x.def).toLowerCase().includes(query));

  return (
    <Layout>
      <div className="page">
        <header className="page-head">
          <h1>{t(ui.reference)}</h1>
          <p className="lede">{t({ en: "Every command and key term from the lessons, in one place. Each links back to the lesson that explains it.", hi: "Lessons ke saare commands aur key terms ek jagah. Har ek us lesson se link hai jo use samjhata hai." })}</p>
        </header>
        <div className="ref-bar">
          <div className="segmented">
            <button className={tab === "ios" ? "is-on" : ""} onClick={() => setTab("ios")}>
              {t({ en: "IOS cheat sheet", hi: "IOS cheat sheet" })} ({ios?.length ?? "…"})
            </button>
            <button className={tab === "commands" ? "is-on" : ""} onClick={() => setTab("commands")}>
              {t({ en: "Commands", hi: "Commands" })} ({commands.length})
            </button>
            <button className={tab === "terms" ? "is-on" : ""} onClick={() => setTab("terms")}>
              {t({ en: "Glossary", hi: "Glossary" })} ({terms.length})
            </button>
          </div>
          <input className="text-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t({ en: "Filter…", hi: "Filter karo…" })} aria-label="Filter" />
        </div>
        {all.loading && <p className="muted">{t(ui.loading)}</p>}
        {tab === "ios" && ios && (
          <div className="ios-sheet">
            {[...new Set(ios.map((c) => c.category))].map((cat) => {
              const rows = ios.filter((c) => c.category === cat && (!query || c.cmd.toLowerCase().includes(query) || plain(t(c.desc)).toLowerCase().includes(query)));
              if (!rows.length) return null;
              return (
                <section key={cat} className="ios-cat">
                  <h2 className="h-small">{cat}</h2>
                  {rows.map((c) => (
                    <details key={c.cmd} className="ios-cmd">
                      <summary>
                        <code>{c.cmd}</code>
                        <span className="muted">{MODES[c.mode] ?? c.mode}</span>
                        <span className="ios-desc">{rich(t(c.desc))}</span>
                      </summary>
                      {c.example && <pre className="ios-example">{c.example}</pre>}
                    </details>
                  ))}
                </section>
              );
            })}
          </div>
        )}
        {tab === "commands" && (
          <div className="table-scroll">
            <table className="cmd-table ref-table">
              <thead>
                <tr>
                  <th>Command</th>
                  <th>Mode</th>
                  <th>{t({ en: "What it does", hi: "Kya karta hai" })}</th>
                  <th>{t(ui.lesson)}</th>
                </tr>
              </thead>
              <tbody>
                {shownCommands.map((c) => (
                  <tr key={c.cmd}>
                    <td>
                      <code>{c.cmd}</code>
                    </td>
                    <td className="muted">{c.mode}</td>
                    <td>{rich(c.does)}</td>
                    <td className="lesson-links">
                      {c.slugs.map((slug) => (
                        <Link key={slug} href={`/lesson/${slug}`} title={t(lessonMeta(slug)!.title)}>
                          {lessonNumber(slug)}
                        </Link>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "terms" && (
          <dl className="terms glossary">
            {shownTerms.map((x) => (
              <div key={x.term}>
                <dt>
                  {x.term}{" "}
                  <Link href={`/lesson/${x.slug}`} className="term-link">
                    {lessonNumber(x.slug)}
                  </Link>
                </dt>
                <dd>{rich(x.def)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Layout>
  );
}
