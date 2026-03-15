import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ecgCategories, ecgTerms } from "@/data/ecgTerms";
import { usePreferences } from "@/contexts/PreferencesContext";

const ECG = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | (typeof ecgCategories)[number]>("All");
  const { t } = usePreferences();

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
    <AppLayout title={t.ecgTitle} subtitle={t.ecgSubtitle}>
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
              placeholder={t.searchEcg}
              className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 rtl:pl-4 rtl:pr-12 text-white placeholder:text-muted-foreground"
            />
          </div>
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {filteredTerms.length} {t.results}
            <p className="text-[10px] text-primary">{t.sourceEcgRef}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["All", ...ecgCategories].map((category) => (
            <Button
              key={category}
              size="sm"
              variant="outline"
              onClick={() => setSelectedCategory(category as typeof selectedCategory)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                category === selectedCategory
                  ? "border-primary/50 bg-primary/30 text-white shadow-[0_15px_30px_rgba(21,154,255,0.35)]"
                  : "border-white/20 text-muted-foreground hover:border-white/40"
              }`}
            >
              {category === "All" ? t.allLabel : category}
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
                <span className="text-primary uppercase tracking-[0.3em] text-xs">{t.clinicalPearl}: </span>
                <span>{item.clinicalPearl}</span>
              </p>
            </div>
          </div>
        ))}
        {filteredTerms.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/30 p-10 text-center text-muted-foreground">
            {t.noEcgTerms}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default ECG;
