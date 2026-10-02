import { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../components/Layout";
import { useAuth } from "../lib/auth";
import { useT } from "../lib/prefs";

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
      setError((err as Error).message);
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
