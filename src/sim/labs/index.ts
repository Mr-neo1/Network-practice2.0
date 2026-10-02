// Every CLI lab in this folder, in a sensible order (level, then lesson order).

import { allLessons } from "../../content/curriculum";
import type { CliLab } from "../lab";

const mods = import.meta.glob<{ default: CliLab }>(["./*.ts", "!./index.ts", "!./*.test.ts"], { eager: true });

const levelRank = { beginner: 0, intermediate: 1, advanced: 2 };
const lessonRank = (lab: CliLab) => Math.min(...lab.lessons.map((s) => allLessons.findIndex((l) => l.slug === s)).filter((i) => i >= 0), 999);

export const cliLabs: CliLab[] = Object.values(mods)
  .map((m) => m.default)
  .sort((a, b) => levelRank[a.level] - levelRank[b.level] || lessonRank(a) - lessonRank(b));

export function cliLab(id: string) {
  return cliLabs.find((l) => l.id === id);
}
