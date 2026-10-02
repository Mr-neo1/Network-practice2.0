// Lazy loading of lesson bodies and scenes: each lesson is its own chunk.

import { useEffect, useState } from "react";
import type { Scene } from "../anim/types";
import { allLessons } from "./curriculum";
import type { Lesson } from "./types";

const lessonModules = import.meta.glob<{ default: Lesson }>("./lessons/*.ts");
const sceneModules = import.meta.glob<{ default: Scene }>("../anim/scenes/*.ts");

const lessonCache = new Map<string, Lesson>();
const sceneCache = new Map<string, Scene>();

export function lessonExists(slug: string) {
  return `./lessons/${slug}.ts` in lessonModules;
}

export async function loadLesson(slug: string): Promise<Lesson | null> {
  const hit = lessonCache.get(slug);
  if (hit) return hit;
  const load = lessonModules[`./lessons/${slug}.ts`];
  if (!load) return null;
  const lesson = (await load()).default;
  lessonCache.set(slug, lesson);
  return lesson;
}

export async function loadScene(id: string): Promise<Scene | null> {
  const hit = sceneCache.get(id);
  if (hit) return hit;
  const load = sceneModules[`../anim/scenes/${id}.ts`];
  if (!load) return null;
  const scene = (await load()).default;
  sceneCache.set(id, scene);
  return scene;
}

/** Every written lesson, in course order. */
export async function loadAllLessons(): Promise<Lesson[]> {
  const list = await Promise.all(allLessons.map((m) => loadLesson(m.slug)));
  return list.filter((l): l is Lesson => l !== null);
}

type Async<T> = { data: T | null; loading: boolean };

function useAsync<T>(key: string, fn: () => Promise<T | null>, cached: T | null | undefined): Async<T> {
  const [state, setState] = useState<Async<T>>({ data: cached ?? null, loading: cached === undefined });
  useEffect(() => {
    let alive = true;
    if (cached !== undefined) {
      setState({ data: cached, loading: false });
      return;
    }
    setState({ data: null, loading: true });
    fn().then(
      (data) => alive && setState({ data, loading: false }),
      () => alive && setState({ data: null, loading: false }),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}

export function useLesson(slug: string) {
  return useAsync(`lesson:${slug}`, () => loadLesson(slug), lessonCache.get(slug));
}

export function useScene(id: string | undefined) {
  return useAsync(`scene:${id}`, () => (id ? loadScene(id) : Promise.resolve(null)), id ? sceneCache.get(id) : null);
}

let allCache: Lesson[] | undefined;
export function useAllLessons() {
  return useAsync(
    "all",
    async () => {
      allCache = await loadAllLessons();
      return allCache;
    },
    allCache,
  );
}
