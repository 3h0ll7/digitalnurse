import { Baby, Calculator as CalcIcon, Droplet, Activity, Scale, Syringe, Square, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/contexts/PreferencesContext";
import calculatorsI18n from "@/data/calculators-i18n.json";

type CalculatorCategory = "dosing" | "body" | "obstetric" | "general";
type FilterCategory = "all" | CalculatorCategory;

const Calculators = () => {
  const navigate = useNavigate();
  const { t, language } = usePreferences();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const cx = calculatorsI18n[language];

  const calculators = useMemo(
    () => [
      { id: "dosage", name: cx.calculators.dosage.name, description: cx.calculators.dosage.description, icon: Droplet, category: "dosing" as CalculatorCategory },
      { id: "iv-drip", name: cx.calculators["iv-drip"].name, description: cx.calculators["iv-drip"].description, icon: Activity, category: "dosing" as CalculatorCategory },
      { id: "bmi", name: cx.calculators.bmi.name, description: cx.calculators.bmi.description, icon: Scale, category: "body" as CalculatorCategory },
      { id: "creatinine", name: cx.calculators.creatinine.name, description: cx.calculators.creatinine.description, icon: CalcIcon, category: "general" as CalculatorCategory },
      { id: "vasopressor", name: cx.calculators.vasopressor.name, description: cx.calculators.vasopressor.description, icon: Activity, category: "dosing" as CalculatorCategory },
      { id: "heparin", name: cx.calculators.heparin.name, description: cx.calculators.heparin.description, icon: Droplet, category: "dosing" as CalculatorCategory },
      { id: "insulin", name: cx.calculators.insulin.name, description: cx.calculators.insulin.description, icon: Syringe, category: "dosing" as CalculatorCategory },
      { id: "ibw", name: cx.calculators.ibw.name, description: cx.calculators.ibw.description, icon: User, category: "body" as CalculatorCategory },
      { id: "bsa", name: cx.calculators.bsa.name, description: cx.calculators.bsa.description, icon: Square, category: "body" as CalculatorCategory },
      { id: "edd", name: cx.calculators.edd.name, description: cx.calculators.edd.description, icon: Baby, category: "obstetric" as CalculatorCategory }
    ],
    [cx]
  );

  const filters: { key: FilterCategory; label: string }[] = [
    { key: "all", label: cx.categories.all },
    { key: "dosing", label: cx.categories.dosing },
    { key: "body", label: cx.categories.body },
    { key: "obstetric", label: cx.categories.obstetric },
    { key: "general", label: cx.categories.general }
  ];

  const filtered = activeCategory === "all" ? calculators : calculators.filter((calc) => calc.category === activeCategory);

  return (
    <AppLayout title={t.calculatorsTitle} subtitle={t.calculatorsSubtitle}>
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{cx.countLabel}</p>
        <h2 className="mt-3 text-3xl font-semibold">{t.calculatorsHeroHeading}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.calculatorsHeroDesc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveCategory(filter.key)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors ${
                activeCategory === filter.key
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-white/15 bg-white/5 text-muted-foreground hover:border-primary/40"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-4">
        {filtered.map((calc) => {
          const Icon = calc.icon;
          return (
            <Card
              key={calc.id}
              onClick={() => navigate(`/calculator/${calc.id}`)}
              className="group cursor-pointer rounded-3xl border border-white/10 bg-card/70 p-5 text-white shadow-[0_15px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary">
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{calc.name}</h3>
                  <p className="text-sm text-muted-foreground">{calc.description}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.open}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Calculators;
