import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookCheck, ChevronRight, ClipboardList, LayoutGrid, Search, Stethoscope } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import FilterChips from "@/components/data/FilterChips";
import StatTile from "@/components/data/StatTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/contexts/PreferencesContext";
import { assessmentScales } from "@/data/assessmentScales";
import { assessText, CATEGORY_LABELS } from "@/data/assessments-text";
import type { AssessmentCategory } from "@/lib/clinical/scores";

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS) as AssessmentCategory[];
const countIn = (c: AssessmentCategory) => assessmentScales.filter((s) => s.category === c).length;
const usedCategories = CATEGORY_ORDER.filter((c) => countIn(c) > 0);
const sourceCount = new Set(assessmentScales.flatMap((s) => s.sources)).size;
const signed = (n: number, withPlus: boolean) => (n < 0 ? `−${-n}` : withPlus && n > 0 ? `+${n}` : String(n));
const formatRange = ([lo, hi]: [number, number]) => `${signed(lo, false)} – ${signed(hi, lo < 0)}`;
const itemCount = (s: (typeof assessmentScales)[number]) => (s.kind === "news2" ? 7 : s.kind === "must" ? 3 : s.kind === "cam-icu" ? 4 : s.items.reduce((n, i) => n + (i.multi ? i.options.length : 1), 0));

const Assessments = () => {
  const { t, language } = usePreferences();
  const tx = assessText[language];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | AssessmentCategory>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return assessmentScales.filter(
      (s) =>
        (category === "all" || s.category === category) &&
        (!needle || [s.name, s.short, s.description, CATEGORY_LABELS[s.category].en, CATEGORY_LABELS[s.category].ar].some((x) => x.toLowerCase().includes(needle))),
    );
  }, [category, query]);

  const options = [
    { value: "all", label: tx.all, count: assessmentScales.length },
    ...usedCategories.map((c) => ({ value: c, label: CATEGORY_LABELS[c][language], count: countIn(c) })),
  ];
  const reset = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <AppLayout illustration="triage" title={t.assessmentHubTitle} subtitle={t.assessmentHubSubtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={ClipboardList} tone="primary" label={tx.tools} value={assessmentScales.length} />
        <StatTile icon={LayoutGrid} label={tx.categories} value={usedCategories.length} />
        <StatTile icon={BookCheck} tone="good" label={tx.sourced} value={sourceCount} />
        <StatTile icon={Stethoscope} label={tx.bedside} value={assessmentScales.filter((s) => s.id !== "sofa").length} />
      </section>

      <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <div className="relative">
          <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tx.search} aria-label={tx.search} className="h-11 rounded-2xl ps-11" />
        </div>
        <FilterChips ariaLabel={tx.categories} value={category} onChange={(v) => setCategory(v as typeof category)} options={options} hideEmpty />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {tx.showing} <span className="font-semibold tabular-nums text-foreground">{filtered.length}</span> / {assessmentScales.length}
          </span>
          {(query || category !== "all") && (
            <Button size="sm" variant="ghost" onClick={reset}>
              {tx.reset}
            </Button>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState variant="no-results" title={tx.empty} action={<Button onClick={reset}>{tx.reset}</Button>} />
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <Link
              key={s.id}
              to={`/scale/${s.id}`}
              className="group flex flex-col gap-2 rounded-3xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-primary">{CATEGORY_LABELS[s.category][language]}</span>
                <ChevronRight size={16} className="shrink-0 text-muted-foreground rtl:rotate-180" aria-hidden="true" />
              </span>
              <span dir="ltr" className="text-start text-lg font-semibold leading-tight">{s.short}</span>
              <span dir="ltr" className="text-start text-xs text-muted-foreground">{s.description}</span>
              <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-muted-foreground">
                <span>
                  {tx.range}: <span dir="ltr" className="font-semibold tabular-nums text-foreground">{s.kind === "cam-icu" ? "+ / −" : formatRange(s.range)}</span>
                </span>
                <span>
                  <span className="font-semibold tabular-nums text-foreground">{itemCount(s)}</span> {tx.items}
                </span>
              </span>
            </Link>
          ))}
        </section>
      )}
    </AppLayout>
  );
};

export default Assessments;
