import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";
import { labValues } from "@/data/labValues";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useMasterData, type MasterDataRecord } from "@/hooks/useMasterData";
import { Skeleton } from "@/components/ui/skeleton";

const Labs = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isFetching } = useMasterData<Record<string, unknown>>("labs");
  const remoteLabs = data?.records ?? [];

  const normalizedLabs = remoteLabs.map((record: MasterDataRecord<Record<string, unknown>>) => ({
    test: record.name,
    normalRange: (record.content?.normalRange as string) || record.summary || "",
    unit: (record.content?.unit as string) || "",
    criticalLow: record.content?.criticalLow as string | undefined,
    criticalHigh: record.content?.criticalHigh as string | undefined,
    category: record.category || "Lab",
  }));

  const dataset = normalizedLabs.length ? normalizedLabs : labValues;

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(dataset.map((lab) => lab.category)))],
    [dataset]
  );

  const filteredLabs = dataset.filter((lab) => {
    const matchesSearch =
      lab.test.toLowerCase().includes(search.toLowerCase()) ||
      lab.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || lab.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout title="Lab Intelligence" subtitle="Critical ranges & trending deltas">
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tests or categories"
              className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-muted-foreground"
            />
          </div>
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {filteredLabs.length} results
            <p className="text-[10px] text-primary">
              Source: {normalizedLabs.length ? "Hospital master data" : "Local reference"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant="outline"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                cat === category
                  ? "border-primary/50 bg-primary/30 text-white shadow-[0_15px_30px_rgba(21,154,255,0.35)]"
                  : "border-white/20 text-muted-foreground hover:border-white/40"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {isFetching && (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-3xl bg-white/5" />
          ))}
        </div>
      )}
      <section className="grid gap-3">
        {filteredLabs.map((lab) => (
          <div
            key={lab.test}
            className="rounded-3xl border border-white/10 bg-card/70 p-5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-primary">{lab.category}</p>
                <p className="text-2xl font-semibold">{lab.test}</p>
              </div>
              <Badge className="rounded-full border border-white/10 bg-white/10 text-white">{lab.unit}</Badge>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <p className="text-white/80">Normal: {lab.normalRange}</p>
              {(lab.criticalLow || lab.criticalHigh) && (
                <p className="text-medical-red">
                  Critical: {lab.criticalLow && `≤${lab.criticalLow}`} {lab.criticalHigh && ` / ≥${lab.criticalHigh}`}
                </p>
              )}
            </div>
          </div>
        ))}
        {filteredLabs.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/30 p-10 text-center text-muted-foreground">
            No lab tests found.
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default Labs;
