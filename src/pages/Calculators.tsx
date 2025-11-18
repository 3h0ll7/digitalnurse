import { Droplet, Activity, Scale, Calculator as CalcIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";

const calculators = [
  {
    id: "dosage",
    name: "Dosage Calculation",
    description: "Calculate medication dosage based on weight",
    icon: Droplet,
  },
  {
    id: "iv-drip",
    name: "IV Drip Rate",
    description: "Calculate mL/hour and drops/min",
    icon: Activity,
  },
  {
    id: "bmi",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index",
    icon: Scale,
  },
  {
    id: "creatinine",
    name: "Creatinine Clearance",
    description: "Calculate renal function",
    icon: CalcIcon,
  },
];

const Calculators = () => {
  const navigate = useNavigate();

  return (
    <AppLayout title="Clinical Calculators" subtitle="Smart dosing & drip tools">
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Precision dosing</p>
        <h2 className="mt-3 text-3xl font-semibold">Frictionless tools engineered for bedside titrations.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every calculator mirrors the Digital Nurse identity with clean inputs, contrast, and escalation prompts.
        </p>
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
                <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Open →</span>
              </div>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Calculators;
