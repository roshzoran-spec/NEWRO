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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
