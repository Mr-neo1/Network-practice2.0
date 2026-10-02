// Passing a ready-made quiz request from one page to another (e.g. Plan -> Practice).

import type { Domain } from "../data/types";

export type PracticeRequest = { lessons?: string[]; domains?: Domain[]; count?: number; mode?: "custom" | "weak" | "review"; label?: string };

let pending: PracticeRequest | null = null;

export const handoff = {
  set(r: PracticeRequest) {
    pending = r;
  },
  take(): PracticeRequest | null {
    const r = pending;
    pending = null;
    return r;
  },
};
