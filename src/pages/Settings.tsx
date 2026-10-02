import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "wouter";
import { LangSwitch } from "../components/LangSwitch";
import { Layout } from "../components/Layout";
import { useAuth } from "../lib/auth";
import { usePrefs, useT } from "../lib/prefs";
import { progress, useProgress, useSyncStatus } from "../lib/progress";

export default function Settings() {
  const t = useT();
  const { lang, theme, setTheme } = usePrefs();
  const prog = useProgress();
  const { user, logout, serverAvailable } = useAuth();
  const sync = useSyncStatus();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const download = () => {
    const blob = new Blob([progress.exportJSON()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `zero2hero-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (f: File | undefined) => {
    if (!f) return;
    const ok = progress.importJSON(await f.text());
    setMsg(ok ? t({ en: "Backup merged into your progress.", hi: "Backup tumhari progress mein merge ho gaya." }) : t({ en: "That file isn't a progress backup.", hi: "Yeh file progress backup nahi hai." }));
  };

  const reset = () => {
    if (confirm(lang === "hi" ? "Saari progress hamesha ke liye mit jaayegi (account par bhi). Pakka?" : "This erases all progress, including on your account. Are you sure?")) {
      progress.reset();
      setMsg(t({ en: "Progress reset.", hi: "Progress reset ho gayi." }));
    }
  };

  return (
    <Layout>
      <div className="page narrow">
        <h1>{t({ en: "Settings", hi: "Settings" })}</h1>

        <section className="settings-group">
          <h2>{t({ en: "Account", hi: "Account" })}</h2>
          {user ? (
            <>
              <p>
                {t({ en: "Signed in as", hi: "Signed in" })} <b>{user.name}</b> ({user.email}). {t({ en: "Sync", hi: "Sync" })}: {sync === "saved" ? t({ en: "up to date", hi: "up to date" }) : sync === "error" ? t({ en: "waiting for the server", hi: "server ka intezaar" }) : t({ en: "saving…", hi: "save ho raha hai…" })}
              </p>
              <button className="btn btn-ghost" onClick={logout}>
                {t({ en: "Sign out", hi: "Sign out" })}
              </button>
            </>
          ) : serverAvailable ? (
            <p>
              {t({ en: "You're using a guest profile saved in this browser.", hi: "Tum is browser mein saved guest profile use kar rahe ho." })} <Link href="/login">{t({ en: "Sign in or create an account", hi: "Sign in karo ya account banao" })}</Link> {t({ en: "to keep progress on every device; your guest progress moves into the account.", hi: "taaki progress har device par rahe; guest progress account mein chali jaayegi." })}
            </p>
          ) : (
            <p className="muted">{t({ en: "Accounts need the site's server, which isn't running here. Progress is saved in this browser; use backups below to move it.", hi: "Accounts ke liye site ka server chahiye, jo yahan nahi chal raha. Progress is browser mein saved hai; ise move karne ke liye neeche backup use karo." })}</p>
          )}
        </section>

        <section className="settings-group">
          <h2>{t({ en: "Study goals", hi: "Study goals" })}</h2>
          <label className="setting-row">
            <span>{t({ en: "Exam date", hi: "Exam date" })}</span>
            <input type="date" className="text-input" value={prog.settings.examDate ?? ""} onChange={(e) => progress.setSettings({ examDate: e.target.value || undefined })} />
          </label>
          <label className="setting-row">
            <span>{t({ en: "Daily study goal (minutes)", hi: "Roz ka study goal (minutes)" })}</span>
            <input type="number" min={10} max={480} step={5} className="text-input" value={prog.settings.dailyGoal} onChange={(e) => progress.setSettings({ dailyGoal: Math.max(10, Math.min(480, Number(e.target.value) || 45)) })} />
          </label>
          <label className="setting-row">
            <span>{t({ en: "8-week plan start date", hi: "8 hafte ke plan ki start date" })}</span>
            <input type="date" className="text-input" value={prog.settings.planStart ?? ""} onChange={(e) => progress.setSettings({ planStart: e.target.value || undefined })} />
          </label>
        </section>

        <section className="settings-group">
          <h2>{t({ en: "Display", hi: "Display" })}</h2>
          <div className="setting-row">
            <span>{t({ en: "Language", hi: "Bhasha" })}</span>
            <LangSwitch />
          </div>
          <div className="setting-row">
            <span>{t({ en: "Theme", hi: "Theme" })}</span>
            <div className="segmented">
              {(["light", "dark", "system"] as const).map((v) => (
                <button key={v} className={theme === v ? "is-on" : ""} onClick={() => setTheme(v)}>
                  {v === "light" ? t({ en: "Light", hi: "Light" }) : v === "dark" ? t({ en: "Dark", hi: "Dark" }) : t({ en: "Match device", hi: "Device jaisa" })}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="settings-group">
          <h2>{t({ en: "Backup", hi: "Backup" })}</h2>
          <p className="muted">{t({ en: "Download your progress as a file, or merge a backup into this profile. Nothing is lost when you import: the two are combined.", hi: "Apni progress file ke roop mein download karo, ya backup is profile mein merge karo. Import karne par kuch nahi khota: dono combine hote hain." })}</p>
          <div className="drill-actions">
            <button className="btn btn-ghost" onClick={download}>
              <Download size={15} /> {t({ en: "Download backup", hi: "Backup download karo" })}
            </button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <Upload size={15} /> {t({ en: "Import backup", hi: "Backup import karo" })}
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => upload(e.target.files?.[0])} />
          </div>
        </section>

        <section className="settings-group danger">
          <h2>{t({ en: "Reset", hi: "Reset" })}</h2>
          <button className="btn btn-ghost danger-btn" onClick={reset}>
            {t({ en: "Erase all progress", hi: "Saari progress mitao" })}
          </button>
        </section>
        {msg && <p className="ok-text">{msg}</p>}
      </div>
    </Layout>
  );
}
