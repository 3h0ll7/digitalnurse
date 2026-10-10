import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, FlaskConical, Layers, Search, Siren, TestTube2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import BandBar, { type Band } from "@/components/data/BandBar";
import FilterChips from "@/components/data/FilterChips";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import StepTimeline, { type Step } from "@/components/data/StepTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/contexts/PreferencesContext";
import { labValues } from "@/data/labValues";
import rawLabInterpretations from "@/data/lab-interpretations.json";
import { interpretABG, type AbgResult, type CompensationVerdict, type PfCategory, type PrimaryDisorder } from "@/lib/clinical/abg";
import { SI_FACTORS, classifyLab, fromSI, labBands, roundForDisplay, toSI, type LabCondition, type LabInterpretation } from "@/lib/clinical/labs";
import { parseNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";

type UnitMode = "conventional" | "si";
type ABGMode = "abg" | "vbg";

const labInterpretations = rawLabInterpretations as unknown as LabInterpretation[];
const RECENT_KEY = "dn_recent_lab_interpretations_v1";

const text = {
  en: {
    reference: "Reference",
    labInterpreter: "Interpreter",
    abg: "ABG / VBG",
    quickEntry: "Quick entry",
    quickPlaceholder: "e.g. sodium=132, potassium 6.1",
    value: "Value",
    selectLab: "Search a test",
    recent: "Recent",
    related: "Related labs",
    clinicalMeaning: "Clinical meaning",
    causes: "Possible causes",
    drug: "Drug interference",
    nursing: "Nursing actions",
    currentValue: "Current value",
    referenceRange: "Adult reference range",
    fromRange: "Outside range by",
    withinRange: "Within range",
    criticalAlert: "Critical value — notify the provider and follow your critical-results policy.",
    enterValue: "Enter a value to see where it falls.",
    populationNote: "Ranges shown are for adults. Children, newborns and pregnancy have different ranges — use your laboratory's reference range.",
    criticalNote: "Critical limits differ between laboratories; your lab's list always wins.",
    tests: "Tests",
    categories: "Categories",
    withCritical: "With critical limits",
    interpretable: "Interpretable labs",
    all: "All",
    critLow: "Critical low",
    critHigh: "Critical high",
    normalRange: "Normal",
    scenarios: "Sample scenarios",
    abgEmpty: "Enter pH, PaCO₂ and HCO₃ to interpret the gas.",
    stepPh: "pH",
    stepPrimary: "Primary disorder",
    stepComp: "Compensation",
    stepAg: "Anion gap",
    stepOxy: "Oxygenation (P/F)",
    stepLactate: "Lactate",
    expected: "Expected",
    measured: "measured",
    notEntered: "Not entered",
    likelyCauses: "Likely causes",
    vbgNote: "VBG values are converted to approximate arterial values (pH +0.03, PCO₂ −5). Confirm with an ABG when oxygenation or precise PaCO₂ matters.",
    pfNote: "P/F category only — the Berlin ARDS definition also needs PEEP ≥ 5 cmH₂O and bilateral opacities.",
  },
  ar: {
    reference: "المرجع",
    labInterpreter: "مفسر التحاليل",
    abg: "غازات الدم",
    quickEntry: "إدخال سريع",
    quickPlaceholder: "مثال: sodium=132, potassium 6.1",
    value: "القيمة",
    selectLab: "ابحث عن تحليل",
    recent: "الأخيرة",
    related: "تحاليل مرتبطة",
    clinicalMeaning: "المعنى السريري",
    causes: "الأسباب المحتملة",
    drug: "تداخل الأدوية",
    nursing: "الإجراءات التمريضية",
    currentValue: "القيمة الحالية",
    referenceRange: "المدى الطبيعي للبالغين",
    fromRange: "خارج المدى بمقدار",
    withinRange: "ضمن المدى",
    criticalAlert: "قيمة حرجة — بلّغ الطبيب واتبع سياسة النتائج الحرجة.",
    enterValue: "أدخل قيمة حتى تشوف موقعها على المقياس.",
    populationNote: "المديات المعروضة للبالغين. الأطفال وحديثو الولادة والحوامل إلهم مديات مختلفة — اعتمد مديات مختبرك.",
    criticalNote: "الحدود الحرجة تختلف بين المختبرات، والمعتمد هو قائمة مختبرك.",
    tests: "تحاليل",
    categories: "فئات",
    withCritical: "بحدود حرجة",
    interpretable: "تحاليل قابلة للتفسير",
    all: "الكل",
    critLow: "حرج منخفض",
    critHigh: "حرج مرتفع",
    normalRange: "الطبيعي",
    scenarios: "حالات تجريبية",
    abgEmpty: "أدخل pH وPaCO₂ وHCO₃ حتى يتم التفسير.",
    stepPh: "الـ pH",
    stepPrimary: "الاضطراب الأساسي",
    stepComp: "التعويض",
    stepAg: "الفجوة الأيونية",
    stepOxy: "الأكسجة (P/F)",
    stepLactate: "اللاكتات",
    expected: "المتوقع",
    measured: "المقاس",
    notEntered: "غير مُدخل",
    likelyCauses: "الأسباب المحتملة",
    vbgNote: "قيم الـ VBG تتحول تقريبياً لقيم شريانية (pH ‎+0.03، PCO₂ ‎−5). أكّد بـ ABG إذا الأكسجة أو PaCO₂ الدقيق مهم.",
    pfNote: "تصنيف P/F فقط — تعريف برلين لـ ARDS يحتاج أيضاً PEEP ≥ 5 وارتشاحات ثنائية.",
  },
} as const;

const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  electrolytes: { en: "Electrolytes", ar: "الأملاح" },
  renal: { en: "Renal", ar: "الكلى" },
  liver: { en: "Liver", ar: "الكبد" },
  cardiac: { en: "Cardiac", ar: "القلب" },
  cbc: { en: "CBC", ar: "صورة الدم" },
  differential: { en: "Differential", ar: "التفريقي" },
  coagulation: { en: "Coagulation", ar: "التخثر" },
  metabolic: { en: "Metabolic", ar: "الأيض" },
  thyroid: { en: "Thyroid", ar: "الغدة الدرقية" },
  sepsis: { en: "Sepsis", ar: "الإنتان" },
};

const PRIMARY_LABELS: Record<PrimaryDisorder, { en: string; ar: string }> = {
  normal: { en: "Normal acid–base", ar: "توازن حمضي قاعدي طبيعي" },
  metabolic_acidosis: { en: "Metabolic acidosis", ar: "حماض استقلابي" },
  metabolic_alkalosis: { en: "Metabolic alkalosis", ar: "قلاء استقلابي" },
  respiratory_acidosis: { en: "Respiratory acidosis", ar: "حماض تنفسي" },
  respiratory_alkalosis: { en: "Respiratory alkalosis", ar: "قلاء تنفسي" },
  mixed_acidosis: { en: "Mixed respiratory + metabolic acidosis", ar: "حماض مختلط تنفسي واستقلابي" },
  mixed_alkalosis: { en: "Mixed respiratory + metabolic alkalosis", ar: "قلاء مختلط تنفسي واستقلابي" },
  compensated_or_mixed: { en: "Compensated or mixed disorder", ar: "اضطراب معوَّض أو مختلط" },
};

const VERDICT_LABELS: Record<CompensationVerdict, { en: string; ar: string }> = {
  appropriate: { en: "Appropriate compensation", ar: "تعويض مناسب" },
  additional_respiratory_acidosis: { en: "PaCO₂ too high — added respiratory acidosis", ar: "PaCO₂ أعلى من المتوقع — حماض تنفسي مرافق" },
  additional_respiratory_alkalosis: { en: "PaCO₂ too low — added respiratory alkalosis", ar: "PaCO₂ أقل من المتوقع — قلاء تنفسي مرافق" },
  acute: { en: "Fits an acute process", ar: "يتوافق مع حالة حادة" },
  chronic: { en: "Fits a chronic process", ar: "يتوافق مع حالة مزمنة" },
  between_acute_and_chronic: { en: "Between acute and chronic (acute-on-chronic?)", ar: "بين الحاد والمزمن (حاد على مزمن؟)" },
  beyond_expected: { en: "Outside expected range — consider a second metabolic disorder", ar: "خارج المتوقع — فكّر باضطراب استقلابي ثاني" },
};

const PF_LABELS: Record<PfCategory, { en: string; ar: string; tone: "critical" | "warn" | "good" }> = {
  severe: { en: "≤ 100 · severe range", ar: "≤ 100 · مدى شديد", tone: "critical" },
  moderate: { en: "101–200 · moderate range", ar: "101–200 · مدى متوسط", tone: "critical" },
  mild: { en: "201–300 · mild range", ar: "201–300 · مدى خفيف", tone: "warn" },
  normal: { en: "> 300 · normal", ar: "> 300 · طبيعي", tone: "good" },
};

const STATUS_TONE: Record<LabCondition, string> = {
  critical_low: "border-medical-red/40 bg-medical-red/10 text-medical-red",
  critical_high: "border-medical-red/40 bg-medical-red/10 text-medical-red",
  low: "border-medical-yellow/40 bg-medical-yellow/10 text-medical-yellow",
  high: "border-medical-yellow/40 bg-medical-yellow/10 text-medical-yellow",
  normal: "border-medical-green/40 bg-medical-green/10 text-medical-green",
};

const PH_BANDS: Band[] = [
  { from: 6.9, to: 7.2, tone: "critical" },
  { from: 7.2, to: 7.35, tone: "warn" },
  { from: 7.35, to: 7.45, tone: "normal" },
  { from: 7.45, to: 7.6, tone: "warn" },
  { from: 7.6, to: 7.8, tone: "critical" },
];
const PCO2_BANDS: Band[] = [
  { from: 10, to: 35, tone: "warn" },
  { from: 35, to: 45, tone: "normal" },
  { from: 45, to: 100, tone: "warn" },
];
const HCO3_BANDS: Band[] = [
  { from: 5, to: 22, tone: "warn" },
  { from: 22, to: 26, tone: "normal" },
  { from: 26, to: 45, tone: "warn" },
];
const PF_BANDS: Band[] = [
  { from: 0, to: 100, tone: "critical" },
  { from: 100, to: 200, tone: "critical" },
  { from: 200, to: 300, tone: "warn" },
  { from: 300, to: 500, tone: "normal" },
];

const abgScenarios = [
  { label: "Septic shock", pH: 7.2, pco2: 28, hco3: 12, pao2: 65, lactate: 6.2, fio2: 21, na: 140, cl: 104 },
  { label: "DKA", pH: 7.1, pco2: 22, hco3: 8, pao2: 84, lactate: 2.8, fio2: 21, na: 134, cl: 98 },
  { label: "COPD exacerbation", pH: 7.28, pco2: 70, hco3: 32, pao2: 58, lactate: 1.9, fio2: 28, na: 140, cl: 98 },
  { label: "Hyperventilation", pH: 7.52, pco2: 25, hco3: 22, pao2: 96, lactate: 1.2, fio2: 21, na: 140, cl: 104 },
  { label: "Vomiting", pH: 7.55, pco2: 46, hco3: 38, pao2: 88, lactate: 1.1, fio2: 21, na: 138, cl: 90 },
  { label: "Pulmonary embolism", pH: 7.48, pco2: 28, hco3: 22, pao2: 58, lactate: 3.1, fio2: 21, na: 140, cl: 106 },
];

const emptyAbg = { pH: "", pco2: "", hco3: "", pao2: "", fio2: "", lactate: "", na: "", cl: "" };
const ABG_FIELDS: { key: keyof typeof emptyAbg; label: string; unit: string }[] = [
  { key: "pH", label: "pH", unit: "" },
  { key: "pco2", label: "PaCO₂", unit: "mmHg" },
  { key: "hco3", label: "HCO₃⁻", unit: "mmol/L" },
  { key: "pao2", label: "PaO₂", unit: "mmHg" },
  { key: "fio2", label: "FiO₂", unit: "%" },
  { key: "lactate", label: "Lactate", unit: "mmol/L" },
  { key: "na", label: "Na⁺", unit: "mmol/L" },
  { key: "cl", label: "Cl⁻", unit: "mmol/L" },
];

const readRecent = (): string[] => {
  try {
    const cached = window.localStorage.getItem(RECENT_KEY);
    const parsed = cached ? JSON.parse(cached) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => labInterpretations.some((l) => l.id === id)) : [];
  } catch {
    return [];
  }
};

const fmt = (n: number) => String(roundForDisplay(n));

const Labs = () => {
  const { t, language } = usePreferences();
  const tx = text[language];
  const isAr = language === "ar";
  const labName = (lab: LabInterpretation) => (isAr ? lab.name_ar : lab.name_en);
  /** Band tooltips use the lab's own status wording instead of the internal key. */
  const named = (lab: LabInterpretation, bands: Band[]) =>
    bands.map((b) => {
      const match = lab.interpretations.find((i) => i.condition === b.label);
      return { ...b, label: match ? (isAr ? match.status_ar : match.status_en) : b.label };
    });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [labSearch, setLabSearch] = useState("");
  const [selectedLabId, setSelectedLabId] = useState(labInterpretations[0]?.id ?? "");
  const [labValue, setLabValue] = useState("");
  const [unitMode, setUnitMode] = useState<UnitMode>("conventional");
  const [quickEntry, setQuickEntry] = useState("");
  const [recent, setRecent] = useState<string[]>(readRecent);
  const [abgMode, setAbgMode] = useState<ABGMode>("abg");
  const [abgValues, setAbgValues] = useState(emptyAbg);

  const selectedLab = labInterpretations.find((lab) => lab.id === selectedLabId) ?? labInterpretations[0];
  const factor = SI_FACTORS[selectedLab.id] ?? 1;
  const adult = selectedLab.ranges.adult;
  const hasSIDifference = factor !== 1 || adult.unit !== adult.unit_si;
  const unitLabel = unitMode === "si" ? adult.unit_si : adult.unit;
  const displayFactor = unitMode === "si" ? factor : 1;

  useEffect(() => {
    setRecent((prev) => {
      const next = [selectedLabId, ...prev.filter((id) => id !== selectedLabId)].slice(0, 8);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable; the list still works for this visit.
      }
      return next;
    });
  }, [selectedLabId]);

  const referenceCategories = useMemo(() => {
    const counts = new Map<string, number>();
    labValues.forEach((lab) => counts.set(lab.category, (counts.get(lab.category) ?? 0) + 1));
    return [...counts.entries()];
  }, []);

  const filteredReference = labValues.filter((lab) => {
    const q = search.toLowerCase();
    const matchesSearch = lab.test.toLowerCase().includes(q) || lab.category.toLowerCase().includes(q);
    return matchesSearch && (category === "All" || lab.category === category);
  });

  const filteredLabs = labInterpretations.filter((lab) => {
    const q = labSearch.trim().toLowerCase();
    return !q || lab.name_en.toLowerCase().includes(q) || lab.name_ar.includes(labSearch.trim()) || lab.category.includes(q);
  });

  // Value typed in the active unit → conventional units for classification.
  const typed = parseNumber(labValue);
  const conventionalValue = typed === null ? null : unitMode === "si" ? fromSI(selectedLab.id, typed) : typed;
  const condition = classifyLab(conventionalValue, selectedLab);
  const interpretation = condition ? selectedLab.interpretations.find((item) => item.condition === condition) : undefined;
  const gauge = labBands(selectedLab, displayFactor);
  const low = adult.low * displayFactor;
  const high = adult.high * displayFactor;
  const distance = typed === null ? null : typed < low ? typed - low : typed > high ? typed - high : 0;

  const switchUnit = (mode: UnitMode) => {
    if (mode === unitMode) return;
    if (typed !== null) {
      const converted = mode === "si" ? toSI(selectedLab.id, typed) : fromSI(selectedLab.id, typed);
      setLabValue(String(roundForDisplay(converted)));
    }
    setUnitMode(mode);
  };

  const quickResults = useMemo(
    () =>
      quickEntry
        .split(/[\n,;]/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const match = line.match(/^(.+?)\s*[=:\s]\s*([-+]?[\d.٫٠-٩]+)\s*$/);
          if (!match) return null;
          const name = match[1].trim().toLowerCase();
          const value = parseNumber(match[2]);
          const found = labInterpretations.find((lab) => lab.id === name || lab.name_en.toLowerCase().includes(name) || lab.name_ar.includes(match[1].trim()));
          if (!found || value === null) return null;
          const rowCondition = classifyLab(value, found);
          const details = found.interpretations.find((item) => item.condition === rowCondition);
          return { found, value, condition: rowCondition, details };
        })
        .filter((row): row is NonNullable<typeof row> => row !== null),
    [quickEntry],
  );

  const abg = interpretABG({
    ph: parseNumber(abgValues.pH),
    pco2: parseNumber(abgValues.pco2),
    hco3: parseNumber(abgValues.hco3),
    pao2: parseNumber(abgValues.pao2),
    fio2: parseNumber(abgValues.fio2),
    lactate: parseNumber(abgValues.lactate),
    na: parseNumber(abgValues.na),
    cl: parseNumber(abgValues.cl),
    mode: abgMode,
  });

  const abgSteps = (r: AbgResult): Step[] => {
    const steps: Step[] = [
      {
        title: `${tx.stepPh}: ${r.ph.toFixed(2)}`,
        body: r.status === "acidemia" ? (isAr ? "حمضية (< 7.35)" : "Acidaemia (< 7.35)") : r.status === "alkalemia" ? (isAr ? "قلوية (> 7.45)" : "Alkalaemia (> 7.45)") : isAr ? "ضمن 7.35–7.45" : "Within 7.35–7.45",
        tone: r.status === "normal" ? "good" : "warn",
      },
      { title: tx.stepPrimary, body: PRIMARY_LABELS[r.primary][language], tone: r.primary === "normal" ? "good" : "warn" },
    ];
    if (r.compensation) {
      const isResp = r.primary.startsWith("respiratory");
      steps.push({
        title: tx.stepComp,
        body: (
          <>
            {tx.expected} {isResp ? "HCO₃⁻" : "PaCO₂"} {r.compensation.expected.low}–{r.compensation.expected.high} · {tx.measured} {isResp ? r.hco3 : r.pco2}
            <br />
            {VERDICT_LABELS[r.compensation.verdict][language]}
          </>
        ),
        tone: r.compensation.verdict === "appropriate" || r.compensation.verdict === "acute" || r.compensation.verdict === "chronic" ? "good" : "warn",
      });
    }
    steps.push({
      title: tx.stepAg,
      body: r.anionGap ? `${r.anionGap.value} mmol/L — ${r.anionGap.high ? (isAr ? "مرتفعة (> 12)" : "high (> 12)") : isAr ? "طبيعية (8–12)" : "normal (8–12)"}` : tx.notEntered,
      tone: r.anionGap?.high ? "warn" : "default",
    });
    steps.push({
      title: tx.stepOxy,
      body: r.pf ? `${r.pf.value} — ${PF_LABELS[r.pf.category][language]}` : tx.notEntered,
      tone: r.pf ? PF_LABELS[r.pf.category].tone : "default",
    });
    const lactate = parseNumber(abgValues.lactate);
    steps.push({
      title: tx.stepLactate,
      body: lactate === null ? tx.notEntered : `${lactate} mmol/L${r.lactateHigh ? (isAr ? " — مرتفع (≥ 2)" : " — raised (≥ 2)") : ""}`,
      tone: lactate === null ? "default" : lactate >= 4 ? "critical" : r.lactateHigh ? "warn" : "good",
    });
    return steps;
  };

  const abgCauses = (r: AbgResult) =>
    r.primary.includes("metabolic_acidosis") || r.primary === "mixed_acidosis"
      ? r.anionGap?.high
        ? ["Lactic acidosis (shock, sepsis)", "Ketoacidosis (DKA, starvation)", "Renal failure", "Toxins (methanol, ethylene glycol, salicylates)"]
        : ["GI bicarbonate loss (diarrhoea)", "Renal tubular acidosis", "Large-volume 0.9% saline"]
      : r.primary.includes("respiratory_acidosis")
        ? ["Hypoventilation (sedation, opioids)", "COPD / asthma exhaustion", "Neuromuscular weakness"]
        : r.primary.includes("respiratory_alkalosis")
          ? ["Pain or anxiety", "Hypoxaemia (PE, pneumonia)", "Early sepsis", "Over-ventilation on the ventilator"]
          : r.primary.includes("metabolic_alkalosis")
            ? ["Vomiting or NG suction", "Diuretics", "Hypokalaemia"]
            : ["Chronic compensated disease", "Mixed disorder — compare with history"];

  return (
    <AppLayout illustration="lab" title={t.labsTitle} subtitle={t.labsSubtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={TestTube2} tone="primary" label={tx.interpretable} value={labInterpretations.length} />
        <StatTile icon={Layers} label={tx.categories} value={Object.keys(CATEGORY_LABELS).length} />
        <StatTile icon={FlaskConical} label={tx.tests} value={labValues.length} />
        <StatTile icon={Siren} tone="critical" label={tx.withCritical} value={labValues.filter((l) => l.criticalLow || l.criticalHigh).length} />
      </section>

      <Tabs defaultValue="lab-interpreter" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-3">
          <TabsTrigger value="lab-interpreter" className="whitespace-normal">{tx.labInterpreter}</TabsTrigger>
          <TabsTrigger value="abg" className="whitespace-normal">{tx.abg}</TabsTrigger>
          <TabsTrigger value="reference" className="whitespace-normal">{tx.reference}</TabsTrigger>
        </TabsList>

        <TabsContent value="lab-interpreter" className="space-y-4">
          <section className="grid gap-4 rounded-3xl border bg-card p-4 shadow-card md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:p-5">
            <div className="space-y-2">
              <label htmlFor="lab-search" className="text-sm font-medium">{tx.selectLab}</label>
              <div className="relative">
                <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input id="lab-search" value={labSearch} onChange={(e) => setLabSearch(e.target.value)} className="ps-8" />
              </div>
              <div className="max-h-64 overflow-auto rounded-2xl border p-1.5" role="listbox" aria-label={tx.selectLab}>
                {filteredLabs.map((lab) => (
                  <button
                    key={lab.id}
                    type="button"
                    role="option"
                    aria-selected={selectedLabId === lab.id}
                    onClick={() => setSelectedLabId(lab.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-start text-sm transition-colors",
                      selectedLabId === lab.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                    )}
                  >
                    <span className="truncate">{labName(lab)}</span>
                    <span className={cn("shrink-0 text-[10px]", selectedLabId === lab.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {CATEGORY_LABELS[lab.category]?.[language] ?? lab.category}
                    </span>
                  </button>
                ))}
                {filteredLabs.length === 0 && <p className="p-3 text-center text-sm text-muted-foreground">{t.noResults}</p>}
              </div>
              {recent.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-muted-foreground">{tx.recent}:</span>
                  {recent.slice(1).map((id) => {
                    const lab = labInterpretations.find((l) => l.id === id);
                    return lab ? (
                      <button key={id} type="button" onClick={() => setSelectedLabId(id)} className="rounded-full border px-2 py-0.5 text-xs hover:bg-secondary">
                        {labName(lab)}
                      </button>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[8rem] flex-1 space-y-1">
                  <label htmlFor="lab-value" className="text-sm font-medium">
                    {labName(selectedLab)} · {tx.value}
                  </label>
                  <Input id="lab-value" dir="ltr" inputMode="decimal" value={labValue} onChange={(e) => setLabValue(e.target.value)} placeholder={unitLabel} />
                </div>
                {hasSIDifference && (
                  <div className="flex gap-1 rounded-2xl border bg-muted/40 p-1" role="group" aria-label="Units">
                    {(["conventional", "si"] as UnitMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        aria-pressed={unitMode === mode}
                        onClick={() => switchUnit(mode)}
                        className={cn("rounded-xl px-3 py-1.5 text-xs font-medium", unitMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                      >
                        {mode === "si" ? adult.unit_si : adult.unit}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <BandBar
                min={gauge.min}
                max={gauge.max}
                bands={named(selectedLab, gauge.bands)}
                value={typed}
                unit={unitLabel}
                valueLabel={interpretation ? (isAr ? interpretation.status_ar : interpretation.status_en) : undefined}
                ariaLabel={labName(selectedLab)}
                ticks={[selectedLab.critical.low, adult.low, adult.high, selectedLab.critical.high].map((n) => n * displayFactor)}
                format={fmt}
              />

              <div className="grid grid-cols-2 gap-2">
                <StatTile label={tx.referenceRange} value={<span dir="ltr">{fmt(low)}–{fmt(high)} <span className="text-xs font-normal text-muted-foreground">{unitLabel}</span></span>} />
                <StatTile
                  label={distance === null ? tx.currentValue : distance === 0 ? tx.withinRange : tx.fromRange}
                  tone={condition === null ? "default" : condition === "normal" ? "good" : condition.startsWith("critical") ? "critical" : "warn"}
                  value={distance === null ? "—" : <span dir="ltr">{distance === 0 ? "✓" : `${distance > 0 ? "+" : ""}${fmt(distance)}`}</span>}
                />
              </div>
              <p className="text-xs text-muted-foreground">{tx.populationNote}</p>
            </div>
          </section>

          {interpretation && condition ? (
            <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{labName(selectedLab)}</h3>
                <Badge variant="outline" className={cn("border", STATUS_TONE[condition])}>
                  {isAr ? interpretation.status_ar : interpretation.status_en}
                </Badge>
              </div>
              {condition.startsWith("critical") && (
                <div role="alert" className="flex items-start gap-2 rounded-2xl border border-medical-red/40 bg-medical-red/10 p-3 text-sm text-medical-red">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {tx.criticalAlert}
                </div>
              )}
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">{tx.clinicalMeaning}: </span>
                {isAr ? interpretation.meaning_ar : interpretation.meaning_en}
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { title: tx.causes, items: isAr ? interpretation.causes_ar : interpretation.causes_en },
                  { title: tx.drug, items: isAr ? interpretation.drug_interference_ar : interpretation.drug_interference_en },
                  { title: tx.nursing, items: isAr ? interpretation.nursing_actions_ar : interpretation.nursing_actions_en },
                ].map((block) => (
                  <div key={block.title} className="rounded-2xl border bg-secondary/40 p-3">
                    <p className="mb-1.5 text-sm font-semibold">{block.title}</p>
                    <ul className="list-disc space-y-1 ps-4 text-sm text-muted-foreground">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {interpretation.related_labs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">{tx.related}:</span>
                  {interpretation.related_labs.map((id) => {
                    const lab = labInterpretations.find((l) => l.id === id);
                    return (
                      <Button key={id} size="sm" variant="outline" className="rounded-full" onClick={() => setSelectedLabId(id)} disabled={!lab}>
                        {lab ? labName(lab) : id}
                      </Button>
                    );
                  })}
                </div>
              )}
            </section>
          ) : (
            <p className="rounded-3xl border border-dashed p-4 text-center text-sm text-muted-foreground">{tx.enterValue}</p>
          )}

          <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
            <label htmlFor="quick-entry" className="text-sm font-semibold">{tx.quickEntry}</label>
            <Input id="quick-entry" dir="ltr" value={quickEntry} onChange={(e) => setQuickEntry(e.target.value)} placeholder={tx.quickPlaceholder} />
            {quickResults.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {quickResults.map((row) => {
                  const g = labBands(row.found);
                  return (
                    <li key={row.found.id} className="space-y-2 rounded-2xl border p-3">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium">{labName(row.found)}</span>
                        {row.condition && (
                          <Badge variant="outline" className={cn("border", STATUS_TONE[row.condition])}>
                            <span dir="ltr">{row.value}</span>&nbsp;· {isAr ? row.details?.status_ar : row.details?.status_en}
                          </Badge>
                        )}
                      </div>
                      <BandBar min={g.min} max={g.max} bands={named(row.found, g.bands)} value={row.value} unit={row.found.ranges.adult.unit} ariaLabel={labName(row.found)} ticks={[row.found.ranges.adult.low, row.found.ranges.adult.high]} format={fmt} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </TabsContent>

        <TabsContent value="abg" className="space-y-4">
          <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {(["abg", "vbg"] as ABGMode[]).map((mode) => (
                <Button key={mode} size="sm" variant={abgMode === mode ? "default" : "outline"} aria-pressed={abgMode === mode} onClick={() => setAbgMode(mode)}>
                  {mode.toUpperCase()}
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => setAbgValues(emptyAbg)}>{isAr ? "مسح" : "Clear"}</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ABG_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label htmlFor={`abg-${field.key}`} className="block text-xs font-medium">
                    {field.label} {field.unit && <span className="text-muted-foreground">({field.unit})</span>}
                  </label>
                  <Input
                    id={`abg-${field.key}`}
                    dir="ltr"
                    inputMode="decimal"
                    value={abgValues[field.key]}
                    onChange={(e) => setAbgValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{tx.scenarios}</p>
              <div className="flex flex-wrap gap-2">
                {abgScenarios.map((s) => (
                  <Button
                    key={s.label}
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setAbgValues({ pH: String(s.pH), pco2: String(s.pco2), hco3: String(s.hco3), pao2: String(s.pao2), fio2: String(s.fio2), lactate: String(s.lactate), na: String(s.na), cl: String(s.cl) })}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
            {abgMode === "vbg" && <p className="rounded-2xl bg-secondary/60 p-3 text-xs text-muted-foreground">{tx.vbgNote}</p>}
          </section>

          {abg ? (
            <>
              <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
                <div>
                  <p className="text-xs text-muted-foreground">{tx.stepPrimary}</p>
                  <p className="text-xl font-semibold">{PRIMARY_LABELS[abg.primary][language]}</p>
                  {abg.compensation && <p className="text-sm text-muted-foreground">{VERDICT_LABELS[abg.compensation.verdict][language]}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium">pH <span dir="ltr" className="tabular-nums">{abg.ph.toFixed(2)}</span></p>
                    <BandBar min={6.9} max={7.8} bands={PH_BANDS} value={abg.ph} ariaLabel="pH" ticks={[7.35, 7.45]} format={(n) => n.toFixed(2)} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">PaCO₂ <span dir="ltr" className="tabular-nums">{abg.pco2}</span> mmHg</p>
                    <BandBar min={10} max={100} bands={PCO2_BANDS} value={abg.pco2} unit="mmHg" ariaLabel="PaCO2" ticks={[35, 45]} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">HCO₃⁻ <span dir="ltr" className="tabular-nums">{abg.hco3}</span> mmol/L</p>
                    <BandBar min={5} max={45} bands={HCO3_BANDS} value={abg.hco3} unit="mmol/L" ariaLabel="HCO3" ticks={[22, 26]} />
                  </div>
                </div>
                {abg.pf && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">P/F <span dir="ltr" className="tabular-nums">{abg.pf.value}</span> — {PF_LABELS[abg.pf.category][language]}</p>
                    <BandBar min={0} max={500} bands={PF_BANDS} value={abg.pf.value} ariaLabel="P/F ratio" ticks={[100, 200, 300]} />
                    <p className="text-[11px] text-muted-foreground">{tx.pfNote}</p>
                  </div>
                )}
              </section>

              <section className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div className="rounded-3xl border bg-card p-4 shadow-card sm:p-5">
                  <StepTimeline steps={abgSteps(abg)} />
                </div>
                <div className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
                  <div>
                    <p className="mb-1.5 text-sm font-semibold">{tx.likelyCauses}</p>
                    <ul dir="ltr" className="list-disc space-y-1 ps-4 text-start text-sm text-muted-foreground">
                      {abgCauses(abg).map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1.5 text-sm font-semibold">{tx.nursing}</p>
                    <ul dir="ltr" className="list-disc space-y-1 ps-4 text-start text-sm text-muted-foreground">
                      <li>Assess airway, breathing, circulation and level of consciousness</li>
                      <li>Correlate with perfusion, lactate and urine output</li>
                      <li>Escalate severe derangements (pH &lt; 7.2 or &gt; 7.6) or hypoxaemia</li>
                      <li>Repeat the gas after each intervention and trend it</li>
                      {abg.lactateHigh && <li>Lactate ≥ 2: screen for sepsis and follow the sepsis bundle</li>}
                    </ul>
                  </div>
                  <SourceNote ids={["winters", "berlin-ards", "byrne-vbg"]} />
                </div>
              </section>
            </>
          ) : (
            <p className="rounded-3xl border border-dashed p-4 text-center text-sm text-muted-foreground">{tx.abgEmpty}</p>
          )}
        </TabsContent>

        <TabsContent value="reference" className="space-y-4">
          <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
            <div className="relative">
              <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchLabs} aria-label={t.searchLabs} className="h-11 rounded-2xl ps-11" />
            </div>
            <FilterChips
              ariaLabel={tx.categories}
              value={category}
              onChange={setCategory}
              options={[{ value: "All", label: tx.all, count: labValues.length }, ...referenceCategories.map(([c, n]) => ({ value: c, label: c, count: n }))]}
            />
          </section>
          {filteredReference.length === 0 ? (
            <EmptyState variant="no-results" title={t.noResults} />
          ) : (
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredReference.map((lab) => (
                <article key={lab.test} className="space-y-2 rounded-3xl border bg-card p-4">
                  <p className="text-xs font-medium text-primary">{lab.category}</p>
                  <h3 dir="ltr" className="text-start text-base font-semibold">{lab.test}</h3>
                  <p dir="ltr" className="text-start text-sm">
                    <span className="text-muted-foreground">{tx.normalRange}: </span>
                    {lab.normalRange} <span className="text-muted-foreground">{lab.unit}</span>
                  </p>
                  {(lab.criticalLow || lab.criticalHigh) && (
                    <div className="flex flex-wrap gap-1.5">
                      {lab.criticalLow && (
                        <span className="rounded-full bg-medical-red/10 px-2 py-0.5 text-xs text-medical-red">
                          {tx.critLow} <span dir="ltr">{lab.criticalLow}</span>
                        </span>
                      )}
                      {lab.criticalHigh && (
                        <span className="rounded-full bg-medical-red/10 px-2 py-0.5 text-xs text-medical-red">
                          {tx.critHigh} <span dir="ltr">{lab.criticalHigh}</span>
                        </span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
          <p className="text-xs text-muted-foreground">{tx.criticalNote}</p>
          <SourceNote ids={["cap-critical"]} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Labs;
