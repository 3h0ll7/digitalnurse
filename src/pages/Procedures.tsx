import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, ShieldCheck, Activity, ClipboardCheck } from "lucide-react";
import { procedures, additionalProcedures, type Procedure } from "@/data/procedures";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";

const Procedures = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = usePreferences();
  const [activeProcedure, setActiveProcedure] = useState<Procedure | null>(null);

  const allProcedures = [...procedures, ...additionalProcedures];
  
  const filteredProcedures = allProcedures.filter(proc =>
    proc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const categories = Array.from(new Set(allProcedures.map(p => p.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const displayProcedures = selectedCategory === "All" 
    ? filteredProcedures 
    : filteredProcedures.filter(p => p.category === selectedCategory);

  const workflowPhases = [
    {
      title: "Pre-procedure",
      description: "Verification, consent, prep, and targeted checklists",
      icon: ShieldCheck,
    },
    {
      title: "Intra-procedure",
      description: "Live sterile guidance + escalation cues",
      icon: Activity,
    },
    {
      title: "Post-procedure",
      description: "Recovery dashboards, teaching, and documentation",
      icon: ClipboardCheck,
    },
  ];

  return (
    <AppLayout
      title={t.proceduresTitle}
      subtitle="Evidence-based workflows"
      actions={
        <Button size="sm" variant="secondary" onClick={() => navigate("/calculators")}>
          Clinical tools
        </Button>
      }
    >
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder={t.searchProcedures}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 text-base text-white placeholder:text-muted-foreground"
            />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {displayProcedures.length} workflows
          </p>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {["All", ...categories].map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm uppercase tracking-widest transition-all ${
                  isActive
                    ? "border-primary/50 bg-primary/30 text-white shadow-[0_10px_25px_rgba(21,154,255,0.35)]"
                    : "border-white/10 text-muted-foreground hover:border-white/30"
                }`}
              >
                {category === "All" ? t.allLabel : category}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {workflowPhases.map((phase) => {
          const Icon = phase.icon;
          return (
            <Card
              key={phase.title}
              className="relative overflow-hidden rounded-3xl border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5 text-white"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/70">
                <span>{phase.title}</span>
                <Icon size={18} />
              </div>
              <p className="mt-3 text-sm text-white/80">{phase.description}</p>
              <span className="absolute inset-x-5 bottom-3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </Card>
          );
        })}
      </section>

      <section className="space-y-3">
        {displayProcedures.map((procedure) => {
          const snippet = procedure.definition
            ? `${procedure.definition.split(".")[0]}.`
            : procedure.description;
          return (
            <div
              key={procedure.id}
              onClick={() => setActiveProcedure(procedure)}
              className="group flex cursor-pointer flex-col gap-3 rounded-3xl border border-white/10 bg-card/70 p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/90"
            >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-primary">{procedure.category}</p>
                <h3 className="mt-2 text-2xl font-semibold">{procedure.title}</h3>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Ready
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{procedure.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{snippet}</span>
              <ChevronRight className="text-primary transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </div>
          </div>
        );
      })}
        {displayProcedures.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-muted-foreground">
            <p>{t.noProcedures}</p>
          </div>
        )}
      </section>

      <Drawer open={Boolean(activeProcedure)} onOpenChange={(open) => !open && setActiveProcedure(null)}>
        <DrawerContent className="border-white/10 bg-[#050912]/95 pb-8 text-white">
          <DrawerHeader className="text-left">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.quickViewTitle}</p>
            <DrawerTitle className="text-2xl text-white">{activeProcedure?.title}</DrawerTitle>
            <DrawerDescription className="text-primary">
              {activeProcedure?.category}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 px-4">
            <p className="text-sm text-muted-foreground">{t.quickViewDescription}</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {activeProcedure?.description}
              </p>
              <p className="mt-3 text-sm text-white whitespace-pre-line">
                {activeProcedure?.definition}
              </p>
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                if (activeProcedure) {
                  navigate(`/procedure/${activeProcedure.id}`);
                  setActiveProcedure(null);
                }
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-primary via-[#5F5CFF] to-[#8C79FF] text-white"
            >
              {t.viewFullProcedure}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );
};

export default Procedures;
