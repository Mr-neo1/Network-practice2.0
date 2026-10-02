import { Menu, Moon, Search, Sun, UserRound, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../lib/auth";
import { usePrefs, useT } from "../lib/prefs";
import { ui } from "../lib/ui";
import { LangSwitch } from "./LangSwitch";
import { Outline } from "./Outline";
import { SearchDialog } from "./Search";

const nav = [
  { href: "/", label: ui.learn },
  { href: "/plan", label: { en: "Plan", hi: "Plan" } },
  { href: "/practice", label: ui.practice },
  { href: "/labs", label: ui.labs },
  { href: "/flashcards", label: { en: "Flashcards", hi: "Flashcards" } },
  { href: "/progress", label: { en: "Progress", hi: "Progress" } },
  { href: "/reference", label: ui.reference },
];

export function Layout({ children, outlineFor, wide }: { children: ReactNode; outlineFor?: string; wide?: boolean }) {
  const t = useT();
  const { dark, setTheme } = usePrefs();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, serverAvailable } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" || location.startsWith("/lesson") : href === "/practice" ? location.startsWith("/practice") || location.startsWith("/exam") : href === "/labs" ? location.startsWith("/lab") : location.startsWith(href);

  return (
    <div className={`app ${outlineFor !== undefined ? "has-outline" : ""}`}>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="brand" aria-label="Network Zero2Hero home">
            <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
              <rect width="32" height="32" rx="7" className="brand-bg" />
              <circle cx="9" cy="16" r="3.2" fill="#fff" />
              <circle cx="23" cy="9" r="3.2" fill="#fff" />
              <circle cx="23" cy="23" r="3.2" fill="#fff" />
              <path d="M9 16 23 9M9 16l14 7" stroke="#fff" strokeWidth="2" />
            </svg>
            <span className="brand-name">
              Zero2Hero<span className="brand-sub">CCNA</span>
            </span>
          </Link>
          <nav className="topnav" aria-label="Main">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={isActive(n.href) ? "is-active" : ""}>
                {t(n.label)}
              </Link>
            ))}
          </nav>
          <div className="topbar-right">
            <button className="search-btn" onClick={() => setSearchOpen(true)} aria-label={t(ui.search)}>
              <Search size={16} />
              <span className="search-btn-text">{t(ui.search)}</span>
              <kbd>Ctrl K</kbd>
            </button>
            <LangSwitch />
            {user ? (
              <Link href="/settings" className="account-chip" title={user.email}>
                <span>{user.name.slice(0, 1).toUpperCase()}</span>
              </Link>
            ) : serverAvailable ? (
              <Link href="/login" className="account-signin" aria-label="Sign in">
                <UserRound size={17} />
                <span>{t({ en: "Sign in", hi: "Sign in" })}</span>
              </Link>
            ) : null}
            <button className="icon-btn" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Light theme" : "Dark theme"} title={dark ? "Light theme" : "Dark theme"}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="drawer" onClick={() => setMenuOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <nav className="drawer-nav" aria-label="Main">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className={isActive(n.href) ? "is-active" : ""}>
                  {t(n.label)}
                </Link>
              ))}
            </nav>
            <Outline current={outlineFor} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className={`shell ${wide ? "is-wide" : ""}`}>
        {outlineFor !== undefined && (
          <aside className="sidebar">
            <Outline current={outlineFor} />
          </aside>
        )}
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <p>
            {t({
              en: "Free to use. Videos are by their YouTube creators and play from YouTube. Not affiliated with Cisco; CCNA is a Cisco trademark.",
              hi: "Free hai. Videos unke YouTube creators ke hain aur YouTube se hi chalte hain. Cisco se koi link nahi; CCNA Cisco ka trademark hai.",
            })}
          </p>
          <p>
            {user
              ? t({
                  en: `Signed in as ${user.email}. Progress syncs to your account.`,
                  hi: `${user.email} se signed in. Progress tumhare account mein sync hoti hai.`,
                })
              : t({
                  en: "Your progress is saved in this browser. Sign in to keep it on every device.",
                  hi: "Tumhari progress isi browser mein save hoti hai. Har device par rakhne ke liye sign in karo.",
                })}
          </p>
        </div>
      </footer>

      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
