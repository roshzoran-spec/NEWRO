import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetSuccess = useMemo(() => searchParams.get("reset") === "success", [searchParams]);

  useEffect(() => {
    if (resetCooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setResetCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resetCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Safety timeout to prevent infinite loading in case of Supabase deadlock
    const safetyTimer = setTimeout(() => {
      setLoading(false);
      toast.error("Sign-in is taking longer than expected. Please refresh the page if it hangs.");
    }, 10000);

    try {
      const { error } = await signIn(email, password);
      clearTimeout(safetyTimer);
      setLoading(false);
      
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          toast.error("Please confirm your email address before signing in. Check your inbox for the confirmation link.");
        } else if (error.message.toLowerCase().includes("invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      clearTimeout(safetyTimer);
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (resetCooldown > 0) {
      toast.error(`Please wait ${resetCooldown}s before requesting another reset email.`);
      return;
    }

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error("Enter your email first so we know where to send the reset link.");
      return;
    }

    setResetting(true);
    try {
      const { error } = await resetPassword(normalizedEmail);

      if (error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          setResetCooldown(60);
          toast.error("Email rate limit reached. Please wait 60 seconds and try again.");
          return;
        }
        toast.error(error.message);
        return;
      }

      setResetCooldown(45);
      toast.success("Password reset link sent. Check your email.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send reset email right now. Please try again.";
      toast.error(message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 hover:scale-105 transition-transform duration-300">
              <div className="h-20 w-auto drop-shadow-md">
                <img src="/logo.png" alt="Newro" className="h-full w-auto object-contain mix-blend-darken" />
              </div>
            </Link>
            <h1 className="font-display text-2xl font-bold text-card-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          {resetSuccess ? (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Password updated successfully. Please sign in with your new password.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetting || resetCooldown > 0}
                  className="text-xs font-medium text-primary hover:underline disabled:opacity-60"
                >
                  {resetting
                    ? "Sending..."
                    : resetCooldown > 0
                    ? `Retry in ${resetCooldown}s`
                    : "Forgot password?"}
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full shadow-glow h-12 rounded-xl bg-gradient-cta" size="lg" disabled={loading} type="submit">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
