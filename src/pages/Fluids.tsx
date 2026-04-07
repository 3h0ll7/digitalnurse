import { useMemo, useState } from "react";
import { Droplets } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/contexts/PreferencesContext";
import fluidsI18n from "@/data/fluids-i18n.json";

type FluidType = "CRYSTALLOIDS" | "COLLOIDS" | "BLOOD PRODUCTS";
type Tonicity = "isotonic" | "hypotonic" | "hypertonic";

interface FluidItem {
  name: string;
  type: FluidType;
  tonicity: Tonicity;
  composition: string;
  osmolarity: string;
  indications: string;
  contraindications: string;
  rateAdministration: string;
  nursingConsiderations: string;
  complications: string;
  specialPrecautions: string;
}

const fluids: FluidItem[] = [
  { name: "Normal Saline 0.9% (NS)", type: "CRYSTALLOIDS", tonicity: "isotonic", composition: "Na 154, Cl 154 mEq/L", osmolarity: "308 mOsm/L", indications: "Septic shock, hypovolemia, hyponatremia, DKA initial resuscitation", contraindications: "Severe hyperchloremic acidosis, fluid-overloaded HF", rateAdministration: "Bolus 500-1000 mL then reassess; maintenance per clinical need", nursingConsiderations: "Track chloride, acid-base status, urine output", complications: "Hyperchloremic metabolic acidosis, edema", specialPrecautions: "Use caution in renal failure and ARDS" },
  { name: "Lactated Ringer's (LR)", type: "CRYSTALLOIDS", tonicity: "isotonic", composition: "Na 130, Cl 109, K 4, Ca 3, Lactate 28 mEq/L", osmolarity: "273 mOsm/L", indications: "Trauma, burns, perioperative replacement", contraindications: "Severe hyperkalemia, liver failure (impaired lactate metabolism)", rateAdministration: "Bolus 500-1000 mL for resuscitation", nursingConsiderations: "Monitor potassium and calcium compatibility with meds", complications: "Alkalosis risk in large volumes", specialPrecautions: "Avoid co-infusing with blood in same line" },
  { name: "D5W (Dextrose 5% in Water)", type: "CRYSTALLOIDS", tonicity: "hypotonic", composition: "50 g/L dextrose, no electrolytes", osmolarity: "252 mOsm/L (becomes hypotonic)", indications: "Free-water replacement, hypernatremia", contraindications: "Increased ICP, shock resuscitation", rateAdministration: "Typical 50-150 mL/hr based on sodium goal", nursingConsiderations: "Frequent glucose and sodium checks", complications: "Hyponatremia, hyperglycemia", specialPrecautions: "Not for initial intravascular expansion" },
  { name: "D5 0.45% NS (D5 Half Normal Saline)", type: "CRYSTALLOIDS", tonicity: "hypertonic", composition: "Dextrose 5% + Na 77 + Cl 77 mEq/L", osmolarity: "406 mOsm/L", indications: "Maintenance fluids, postoperative replacement", contraindications: "Severe hyperglycemia or rapid sodium shifts", rateAdministration: "Maintenance 75-125 mL/hr individualized", nursingConsiderations: "Monitor glucose, sodium, and volume status", complications: "Hyperglycemia, fluid overload", specialPrecautions: "Adjust in diabetes and renal impairment" },
  { name: "0.45% NS (Half Normal Saline)", type: "CRYSTALLOIDS", tonicity: "hypotonic", composition: "Na 77, Cl 77 mEq/L", osmolarity: "154 mOsm/L", indications: "Hypernatremia and intracellular dehydration", contraindications: "Cerebral edema, trauma, hypovolemic shock", rateAdministration: "Infuse slowly with sodium correction target", nursingConsiderations: "Check Na every 4-6 hours", complications: "Cerebral edema if over-corrected", specialPrecautions: "Avoid in acute neurologic injury" },
  { name: "3% Hypertonic Saline", type: "CRYSTALLOIDS", tonicity: "hypertonic", composition: "Na 513, Cl 513 mEq/L", osmolarity: "1026 mOsm/L", indications: "Severe symptomatic hyponatremia, raised ICP", contraindications: "Chronic asymptomatic hyponatremia without close monitoring", rateAdministration: "100 mL bolus over 10 min or controlled infusion in ICU", nursingConsiderations: "Frequent sodium checks, neuro and cardiac monitoring", complications: "Osmotic demyelination, pulmonary edema", specialPrecautions: "Prefer central access for continuous infusion" },
  { name: "Albumin 5%", type: "COLLOIDS", tonicity: "isotonic", composition: "5 g albumin/100 mL", osmolarity: "~300 mOsm/L", indications: "Intravascular volume expansion", contraindications: "Severe anemia, uncompensated HF", rateAdministration: "250-500 mL depending on hemodynamics", nursingConsiderations: "Monitor BP response and lung exam", complications: "Pulmonary edema, allergic reaction", specialPrecautions: "Costly; reserve for selected cases" },
  { name: "Albumin 25%", type: "COLLOIDS", tonicity: "hypertonic", composition: "25 g albumin/100 mL", osmolarity: "~300 mOsm/L oncotic pull", indications: "Cirrhosis with ascites/paracentesis support", contraindications: "Hypovolemia without crystalloid backup", rateAdministration: "25-100 mL slow infusion", nursingConsiderations: "Assess intravascular depletion before dosing", complications: "Rapid fluid shifts, overload", specialPrecautions: "Combine with crystalloids when needed" },
  { name: "Hydroxyethyl Starch (Voluven)", type: "COLLOIDS", tonicity: "isotonic", composition: "HES 130/0.4", osmolarity: "~308 mOsm/L", indications: "Historically used for plasma expansion", contraindications: "Sepsis, burns, kidney injury, critical illness", rateAdministration: "Use is restricted in many ICUs", nursingConsiderations: "Monitor kidney function and bleeding risk", complications: "AKI, coagulopathy", specialPrecautions: "Controversial: associated with increased renal injury and mortality in critical illness" },
  { name: "Packed Red Blood Cells (PRBCs)", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "Concentrated RBCs, Hct ~55-70%", osmolarity: "~300 mOsm/L", indications: "Symptomatic anemia, hemorrhagic shock", contraindications: "No absolute if life-threatening bleed", rateAdministration: "Typically 1 unit over 1.5-3 hours", nursingConsiderations: "Type & crossmatch, baseline/15 min vitals", complications: "Hemolytic reaction, TACO, TRALI", specialPrecautions: "Use blood filter and dedicated line" },
  { name: "Fresh Frozen Plasma (FFP)", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "All coagulation factors", osmolarity: "~280-300 mOsm/L", indications: "Coagulopathy with bleeding, warfarin reversal", contraindications: "Volume-sensitive patients unless essential", rateAdministration: "10-15 mL/kg guided by INR/clinical bleeding", nursingConsiderations: "ABO compatibility required", complications: "Allergic reactions, TRALI, overload", specialPrecautions: "Thaw timing and rapid availability planning" },
  { name: "Platelets", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "Platelet concentrate", osmolarity: "~300 mOsm/L", indications: "Thrombocytopenia with bleeding/procedure", contraindications: "TTP/HIT unless life-threatening bleed", rateAdministration: "1 adult dose over 20-60 min", nursingConsiderations: "Pre/post platelet count response", complications: "Febrile reaction, alloimmunization", specialPrecautions: "Transfuse promptly after issue" },
  { name: "Cryoprecipitate", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "Fibrinogen, factor VIII, vWF, factor XIII", osmolarity: "~280-300 mOsm/L", indications: "Low fibrinogen in massive bleeding", contraindications: "No indication without hypofibrinogenemia", rateAdministration: "Typically pooled units over 30-60 min", nursingConsiderations: "Target fibrinogen >150-200 mg/dL in bleeding", complications: "Allergic reaction, infection risk", specialPrecautions: "ABO-compatible preferred when possible" }
];

const electrolyteCards = [
  {
    key: "POTASSIUM",
    titleEn: "Potassium (K+)",
    normal: "3.5-5.0 mEq/L",
    labels: ["hypokalemia", "hyperkalemia"],
    lines: [
      "K+ 3.0-3.4: oral replacement protocol.",
      "K+ 2.5-2.9: IV 10-20 mEq/hr + cardiac monitor.",
      "K+ < 2.5: critical, ICU IV replacement protocol.",
      "K+ 5.1-5.9: Kayexalate + recheck.",
      "K+ 6.0-6.4: Calcium gluconate + Insulin/D50 + Albuterol.",
      "K+ ≥ 6.5: EMERGENCY calcium chloride + above + emergent dialysis.",
      "Max IV rate: 10 mEq/hr peripheral, 20 mEq/hr central.",
      "Continuous telemetry when K+ <3.0 or ≥6.0."
    ]
  },
  {
    key: "SODIUM",
    titleEn: "Sodium (Na+)",
    normal: "135-145 mEq/L",
    labels: ["hyponatremia", "hypernatremia"],
    lines: [
      "Hyponatremia correction limit: max 8-10 mEq/L per 24 hrs.",
      "Use acute vs chronic symptom-based approach.",
      "3% saline dose can be estimated from sodium deficit and body water.",
      "Hypernatremia: calculate free water deficit.",
      "Do not lower Na by >10-12 mEq/L/day in chronic states."
    ]
  },
  {
    key: "MAGNESIUM",
    titleEn: "Magnesium (Mg2+)",
    normal: "1.7-2.2 mg/dL",
    labels: ["hypomagnesemia"],
    lines: [
      "Mild: oral magnesium if tolerated.",
      "Moderate: 1-2 g IV magnesium sulfate.",
      "Severe/symptomatic: 4-6 g IV with monitoring.",
      "Eclampsia: 4-6 g loading then 1-2 g/hr infusion.",
      "Torsades: 2 g IV push over 10-15 minutes."
    ]
  },
  {
    key: "CALCIUM",
    titleEn: "Calcium (Ca2+)",
    normal: "8.5-10.5 mg/dL total / 4.5-5.5 mg/dL ionized",
    labels: ["hypocalcemia"],
    lines: [
      "Calcium gluconate preferred for peripheral administration.",
      "Calcium chloride has more elemental calcium; prefer central line.",
      "Symptomatic hypocalcemia: immediate IV calcium + ECG monitoring."
    ]
  },
  {
    key: "PHOSPHATE",
    titleEn: "Phosphate (PO4)",
    normal: "2.5-4.5 mg/dL",
    labels: ["hypophosphatemia"],
    lines: [
      "Mild-moderate: oral replacement if GI tract usable.",
      "Severe or symptomatic: IV phosphate replacement.",
      "Watch for refeeding syndrome in malnourished ICU patients."
    ]
  }
] as const;

const fluidComparison = [
  ["NS", "154", "0", "154", "0", "0", "308", "5.5"],
  ["LR", "130", "4", "109", "3", "28", "273", "6.5"],
  ["D5W", "0", "0", "0", "0", "0", "252", "4.2"],
  ["0.45% NS", "77", "0", "77", "0", "0", "154", "5.6"],
  ["3% NaCl", "513", "0", "513", "0", "0", "1026", "5.0"]
];

const normalRanges = [
  ["K+", "3.5-5.0 mEq/L", "<2.5 or ≥6.5"],
  ["Na+", "135-145 mEq/L", "<120 or >160"],
  ["Mg2+", "1.7-2.2 mg/dL", "<1.2"],
  ["Ca2+ (ionized)", "4.5-5.5 mg/dL", "<3.5"],
  ["PO4", "2.5-4.5 mg/dL", "<1.0"]
];

const checklist = [
  "Verify order, consent, blood type, and indication.",
  "Baseline vitals immediately before transfusion.",
  "Start slowly for first 15 minutes with direct observation.",
  "Repeat vitals at 15 min, hourly, and post-transfusion.",
  "Stop transfusion and notify MD for any reaction."
];

const reactions = [
  ["Acute hemolytic", "Fever, flank pain, hypotension", "Stop transfusion, NS, notify blood bank"],
  ["Febrile non-hemolytic", "Fever/chills", "Pause, assess, antipyretic per order"],
  ["Allergic", "Rash, urticaria, wheeze", "Stop, antihistamine, escalate if severe"],
  ["TRALI", "Hypoxemia, pulmonary edema", "Stop, oxygen/vent support, ICU care"],
  ["TACO", "Dyspnea, hypertension, JVP rise", "Stop, upright, diuretic as ordered"]
];

const Fluids = () => {
  const { language } = usePreferences();
  const copy = fluidsI18n[language];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<keyof typeof copy.categories>("ALL");
  const [calc, setCalc] = useState({
    weight: "",
    dehydration: "",
    currentNa: "",
    targetNa: "140",
    gender: "male",
    initialNa: "",
    nowNa: "",
    hours: "",
    volume: "",
    time: "",
    dropFactor: "20"
  });

  const filteredFluids = useMemo(() => {
    return fluids.filter((item) => {
      const needle = search.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(needle) || item.indications.toLowerCase().includes(needle);
      const matchesCategory = category === "ALL" || category === "IV FLUIDS" || item.type === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const fluidDeficit = (Number(calc.weight) || 0) * ((Number(calc.dehydration) || 0) / 100) * 1000;
  const maintenanceRate = (() => {
    const w = Number(calc.weight) || 0;
    if (w <= 10) return w * 4;
    if (w <= 20) return 40 + (w - 10) * 2;
    return 60 + (w - 20);
  })();
  const tbw = (Number(calc.weight) || 0) * (calc.gender === "male" ? 0.6 : 0.5);
  const freeWaterDeficit = tbw * (((Number(calc.currentNa) || 0) / (Number(calc.targetNa) || 1)) - 1);
  const sodiumRate = ((Number(calc.nowNa) || 0) - (Number(calc.initialNa) || 0)) / (Number(calc.hours) || 1);
  const dripMlh = (Number(calc.volume) || 0) / ((Number(calc.time) || 1));
  const dripGtts = (dripMlh * (Number(calc.dropFactor) || 0)) / 60;

  return (
    <AppLayout title={copy.title} subtitle={copy.subtitle}>
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="relative">
          <Droplets size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary rtl:left-auto rtl:right-4" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.searchPlaceholder} className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 rtl:pl-4 rtl:pr-12 text-white" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(copy.categories).map(([key, label]) => (
            <Button key={key} size="sm" variant="outline" onClick={() => setCategory(key as keyof typeof copy.categories)} className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-widest ${category === key ? "border-primary/50 bg-primary/30 text-white" : "border-white/20 text-muted-foreground"}`}>
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cyan-100">{copy.sectionFluids}</h2>
        {filteredFluids.map((item) => (
          <details key={item.name} className="group rounded-3xl border border-white/10 bg-card/70 p-4">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-white">{item.name}</p>
                <Badge className="border-cyan-300/40 bg-cyan-500/15 text-cyan-100">{copy.types[item.type === "CRYSTALLOIDS" ? "crystalloid" : item.type === "COLLOIDS" ? "colloid" : "blood"]}</Badge>
                <Badge className="border-white/20 bg-white/10 text-white">{copy.tonicity[item.tonicity]}</Badge>
              </div>
            </summary>
            <div className="mt-3 grid gap-2 text-sm text-slate-200">
              <p><span className="text-cyan-200">{copy.fields.composition}:</span> {item.composition}</p>
              <p><span className="text-cyan-200">{copy.fields.osmolarity}:</span> {item.osmolarity}</p>
              <p><span className="text-cyan-200">{copy.fields.indications}:</span> {item.indications}</p>
              <p><span className="text-cyan-200">{copy.fields.contraindications}:</span> {item.contraindications}</p>
              <p><span className="text-cyan-200">{copy.fields.rateAdministration}:</span> {item.rateAdministration}</p>
              <p><span className="text-cyan-200">{copy.fields.nursingConsiderations}:</span> {item.nursingConsiderations}</p>
              <p><span className="text-cyan-200">{copy.fields.complications}:</span> {item.complications}</p>
              <p><span className="text-cyan-200">{copy.fields.specialPrecautions}:</span> {item.specialPrecautions}</p>
            </div>
          </details>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cyan-100">{copy.sectionElectrolytes}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {electrolyteCards.map((card) => (
            <Card key={card.key} className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-100">
              <p className="text-base font-semibold text-white">{card.titleEn}</p>
              <p className="text-cyan-200">{copy.electrolytes.normalRange}: {card.normal}</p>
              <div className="my-2 flex flex-wrap gap-2">
                {card.labels.map((l) => (
                  <Badge key={l} className="border-white/20 bg-white/10 text-white">{copy.electrolytes[l as keyof typeof copy.electrolytes]}</Badge>
                ))}
              </div>
              <ul className="list-disc space-y-1 ps-5">
                {card.lines.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cyan-100">{copy.sectionCalculators}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <p className="font-semibold">{copy.calculator.fluidDeficitTitle}</p>
            <Input className="mt-2 bg-white/5" placeholder={copy.calculator.weight} value={calc.weight} onChange={(e) => setCalc({ ...calc, weight: e.target.value })} />
            <Input className="mt-2 bg-white/5" placeholder={copy.calculator.dehydrationPercent} value={calc.dehydration} onChange={(e) => setCalc({ ...calc, dehydration: e.target.value })} />
            <p className="mt-2 text-sm">{copy.calculator.result}: {fluidDeficit.toFixed(0)} mL</p>
            <p className="text-xs text-muted-foreground">{copy.calculator.replacementPlan}: 50% in first 8h, remaining over next 16h.</p>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <p className="font-semibold">{copy.calculator.maintenanceTitle}</p>
            <p className="mt-2 text-sm">4-2-1 Rule (Holliday-Segar)</p>
            <p className="mt-2 text-sm">{copy.calculator.maintenanceRate}: {maintenanceRate.toFixed(1)} mL/hr</p>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <p className="font-semibold">{copy.calculator.freeWaterTitle}</p>
            <Input className="mt-2 bg-white/5" placeholder={copy.calculator.currentNa} value={calc.currentNa} onChange={(e) => setCalc({ ...calc, currentNa: e.target.value })} />
            <Input className="mt-2 bg-white/5" placeholder={copy.calculator.targetNa} value={calc.targetNa} onChange={(e) => setCalc({ ...calc, targetNa: e.target.value })} />
            <select className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3" value={calc.gender} onChange={(e) => setCalc({ ...calc, gender: e.target.value })}>
              <option value="male">{copy.calculator.male}</option>
              <option value="female">{copy.calculator.female}</option>
            </select>
            <p className="mt-2 text-sm">{copy.calculator.result}: {freeWaterDeficit.toFixed(2)} L</p>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <p className="font-semibold">{copy.calculator.sodiumRateTitle}</p>
            <Input className="mt-2 bg-white/5" placeholder={copy.calculator.initialNa} value={calc.initialNa} onChange={(e) => setCalc({ ...calc, initialNa: e.target.value })} />
            <Input className="mt-2 bg-white/5" placeholder={copy.calculator.currentNa} value={calc.nowNa} onChange={(e) => setCalc({ ...calc, nowNa: e.target.value })} />
            <Input className="mt-2 bg-white/5" placeholder={copy.calculator.hoursElapsed} value={calc.hours} onChange={(e) => setCalc({ ...calc, hours: e.target.value })} />
            <p className="mt-2 text-sm">{copy.calculator.correctionRate}: {sodiumRate.toFixed(2)} mEq/L/hr</p>
            <p className={`text-xs ${sodiumRate <= 0.5 ? "text-emerald-300" : "text-red-300"}`}>{sodiumRate <= 0.5 ? copy.calculator.safe : copy.calculator.tooFast}</p>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 md:col-span-2">
            <p className="font-semibold">{copy.calculator.dripRateTitle}</p>
            <div className="grid gap-2 md:grid-cols-3">
              <Input className="bg-white/5" placeholder={copy.calculator.volume} value={calc.volume} onChange={(e) => setCalc({ ...calc, volume: e.target.value })} />
              <Input className="bg-white/5" placeholder={copy.calculator.timeHours} value={calc.time} onChange={(e) => setCalc({ ...calc, time: e.target.value })} />
              <Input className="bg-white/5" placeholder={copy.calculator.dropFactor} value={calc.dropFactor} onChange={(e) => setCalc({ ...calc, dropFactor: e.target.value })} />
            </div>
            <p className="mt-2 text-sm">{copy.calculator.gttsMin}: {dripGtts.toFixed(1)} | {copy.calculator.mlHour}: {dripMlh.toFixed(1)}</p>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cyan-100">{copy.sectionQuick}</h2>
        <Card className="rounded-3xl border-white/10 bg-card/70 p-4 overflow-x-auto">
          <p className="mb-2 font-semibold">{copy.quick.fluidComparison}</p>
          <table className="w-full text-sm"><thead><tr className="text-left"><th>Fluid</th><th>Na</th><th>K</th><th>Cl</th><th>Ca</th><th>Lactate</th><th>Osm</th><th>pH</th></tr></thead><tbody>{fluidComparison.map((row) => <tr key={row[0]} className="border-t border-white/10">{row.map((c) => <td key={c} className="py-1 pe-2">{c}</td>)}</tr>)}</tbody></table>
        </Card>
        <Card className="rounded-3xl border-white/10 bg-card/70 p-4 overflow-x-auto">
          <p className="mb-2 font-semibold">{copy.quick.normalRanges}</p>
          <table className="w-full text-sm"><thead><tr className="text-left"><th>Electrolyte</th><th>{copy.quick.normalRanges}</th><th className="text-red-300">{copy.quick.criticalPanic}</th></tr></thead><tbody>{normalRanges.map((row) => <tr key={row[0]} className="border-t border-white/10">{row.map((c, i) => <td key={c} className={`py-1 pe-2 ${i === 2 ? "text-red-300" : ""}`}>{c}</td>)}</tr>)}</tbody></table>
        </Card>
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <p className="mb-2 font-semibold">{copy.quick.transfusionChecklist}</p>
            <ol className="list-decimal space-y-1 ps-5 text-sm">{checklist.map((item) => <li key={item}>{item}</li>)}</ol>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 overflow-x-auto">
            <p className="mb-2 font-semibold">{copy.quick.transfusionReactions}</p>
            <table className="w-full text-xs"><thead><tr className="text-left"><th>Type</th><th>Signs</th><th>Action</th></tr></thead><tbody>{reactions.map((r) => <tr key={r[0]} className="border-t border-white/10">{r.map((c) => <td key={c} className="py-1 pe-2">{c}</td>)}</tr>)}</tbody></table>
          </Card>
        </div>
      </section>
    </AppLayout>
  );
};

export default Fluids;
