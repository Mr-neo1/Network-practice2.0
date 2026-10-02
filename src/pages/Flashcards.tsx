import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { DOMAINS } from "../data/domains";
import type { Flashcard } from "../data/types";
import { usePrefs, useT } from "../lib/prefs";
import { progress, useProgress } from "../lib/progress";
import { rich } from "../lib/rich";

const NEW_PER_SESSION = 20;

export default function Flashcards() {
  const t = useT();
  const { lang } = usePrefs();
  const prog = useProgress();
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [deck, setDeck] = useState<number>(0);
  const [queue, setQueue] = useState<string[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    import("../data/flashcards.json").then((m) => setCards(m.default as unknown as Flashcard[]));
  }, []);

  const inDeck = useMemo(() => (cards ?? []).filter((c) => !deck || c.domain === deck), [cards, deck]);
  const now = Date.now();
  const due = inDeck.filter((c) => prog.cards[c.id] && prog.cards[c.id].due <= now);
  const fresh = inDeck.filter((c) => !prog.cards[c.id]);
  const learned = inDeck.filter((c) => prog.cards[c.id] && prog.cards[c.id].reps >= 2).length;

  const start = () => {
    setQueue([...due.map((c) => c.id), ...fresh.slice(0, NEW_PER_SESSION).map((c) => c.id)]);
    setFlipped(false);
    setReviewed(0);
  };

  const current = queue?.length ? cards!.find((c) => c.id === queue[0]) : undefined;

  const grade = (g: 0 | 1 | 2 | 3) => {
    if (!current || !queue) return;
    progress.reviewCard(current.id, g);
    // "Again" puts the card back near the end of this session.
    const rest = queue.slice(1);
    setQueue(g === 0 ? [...rest.slice(0, 5), current.id, ...rest.slice(5)] : rest);
    setFlipped(false);
    setReviewed((r) => r + 1);
  };

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && ["1", "2", "3", "4"].includes(e.key)) grade((Number(e.key) - 1) as 0 | 1 | 2 | 3);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const GRADES: { g: 0 | 1 | 2 | 3; label: { en: string; hi: string }; cls: string }[] = [
    { g: 0, label: { en: "Again", hi: "Phir se" }, cls: "g-again" },
    { g: 1, label: { en: "Hard", hi: "Mushkil" }, cls: "g-hard" },
    { g: 2, label: { en: "Good", hi: "Theek" }, cls: "g-good" },
    { g: 3, label: { en: "Easy", hi: "Aasaan" }, cls: "g-easy" },
  ];

  return (
    <Layout>
      <div className="page narrow-wide">
        <header className="page-head">
          <h1>{t({ en: "Flashcards", hi: "Flashcards" })}</h1>
          <p className="lede">
            {t({
              en: "Ports, timers, defaults and commands: the facts the exam expects you to know cold. Cards you find hard come back sooner (SM-2 spaced repetition). Ten minutes a day is enough.",
              hi: "Ports, timers, defaults aur commands: woh facts jo exam mein turant yaad hone chahiye. Jo cards mushkil lagte hain woh jaldi wapas aate hain (SM-2 spaced repetition). Roz das minute kaafi hain.",
            })}
          </p>
        </header>

        {!queue?.length && (
          <section className="setup">
            {queue && reviewed > 0 && (
              <p className="ok-text">
                {t({ en: "Session done.", hi: "Session ho gaya." })} {reviewed} {lang === "hi" ? "cards review kiye." : "cards reviewed."}
              </p>
            )}
            <div className="setup-group">
              <div className="setup-label">{t({ en: "Deck", hi: "Deck" })}</div>
              <div className="chips">
                <button className={`chip ${deck === 0 ? "is-on" : ""}`} onClick={() => setDeck(0)}>
                  {t({ en: "All domains", hi: "Saare domains" })}
                </button>
                {DOMAINS.map((d) => (
                  <button key={d.id} className={`chip ${deck === d.id ? "is-on" : ""}`} onClick={() => setDeck(d.id)}>
                    {d.id}. {t(d.name)}
                  </button>
                ))}
              </div>
            </div>
            <dl className="facts small-facts">
              <div>
                <dt>{due.length}</dt>
                <dd>{t({ en: "due now", hi: "abhi due" })}</dd>
              </div>
              <div>
                <dt>{Math.min(fresh.length, NEW_PER_SESSION)}</dt>
                <dd>{t({ en: "new this session", hi: "is session mein naye" })}</dd>
              </div>
              <div>
                <dt>
                  {learned}/{inDeck.length}
                </dt>
                <dd>{t({ en: "learned", hi: "yaad ho gaye" })}</dd>
              </div>
            </dl>
            <div className="setup-go">
              <button className="btn btn-primary" onClick={start} disabled={!cards || due.length + fresh.length === 0}>
                {t({ en: "Start reviewing", hi: "Review shuru karo" })}
              </button>
              {cards && due.length + fresh.length === 0 && <span className="muted">{t({ en: "Nothing due. Come back tomorrow.", hi: "Kuch due nahi. Kal wapas aao." })}</span>}
            </div>
          </section>
        )}

        {current && (
          <section className="fc-session">
            <div className="session-head">
              <span className="muted">
                {queue!.length} {t({ en: "left", hi: "baaki" })} · {t(DOMAINS.find((d) => d.id === current.domain)!.name)}
              </span>
              <button className="btn btn-ghost" onClick={() => setQueue(null)}>
                <RotateCcw size={15} /> {t({ en: "Stop", hi: "Roko" })}
              </button>
            </div>
            <button className={`fc-card ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped((f) => !f)} aria-live="polite">
              <span className="fc-side">{flipped ? t({ en: "Answer", hi: "Answer" }) : t({ en: "Question", hi: "Question" })}</span>
              <span className="fc-text">{rich(t(flipped ? current.back : current.front))}</span>
              {!flipped && <span className="fc-hint muted">{t({ en: "Think of the answer, then tap or press Space", hi: "Answer socho, phir tap karo ya Space dabao" })}</span>}
            </button>
            {flipped && (
              <div className="fc-grades">
                {GRADES.map((g) => (
                  <button key={g.g} className={`btn btn-ghost ${g.cls}`} onClick={() => grade(g.g)}>
                    <kbd>{g.g + 1}</kbd> {t(g.label)}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
}
