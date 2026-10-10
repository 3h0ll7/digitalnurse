import { useMemo, useState } from "react";
import { Droplets, Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import BandBar, { type Band } from "@/components/data/BandBar";
import BarList from "@/components/data/BarList";
import FilterChips from "@/components/data/FilterChips";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import StepTimeline from "@/components/data/StepTimeline";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/contexts/PreferencesContext";
import fluidsI18n from "@/data/fluids-i18n.json";
import { dripRate, fluidDeficit, freeWaterDeficit, hollidaySegar, potassiumBand, sodiumChange, type PotassiumBand } from "@/lib/clinical/fluids";
import { parseNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";

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
  { name: "Plasma-Lyte A", type: "CRYSTALLOIDS", tonicity: "isotonic", composition: "Na 140, K 5, Mg 3, Cl 98, Acetate 27, Gluconate 23 mEq/L", osmolarity: "294 mOsm/L", indications: "Balanced resuscitation and replacement, perioperative fluid", contraindications: "Hyperkalemia; caution in severe renal impairment", rateAdministration: "Bolus 500-1000 mL then reassess", nursingConsiderations: "Balanced crystalloid with less chloride than NS; monitor electrolytes", complications: "Fluid overload", specialPrecautions: "Contains no calcium (compatible with blood products per label)" },
  { name: "D5W (Dextrose 5% in Water)", type: "CRYSTALLOIDS", tonicity: "hypotonic", composition: "50 g/L dextrose, no electrolytes", osmolarity: "252 mOsm/L (becomes hypotonic)", indications: "Free-water replacement, hypernatremia", contraindications: "Increased ICP, shock resuscitation", rateAdministration: "Typical 50-150 mL/hr based on sodium goal", nursingConsiderations: "Frequent glucose and sodium checks", complications: "Hyponatremia, hyperglycemia", specialPrecautions: "Not for initial intravascular expansion" },
  { name: "D5 0.45% NS (D5 Half Normal Saline)", type: "CRYSTALLOIDS", tonicity: "hypertonic", composition: "Dextrose 5% + Na 77 + Cl 77 mEq/L", osmolarity: "406 mOsm/L in the bag — hypotonic once the dextrose is metabolised", indications: "Maintenance fluids, postoperative replacement", contraindications: "Severe hyperglycemia or rapid sodium shifts", rateAdministration: "Maintenance 75-125 mL/hr individualized", nursingConsiderations: "Monitor glucose, sodium, and volume status", complications: "Hyperglycemia, fluid overload, hyponatremia", specialPrecautions: "Adjust in diabetes and renal impairment" },
  { name: "0.45% NS (Half Normal Saline)", type: "CRYSTALLOIDS", tonicity: "hypotonic", composition: "Na 77, Cl 77 mEq/L", osmolarity: "154 mOsm/L", indications: "Hypernatremia and intracellular dehydration", contraindications: "Cerebral edema, trauma, hypovolemic shock", rateAdministration: "Infuse slowly with sodium correction target", nursingConsiderations: "Check Na every 4-6 hours", complications: "Cerebral edema if over-corrected", specialPrecautions: "Avoid in acute neurologic injury" },
  { name: "3% Hypertonic Saline", type: "CRYSTALLOIDS", tonicity: "hypertonic", composition: "Na 513, Cl 513 mEq/L", osmolarity: "1026 mOsm/L", indications: "Severe symptomatic hyponatremia, raised ICP", contraindications: "Chronic asymptomatic hyponatremia without close monitoring", rateAdministration: "100 mL bolus over 10 min or controlled infusion in ICU", nursingConsiderations: "Frequent sodium checks, neuro and cardiac monitoring", complications: "Osmotic demyelination, pulmonary edema", specialPrecautions: "Prefer central access for continuous infusion" },
  { name: "Albumin 5%", type: "COLLOIDS", tonicity: "isotonic", composition: "5 g albumin/100 mL", osmolarity: "~300 mOsm/L", indications: "Intravascular volume expansion", contraindications: "Severe anemia, uncompensated HF", rateAdministration: "250-500 mL depending on hemodynamics", nursingConsiderations: "Monitor BP response and lung exam", complications: "Pulmonary edema, allergic reaction", specialPrecautions: "Costly; reserve for selected cases" },
  { name: "Albumin 25%", type: "COLLOIDS", tonicity: "hypertonic", composition: "25 g albumin/100 mL", osmolarity: "~300 mOsm/L oncotic pull", indications: "Cirrhosis with ascites/paracentesis support", contraindications: "Hypovolemia without crystalloid backup", rateAdministration: "25-100 mL slow infusion", nursingConsiderations: "Assess intravascular depletion before dosing", complications: "Rapid fluid shifts, overload", specialPrecautions: "Combine with crystalloids when needed" },
  { name: "Hydroxyethyl Starch (Voluven)", type: "COLLOIDS", tonicity: "isotonic", composition: "HES 130/0.4", osmolarity: "~308 mOsm/L", indications: "Historically used for plasma expansion", contraindications: "Sepsis, burns, kidney injury, critical illness", rateAdministration: "Use is restricted in many ICUs", nursingConsiderations: "Monitor kidney function and bleeding risk", complications: "AKI, coagulopathy", specialPrecautions: "Controversial: associated with increased renal injury and mortality in critical illness" },
  { name: "Packed Red Blood Cells (PRBCs)", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "Concentrated RBCs, Hct ~55-70%", osmolarity: "~300 mOsm/L", indications: "Symptomatic anemia, hemorrhagic shock", contraindications: "No absolute if life-threatening bleed", rateAdministration: "Typically 1 unit over 1.5-3 hours", nursingConsiderations: "Type & crossmatch, baseline/15 min vitals", complications: "Hemolytic reaction, TACO, TRALI", specialPrecautions: "Use blood filter and dedicated line" },
  { name: "Fresh Frozen Plasma (FFP)", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "All coagulation factors", osmolarity: "~280-300 mOsm/L", indications: "Coagulopathy with bleeding, warfarin reversal", contraindications: "Volume-sensitive patients unless essential", rateAdministration: "10-15 mL/kg guided by INR/clinical bleeding", nursingConsiderations: "ABO compatibility required", complications: "Allergic reactions, TRALI, overload", specialPrecautions: "Thaw timing and rapid availability planning" },
  { name: "Platelets", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "Platelet concentrate", osmolarity: "~300 mOsm/L", indications: "Thrombocytopenia with bleeding/procedure", contraindications: "TTP/HIT unless life-threatening bleed", rateAdministration: "1 adult dose over 20-60 min", nursingConsiderations: "Pre/post platelet count response", complications: "Febrile reaction, alloimmunization", specialPrecautions: "Transfuse promptly after issue" },
  { name: "Cryoprecipitate", type: "BLOOD PRODUCTS", tonicity: "isotonic", composition: "Fibrinogen, factor VIII, vWF, factor XIII", osmolarity: "~280-300 mOsm/L", indications: "Low fibrinogen in massive bleeding", contraindications: "No indication without hypofibrinogenemia", rateAdministration: "Typically pooled units over 30-60 min", nursingConsiderations: "Target fibrinogen >150-200 mg/dL in bleeding", complications: "Allergic reaction, infection risk", specialPrecautions: "ABO-compatible preferred when possible" },
];

/** mEq/L (Mg as mEq/L) and mOsm/L from product labels; pH is the label's nominal value. */
const composition = [
  { key: "ns", name: "0.9% NaCl", na: 154, k: 0, cl: 154, ca: 0, mg: 0, buffer: 0, osm: 308, ph: "5.5" },
  { key: "lr", name: "Lactated Ringer's", na: 130, k: 4, cl: 109, ca: 3, mg: 0, buffer: 28, osm: 273, ph: "6.5" },
  { key: "pl", name: "Plasma-Lyte A", na: 140, k: 5, cl: 98, ca: 0, mg: 3, buffer: 50, osm: 294, ph: "7.4" },
  { key: "d5w", name: "D5W", na: 0, k: 0, cl: 0, ca: 0, mg: 0, buffer: 0, osm: 252, ph: "4.3" },
  { key: "half", name: "0.45% NaCl", na: 77, k: 0, cl: 77, ca: 0, mg: 0, buffer: 0, osm: 154, ph: "5.6" },
  { key: "hyp", name: "3% NaCl", na: 513, k: 0, cl: 513, ca: 0, mg: 0, buffer: 0, osm: 1026, ph: "5.0" },
];

type ElectrolyteCard = { key: string; titleEn: string; normal: string; labels: string[]; lines: string[] };

const electrolyteCards: ElectrolyteCard[] = [
  {
    key: "POTASSIUM",
    titleEn: "Potassium (K⁺)",
    normal: "3.5–5.0 mmol/L",
    labels: ["hypokalemia", "hyperkalemia"],
    lines: [
      "K⁺ 3.0–3.4: oral replacement if the gut works; find the cause.",
      "K⁺ 2.5–2.9: IV replacement with cardiac monitoring.",
      "K⁺ < 2.5: severe — IV replacement on a monitor, check magnesium.",
      "Max IV rate (typical policy): 10 mmol/h peripheral, 20 mmol/h central with monitoring.",
      "K⁺ 5.5–5.9 (mild): look for the cause, stop potassium-raising drugs, recheck.",
      "K⁺ 6.0–6.4 (moderate): 12-lead ECG, insulin–glucose; consider a potassium binder (e.g. sodium zirconium cyclosilicate).",
      "K⁺ ≥ 6.5 or ECG changes (severe): IV calcium to protect the heart, insulin–glucose, nebulised salbutamol, urgent renal review.",
      "Sodium polystyrene (Kayexalate) is no longer recommended for acute hyperkalaemia.",
    ],
  },
  {
    key: "SODIUM",
    titleEn: "Sodium (Na⁺)",
    normal: "135–145 mmol/L",
    labels: ["hyponatremia", "hypernatremia"],
    lines: [
      "Chronic hyponatraemia: raise Na⁺ by no more than 10 mmol/L in 24 h (8 if high risk of osmotic demyelination).",
      "Severe symptoms: 150 mL 3% saline over 20 min, repeat with Na⁺ checks (aim +5 mmol/L in the first hour).",
      "Hypernatraemia: calculate the free water deficit and correct slowly in chronic cases.",
      "Check Na⁺ every 2–6 h during active correction.",
    ],
  },
  {
    key: "MAGNESIUM",
    titleEn: "Magnesium (Mg²⁺)",
    normal: "1.7–2.2 mg/dL",
    labels: ["hypomagnesemia"],
    lines: [
      "Mild: oral magnesium if tolerated.",
      "Moderate: 1–2 g IV magnesium sulfate.",
      "Severe/symptomatic: 4–6 g IV with monitoring.",
      "Eclampsia: 4–6 g loading then 1–2 g/h infusion.",
      "Torsades: 2 g IV over 10–15 minutes.",
    ],
  },
  {
    key: "CALCIUM",
    titleEn: "Calcium (Ca²⁺)",
    normal: "8.5–10.5 mg/dL total · 1.12–1.32 mmol/L ionised",
    labels: ["hypocalcemia"],
    lines: [
      "Calcium gluconate is preferred for peripheral administration.",
      "Calcium chloride has 3× more elemental calcium; prefer a central line.",
      "Symptomatic hypocalcaemia: immediate IV calcium with ECG monitoring.",
    ],
  },
  {
    key: "PHOSPHATE",
    titleEn: "Phosphate (PO₄)",
    normal: "2.5–4.5 mg/dL",
    labels: ["hypophosphatemia"],
    lines: [
      "Mild–moderate: oral replacement if the GI tract is usable.",
      "Severe or symptomatic: IV phosphate replacement.",
      "Watch for refeeding syndrome in malnourished ICU patients.",
    ],
  },
];

const K_BANDS: Band[] = [
  { from: 1.5, to: 2.5, tone: "critical", label: "< 2.5" },
  { from: 2.5, to: 3.5, tone: "warn", label: "2.5–3.4" },
  { from: 3.5, to: 5.5, tone: "normal", label: "3.5–5.4" },
  { from: 5.5, to: 6.5, tone: "warn", label: "5.5–6.4" },
  { from: 6.5, to: 8, tone: "critical", label: "≥ 6.5" },
];

const NA_RATE_BANDS: Band[] = [
  { from: 0, to: 8, tone: "normal" },
  { from: 8, to: 10, tone: "warn" },
  { from: 10, to: 20, tone: "critical" },
];

const normalRanges = [
  ["K⁺", "3.5–5.0 mmol/L", "< 2.5 or ≥ 6.5"],
  ["Na⁺", "135–145 mmol/L", "< 120 or > 160"],
  ["Mg²⁺", "1.7–2.2 mg/dL", "< 1.2"],
  ["Ca²⁺ (ionised)", "1.12–1.32 mmol/L", "< 0.9"],
  ["PO₄", "2.5–4.5 mg/dL", "< 1.0"],
];

const checklist = [
  "Verify order, consent, blood type, and indication.",
  "Baseline vitals immediately before transfusion.",
  "Start slowly for the first 15 minutes with direct observation.",
  "Repeat vitals at 15 min, hourly, and post-transfusion.",
  "Stop the transfusion and notify the provider for any reaction.",
];

const reactions = [
  ["Acute hemolytic", "Fever, flank pain, hypotension", "Stop transfusion, keep line open with NS, notify blood bank"],
  ["Febrile non-hemolytic", "Fever/chills", "Pause, assess, antipyretic per order"],
  ["Allergic", "Rash, urticaria, wheeze", "Stop, antihistamine, escalate if severe"],
  ["TRALI", "Hypoxemia, pulmonary edema", "Stop, oxygen/ventilatory support, ICU care"],
  ["TACO", "Dyspnea, hypertension, JVP rise", "Stop, sit upright, diuretic as ordered"],
];

const extra = {
  en: {
    tabs: { fluids: "Fluids", composition: "Composition", electrolytes: "Electrolytes", calculators: "Calculators", blood: "Blood products" },
    total: "Fluids", crystalloids: "Crystalloids", colloids: "Colloids", blood: "Blood products",
    sodium: "Sodium (Na⁺)", chloride: "Chloride (Cl⁻)", potassium: "Potassium (K⁺)", buffer: "Buffer (lactate/acetate/gluconate)",
    osmTitle: "Osmolarity", osmRef: "Plasma osmolality 275–295 mOsm/kg",
    compositionNote: "Values in mEq/L from product labels. 3% NaCl is drawn clipped.",
    kChecker: "Where does this potassium fall?", kValue: "K⁺ (mmol/L)",
    kBand: { severe_low: "Severe hypokalaemia", low: "Hypokalaemia", normal: "Normal", mild_high: "Mild hyperkalaemia", moderate_high: "Moderate hyperkalaemia", severe_high: "Severe hyperkalaemia" } as Record<PotassiumBand, string>,
    first8h: "First 8 h", next16h: "Next 16 h", perHour: "per hour", per24h: "Projected 24 h change",
    limit: "Limit 10 mmol/L per 24 h (8 if high risk)", highRisk: "High risk of osmotic demyelination (alcohol, malnutrition, hypokalaemia, liver disease)",
    adultMaintenance: "Adults: NICE suggests 25–30 mL/kg/day of water to start.",
    enter: "Enter values to calculate.",
  },
  ar: {
    tabs: { fluids: "السوائل", composition: "التركيب", electrolytes: "الشوارد", calculators: "الحاسبات", blood: "مشتقات الدم" },
    total: "سائل", crystalloids: "بلورية", colloids: "غروانية", blood: "مشتقات الدم",
    sodium: "الصوديوم (Na⁺)", chloride: "الكلوريد (Cl⁻)", potassium: "البوتاسيوم (K⁺)", buffer: "المنظّم (لاكتات/أسيتات/غلوكونات)",
    osmTitle: "الأسمولية", osmRef: "أسمولية البلازما 275–295 mOsm/kg",
    compositionNote: "القيم بوحدة mEq/L من نشرات المنتج. محلول 3% مقصوص بالرسم.",
    kChecker: "وين يقع هذا البوتاسيوم؟", kValue: "K⁺ (mmol/L)",
    kBand: { severe_low: "نقص بوتاسيوم شديد", low: "نقص بوتاسيوم", normal: "طبيعي", mild_high: "فرط بوتاسيوم خفيف", moderate_high: "فرط بوتاسيوم متوسط", severe_high: "فرط بوتاسيوم شديد" } as Record<PotassiumBand, string>,
    first8h: "أول 8 ساعات", next16h: "الـ 16 ساعة التالية", perHour: "بالساعة", per24h: "التغير المتوقع خلال 24 ساعة",
    limit: "الحد 10 mmol/L خلال 24 ساعة (8 للخطورة العالية)", highRisk: "خطورة عالية لإزالة الميالين (كحول، سوء تغذية، نقص بوتاسيوم، مرض كبد)",
    adultMaintenance: "للبالغين: NICE تقترح 25–30 mL/kg/يوم ماء كبداية.",
    enter: "أدخل القيم حتى يتم الحساب.",
  },
} as const;

const Fluids = () => {
  const { language } = usePreferences();
  const copy = fluidsI18n[language];
  const ex = extra[language];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"ALL" | FluidType>("ALL");
  const [kValue, setKValue] = useState("");
  const [calc, setCalc] = useState({
    weight: "", dehydration: "", maintWeight: "", fwWeight: "", currentNa: "", targetNa: "140", gender: "male" as "male" | "female",
    initialNa: "", nowNa: "", hours: "", highRisk: false, volume: "", time: "", dropFactor: "20",
  });
  const set = (key: keyof typeof calc) => (e: React.ChangeEvent<HTMLInputElement>) => setCalc((c) => ({ ...c, [key]: e.target.value }));

  const counts = useMemo(() => ({
    CRYSTALLOIDS: fluids.filter((f) => f.type === "CRYSTALLOIDS").length,
    COLLOIDS: fluids.filter((f) => f.type === "COLLOIDS").length,
    "BLOOD PRODUCTS": fluids.filter((f) => f.type === "BLOOD PRODUCTS").length,
  }), []);

  const filteredFluids = useMemo(() => {
    const needle = search.toLowerCase();
    return fluids.filter((item) =>
      (item.name.toLowerCase().includes(needle) || item.indications.toLowerCase().includes(needle)) &&
      (category === "ALL" || item.type === category),
    );
  }, [search, category]);

  const deficit = fluidDeficit(parseNumber(calc.weight), parseNumber(calc.dehydration));
  const maintenance = hollidaySegar(parseNumber(calc.maintWeight));
  const freeWater = freeWaterDeficit(parseNumber(calc.fwWeight), calc.gender, parseNumber(calc.currentNa), parseNumber(calc.targetNa));
  const naRate = sodiumChange(parseNumber(calc.initialNa), parseNumber(calc.nowNa), parseNumber(calc.hours), calc.highRisk);
  const drip = dripRate(parseNumber(calc.volume), parseNumber(calc.time), parseNumber(calc.dropFactor));
  const k = parseNumber(kValue);
  const kBand = potassiumBand(k);

  const field = (id: keyof typeof calc, label: string) => (
    <div className="space-y-1">
      <label htmlFor={`fl-${id}`} className="block text-xs font-medium">{label}</label>
      <Input id={`fl-${id}`} dir="ltr" inputMode="decimal" value={calc[id] as string} onChange={set(id)} />
    </div>
  );
  const empty = <p className="text-xs text-muted-foreground">{ex.enter}</p>;
  const card = "space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5";

  const ionChart = (title: string, key: "na" | "cl" | "k" | "buffer", color: string, max?: number) => (
    <div className="space-y-2">
      <p className="text-xs font-semibold">{title}</p>
      <BarList
        ariaLabel={title}
        unit="mEq/L"
        max={max}
        rows={composition.map((c) => ({ key: c.key, label: c.name, value: c[key], color, display: max && c[key] > max ? `${c[key]} ↑` : undefined }))}
      />
    </div>
  );

  return (
    <AppLayout illustration="iv" title={copy.title} subtitle={copy.subtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Droplets} tone="primary" label={ex.total} value={fluids.length} />
        <StatTile label={ex.crystalloids} value={counts.CRYSTALLOIDS} />
        <StatTile label={ex.colloids} value={counts.COLLOIDS} />
        <StatTile label={ex.blood} value={counts["BLOOD PRODUCTS"]} />
      </section>

      <Tabs defaultValue="fluids" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 sm:grid-cols-5">
          {(Object.keys(ex.tabs) as (keyof typeof ex.tabs)[]).map((key) => (
            <TabsTrigger key={key} value={key} className="whitespace-normal text-xs sm:text-sm">{ex.tabs[key]}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="fluids" className="space-y-4">
          <section className={card}>
            <div className="relative">
              <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.searchPlaceholder} aria-label={copy.searchPlaceholder} className="h-11 rounded-2xl ps-11" />
            </div>
            <FilterChips
              ariaLabel={ex.tabs.fluids}
              value={category}
              onChange={(v) => setCategory(v as "ALL" | FluidType)}
              options={[
                { value: "ALL", label: copy.categories.ALL, count: fluids.length },
                { value: "CRYSTALLOIDS", label: copy.categories.CRYSTALLOIDS, count: counts.CRYSTALLOIDS },
                { value: "COLLOIDS", label: copy.categories.COLLOIDS, count: counts.COLLOIDS },
                { value: "BLOOD PRODUCTS", label: copy.categories["BLOOD PRODUCTS"], count: counts["BLOOD PRODUCTS"] },
              ]}
            />
          </section>
          {filteredFluids.length === 0 ? (
            <EmptyState variant="no-results" title={copy.searchPlaceholder} />
          ) : (
            <section className="grid gap-3 md:grid-cols-2">
              {filteredFluids.map((item) => (
                <details key={item.name} className="group rounded-3xl border bg-card p-4 open:shadow-card">
                  <summary className="cursor-pointer list-none space-y-2">
                    <p dir="ltr" className="text-start font-semibold">{item.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline">{copy.types[item.type === "CRYSTALLOIDS" ? "crystalloid" : item.type === "COLLOIDS" ? "colloid" : "blood"]}</Badge>
                      <Badge variant="outline" className={cn(item.tonicity === "hypertonic" && "border-medical-yellow/40 text-medical-yellow", item.tonicity === "hypotonic" && "border-primary/40 text-primary")}>
                        {copy.tonicity[item.tonicity]}
                      </Badge>
                      <span dir="ltr" className="ms-auto text-xs text-muted-foreground">{item.osmolarity.split(" ")[0]} mOsm/L</span>
                    </div>
                  </summary>
                  <dl dir="ltr" className="mt-3 grid gap-2 text-start text-sm">
                    {(["composition", "osmolarity", "indications", "contraindications", "rateAdministration", "nursingConsiderations", "complications", "specialPrecautions"] as const).map((f) => (
                      <div key={f}>
                        <dt className="text-xs font-medium text-muted-foreground">{copy.fields[f]}</dt>
                        <dd>{item[f]}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
            </section>
          )}
        </TabsContent>

        <TabsContent value="composition" className="space-y-4">
          <section className={cn(card, "grid gap-5 md:grid-cols-2")}>
            {ionChart(ex.sodium, "na", "var(--viz-1)", 200)}
            {ionChart(ex.chloride, "cl", "var(--viz-2)", 200)}
            {ionChart(ex.potassium, "k", "var(--viz-3)")}
            {ionChart(ex.buffer, "buffer", "var(--viz-6)")}
          </section>
          <section className={card}>
            <p className="text-sm font-semibold">{ex.osmTitle}</p>
            <BarList
              ariaLabel={ex.osmTitle}
              unit="mOsm/L"
              max={450}
              reference={{ from: 275, to: 295, label: ex.osmRef }}
              rows={composition.map((c) => ({ key: c.key, label: c.name, value: c.osm, color: "var(--viz-1)", display: c.osm > 450 ? `${c.osm} ↑` : undefined }))}
            />
            <p className="text-[11px] text-muted-foreground">{ex.compositionNote}</p>
          </section>
          <section className={cn(card, "overflow-x-auto")}>
            <p className="text-sm font-semibold">{copy.quick.fluidComparison}</p>
            <table dir="ltr" className="w-full min-w-[520px] text-start text-sm tabular-nums">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  {["Fluid", "Na", "K", "Cl", "Ca", "Mg", "Buffer", "Osm", "pH"].map((h) => (
                    <th key={h} className="py-1 pe-2 text-start font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {composition.map((c) => (
                  <tr key={c.key} className="border-t">
                    <td className="py-1.5 pe-2 font-medium">{c.name}</td>
                    {[c.na, c.k, c.cl, c.ca, c.mg, c.buffer, c.osm].map((v, i) => (
                      <td key={i} className="py-1.5 pe-2">{v}</td>
                    ))}
                    <td className="py-1.5 pe-2">{c.ph}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <SourceNote ids={["dailymed", "nice-cg174"]} />
          </section>
        </TabsContent>

        <TabsContent value="electrolytes" className="space-y-4">
          <section className={card}>
            <p className="text-sm font-semibold">{ex.kChecker}</p>
            <div className="grid items-end gap-3 sm:grid-cols-[10rem_1fr]">
              <div className="space-y-1">
                <label htmlFor="k-value" className="block text-xs font-medium">{ex.kValue}</label>
                <Input id="k-value" dir="ltr" inputMode="decimal" value={kValue} onChange={(e) => setKValue(e.target.value)} />
              </div>
              <BandBar min={1.5} max={8} bands={K_BANDS} value={k} unit="mmol/L" valueLabel={kBand ? ex.kBand[kBand] : undefined} ariaLabel="K⁺" ticks={[2.5, 3.5, 5.5, 6.5]} />
            </div>
            {kBand && (
              <p role="status" className={cn("rounded-2xl p-3 text-sm font-medium", kBand === "normal" ? "bg-medical-green/10 text-medical-green" : kBand.startsWith("severe") ? "bg-medical-red/10 text-medical-red" : "bg-medical-yellow/10 text-medical-yellow")}>
                {ex.kBand[kBand]}
              </p>
            )}
          </section>
          <section className="grid gap-3 md:grid-cols-2">
            {electrolyteCards.map((c) => (
              <article key={c.key} className="space-y-2 rounded-3xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p dir="ltr" className="font-semibold">{c.titleEn}</p>
                  <span dir="ltr" className="rounded-full bg-medical-green/10 px-2 py-0.5 text-xs text-medical-green">{c.normal}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.labels.map((l) => (
                    <Badge key={l} variant="outline">{copy.electrolytes[l as keyof typeof copy.electrolytes]}</Badge>
                  ))}
                </div>
                <ul dir="ltr" className="list-disc space-y-1 ps-4 text-start text-sm text-muted-foreground">
                  {c.lines.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </article>
            ))}
          </section>
          <section className={cn(card, "overflow-x-auto")}>
            <p className="text-sm font-semibold">{copy.quick.normalRanges}</p>
            <table dir="ltr" className="w-full text-start text-sm">
              <tbody>
                {normalRanges.map(([name, normal, crit]) => (
                  <tr key={name} className="border-t first:border-t-0">
                    <td className="py-1.5 pe-2 font-medium">{name}</td>
                    <td className="py-1.5 pe-2">{normal}</td>
                    <td className="py-1.5 pe-2 text-medical-red">{crit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <SourceNote ids={["ukka-hyperk", "hyponatraemia-2014", "cap-critical"]} />
          </section>
        </TabsContent>

        <TabsContent value="calculators" className="space-y-4">
          <section className="grid gap-3 md:grid-cols-2">
            <div className={card}>
              <p className="font-semibold">{copy.calculator.fluidDeficitTitle}</p>
              <div className="grid grid-cols-2 gap-2">{field("weight", copy.calculator.weight)}{field("dehydration", copy.calculator.dehydrationPercent)}</div>
              {deficit ? (
                <>
                  <StatTile tone="primary" label={copy.calculator.result} value={<span dir="ltr">{deficit.total} mL</span>} />
                  <div className="grid grid-cols-2 gap-2">
                    <StatTile label={ex.first8h} value={<span dir="ltr">{deficit.first8h} mL</span>} />
                    <StatTile label={ex.next16h} value={<span dir="ltr">{deficit.next16h} mL</span>} />
                  </div>
                </>
              ) : empty}
            </div>
            <div className={card}>
              <p className="font-semibold">{copy.calculator.maintenanceTitle}</p>
              {field("maintWeight", copy.calculator.weight)}
              {maintenance !== null ? (
                <StatTile tone="primary" label={`${copy.calculator.maintenanceRate} · 4-2-1`} value={<span dir="ltr">{maintenance} mL/h</span>} />
              ) : empty}
              <p className="text-[11px] text-muted-foreground">{ex.adultMaintenance}</p>
              <SourceNote ids={["holliday-segar", "nice-cg174"]} />
            </div>
            <div className={card}>
              <p className="font-semibold">{copy.calculator.freeWaterTitle}</p>
              <div className="grid grid-cols-2 gap-2">
                {field("fwWeight", copy.calculator.weight)}
                <div className="space-y-1">
                  <label htmlFor="fl-gender" className="block text-xs font-medium">&nbsp;</label>
                  <select id="fl-gender" className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={calc.gender} onChange={(e) => setCalc((c) => ({ ...c, gender: e.target.value as "male" | "female" }))}>
                    <option value="male">{copy.calculator.male}</option>
                    <option value="female">{copy.calculator.female}</option>
                  </select>
                </div>
                {field("currentNa", copy.calculator.currentNa)}
                {field("targetNa", copy.calculator.targetNa)}
              </div>
              {freeWater !== null ? <StatTile tone="primary" label={copy.calculator.result} value={<span dir="ltr">{freeWater} L</span>} /> : empty}
            </div>
            <div className={card}>
              <p className="font-semibold">{copy.calculator.sodiumRateTitle}</p>
              <div className="grid grid-cols-3 gap-2">{field("initialNa", copy.calculator.initialNa)}{field("nowNa", copy.calculator.currentNa)}{field("hours", copy.calculator.hoursElapsed)}</div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" className="mt-0.5" checked={calc.highRisk} onChange={(e) => setCalc((c) => ({ ...c, highRisk: e.target.checked }))} />
                {ex.highRisk}
              </label>
              {naRate ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <StatTile label={`${copy.calculator.correctionRate} · ${ex.perHour}`} value={<span dir="ltr">{naRate.perHour} mmol/L</span>} />
                    <StatTile tone={naRate.overLimit ? "critical" : "good"} label={ex.per24h} value={<span dir="ltr">{naRate.per24h} mmol/L</span>} hint={naRate.overLimit ? copy.calculator.tooFast : copy.calculator.safe} />
                  </div>
                  <BandBar min={0} max={20} bands={NA_RATE_BANDS} value={Math.abs(naRate.per24h)} unit="mmol/L/24h" ariaLabel={ex.per24h} ticks={[0, 8, 10, 20]} />
                </>
              ) : empty}
              <p className="text-[11px] text-muted-foreground">{ex.limit}</p>
              <SourceNote ids={["hyponatraemia-2014"]} />
            </div>
            <div className={cn(card, "md:col-span-2")}>
              <p className="font-semibold">{copy.calculator.dripRateTitle}</p>
              <div className="grid grid-cols-3 gap-2">{field("volume", copy.calculator.volume)}{field("time", copy.calculator.timeHours)}{field("dropFactor", copy.calculator.dropFactor)}</div>
              {drip ? (
                <div className="grid grid-cols-2 gap-2">
                  <StatTile tone="primary" label={copy.calculator.mlHour} value={<span dir="ltr">{drip.mlPerHour}</span>} />
                  <StatTile tone="primary" label={copy.calculator.gttsMin} value={<span dir="ltr">{drip.dropsPerMin}</span>} />
                </div>
              ) : empty}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="blood" className="space-y-4">
          <section className="grid gap-3 md:grid-cols-2">
            <div className={card}>
              <p className="text-sm font-semibold">{copy.quick.transfusionChecklist}</p>
              <div dir="ltr" className="text-start">
                <StepTimeline steps={checklist.map((title) => ({ title }))} />
              </div>
            </div>
            <div className={cn(card, "overflow-x-auto")}>
              <p className="text-sm font-semibold">{copy.quick.transfusionReactions}</p>
              <ul dir="ltr" className="space-y-2 text-start">
                {reactions.map(([type, signs, action]) => (
                  <li key={type} className="rounded-2xl border p-3 text-sm">
                    <p className="font-semibold">{type}</p>
                    <p className="text-muted-foreground">{signs}</p>
                    <p className="mt-1 text-xs"><span className="font-medium">→ </span>{action}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Fluids;
