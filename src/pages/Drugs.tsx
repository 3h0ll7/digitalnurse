import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, GitMerge, Pill, Scale, Search, Siren, SlidersHorizontal, TrendingUp } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import BarList from "@/components/data/BarList";
import FilterChips from "@/components/data/FilterChips";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreferences } from "@/contexts/PreferencesContext";
import drugsCatalog from "@/data/drugs-catalog.json";
import { DRUG_CATEGORY_LABELS, drugsText } from "@/data/drugs-i18n";
import { categoryCounts, compatibility, drugStats, filterDrugs, routeCounts, type DrugFlag } from "@/lib/clinical/catalog";
import { cn } from "@/lib/utils";

const drugs = drugsCatalog.drugs;
const stats = drugStats(drugs);
const routes = routeCounts(drugs);
const perCategory = categoryCounts(drugs);

const COMPAT_TONE = {
  compatible: "border-medical-green/40 bg-medical-green/10 text-medical-green",
  incompatible: "border-medical-red/40 bg-medical-red/10 text-medical-red",
  unknown: "border-border bg-secondary/60 text-muted-foreground",
  same: "border-border bg-secondary/60 text-muted-foreground",
} as const;

const Drugs = () => {
  const { language } = usePreferences();
  const tx = drugsText[language];
  const catLabel = (value: string) => DRUG_CATEGORY_LABELS[value]?.[language] ?? value;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [flags, setFlags] = useState<DrugFlag[]>([]);
  const [route, setRoute] = useState("");
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");

  const filtered = useMemo(() => filterDrugs(drugs, { query, category, flags, route }), [query, category, flags, route]);
  const emergencyDrugs = useMemo(() => drugs.filter((d) => d.emergency), []);
  const compat = compatibility(drugsCatalog.ivCompatibilityMatrix, drugA, drugB);

  const toggleFlag = (flag: string) =>
    setFlags((prev) => (prev.includes(flag as DrugFlag) ? prev.filter((f) => f !== flag) : [...prev, flag as DrugFlag]));

  const flagOptions: { value: DrugFlag; label: string; count: number }[] = [
    { value: "highAlert", label: tx.highAlert, count: stats.highAlert },
    { value: "emergency", label: tx.emergency, count: stats.emergency },
    { value: "weightBased", label: tx.weightBased, count: stats.weightBased },
    { value: "titration", label: tx.titration, count: stats.titration },
  ];

  const resetFilters = () => {
    setQuery("");
    setCategory("ALL");
    setFlags([]);
    setRoute("");
  };
  const hasFilters = Boolean(query || category !== "ALL" || flags.length || route);

  return (
    <AppLayout illustration="pharmacy" title={tx.title} subtitle={tx.subtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Pill} tone="primary" label={tx.total} value={stats.total} />
        <StatTile icon={AlertTriangle} tone="critical" label={tx.highAlert} value={stats.highAlert} hint="ISMP" />
        <StatTile icon={Siren} tone="warn" label={tx.emergency} value={stats.emergency} />
        <StatTile icon={Scale} label={tx.weightBased} value={stats.weightBased} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
          <h2 className="text-sm font-semibold">{tx.byCategory}</h2>
          <BarList
            ariaLabel={tx.byCategory}
            rows={[...perCategory.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([value, count]) => ({ key: value, label: catLabel(value), value: count }))}
          />
        </div>
        <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
          <h2 className="text-sm font-semibold">{tx.byRoute}</h2>
          <BarList ariaLabel={tx.byRoute} rows={routes.map((r) => ({ key: r.route, label: r.route, value: r.count, color: "var(--viz-3)" }))} max={stats.total} />
          <p className="text-[11px] text-muted-foreground">{tx.routeNote}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full rounded-2xl border-medical-red/40 text-medical-red hover:bg-medical-red/10">
                <Siren className="me-2" size={16} aria-hidden="true" /> {tx.crashCart}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-start">{tx.crashCart}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {emergencyDrugs.map((drug) => (
                  <Link key={drug.id} to={`/drugs/${drug.id}`} className="rounded-2xl border border-medical-red/30 bg-medical-red/5 p-3 hover:bg-medical-red/10">
                    <p dir="ltr" className="text-start font-semibold">{drug.genericName}</p>
                    <p className="text-xs text-muted-foreground">
                      {catLabel(drug.category)} · <span dir="ltr">{drug.routes.join(" / ")}</span>
                    </p>
                  </Link>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <div className="relative">
          <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tx.search} aria-label={tx.search} className="h-11 rounded-2xl ps-11" />
        </div>
        <FilterChips
          ariaLabel={tx.byCategory}
          value={category}
          onChange={setCategory}
          options={drugsCatalog.categories.map((c) => ({ value: c.value, label: catLabel(c.value), count: c.value === "ALL" ? stats.total : perCategory.get(c.value) ?? 0 }))}
          hideEmpty
        />
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={14} className="text-muted-foreground" aria-hidden="true" />
          <FilterChips ariaLabel={tx.flags} value={flags} onChange={toggleFlag} options={flagOptions} />
          <FilterChips
            ariaLabel={tx.byRoute}
            value={route}
            onChange={(r) => setRoute((prev) => (prev === r ? "" : r))}
            options={routes.map((r) => ({ value: r.route, label: r.route, count: r.count }))}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {tx.showing} <span className="font-semibold tabular-nums text-foreground">{filtered.length}</span> / {stats.total}
          </span>
          {hasFilters && (
            <Button size="sm" variant="ghost" onClick={resetFilters}>
              {tx.reset}
            </Button>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState variant="no-results" title={tx.empty} action={<Button onClick={resetFilters}>{tx.reset}</Button>} />
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((drug) => (
            <Link
              key={drug.id}
              to={`/drugs/${drug.id}`}
              className="group flex flex-col gap-3 rounded-3xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div dir="ltr" className="text-start">
                <p className="font-semibold leading-tight">{drug.genericName}</p>
                {drug.brandName && <p className="text-xs text-muted-foreground">{drug.brandName}</p>}
              </div>
              <p className="text-xs font-medium text-primary">{catLabel(drug.category)}</p>
              <div className="mt-auto flex flex-wrap items-center gap-1.5">
                {drug.highAlert && <Badge variant="outline" className="border-medical-red/40 bg-medical-red/10 text-medical-red">{tx.highAlert}</Badge>}
                {drug.emergency && <Badge variant="outline" className="border-medical-yellow/40 bg-medical-yellow/10 text-medical-yellow">{tx.emergency}</Badge>}
                {drug.hasTitrationGuide && (
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp size={12} aria-hidden="true" />
                    {tx.titration}
                  </Badge>
                )}
                <span dir="ltr" className="ms-auto text-[11px] text-muted-foreground">{drug.routes.join(" · ")}</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <GitMerge size={16} className="text-primary" aria-hidden="true" /> {tx.compatTitle}
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Select value={drugA} onValueChange={setDrugA}>
            <SelectTrigger aria-label={tx.firstDrug}><SelectValue placeholder={tx.firstDrug} /></SelectTrigger>
            <SelectContent>{drugs.map((d) => <SelectItem key={d.id} value={d.genericName}>{d.genericName}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={drugB} onValueChange={setDrugB}>
            <SelectTrigger aria-label={tx.secondDrug}><SelectValue placeholder={tx.secondDrug} /></SelectTrigger>
            <SelectContent>{drugs.map((d) => <SelectItem key={`${d.id}-b`} value={d.genericName}>{d.genericName}</SelectItem>)}</SelectContent>
          </Select>
          <div role="status" className={cn("rounded-2xl border p-3 text-sm", COMPAT_TONE[compat ?? "unknown"])}>
            {compat ? tx.compat[compat] : tx.compatPrompt}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{tx.knownPairs}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {drugsCatalog.ivCompatibilityMatrix.map((pair) => (
              <li key={`${pair.drugA}-${pair.drugB}`} className="flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-xs">
                <span dir="ltr" className="min-w-0 truncate">{pair.drugA} + {pair.drugB}</span>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 font-medium", pair.compatible ? "bg-medical-green/10 text-medical-green" : "bg-medical-red/10 text-medical-red")}>
                  {pair.compatible ? `✓ ${tx.compatShort}` : `✕ ${tx.incompatShort}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground">{tx.compatNote}</p>
        </div>
        <SourceNote ids={["ismp-high-alert", "dailymed"]} />
      </section>
    </AppLayout>
  );
};

export default Drugs;
