import AppLayout from "@/components/layout/AppLayout";
import { assessmentScales } from "@/data/assessmentScales";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

const categoryLabels: Record<string, { en: string; ar: string }> = {
  All: { en: "All", ar: "الكل" },
  Neurological: { en: "Neurological", ar: "عصبي" },
  "Skin Integrity": { en: "Skin Integrity", ar: "سلامة الجلد" },
  Safety: { en: "Safety", ar: "سلامة" },
  Pain: { en: "Pain", ar: "ألم" },
  Neonatal: { en: "Neonatal", ar: "حديثي الولادة" },
  SEPSIS: { en: "SEPSIS", ar: "إنتان" },
  CARDIAC: { en: "CARDIAC", ar: "قلبي" },
  "EARLY WARNING": { en: "EARLY WARNING", ar: "إنذار مبكر" },
  DELIRIUM: { en: "DELIRIUM", ar: "هذيان" },
  PULMONARY: { en: "PULMONARY", ar: "رئوي" },
  NUTRITION: { en: "NUTRITION", ar: "تغذية" },
  PSYCHIATRIC: { en: "PSYCHIATRIC", ar: "نفسي" },
  "SKIN INTEGRITY": { en: "SKIN INTEGRITY", ar: "سلامة الجلد" },
};

const Assessments = () => {
  const navigate = useNavigate();
  const { t, language } = usePreferences();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const dataset = assessmentScales;
  const isArabic = language === "ar";

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(dataset.map((scale) => scale.category)))],
    [dataset],
  );

  const filteredScales = dataset.filter((scale) => {
    const matchesQuery =
      scale.name.toLowerCase().includes(query.toLowerCase()) ||
      scale.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || scale.category === category;
    return matchesQuery && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    const mapped = categoryLabels[cat];
    return mapped ? (isArabic ? mapped.ar : mapped.en) : cat;
  };

  return (
    <AppLayout title={t.assessmentHubTitle} subtitle={t.assessmentHubSubtitle}>
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-primary rtl:left-auto rtl:right-4" size={18} />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchAssessments}
              className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 rtl:pl-4 rtl:pr-12 text-white placeholder:text-muted-foreground"
            />
          </div>
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {dataset.length} {isArabic ? "وحدة" : "MODULES"}
            <p className="text-[10px] text-primary">{t.sourceAssessmentCatalog}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant="outline"
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                category === cat
                  ? "border-primary/50 bg-primary/30 text-white shadow-[0_10px_30px_rgba(21,154,255,0.35)]"
                  : "border-white/20 text-muted-foreground hover:border-white/40"
              }`}
              onClick={() => setCategory(cat)}
            >
              {getCategoryLabel(cat)}
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        {filteredScales.map((scale) => (
          <Card
            key={scale.id}
            className="cursor-pointer rounded-3xl border border-white/10 bg-card/70 p-5 text-white shadow-[0_15px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            onClick={() => navigate(`/scale/${scale.id}`)}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-primary">{getCategoryLabel(scale.category)}</p>
                <p className="text-2xl font-semibold">{scale.name}</p>
                <p className="text-sm text-muted-foreground">{scale.description}</p>
              </div>
              <span className="self-start rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                {t.interactive}
              </span>
            </div>
          </Card>
        ))}
        {filteredScales.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/30 p-10 text-center text-muted-foreground">
            {t.noAssessments}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default Assessments;
