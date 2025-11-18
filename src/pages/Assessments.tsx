import AppLayout from "@/components/layout/AppLayout";
import { assessmentScales } from "@/data/assessmentScales";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

const Assessments = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

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
    <AppLayout title="Assessment Hub" subtitle="Risk scores & bedside tools">
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search assessments"
              className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-muted-foreground"
            />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{filteredScales.length} modules</p>
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
              {cat}
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
                <p className="text-xs uppercase tracking-[0.4em] text-primary">{scale.category}</p>
                <p className="text-2xl font-semibold">{scale.name}</p>
                <p className="text-sm text-muted-foreground">{scale.description}</p>
              </div>
              <span className="self-start rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Interactive
              </span>
            </div>
          </Card>
        ))}
        {filteredScales.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/30 p-10 text-center text-muted-foreground">
            No assessments found.
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default Assessments;
