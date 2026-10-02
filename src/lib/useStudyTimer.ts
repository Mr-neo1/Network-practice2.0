import { useEffect } from "react";
import { progress } from "./progress";

const TICK_MS = 30_000;
const IDLE_MS = 120_000;

/**
 * Counts study time: half a minute for every 30 seconds the tab is visible and you have
 * scrolled, typed or clicked in the last two minutes. Idle tabs don't count.
 */
export function useStudyTimer() {
  useEffect(() => {
    let lastActive = Date.now();
    const mark = () => {
      lastActive = Date.now();
    };
    const events = ["pointerdown", "keydown", "scroll", "pointermove", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - lastActive < IDLE_MS) progress.addMinutes(TICK_MS / 60_000);
    }, TICK_MS);
    return () => {
      clearInterval(id);
      events.forEach((e) => window.removeEventListener(e, mark));
    };
  }, []);
}
