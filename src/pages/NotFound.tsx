import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import EmptyState from "@/components/EmptyState";
import { usePreferences } from "@/contexts/PreferencesContext";

const NotFound = () => {
  const location = useLocation();
  const { t, direction } = usePreferences();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div dir={direction} className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <EmptyState
        variant="not-found"
        title={t.notFoundTitle}
        description={`404 · ${location.pathname}`}
        className="w-full max-w-md"
        action={
          <Link
            to="/home"
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t.returnHome}
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
