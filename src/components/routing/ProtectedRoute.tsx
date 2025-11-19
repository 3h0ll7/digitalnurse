import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { user, isSessionLoading } = useAuth();
  const location = useLocation();

  if (isSessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/70 px-6 py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm uppercase tracking-[0.3em]">Validating session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
