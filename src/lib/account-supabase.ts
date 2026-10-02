// Accounts and progress on Supabase. Loaded only when the site is built with Supabase keys.
// The database side (one `progress` row per user, protected by row-level security) is in supabase/setup.sql.
import { createClient, type Session, type User as SbUser } from "@supabase/supabase-js";
import type { AccountBackend, User } from "./account";
import { mergeProgress, normalize, type Progress } from "./progress-model";

const toUser = (u: SbUser): User => ({
  id: u.id,
  email: u.email ?? "",
  name: (u.user_metadata?.name as string | undefined)?.trim() || (u.email ?? "").split("@")[0],
  createdAt: new Date(u.created_at).getTime(),
});

export function supabaseBackend(url: string, key: string): AccountBackend {
  // PKCE puts the email-confirmation code in ?code=, which leaves the #/route hash alone.
  const sb = createClient(url, key, { auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  let session: Session | null = null;
  sb.auth.onAuthStateChange((_event, s) => {
    session = s;
  });

  const fail = (error: { message: string } | null) => {
    if (error) throw new Error(error.message);
  };

  const load = async (userId: string): Promise<Progress | null> => {
    const { data, error } = await sb.from("progress").select("data").eq("user_id", userId).maybeSingle();
    fail(error);
    return data ? normalize(data.data) : null;
  };

  const save = async (userId: string, p: Progress) => {
    const { error } = await sb.from("progress").upsert({ user_id: userId, data: p, updated_at: new Date().toISOString() });
    fail(error);
  };

  return {
    async me() {
      const { data, error } = await sb.auth.getSession();
      fail(error);
      session = data.session;
      if (location.search.includes("code=")) {
        // The confirmation code has been exchanged by now; tidy the address bar.
        history.replaceState(null, "", location.pathname + location.hash);
      }
      return session ? toUser(session.user) : null;
    },
    async login(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      fail(error);
      session = data.session;
      return toUser(data.user!);
    },
    async register(name, email, password) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { name: name.trim() }, emailRedirectTo: location.origin + location.pathname },
      });
      fail(error);
      session = data.session;
      // No session means the project asks new users to confirm their email first.
      return data.session && data.user ? toUser(data.user) : null;
    },
    async logout() {
      await sb.auth.signOut();
      session = null;
    },
    async load(user) {
      return load(user.id);
    },
    async push(p, opts) {
      const userId = session?.user.id;
      if (!userId) throw new Error("Not signed in");
      if (opts?.keepalive && session) {
        // The page is closing: one plain request that the browser finishes on its own, no merge round trip.
        await fetch(`${url}/rest/v1/progress?on_conflict=user_id`, {
          method: "POST",
          keepalive: true,
          headers: {
            apikey: key,
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({ user_id: userId, data: p, updated_at: new Date().toISOString() }),
        });
        return null;
      }
      const stored = opts?.replace ? null : await load(userId);
      const merged = stored ? mergeProgress(stored, p) : p;
      await save(userId, merged);
      return merged;
    },
  };
}
