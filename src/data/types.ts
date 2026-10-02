// Practice data shared across the app: question bank, flashcards, Packet Tracer labs,
// command reference and the study plan. Text is bilingual (L); an empty `hi` falls back to English.

import type { L } from "../content/types.ts";

export type Domain = 1 | 2 | 3 | 4 | 5 | 6;

export type BankQuestion = {
  id: string;
  domain: Domain;
  /** Lesson that teaches this. */
  lesson: string;
  difficulty: "easy" | "medium" | "hard";
  type: "single" | "multi" | "match" | "command";
  text: L;
  explanation: L;
  /** single / multi */
  options?: L[];
  answer?: number[];
  /** Why each option is wrong, aligned with options ("" for correct ones). */
  whyWrong?: L[];
  /** match */
  pairs?: { left: L; right: L }[];
  /** command: the canonical answer plus accepted abbreviations */
  commandAnswer?: string;
  accept?: string[];
};

export type Flashcard = { id: string; domain: Domain; tag: string; front: L; back: L };

export type PtLab = {
  id: string;
  week: number | null;
  day: string | null;
  title: L;
  objective: L;
  topology: string;
  tasks: L[];
  verify: L[];
  note: L;
  lessons: string[];
};

export type CommandRef = { cmd: string; mode: string; category: string; desc: L; example: string };

/** mode: "lessons" (quiz on lessons), "weekly" (domains), "weak", or "mock" (full exam). */
export type PlanQuiz = { mode: string; lessons?: string[]; domains?: Domain[]; count?: number };

export type PlanDay = {
  id: string;
  week: number;
  day: number;
  title: L;
  focus: L;
  lessons: string[];
  lab: string | null;
  drill: string | null;
  quiz: PlanQuiz | null;
  review: boolean;
  examDay: boolean;
};
