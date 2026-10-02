import { Search as SearchIcon, X } from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { allLessons, lessonNumber } from "../content/curriculum";
import { useAllLessons } from "../content/load";
import { usePrefs, useT } from "../lib/prefs";
import { plain } from "../lib/rich";
import { ui } from "../lib/ui";

type Hit = { kind: "lesson" | "term" | "command"; title: string; detail: string; slug: string; score: number };

function score(hay: string, q: string) {
  const h = hay.toLowerCase();
  if (h.startsWith(q)) return 3;
  if (h.includes(` ${q}`)) return 2;
  if (h.includes(q)) return 1;
  return 0;
}

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const t = useT();
  const { lang } = usePrefs();
  const [, navigate] = useLocation();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const all = useAllLessons();

  useEffect(() => inputRef.current?.focus(), []);

  const hits = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [] as Hit[];
    const out: Hit[] = [];
    for (const m of allLessons) {
      const s = Math.max(score(m.title.en, query), score(m.title.hi, query)) * 2 + Math.max(score(m.summary.en, query), score(m.summary.hi, query));
      if (s) out.push({ kind: "lesson", title: `${lessonNumber(m.slug)}  ${t(m.title)}`, detail: t(m.summary), slug: m.slug, score: s + 4 });
    }
    for (const lesson of all.data ?? []) {
      for (const term of lesson.terms) {
        const s = score(term.term, query);
        if (s) out.push({ kind: "term", title: term.term, detail: plain(term.def[lang]), slug: lesson.slug, score: s + 1 });
      }
      for (const c of lesson.commands ?? []) {
        const s = score(c.cmd, query);
        if (s) out.push({ kind: "command", title: c.cmd, detail: plain(t(c.does)), slug: lesson.slug, score: s });
      }
    }
    const seen = new Set<string>();
    return out
      .sort((a, b) => b.score - a.score)
      .filter((h) => {
        const k = `${h.kind}:${h.title.toLowerCase()}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 24);
  }, [q, all.data, t, lang]);

  useEffect(() => setSel(0), [q]);

  const go = (h: Hit) => {
    navigate(`/lesson/${h.slug}`);
    onClose();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(hits.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter" && hits[sel]) go(hits[sel]);
  };

  const kindLabel = { lesson: lang === "hi" ? "Lesson" : "Lesson", term: lang === "hi" ? "Term" : "Term", command: lang === "hi" ? "Command" : "Command" };

  return (
    <div className="search-backdrop" onMouseDown={onClose}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <div className="search-input">
          <SearchIcon size={18} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(ui.search)} />
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </div>
        <ul className="search-results">
          {hits.map((h, i) => (
            <li key={`${h.kind}${h.title}${h.slug}`}>
              <button className={i === sel ? "is-sel" : ""} onMouseEnter={() => setSel(i)} onClick={() => go(h)}>
                <span className={`search-kind kind-${h.kind}`}>{kindLabel[h.kind]}</span>
                <span className="search-title">{h.title}</span>
                <span className="search-detail">{h.detail}</span>
              </button>
            </li>
          ))}
          {q.trim() && hits.length === 0 && <li className="search-empty">{lang === "hi" ? "Kuch nahi mila. Doosra word try karo, jaise “VLAN” ya “port 53”." : "Nothing found. Try another word, like “VLAN” or “port 53”."}</li>}
          {!q.trim() && <li className="search-empty">{lang === "hi" ? "Jaise: OSPF, subnet, trunk, show ip route" : "For example: OSPF, subnet, trunk, show ip route"}</li>}
        </ul>
      </div>
    </div>
  );
}
