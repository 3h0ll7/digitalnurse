import { Droplet, Activity, Scale, Calculator as CalcIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/contexts/PreferencesContext";

const Calculators = () => {
  const navigate = useNavigate();
  const { t } = usePreferences();

  const calculators = [
    { id: "dosage", name: t.dosageCalculation, description: t.dosageCalculationDesc, icon: Droplet },
    { id: "iv-drip", name: t.ivDripRate, description: t.ivDripRateDesc, icon: Activity },
    { id: "bmi", name: t.bmiCalculator, description: t.bmiCalculatorDesc, icon: Scale },
    { id: "creatinine", name: t.creatinineClearance, description: t.creatinineClearanceDesc, icon: CalcIcon },
  ];

  return (
    <AppLayout title={t.calculatorsTitle} subtitle={t.calculatorsSubtitle}>
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.precisionDosing}</p>
        <h2 className="mt-3 text-3xl font-semibold">{t.calculatorsHeroHeading}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.calculatorsHeroDesc}</p>
      </section>

      <div className="grid gap-4">
        {calculators.map((calc) => {
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
