import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Brain, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const { session, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [recoveryChecking, setRecoveryChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const prepareRecoverySession = async () => {
      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const queryCode = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const flowType = url.searchParams.get("type");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (session) {
          if (active) setRecoveryReady(true);
        } else if (queryCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(queryCode);
          if (error) throw error;
          if (active) setRecoveryReady(true);
        } else if (tokenHash && flowType === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          if (error) throw error;
          if (active) setRecoveryReady(true);
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          if (active) setRecoveryReady(true);
        } else {
          const { data } = await supabase.auth.getSession();
          if (active) setRecoveryReady(Boolean(data.session));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "This reset link is invalid or expired.";
        if (active) {
          setRecoveryReady(false);
          setStatusType("error");
          setStatusMessage(message);
        }
      } finally {
        if (active) setRecoveryChecking(false);
      }
    };

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;

      if (event === "PASSWORD_RECOVERY") {
        setRecoveryReady(true);
        setRecoveryChecking(false);
        setStatusMessage(null);
        setStatusType(null);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        setRecoveryReady(Boolean(nextSession));
        setRecoveryChecking(false);
      }
    });

    void prepareRecoverySession();

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [session]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      setStatusType("error");
      setStatusMessage("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setStatusType("error");
      setStatusMessage("Passwords do not match.");
      toast.error("Passwords do not match");
      return;
    }

    setStatusMessage(null);
    setStatusType(null);
    setSubmitting(true);

    try {
      const result = await updatePassword(password);

      if (result.error) {
        setStatusType("error");
        setStatusMessage(result.error.message);
        toast.error(result.error.message);
        return;
      }

      setStatusType("success");
      setStatusMessage("Password updated successfully. Redirecting to sign in...");
      toast.success("Password updated. You can sign in now.");
      window.setTimeout(() => {
        window.location.assign("/login?reset=success");
      }, 1200);
    } finally {
      setSubmitting(false);
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
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">Newro</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-card-foreground">Reset your password</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {recoveryReady
                ? "Choose a new password for your account."
                : "Open the password reset link from your email to continue."}
            </p>
          </div>

          {loading || recoveryChecking ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : recoveryReady ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
              {statusMessage ? (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    statusType === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {statusMessage}
                </div>
              ) : null}
              <Button className="w-full shadow-glow h-12 rounded-xl bg-gradient-cta" size="lg" disabled={submitting} type="submit">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save New Password
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {statusMessage || "If you already requested a reset, return to the email we sent and open the secure link from that message."}
              </p>
              <Button asChild className="w-full shadow-glow h-12 rounded-xl bg-gradient-cta" size="lg">
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
