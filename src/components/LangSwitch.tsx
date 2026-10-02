import { usePrefs } from "../lib/prefs";

/** The language belt: English or Hinglish, always one click away. */
export function LangSwitch({ compact }: { compact?: boolean }) {
  const { lang, setLang } = usePrefs();
  return (
    <div className={`lang-switch ${compact ? "is-compact" : ""}`} role="radiogroup" aria-label="Language / Bhasha">
      <button role="radio" aria-checked={lang === "en"} className={lang === "en" ? "is-on" : ""} onClick={() => setLang("en")}>
        English
      </button>
      <button role="radio" aria-checked={lang === "hi"} className={lang === "hi" ? "is-on" : ""} onClick={() => setLang("hi")}>
        Hinglish
      </button>
    </div>
  );
}
