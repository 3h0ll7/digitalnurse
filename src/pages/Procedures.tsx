import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ChevronRight, ClipboardCheck, LayoutGrid, ListChecks, Search, ShieldAlert, ShieldCheck, Stethoscope } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import BarList from "@/components/data/BarList";
import FilterChips from "@/components/data/FilterChips";
import StatTile from "@/components/data/StatTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/contexts/PreferencesContext";
import { procedures } from "@/data/procedures";
import { PROCEDURE_CATEGORY_LABELS, procText } from "@/data/procedures-text";

const perCategory = procedures.reduce((m, p) => m.set(p.category, (m.get(p.category) ?? 0) + 1), new Map<string, number>());
const categories = [...perCategory.keys()].sort((a, b) => (perCategory.get(b) ?? 0) - (perCategory.get(a) ?? 0) || a.localeCompare(b));
const totalSteps = procedures.reduce((n, p) => n + p.steps.length, 0);
const totalAlerts = procedures.reduce((n, p) => n + p.safetyAlerts.length, 0);

const labelFor = (c: string, lang: "en" | "ar") => PROCEDURE_CATEGORY_LABELS[c]?.[lang] ?? c;

const Procedures = () => {
  const { t, language } = usePreferences();
  const tx = procText[language];
  const label = (c: string) => labelFor(c, language);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return procedures.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!needle || [p.title, p.description, p.category, labelFor(p.category, language), ...p.indications].some((x) => x.toLowerCase().includes(needle))),
    );
  }, [category, query, language]);

  const reset = () => {
    setQuery("");
    setCategory("all");
  };
  const phases = [
    { title: t.preProcedure, body: t.preProcedureDesc, icon: ShieldCheck },
    { title: t.intraProcedure, body: t.intraProcedureDesc, icon: Activity },
    { title: t.postProcedure, body: t.postProcedureDesc, icon: ClipboardCheck },
  ];

  return (
    <AppLayout illustration="icu" title={t.proceduresTitle} subtitle={t.evidenceBasedWorkflows}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Stethoscope} tone="primary" label={tx.procedures} value={procedures.length} />
        <StatTile icon={LayoutGrid} label={tx.categories} value={categories.length} />
        <StatTile icon={ListChecks} label={tx.steps} value={totalSteps} />
        <StatTile icon={ShieldAlert} tone="critical" label={tx.alerts} value={totalAlerts} />
      </section>

      <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
          <h2 className="text-sm font-semibold">{tx.workflow}</h2>
          <ol className="grid gap-2 sm:grid-cols-3">
            {phases.map(({ title, body, icon: Icon }, i) => (
              <li key={title} className="flex gap-3 rounded-2xl bg-secondary/50 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <Icon size={14} className="text-primary" aria-hidden="true" /> {title}
                  </span>
                  <span className="block text-xs text-muted-foreground">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
          <h2 className="text-sm font-semibold">{tx.biggest}</h2>
          <BarList ariaLabel={tx.biggest} rows={categories.slice(0, 6).map((c) => ({ key: c, label: label(c), value: perCategory.get(c) ?? 0 }))} />
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <div className="relative">
          <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchProcedures} aria-label={t.searchProcedures} className="h-11 rounded-2xl ps-11" />
        </div>
        <FilterChips
          ariaLabel={tx.categories}
          value={category}
          onChange={setCategory}
          options={[{ value: "all", label: tx.all, count: procedures.length }, ...categories.map((c) => ({ value: c, label: label(c), count: perCategory.get(c) ?? 0 }))]}
          hideEmpty
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {tx.showing} <span className="font-semibold tabular-nums text-foreground">{filtered.length}</span> / {procedures.length}
          </span>
          {(query || category !== "all") && (
            <Button size="sm" variant="ghost" onClick={reset}>
              {tx.reset}
            </Button>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState variant="no-results" title={t.noProcedures} action={<Button onClick={reset}>{tx.reset}</Button>} />
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/procedure/${p.id}`}
              className="group flex flex-col gap-2 rounded-3xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-primary">{label(p.category)}</span>
                <ChevronRight size={16} className="shrink-0 text-muted-foreground rtl:rotate-180" aria-hidden="true" />
              </span>
              <span dir="ltr" className="text-start font-semibold leading-tight">{p.title}</span>
              <span dir="ltr" className="text-start text-xs text-muted-foreground">{p.description}</span>
              <span className="mt-auto flex flex-wrap gap-3 pt-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ListChecks size={12} aria-hidden="true" /> <span className="font-semibold tabular-nums text-foreground">{p.steps.length}</span> {tx.steps}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldAlert size={12} className="text-medical-red" aria-hidden="true" /> <span className="font-semibold tabular-nums text-foreground">{p.safetyAlerts.length}</span> {tx.alerts}
                </span>
              </span>
            </Link>
          ))}
        </section>
      )}
    </AppLayout>
  );
};

export default Procedures;
