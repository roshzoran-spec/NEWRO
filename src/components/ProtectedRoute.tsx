import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [forceShow, setForceShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setForceShow(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !forceShow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && (forceShow || !loading)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
