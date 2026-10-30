import { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../components/Layout";
import { useAuth } from "../lib/auth";
import { useT } from "../lib/prefs";

// Account errors in plain words, in both languages. Unknown messages are shown as they come.
const friendly: [RegExp, { en: string; hi: string }][] = [
  [/failed to fetch|networkerror|load failed|network request failed/i, { en: "Can't reach the account server. Check your internet connection and try again; your progress is safe on this device meanwhile.", hi: "Account server tak nahi pahunch pa rahe. Internet check karke dobara try karo; tab tak progress is device par safe hai." }],
  [/invalid login credentials|invalid email or password|email or password is incorrect/i, { en: "That email and password don't match. Check both, or create an account if you're new.", hi: "Email aur password match nahi kar rahe. Dono check karo, ya naye ho toh account banao." }],
  [/already registered|already exists|already in use/i, { en: "There's already an account with this email. Sign in instead.", hi: "Is email se account pehle se hai. Sign in karo." }],
  [/password should be at least|at least \d+ characters/i, { en: "The password is too short. Use at least 8 characters.", hi: "Password bahut chhota hai. Kam se kam 8 characters rakho." }],
  [/email not confirmed/i, { en: "This account still needs its email confirmed. Open the link we emailed you, then sign in.", hi: "Is account ka email abhi confirm nahi hua. Email mein bheja link kholo, phir sign in karo." }],
  [/rate limit|too many attempts/i, { en: "Too many attempts. Wait a minute and try again.", hi: "Bahut zyada attempts ho gaye. Ek minute ruk kar dobara try karo." }],
];

export default function Login() {
  const t = useT();
  const { login, register, user, serverAvailable } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "in") await login(email, password);
      else if (!(await register(name, email, password))) {
        setConfirmSent(true);
        setMode("in");
        return;
      }
      navigate("/progress");
    } catch (err) {
      const message = (err as Error).message;
      const known = friendly.find(([re]) => re.test(message));
      setError(known ? t(known[1]) : message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <div className="page narrow auth-page">
        <h1>{mode === "in" ? t({ en: "Sign in", hi: "Sign in" }) : t({ en: "Create your account", hi: "Apna account banao" })}</h1>
        <p className="lede">
          {t({
            en: "An account keeps your lessons, scores, labs and plan in sync on every device. Anything you did as a guest in this browser moves into it.",
            hi: "Account tumhare lessons, scores, labs aur plan ko har device par sync rakhta hai. Is browser mein guest ki tarah jo kiya, woh sab account mein chala jaayega.",
          })}
        </p>
        {confirmSent && (
          <p className="ok-text">
            {t({
              en: `Almost done: we sent a confirmation link to ${email}. Open it, then sign in here.`,
              hi: `Bas ek step: ${email} par confirmation link bheja hai. Use kholo, phir yahan sign in karo.`,
            })}
          </p>
        )}
        {user && <p className="ok-text">{t({ en: `You're signed in as ${user.name}.`, hi: `Tum ${user.name} ke naam se signed in ho.` })}</p>}
        {!serverAvailable && (
          <p className="error">
            {t({
              en: "Accounts aren't available right now, so your progress is saved in this browser only. Check your connection and reload the page.",
              hi: "Abhi accounts available nahi hain, isliye progress sirf is browser mein save ho rahi hai. Connection check karke page reload karo.",
            })}
          </p>
        )}
        <div className="segmented page-tabs">
          <button className={mode === "in" ? "is-on" : ""} onClick={() => setMode("in")}>
            {t({ en: "I have an account", hi: "Mera account hai" })}
          </button>
          <button className={mode === "up" ? "is-on" : ""} onClick={() => setMode("up")}>
            {t({ en: "I'm new", hi: "Main naya hoon" })}
          </button>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {mode === "up" && (
            <label>
              <span>{t({ en: "Name", hi: "Naam" })}</span>
              <input className="text-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={60} />
            </label>
          )}
          <label>
            <span>Email</span>
            <input className="text-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          <label>
            <span>{t({ en: "Password", hi: "Password" })}</span>
            <input className="text-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} minLength={mode === "up" ? 8 : undefined} required />
            {mode === "up" && <small className="muted">{t({ en: "At least 8 characters.", hi: "Kam se kam 8 characters." })}</small>}
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy || !serverAvailable}>
            {busy ? "…" : mode === "in" ? t({ en: "Sign in", hi: "Sign in" }) : t({ en: "Create account", hi: "Account banao" })}
          </button>
        </form>
      </div>
    </Layout>
  );
}
