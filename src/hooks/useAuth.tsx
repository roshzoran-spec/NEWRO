import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearSupabaseSessionCache = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("sb-") && key.includes("-auth-token"))
    .forEach((key) => localStorage.removeItem(key));
};

const clearSupabaseLockKeys = () => {
  Object.keys(localStorage)
    .filter(
      (key) =>
        key.includes("lock:sb-") ||
        (key.includes("supabase.auth.token") && key.includes("lock"))
    )
    .forEach((key) => localStorage.removeItem(key));
};

const isRecoverableSignOutLockError = (error: unknown) => {
  return error instanceof Error && error.message.includes('Lock "lock:sb-') && error.message.includes("was released because another request stole it");
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log(`[useAuth] fetchProfile started for ${userId}`);
    const fetchStart = Date.now();
    
    // Safety timeout for the profile query itself
    const queryTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Profile fetch timeout")), 5000)
    );

    try {
      const query = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      const { data, error } = await Promise.race([query, queryTimeout]) as any;
      
      console.log(`[useAuth] fetchProfile query finished in ${Date.now() - fetchStart}ms`);
      
      if (error) {
        console.warn("[useAuth] Profile fetch error (expected if new user):", error.message);
        return;
      }
      if (data) {
        console.log("[useAuth] Profile data updated");
        setProfile(data as Profile);
      }
    } catch (err: any) {
      console.error("[useAuth] Error in fetchProfile:", err.message);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("Initial session check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Global safety timer
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });
      return { data: { user: data.user, session: data.session }, error };
    } catch (err: any) {
      return { data: { user: null, session: null }, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearSupabaseLockKeys();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data.session) {
        // Keep the active device signed in while revoking stale sessions elsewhere.
        const { error: revokeError } = await supabase.auth.signOut({ scope: "others" });
        if (revokeError) {
          console.warn("[useAuth] Could not revoke other sessions after sign-in:", revokeError.message);
        }
      }

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    const configuredRedirect = import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL as string | undefined;
    const redirectTo = configuredRedirect?.trim() || `${window.location.origin}/reset-password`;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error && error.message.toLowerCase().includes("failed to fetch")) {
        return {
          error: new Error(
            "Unable to reach authentication service. Please check your internet/VPN and try again."
          ),
        };
      }
      return { error };
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("failed to fetch")) {
        return {
          error: new Error(
            "Unable to reach authentication service. Please check your internet/VPN and try again."
          ),
        };
      }

      return {
        error: error instanceof Error ? error : new Error("Unable to send reset email. Please try again."),
      };
    }
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error };

    // After password change, revoke sessions on other devices for account safety.
    const { error: revokeError } = await supabase.auth.signOut({ scope: "others" });
    if (revokeError) {
      console.warn("[useAuth] Could not revoke other sessions after password update:", revokeError.message);
    }

    return { error: null };
  };

  const signOut = async () => {
    try {
      clearSupabaseLockKeys();
      const { error: globalError } = await supabase.auth.signOut({ scope: "global" });

      if (globalError && !isRecoverableSignOutLockError(globalError)) {
        const { error: localError } = await supabase.auth.signOut({ scope: "local" });
        if (localError && !isRecoverableSignOutLockError(localError)) {
          return { error: localError };
        }
      }

      clearSupabaseSessionCache();
      clearSupabaseLockKeys();
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);

      return { error: null };
    } catch (error) {
      if (isRecoverableSignOutLockError(error)) {
        clearSupabaseSessionCache();
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);

        return { error: null };
      }

      return {
        error: error instanceof Error ? error : new Error("Unable to sign out. Please try again."),
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, resetPassword, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
