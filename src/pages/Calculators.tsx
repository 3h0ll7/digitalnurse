import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BookCheck, Calculator as CalcIcon, ChevronRight, LayoutGrid } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FilterChips from "@/components/data/FilterChips";
import StatTile from "@/components/data/StatTile";
import { CALCULATORS, CATEGORY_ORDER, type CalculatorCategory } from "@/components/calculators/registry";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/contexts/PreferencesContext";
import calculatorsI18n from "@/data/calculators-i18n.json";
import { calcText } from "@/data/calculators-text";

const countIn = (category: CalculatorCategory) => CALCULATORS.filter((c) => c.category === category).length;
const highAlertCount = CALCULATORS.filter((c) => c.highAlert).length;

const Calculators = () => {
  const { t, language } = usePreferences();
  const cx = calculatorsI18n[language];
  const tx = calcText[language].list;
  const [category, setCategory] = useState<"all" | CalculatorCategory>("all");

  const filtered = category === "all" ? CALCULATORS : CALCULATORS.filter((c) => c.category === category);
  const options = [
    { value: "all", label: cx.categories.all, count: CALCULATORS.length },
    ...CATEGORY_ORDER.map((value) => ({ value, label: cx.categories[value], count: countIn(value) })),
  ];

  return (
    <AppLayout illustration="station" title={t.calculatorsTitle} subtitle={t.calculatorsSubtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={CalcIcon} tone="primary" label={tx.total} value={CALCULATORS.length} />
        <StatTile icon={AlertTriangle} tone="critical" label={tx.highAlert} value={highAlertCount} hint="ISMP" />
        <StatTile icon={LayoutGrid} label={tx.categories} value={CATEGORY_ORDER.length} />
        <StatTile icon={BookCheck} tone="good" label={tx.sourced} value={CALCULATORS.length} />
      </section>

      <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="text-lg font-semibold">{t.calculatorsHeroHeading}</h2>
        <p className="text-sm text-muted-foreground">{t.calculatorsHeroDesc}</p>
        <FilterChips ariaLabel={tx.category} value={category} onChange={(v) => setCategory(v as typeof category)} options={options} hideEmpty />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {filtered.map(({ id, icon: Icon, category: cat, highAlert }) => (
          <Link
            key={id}
            to={`/calculator/${id}`}
            className="group flex items-center gap-4 rounded-3xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 space-y-1">
              <span className="block font-semibold leading-tight">{cx.calculators[id].name}</span>
              <span className="block text-xs text-muted-foreground">{cx.calculators[id].description}</span>
              <span className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-medium text-primary">{cx.categories[cat]}</span>
                {highAlert && (
                  <Badge variant="outline" className="border-medical-red/40 bg-medical-red/10 px-1.5 py-0 text-[10px] text-medical-red">
                    {tx.highAlertBadge}
                  </Badge>
                )}
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-label={tx.open} />
          </Link>
        ))}
      </section>
    </AppLayout>
  );
};

export default Calculators;
