import { useMemo, useState } from "react";
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
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetSuccess = useMemo(() => searchParams.get("reset") === "success", [searchParams]);

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
    if (!email) {
      toast.error("Enter your email first so we know where to send the reset link.");
      return;
    }

    setResetting(true);
    const { error } = await resetPassword(email);
    setResetting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset link sent. Check your email.");
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
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">Newro</span>
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
                  disabled={resetting}
                  className="text-xs font-medium text-primary hover:underline disabled:opacity-60"
                >
                  {resetting ? "Sending..." : "Forgot password?"}
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
