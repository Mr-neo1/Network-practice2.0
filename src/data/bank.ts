// One question pool: the 300-question CCNA bank plus every lesson's own quiz.

import { useEffect, useState } from "react";
import { allLessons, lessonMeta } from "../content/curriculum";
import { loadAllLessons } from "../content/load";
import type { Question } from "../content/types";
import { domainForLesson } from "./domains";
import type { BankQuestion, Domain } from "./types";

export type QItem = BankQuestion & { source: "bank" | "lesson" };

export function lessonQuestion(slug: string, q: Question, i: number): QItem {
  const meta = lessonMeta(slug);
  return {
    id: `${slug}#${i}`,
    source: "lesson",
    domain: (meta ? domainForLesson(slug, meta.moduleId) : null) ?? (0 as Domain),
    lesson: slug,
    difficulty: "medium",
    type: "single",
    text: q.q,
    options: q.options,
    answer: [q.answer],
    explanation: q.explain,
  };
}

let cache: QItem[] | null = null;
let pending: Promise<QItem[]> | null = null;

export function loadBank(): Promise<QItem[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= (async () => {
    const files = await Promise.all([import("./questions/d1.json"), import("./questions/d2.json"), import("./questions/d3.json"), import("./questions/d4.json"), import("./questions/d5.json"), import("./questions/d6.json")]);
    const bank = files.flatMap((f) => f.default as unknown as BankQuestion[]);
    const lessons = await loadAllLessons();
    const fromLessons = lessons.flatMap((l) => l.quiz.map((q, i) => lessonQuestion(l.slug, q, i)));
    cache = [...(bank as BankQuestion[]).map((q) => ({ ...q, source: "bank" as const })), ...fromLessons];
    return cache;
  })();
  return pending;
}

export function useBank() {
  const [items, setItems] = useState<QItem[] | null>(cache);
  useEffect(() => {
    if (!cache) loadBank().then(setItems);
  }, []);
  return items;
}

/** Lesson a question belongs to, from its id alone (works before the bank has loaded for lesson questions). */
export function lessonOfQuestion(qid: string): string | undefined {
  const hash = qid.indexOf("#");
  if (hash > 0) return qid.slice(0, hash);
  return cache?.find((q) => q.id === qid)?.lesson;
}

export const ccnaLessonSlugs = allLessons.filter((l) => ["m1", "m2", "m3", "m4", "m5", "m6"].includes(l.moduleId)).map((l) => l.slug);

// ─── Grading ──────────────────────────────────────────────────────────────

export type Response = { kind: "single"; choice: number } | { kind: "multi"; choices: number[] } | { kind: "match"; pairs: Record<number, number> } | { kind: "command"; text: string };

const normCmd = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

export function isCorrect(q: BankQuestion, r: Response | undefined): boolean {
  if (!r) return false;
  switch (q.type) {
    case "single":
      return r.kind === "single" && q.answer?.[0] === r.choice;
    case "multi": {
      if (r.kind !== "multi") return false;
      const want = [...(q.answer ?? [])].sort().join(",");
      return [...r.choices].sort().join(",") === want;
    }
    case "match":
      // Pair i is correct when its right-hand choice is the right side of pair i.
      return r.kind === "match" && (q.pairs ?? []).every((_, i) => r.pairs[i] === i);
    case "command": {
      if (r.kind !== "command") return false;
      const given = normCmd(r.text);
      return [q.commandAnswer ?? "", ...(q.accept ?? [])].some((a) => normCmd(a) === given);
    }
  }
}

export function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
