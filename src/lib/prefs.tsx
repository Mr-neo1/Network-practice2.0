import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { L, Lang } from "../content/types";

type Theme = "light" | "dark" | "system";
type Prefs = { lang: Lang; theme: Theme };

const KEY = "nz2h.prefs";

function readPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { lang: raw.lang === "hi" ? "hi" : "en", theme: raw.theme === "dark" || raw.theme === "light" ? raw.theme : "system" };
  } catch {
    return { lang: "en", theme: "system" };
  }
}

type Ctx = Prefs & {
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  /** Resolved theme actually shown. */
  dark: boolean;
};

const PrefsContext = createContext<Ctx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(readPrefs);
  const [systemDark, setSystemDark] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => setSystemDark(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const dark = prefs.theme === "dark" || (prefs.theme === "system" && systemDark);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    document.documentElement.lang = prefs.lang === "hi" ? "hi-Latn" : "en";
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* private mode: preferences just won't persist */
    }
  }, [prefs]);

  const setLang = useCallback((lang: Lang) => setPrefs((p) => ({ ...p, lang })), []);
  const setTheme = useCallback((theme: Theme) => setPrefs((p) => ({ ...p, theme })), []);
  const value = useMemo(() => ({ ...prefs, setLang, setTheme, dark }), [prefs, setLang, setTheme, dark]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs outside PrefsProvider");
  return ctx;
}

/** Returns a translator for bilingual strings in the current language. */
export function useT() {
  const { lang } = usePrefs();
  return useCallback((v: L | string | undefined) => (v === undefined ? "" : typeof v === "string" ? v : v[lang] || v.en), [lang]);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
