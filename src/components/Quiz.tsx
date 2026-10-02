import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isCorrect, type QItem, type Response } from "../data/bank";
import { usePrefs, useT } from "../lib/prefs";
import { progress } from "../lib/progress";
import { ui } from "../lib/ui";
import { QuestionCard } from "./QuestionCard";

type Props = {
  items: QItem[];
  /** Label shown above each question (e.g. the lesson it comes from). */
  sourceOf?: (item: QItem) => string | undefined;
  onFinish?: (correct: number, total: number, results: boolean[]) => void;
  onRetry?: () => void;
};

/**
 * Practice quiz with instant feedback. Every answer is recorded for spaced repetition and mastery.
 * Parents pass a new `key` to start a fresh attempt.
 */
export function Quiz({ items, sourceOf, onFinish, onRetry }: Props) {
  const t = useT();
  const { lang } = usePrefs();
  const [responses, setResponses] = useState<Record<number, Response>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const finished = useRef(false);

  const done = items.length > 0 && items.every((_, i) => revealed[i]);
  const results = items.map((q, i) => isCorrect(q, responses[i]));
  const correct = results.filter(Boolean).length;

  useEffect(() => {
    if (done && !finished.current) {
      finished.current = true;
      onFinish?.(correct, items.length, results);
    }
    if (!done) finished.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const reveal = (i: number, r: Response | undefined = responses[i]) => {
    if (revealed[i] || !r) return;
    setRevealed((v) => ({ ...v, [i]: true }));
    progress.recordAnswer(items[i].id, isCorrect(items[i], r), items[i].domain);
  };

  const respond = (i: number, r: Response) => {
    setResponses((s) => ({ ...s, [i]: r }));
    if (items[i].type === "single") reveal(i, r);
  };

  const retry = () => {
    if (onRetry) return onRetry();
    setResponses({});
    setRevealed({});
  };

  return (
    <div className="quiz">
      {items.map((item, i) => (
        <QuestionCard
          key={item.id}
          item={item}
          number={i + 1}
          response={responses[i]}
          onRespond={(r) => respond(i, r)}
          revealed={Boolean(revealed[i])}
          onCheck={() => reveal(i)}
          source={sourceOf?.(item)}
        />
      ))}
      {done && (
        <div className="quiz-result">
          <div>
            <b>
              {t(ui.score)}: {correct} / {items.length}
            </b>
            <span>
              {correct === items.length
                ? lang === "hi"
                  ? "Sab sahi. Badhiya."
                  : "All correct. Well done."
                : lang === "hi"
                  ? "Galat answers ki explanation padho; woh questions review ke liye wapas aayenge."
                  : "Read the explanations for the ones you missed; those questions will come back for review."}
            </span>
          </div>
          <button className="btn btn-ghost" onClick={retry}>
            <RotateCcw size={15} /> {t(ui.tryAgain)}
          </button>
        </div>
      )}
    </div>
  );
}
