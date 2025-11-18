import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
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
      description: "Verification, consent, and patient preparation",
    },
    {
      title: "Intra-procedure",
      description: "Sterile technique, monitoring, escalation cues",
    },
    {
      title: "Post-procedure",
      description: "Recovery, documentation, and patient teaching",
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
      <section className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder={t.searchProcedures}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {t.allLabel}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {workflowPhases.map((phase) => (
          <Card key={phase.title} className="p-4 shadow-card">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{phase.title}</p>
            <p className="mt-1 text-sm text-card-foreground">{phase.description}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        {displayProcedures.map((procedure) => (
          <div
            key={procedure.id}
            onClick={() => setActiveProcedure(procedure)}
            className="bg-card p-4 rounded-xl shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-semibold text-primary mb-1">
                  {procedure.category}
                </div>
                <h3 className="font-bold text-card-foreground mb-1">
                  {procedure.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {procedure.description}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground ml-2 flex-shrink-0" size={20} />
            </div>
          </div>
        ))}
        {displayProcedures.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t.noProcedures}</p>
          </div>
        )}
      </section>

      <Drawer open={Boolean(activeProcedure)} onOpenChange={(open) => !open && setActiveProcedure(null)}>
        <DrawerContent className="pb-6">
          <DrawerHeader className="text-left">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.quickViewTitle}</p>
            <DrawerTitle>{activeProcedure?.title}</DrawerTitle>
            <DrawerDescription>{activeProcedure?.category}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-4">
            <p className="text-sm text-muted-foreground">{t.quickViewDescription}</p>
            <div className="rounded-xl border p-4 bg-card">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {activeProcedure?.description}
              </p>
              <p className="mt-2 text-card-foreground whitespace-pre-line">
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
