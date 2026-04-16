import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { labValues } from "@/data/labValues";
import rawLabInterpretations from "@/data/lab-interpretations.json";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Activity, Copy, Search } from "lucide-react";

type PatientCategory = "adult" | "pediatric" | "neonatal" | "pregnant";
type UnitMode = "conventional" | "si";
type ABGMode = "abg" | "vbg";

type LabInterpretation = {
  id: string;
  name_en: string;
  name_ar: string;
  category: string;
  ranges: Record<PatientCategory, { low: number; high: number; unit: string; unit_si: string }>;
  critical: { low: number; high: number };
  interpretations: Array<{
    condition: string;
    threshold: string;
    status_en: string;
    status_ar: string;
    meaning_en: string;
    meaning_ar: string;
    causes_en: string[];
    causes_ar: string[];
    drug_interference_en: string[];
    drug_interference_ar: string[];
    nursing_actions_en: string[];
    nursing_actions_ar: string[];
    related_labs: string[];
  }>;
};

const labInterpretations = rawLabInterpretations as LabInterpretation[];
const RECENT_KEY = "dn_recent_lab_interpretations_v1";

const text = {
  en: {
    reference: "Reference",
    labInterpreter: "Lab Interpreter",
    abg: "ABG / VBG Interpreter",
    quickEntry: "Quick-entry mode",
    quickPlaceholder: "Paste lines like: sodium=132, potassium=6.1",
    category: "Category",
    patient: "Patient",
    unit: "Units",
    value: "Value",
    selectLab: "Search test name",
    recent: "Recent interpretations",
    copy: "Copy result",
    related: "Related labs",
    clinicalMeaning: "Clinical Meaning",
    causes: "Possible Causes",
    drug: "Drug Interference",
    nursing: "Nursing Actions",
    currentValue: "Current Value",
    referenceRange: "Reference Range",
    criticalAlert: "Critical Value Alert",
    step: "Step",
    primary: "Primary disturbance",
    likelyCauses: "Likely causes",
    expectedComp: "Expected compensation",
    oxygenation: "Oxygenation",
    scenarios: "Try sample scenario",
  },
  ar: {
    reference: "مرجع المختبر",
    labInterpreter: "مفسر التحاليل",
    abg: "مفسر ABG / VBG",
    quickEntry: "الإدخال السريع",
    quickPlaceholder: "ألصق أسطر مثل: sodium=132, potassium=6.1",
    category: "الفئة",
    patient: "فئة المريض",
    unit: "الوحدات",
    value: "القيمة",
    selectLab: "ابحث عن التحليل",
    recent: "آخر التفسيرات",
    copy: "نسخ النتيجة",
    related: "تحاليل مرتبطة",
    clinicalMeaning: "المعنى السريري",
    causes: "الأسباب المحتملة",
    drug: "تداخل الأدوية",
    nursing: "الإجراءات التمريضية",
    currentValue: "القيمة الحالية",
    referenceRange: "المدى الطبيعي",
    criticalAlert: "تنبيه قيمة حرجة",
    step: "الخطوة",
    primary: "الاضطراب الرئيسي",
    likelyCauses: "الأسباب المحتملة",
    expectedComp: "التعويض المتوقع",
    oxygenation: "الأكسجة",
    scenarios: "جرّب سيناريو",
  },
} as const;

const getStatusTone = (condition: string) => {
  if (condition.includes("critical")) return "bg-red-500/20 text-red-300 border-red-400/30";
  if (condition === "high" || condition === "low") return "bg-orange-500/20 text-orange-200 border-orange-300/30";
  if (condition === "normal") return "bg-emerald-500/20 text-emerald-200 border-emerald-300/30";
  return "bg-yellow-500/20 text-yellow-200 border-yellow-300/30";
};

const getCondition = (value: number, lab: LabInterpretation, category: PatientCategory) => {
  const range = lab.ranges[category] ?? lab.ranges.adult;
  if (value < lab.critical.low) return "critical_low";
  if (value > lab.critical.high) return "critical_high";
  if (value < range.low) return "low";
  if (value > range.high) return "high";
  return "normal";
};

const abgScenarios = [
  { label: "Septic Shock", pH: 7.2, pco2: 28, hco3: 12, pao2: 65, sao2: 90, be: -8, lactate: 6.2, fio2: 21 },
  { label: "DKA", pH: 7.1, pco2: 22, hco3: 8, pao2: 84, sao2: 95, be: -14, lactate: 2.8, fio2: 21 },
  { label: "COPD Exacerbation", pH: 7.28, pco2: 70, hco3: 32, pao2: 58, sao2: 86, be: 4, lactate: 1.9, fio2: 28 },
  { label: "Anxiety/Hyperventilation", pH: 7.52, pco2: 25, hco3: 22, pao2: 96, sao2: 98, be: -1, lactate: 1.2, fio2: 21 },
  { label: "Vomiting", pH: 7.55, pco2: 46, hco3: 38, pao2: 88, sao2: 96, be: 10, lactate: 1.1, fio2: 21 },
  { label: "Pulmonary Embolism", pH: 7.48, pco2: 28, hco3: 22, pao2: 58, sao2: 90, be: -1, lactate: 3.1, fio2: 21 },
];

const Labs = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { t, language } = usePreferences();
  const tx = text[language];

  const [labSearch, setLabSearch] = useState("");
  const [selectedLabId, setSelectedLabId] = useState(labInterpretations[0]?.id ?? "");
  const [labValue, setLabValue] = useState("");
  const [patientCategory, setPatientCategory] = useState<PatientCategory>("adult");
  const [unitMode, setUnitMode] = useState<UnitMode>("conventional");
  const [quickEntry, setQuickEntry] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  const [abgMode, setAbgMode] = useState<ABGMode>("abg");
  const [abgValues, setAbgValues] = useState({ pH: "", pco2: "", hco3: "", pao2: "", sao2: "", be: "", lactate: "", fio2: "", na: "140", cl: "104" });

  useEffect(() => {
    const cache = window.localStorage.getItem(RECENT_KEY);
    if (cache) setRecent(JSON.parse(cache));
  }, []);

  const persistRecent = (id: string) => {
    const next = [id, ...recent.filter((item) => item !== id)].slice(0, 8);
    setRecent(next);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const filteredReference = labValues.filter((lab) => {
    const matchesSearch = lab.test.toLowerCase().includes(search.toLowerCase()) || lab.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || lab.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = useMemo(() => ["All", ...Array.from(new Set(labValues.map((lab) => lab.category)))], []);

  const filteredLabs = labInterpretations.filter((lab) => {
    const label = language === "ar" ? lab.name_ar : lab.name_en;
    return (
      label.toLowerCase().includes(labSearch.toLowerCase()) ||
      lab.name_en.toLowerCase().includes(labSearch.toLowerCase()) ||
      lab.name_ar.includes(labSearch) ||
      lab.category.toLowerCase().includes(labSearch.toLowerCase())
    );
  });

  const selectedLab = labInterpretations.find((lab) => lab.id === selectedLabId) ?? labInterpretations[0];
  const numericValue = Number(labValue);
  const activeCondition = Number.isFinite(numericValue)
    ? getCondition(numericValue, selectedLab, patientCategory)
    : null;
  const interpretation = selectedLab.interpretations.find((item) => item.condition === activeCondition);
  const range = selectedLab.ranges[patientCategory] ?? selectedLab.ranges.adult;

  useEffect(() => {
    if (selectedLabId) persistRecent(selectedLabId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLabId]);

  const quickResults = useMemo(() => {
    return quickEntry
      .split(/[\n,]/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, valueStr] = line.split(/[=:]/).map((v) => v.trim());
        const value = Number(valueStr);
        const found = labInterpretations.find((lab) => lab.id === name?.toLowerCase() || lab.name_en.toLowerCase().includes(name?.toLowerCase()));
        if (!found || !Number.isFinite(value)) return null;
        const condition = getCondition(value, found, patientCategory);
        const details = found.interpretations.find((item) => item.condition === condition);
        return { found, value, condition, details };
      })
      .filter(Boolean) as Array<{ found: LabInterpretation; value: number; condition: string; details: LabInterpretation["interpretations"][number] | undefined }>;
  }, [quickEntry, patientCategory]);

  const parse = (v: string) => Number(v);
  const phRaw = parse(abgValues.pH);
  const pco2Raw = parse(abgValues.pco2);
  const hco3 = parse(abgValues.hco3);
  const pao2 = parse(abgValues.pao2);
  const fio2 = parse(abgValues.fio2);
  const lactate = parse(abgValues.lactate);
  const na = parse(abgValues.na);
  const cl = parse(abgValues.cl);
  const ph = abgMode === "vbg" && Number.isFinite(phRaw) ? phRaw + 0.03 : phRaw;
  const pco2 = abgMode === "vbg" && Number.isFinite(pco2Raw) ? pco2Raw - 5 : pco2Raw;

  const abgInterpretation = useMemo(() => {
    if (![ph, pco2, hco3].every(Number.isFinite)) return null;
    const acidBase = ph < 7.35 ? "Acidosis" : ph > 7.45 ? "Alkalosis" : "Normal pH";
    const respiratory = (ph < 7.35 && pco2 > 45) || (ph > 7.45 && pco2 < 35);
    const metabolic = (ph < 7.35 && hco3 < 22) || (ph > 7.45 && hco3 > 26);
    const primary = respiratory ? `Respiratory ${acidBase}` : metabolic ? `Metabolic ${acidBase}` : "Mixed or compensated";

    const co2Abn = pco2 < 35 || pco2 > 45;
    const hco3Abn = hco3 < 22 || hco3 > 26;
    const compensation =
      (ph < 7.35 || ph > 7.45) && co2Abn && hco3Abn
        ? "Partially compensated"
        : (ph < 7.35 || ph > 7.45) && (co2Abn || hco3Abn)
          ? "Uncompensated"
          : co2Abn && hco3Abn
            ? "Fully compensated"
            : "No compensation";

    const anionGap = Number.isFinite(na) && Number.isFinite(cl) ? na - (cl + hco3) : null;
    const agLabel = anionGap == null ? "N/A" : anionGap > 12 ? "High Anion Gap" : "Normal Anion Gap";
    const oxygenation = !Number.isFinite(pao2) ? "N/A" : pao2 < 60 ? "Severe hypoxemia" : pao2 < 80 ? "Mild hypoxemia" : "Normal oxygenation";
    const pfRatio = Number.isFinite(pao2) && Number.isFinite(fio2) && fio2 > 0 ? pao2 / (fio2 / 100) : null;
    const pfLabel = pfRatio == null ? "N/A" : pfRatio < 100 ? "Severe ARDS" : pfRatio < 200 ? "Moderate ARDS" : pfRatio < 300 ? "Mild ARDS" : "Normal";

    let expected = "";
    if (metabolic && ph < 7.35) expected = `Winter: PaCO2 = ${(1.5 * hco3 + 8).toFixed(1)} ±2`;
    if (metabolic && ph > 7.45) expected = `Expected PaCO2 = ${(0.7 * hco3 + 21).toFixed(1)}`;
    if (respiratory && ph < 7.35) expected = "Acute: HCO3 +1 /10 PaCO2; Chronic: +3.5 /10";
    if (respiratory && ph > 7.45) expected = "Acute: HCO3 -2 /10 PaCO2; Chronic: -5 /10";

    const likelyCauses = metabolic
      ? ["Sepsis/shock", "DKA/renal failure", "GI bicarbonate loss"]
      : respiratory
        ? ["Airway/lung disease", "Sedation/opioids", "Hyperventilation/pain"]
        : ["Mixed disturbance", "Compensated chronic disease"];

    const nursingActions = [
      "Assess airway, breathing, circulation and mental status",
      "Correlate with lactate, perfusion, urine output",
      "Notify MD for severe derangements or critical hypoxemia",
      "Repeat gas and trend after intervention",
    ];
    if (Number.isFinite(lactate) && lactate >= 4) nursingActions.push("Begin sepsis bundle and fluid resuscitation per protocol");

    return { acidBase, primary, compensation, anionGap, agLabel, oxygenation, pfRatio, pfLabel, expected, likelyCauses, nursingActions };
  }, [ph, pco2, hco3, na, cl, pao2, fio2, lactate]);

  return (
    <AppLayout title={t.labsTitle} subtitle={t.labsSubtitle}>
      <Tabs defaultValue="reference" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reference">{tx.reference}</TabsTrigger>
          <TabsTrigger value="lab-interpreter">{tx.labInterpreter}</TabsTrigger>
          <TabsTrigger value="abg">{tx.abg}</TabsTrigger>
        </TabsList>

        <TabsContent value="reference" className="space-y-4">
          <section className="rounded-3xl border border-white/10 bg-card/80 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary rtl:left-auto rtl:right-4" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchLabs} className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 rtl:pl-4 rtl:pr-12" />
              </div>
              <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{filteredReference.length} {t.results}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button key={cat} size="sm" variant="outline" onClick={() => setCategory(cat)} className={cat === category ? "rounded-full border-primary/50 bg-primary/30" : "rounded-full"}>{cat === "All" ? t.allLabel : cat}</Button>
              ))}
            </div>
          </section>
          <section className="grid gap-3">
            {filteredReference.map((lab) => (
              <div key={lab.test} className="rounded-3xl border border-white/10 bg-card/70 p-5">
                <p className="text-xs uppercase tracking-[0.4em] text-primary">{lab.category}</p>
                <p className="text-2xl font-semibold">{lab.test}</p>
                <p className="text-sm text-white/80">{t.normal}: {lab.normalRange}</p>
              </div>
            ))}
          </section>
        </TabsContent>

        <TabsContent value="lab-interpreter" className="space-y-4">
          <section className="rounded-3xl border border-white/10 bg-card/80 p-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm">{tx.selectLab}</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={labSearch} onChange={(e) => setLabSearch(e.target.value)} className="pl-8" />
                </div>
                <div className="max-h-44 overflow-auto rounded-xl border border-white/10 p-2">
                  {filteredLabs.slice(0, 20).map((lab) => (
                    <button key={lab.id} onClick={() => setSelectedLabId(lab.id)} className={`mb-1 block w-full rounded-lg px-2 py-1 text-start text-sm ${selectedLabId === lab.id ? "bg-primary/30" : "bg-white/5"}`}>
                      {language === "ar" ? lab.name_ar : lab.name_en}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm">{tx.value}</label>
                <Input value={labValue} onChange={(e) => setLabValue(e.target.value)} type="number" />
                <div className="flex flex-wrap gap-2">
                  {(["conventional", "si"] as UnitMode[]).map((mode) => (
                    <Button key={mode} size="sm" variant={unitMode === mode ? "default" : "outline"} onClick={() => setUnitMode(mode)}>{mode.toUpperCase()}</Button>
                  ))}
                  {(["adult", "pediatric", "neonatal", "pregnant"] as PatientCategory[]).map((patient) => (
                    <Button key={patient} size="sm" variant={patientCategory === patient ? "default" : "outline"} onClick={() => setPatientCategory(patient)}>{patient}</Button>
                  ))}
                </div>
                <Button variant="secondary" onClick={() => navigator.clipboard.writeText(JSON.stringify({ lab: selectedLabId, value: labValue, category: patientCategory }))}><Copy className="me-2 h-4 w-4" />{tx.copy}</Button>
              </div>
            </div>
          </section>

          {interpretation && Number.isFinite(numericValue) && (
            <section className="space-y-3 rounded-3xl border border-white/10 bg-card/80 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{language === "ar" ? selectedLab.name_ar : selectedLab.name_en}</h3>
                <Badge className={`border ${getStatusTone(activeCondition ?? "")}`}>{language === "ar" ? interpretation.status_ar : interpretation.status_en}</Badge>
              </div>
              <p><strong>{tx.referenceRange}:</strong> {range.low} - {range.high} {unitMode === "si" ? range.unit_si : range.unit}</p>
              <p><strong>{tx.currentValue}:</strong> {numericValue} {unitMode === "si" ? range.unit_si : range.unit} ({numericValue < range.low ? (range.low - numericValue).toFixed(2) : numericValue > range.high ? `+${(numericValue - range.high).toFixed(2)}` : "0"})</p>
              <p><strong>{tx.clinicalMeaning}:</strong> {language === "ar" ? interpretation.meaning_ar : interpretation.meaning_en}</p>
              <p><strong>{tx.causes}:</strong> {(language === "ar" ? interpretation.causes_ar : interpretation.causes_en).join(" • ")}</p>
              <p><strong>{tx.drug}:</strong> {(language === "ar" ? interpretation.drug_interference_ar : interpretation.drug_interference_en).join(" • ")}</p>
              <p><strong>{tx.nursing}:</strong> {(language === "ar" ? interpretation.nursing_actions_ar : interpretation.nursing_actions_en).join(" • ")}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">{tx.related}:</span>
                {interpretation.related_labs.map((id) => (
                  <Button key={id} size="sm" variant="outline" onClick={() => setSelectedLabId(id)}>{id}</Button>
                ))}
              </div>
              {activeCondition?.includes("critical") && <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-red-200">⚠️ {tx.criticalAlert}</div>}
            </section>
          )}

          <section className="rounded-3xl border border-white/10 bg-card/80 p-5">
            <p className="mb-2 text-sm font-semibold">{tx.quickEntry}</p>
            <Input value={quickEntry} onChange={(e) => setQuickEntry(e.target.value)} placeholder={tx.quickPlaceholder} />
            <div className="mt-3 grid gap-2">
              {quickResults.map((row) => (
                <div key={row.found.id} className="rounded-xl border border-white/10 p-3 text-sm">
                  {language === "ar" ? row.found.name_ar : row.found.name_en}: {row.value} — {language === "ar" ? row.details?.status_ar : row.details?.status_en}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{tx.recent}: {recent.join(", ")}</p>
          </section>
        </TabsContent>

        <TabsContent value="abg" className="space-y-4">
          <section className="rounded-3xl border border-white/10 bg-card/80 p-5">
            <div className="mb-3 flex gap-2">
              <Button size="sm" variant={abgMode === "abg" ? "default" : "outline"} onClick={() => setAbgMode("abg")}>ABG</Button>
              <Button size="sm" variant={abgMode === "vbg" ? "default" : "outline"} onClick={() => setAbgMode("vbg")}>VBG</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries({ pH: "pH", pco2: "PaCO2", hco3: "HCO3", pao2: "PaO2", sao2: "SaO2", be: "Base Excess", lactate: "Lactate", fio2: "FiO2", na: "Na", cl: "Cl" }).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs">{label}</label>
                  <Input value={abgValues[key as keyof typeof abgValues]} onChange={(e) => setAbgValues((prev) => ({ ...prev, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {abgScenarios.map((scenario) => (
                <Button key={scenario.label} size="sm" variant="outline" onClick={() => setAbgValues({ pH: String(scenario.pH), pco2: String(scenario.pco2), hco3: String(scenario.hco3), pao2: String(scenario.pao2), sao2: String(scenario.sao2), be: String(scenario.be), lactate: String(scenario.lactate), fio2: String(scenario.fio2), na: "140", cl: "104" })}>{scenario.label}</Button>
              ))}
            </div>
          </section>

          {abgInterpretation && (
            <section className="grid gap-3">
              <div className="rounded-3xl border border-white/10 bg-card/80 p-4">
                <p className="text-sm text-muted-foreground">{tx.primary}</p>
                <p className="text-2xl font-semibold">{abgInterpretation.primary} — {abgInterpretation.compensation}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-card/80 p-4">
                <p>{tx.step} 1: {abgInterpretation.acidBase}</p>
                <p>{tx.step} 4: {abgInterpretation.agLabel} {abgInterpretation.anionGap != null ? `(${abgInterpretation.anionGap.toFixed(1)})` : ""}</p>
                <p>{tx.oxygenation}: {abgInterpretation.oxygenation}</p>
                <p>P/F Ratio: {abgInterpretation.pfRatio?.toFixed(1) ?? "N/A"} ({abgInterpretation.pfLabel})</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-card/80 p-4">
                <p className="font-semibold">{tx.expectedComp}</p>
                <p>{abgInterpretation.expected || "—"}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-card/80 p-4">
                <p className="font-semibold">{tx.likelyCauses}</p>
                <p>{abgInterpretation.likelyCauses.join(" • ")}</p>
                <p className="mt-2 font-semibold">{tx.nursing}</p>
                <ul className="list-disc ps-5 text-sm">
                  {abgInterpretation.nursingActions.map((action) => <li key={action}>{action}</li>)}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  {abgInterpretation.pfLabel.includes("ARDS") && <Badge className="bg-blue-500/20">Ventilator Guide</Badge>}
                  {Number.isFinite(lactate) && lactate > 2 && <Badge className="bg-red-500/20">Sepsis Protocol</Badge>}
                  {abgInterpretation.primary.includes("Metabolic Acidosis") && <Badge className="bg-yellow-500/20">Insulin Drip Calculator</Badge>}
                </div>
              </div>
            </section>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Labs;
