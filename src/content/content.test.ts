import { describe, expect, it } from "vitest";
import type { Scene } from "../anim/types";
import { allLessons, modules } from "./curriculum";
import type { Lesson } from "./types";
import { validateLesson, validateScene } from "./validate";

const lessons = import.meta.glob<{ default: Lesson }>("./lessons/*.ts", { eager: true });
const scenes = import.meta.glob<{ default: Scene }>("../anim/scenes/*.ts", { eager: true });

describe("curriculum", () => {
  it("has unique lesson slugs and module ids", () => {
    const slugs = allLessons.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(modules.map((m) => m.id)).size).toBe(modules.length);
  });

  it("has no files that are not in the outline", () => {
    const known = new Set(allLessons.map((l) => l.slug));
    const stray = Object.keys(lessons)
      .map((p) => p.replace("./lessons/", "").replace(".ts", ""))
      .filter((s) => !known.has(s));
    expect(stray).toEqual([]);
  });
});

describe.each(allLessons.filter((m) => `./lessons/${m.slug}.ts` in lessons))("lesson $slug", (meta) => {
  it("passes validation", () => {
    const report = validateLesson(lessons[`./lessons/${meta.slug}.ts`].default, meta);
    expect(report.errors).toEqual([]);
  });

  it("has a valid scene", () => {
    const mod = scenes[`../anim/scenes/${meta.scene}.ts`];
    expect(mod, `scene ${meta.scene} missing`).toBeDefined();
    expect(validateScene(mod.default, meta.scene).errors).toEqual([]);
  });

  it("has quiz answers that point at real options", () => {
    for (const q of lessons[`./lessons/${meta.slug}.ts`].default.quiz) expect(q.options[q.answer]).toBeDefined();
  });
});
