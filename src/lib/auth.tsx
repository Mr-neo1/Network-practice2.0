import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getBackend, type User } from "./account";
import { switchOwner } from "./progress";

export type { User } from "./account";

type AuthState = {
  user: User | null;
  /** Still checking the session on first load. */
  loading: boolean;
  /** False when no account backend answers (e.g. a static-only deployment): accounts are unavailable. */
  serverAvailable: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Resolves to false when the account must be confirmed from an email before signing in. */
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function startSync(user: User) {
  const backend = await getBackend();
  const server = await backend.load(user).catch(() => null);
  switchOwner(user.id, server, backend.push);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverAvailable, setServerAvailable] = useState(true);

  useEffect(() => {
    let alive = true;
    getBackend()
      .then((b) => b.me())
      .then(async (user) => {
        if (!alive) return;
        setServerAvailable(true);
        if (user) {
          setUser(user);
          await startSync(user);
        }
      })
      .catch(() => alive && setServerAvailable(false))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await (await getBackend()).login(email, password);
    setUser(user);
    await startSync(user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const user = await (await getBackend()).register(name, email, password);
    if (!user) return false;
    setUser(user);
    await startSync(user);
    return true;
  }, []);

  const logout = useCallback(async () => {
    await (await getBackend()).logout().catch(() => undefined);
    setUser(null);
    switchOwner(null, null, null);
  }, []);

  const value = useMemo(() => ({ user, loading, serverAvailable, login, register, logout }), [user, loading, serverAvailable, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
