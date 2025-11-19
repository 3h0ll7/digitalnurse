import { Building2, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const SystemStatusBar = () => {
  const { user, activeUnit, setActiveUnit, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050d1c]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-primary">
            <ShieldCheck size={16} />
            Secure Clinical Workspace
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              {user.organization || "Unassigned facility"}
            </span>
            {user.units?.length > 0 && (
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Unit
                <select
                  value={activeUnit?.id || user.units[0].id}
                  onChange={(event) => setActiveUnit(event.target.value)}
                  className="rounded-full border border-white/20 bg-transparent px-3 py-1 text-[11px] uppercase tracking-[0.3em]"
                >
                  {user.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em]">
            <Users size={16} className="text-primary" />
            {user.fullName} · {user.role}
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="rounded-full border-white/30 text-xs uppercase tracking-[0.4em] text-white">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SystemStatusBar;
