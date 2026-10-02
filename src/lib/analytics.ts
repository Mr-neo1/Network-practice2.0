// Numbers for the progress page, all derived from Progress. Nothing here is stored.

import { DOMAINS } from "../data/domains.ts";
import { DAY, dayKey, isDone, type Progress } from "./progress-model.ts";

/** Consecutive days with any study time, ending today (or yesterday if today has none yet). */
export function streak(p: Progress, now = Date.now()) {
  let n = 0;
  let t = now;
  if (!(p.activity[dayKey(t)] > 0)) t -= DAY;
  while (p.activity[dayKey(t)] > 0) {
    n++;
    t -= DAY;
  }
  return n;
}

export function minutesBetween(p: Progress, from: number, to: number) {
  let total = 0;
  for (let t = from; t <= to; t += DAY) total += p.activity[dayKey(t)] ?? 0;
  return Math.round(total);
}

export function totalMinutes(p: Progress) {
  return Math.round(Object.values(p.activity).reduce((a, b) => a + b, 0));
}

/** Last `weeks` weeks of daily minutes, Monday-first columns, oldest first. */
export function heatmap(p: Progress, weeks = 18, now = Date.now()) {
  const today = new Date(now);
  const dow = (today.getDay() + 6) % 7; // Monday = 0
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dow - (weeks - 1) * 7);
  const cols: { date: string; minutes: number; future: boolean }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
      const key = dayKey(day);
      col.push({ date: key, minutes: Math.round(p.activity[key] ?? 0), future: day.getTime() > now });
    }
    cols.push(col);
  }
  return cols;
}

export type DomainScore = { id: number; accuracy: number; answered: number; mastery: number };

/**
 * Mastery per exam domain. Accuracy on questions in that domain, scaled by how much of the domain
 * you have actually practised: 2 right answers out of 2 is not mastery. Full credit needs 40 answers.
 */
export function domainScores(p: Progress): DomainScore[] {
  const acc = new Map<number, { seen: number; right: number; unique: number }>();
  for (const a of Object.values(p.answers)) {
    if (!a.d) continue;
    const s = acc.get(a.d) ?? { seen: 0, right: 0, unique: 0 };
    s.seen += a.seen;
    s.right += a.right;
    s.unique += 1;
    acc.set(a.d, s);
  }
  return DOMAINS.map((d) => {
    const s = acc.get(d.id) ?? { seen: 0, right: 0, unique: 0 };
    const accuracy = s.seen ? s.right / s.seen : 0;
    const coverage = Math.min(1, s.unique / 40);
    return { id: d.id, accuracy: Math.round(accuracy * 100), answered: s.unique, mastery: Math.round(accuracy * coverage * 100) };
  });
}

/** Exam readiness: domain mastery weighted by the official exam weights (0-100). */
export function readiness(p: Progress) {
  const scores = domainScores(p);
  return Math.round(scores.reduce((sum, s) => sum + (s.mastery * (DOMAINS.find((d) => d.id === s.id)!.weight)) / 100, 0));
}

export function exams(p: Progress) {
  return p.sessions.filter((s) => s.kind === "exam");
}

/** The "book your exam" check, from the original CCNA Sprint: all three must hold. */
export function readyToBook(p: Progress, ccnaLessons: string[]) {
  const lessonsDone = ccnaLessons.filter((s) => isDone(p, s)).length / Math.max(1, ccnaLessons.length);
  const mocks = exams(p).filter((e) => e.total >= 50).slice(-2);
  const mocksOk = mocks.length === 2 && mocks.every((m) => m.correct / m.total >= 0.85);
  const domainsOk = domainScores(p).every((d) => d.mastery >= 75);
  const lessonsOk = lessonsDone >= 0.9;
  return { ready: lessonsOk && mocksOk && domainsOk, lessonsOk, lessonsDone, mocksOk, mocks, domainsOk };
}

/** Lessons whose questions you get wrong most (needs at least 3 answers). */
export function weakLessons(p: Progress, lessonOf: (qid: string) => string | undefined, n = 5) {
  const by = new Map<string, { seen: number; right: number }>();
  for (const [qid, a] of Object.entries(p.answers)) {
    const slug = lessonOf(qid);
    if (!slug) continue;
    const s = by.get(slug) ?? { seen: 0, right: 0 };
    s.seen += a.seen;
    s.right += a.right;
    by.set(slug, s);
  }
  return [...by.entries()]
    .filter(([, s]) => s.seen >= 3)
    .map(([slug, s]) => ({ slug, accuracy: Math.round((s.right / s.seen) * 100), seen: s.seen }))
    .filter((x) => x.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, n);
}

export function dueQuestionIds(p: Progress, now = Date.now()) {
  return Object.entries(p.answers)
    .filter(([, a]) => a.due > 0 && a.due <= now && a.stage >= 0 && a.stage < 3)
    .map(([id]) => id);
}

export function dueCardIds(p: Progress, now = Date.now()) {
  return Object.entries(p.cards)
    .filter(([, c]) => c.due <= now)
    .map(([id]) => id);
}
