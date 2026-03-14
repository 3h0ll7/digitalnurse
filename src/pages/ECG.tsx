import { useMemo, useState } from "react";
import { Activity, BookOpenText, Clock3 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ecgCategories, ecgTerms } from "@/data/ecgTerms";
import { ecgLearningPath } from "@/data/ecgLearningPath";

const ECG = () => {
  const [activeTab, setActiveTab] = useState<"GLOSSARY" | "LEARNING PATH">("GLOSSARY");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | (typeof ecgCategories)[number]>("All");

  const filteredTerms = useMemo(() => {
    return ecgTerms.filter((term) => {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const matchesSearch =
        term.term.toLowerCase().includes(normalizedQuery) ||
        term.definition.toLowerCase().includes(normalizedQuery) ||
        term.clinicalPearl.toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === "All" || term.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <AppLayout
      title="ECG Interpretation"
      subtitle="CARDIAC RHYTHMS & WAVEFORMS"
      badgeLabel="DIGITAL NURSE BUDDY"
      subBadgeLabel="PUBLIC CLINICAL REFERENCE · NO LOGIN REQUIRED"
    >
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex gap-2">
          {(["GLOSSARY", "LEARNING PATH"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Button
                key={tab}
                size="sm"
                variant="outline"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                  isActive
                    ? "border-primary/50 bg-primary/30 text-white shadow-[0_15px_30px_rgba(21,154,255,0.35)]"
                    : "border-white/20 text-muted-foreground hover:border-white/40"
                }`}
              >
                {tab}
              </Button>
            );
          })}
        </div>
      </section>

      {activeTab === "GLOSSARY" ? (
        <>
          <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Activity
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-primary rtl:left-auto rtl:right-4"
                />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search ECG terms, definitions, or clinical pearls"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 rtl:pl-4 rtl:pr-12 text-white placeholder:text-muted-foreground"
                />
              </div>
              <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                {filteredTerms.length} results
                <p className="text-[10px] text-primary">SOURCE: ECG STATIC REFERENCE</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["All", ...ecgCategories].map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                    category === selectedCategory
                      ? "border-primary/50 bg-primary/30 text-white shadow-[0_15px_30px_rgba(21,154,255,0.35)]"
                      : "border-white/20 text-muted-foreground hover:border-white/40"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            {filteredTerms.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-card/70 p-5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-primary">{item.category}</p>
                    <p className="text-2xl font-semibold">{item.term}</p>
                  </div>
                  {item.normalValue && (
                    <Badge className="rounded-full border border-white/10 bg-white/10 text-white">
                      {item.normalValue}
                    </Badge>
                  )}
                </div>
                <div className="mt-3 text-sm text-muted-foreground space-y-2">
                  <p className="text-white/85">{item.definition}</p>
                  <p>
                    <span className="text-primary uppercase tracking-[0.3em] text-xs">Clinical Pearl: </span>
                    <span>{item.clinicalPearl}</span>
                  </p>
                </div>
              </div>
            ))}
            {filteredTerms.length === 0 && (
              <div className="rounded-3xl border border-dashed border-white/30 p-10 text-center text-muted-foreground">
                No ECG terms matched your filters.
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="space-y-4">
          {ecgLearningPath.map((stage, index) => (
            <div key={stage.stage} className="relative rounded-3xl border border-white/10 bg-card/70 p-5 text-white">
              {index < ecgLearningPath.length - 1 && (
                <span className="absolute left-8 top-[72px] h-[calc(100%-36px)] w-px bg-gradient-to-b from-primary/60 to-transparent" />
              )}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/40 bg-primary/20 text-sm font-semibold">
                    {stage.stage}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-primary">{stage.badge}</p>
                    <h3 className="mt-1 text-2xl font-semibold">{stage.title}</h3>
                  </div>
                </div>
                <Badge className="rounded-full border border-white/10 bg-white/10 text-white">
                  <Clock3 size={14} className="mr-1.5" />
                  {stage.estimatedTime}
                </Badge>
              </div>

              <details className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  Learning Objectives
                </summary>
                <ul className="mt-3 space-y-2 text-sm text-white/85">
                  {stage.objectives.map((objective) => (
                    <li key={objective} className="flex items-start gap-2">
                      <Activity size={14} className="mt-1 text-primary" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </details>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Clinical Scenario</p>
                  <p className="mt-2 text-sm text-white/85">{stage.clinicalScenario}</p>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-primary">Mastery Checkpoint</p>
                  <p className="mt-2 text-sm text-white">{stage.masteryCheckpoint}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-white/10 bg-card/60 p-5 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <div className="flex items-center gap-2 text-primary">
              <BookOpenText size={14} />
              Learning path complete: {ecgLearningPath.length} progressive stages.
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
};

export default ECG;
