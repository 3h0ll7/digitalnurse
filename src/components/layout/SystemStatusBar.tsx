import { Building2, ShieldCheck, Users } from "lucide-react";

const SystemStatusBar = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050d1c]/90 backdrop-blur-xl">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-primary">
          <ShieldCheck size={16} />
          Digital Nurse Buddy
        </div>
        <div className="text-sm text-white/80">
          Evidence-informed care workflows, always-on and available to every nurse.
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em]">
          <Building2 size={16} className="text-primary" />
          Public access workspace
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em]">
          <Users size={16} className="text-primary" />
          No login required
        </div>
      </div>
    </div>
  </header>
);

export default SystemStatusBar;
