import AppLayout from "@/components/layout/AppLayout";
import { assessmentScales } from "@/data/assessmentScales";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/contexts/PreferencesContext";

const Assessments = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { t } = usePreferences();

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(assessmentScales.map((scale) => scale.category)))],
    []
  );

  const filteredScales = assessmentScales.filter((scale) => {
    const matchesQuery =
      scale.name.toLowerCase().includes(query.toLowerCase()) ||
      scale.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || scale.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <AppLayout title={t.assessmentHub} subtitle={t.riskScoresBedsideTools}>
      <section className="space-y-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.searchAssessments}
          className="bg-card"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={cat === category ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCategory(cat)}
            >
              {cat === "All" ? t.allLabel : cat}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        {filteredScales.map((scale) => (
          <Card
            key={scale.id}
            className="p-4 shadow-card hover:shadow-card-hover cursor-pointer"
            onClick={() => navigate(`/scale/${scale.id}`)}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{scale.category}</p>
                <p className="text-lg font-semibold text-card-foreground">{scale.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{scale.description}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {t.interactive}
              </span>
            </div>
          </Card>
        ))}
        {filteredScales.length === 0 && (
          <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
            {t.noAssessmentsFound}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default Assessments;
