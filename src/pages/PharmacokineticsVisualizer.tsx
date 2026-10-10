import { useState } from "react";
import { Link } from "react-router-dom";
import { Atom, FlaskConical, Hourglass, Pill } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Choice, Field, Panel } from "@/components/calculators/parts";
import BarList from "@/components/data/BarList";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import ConcentrationChart from "@/components/pk/ConcentrationChart";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreferences } from "@/contexts/PreferencesContext";
import pharma from "@/data/pharma-i18n.json";
import { accumulationFactor, concentrationCurve, formatMinutes, fractionRemaining, pick, timeToSteadyState } from "@/lib/clinical/pk";
import { parseNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";

const TEXT = {
  en: {
    drugs: "Drugs",
    concepts: "Concepts",
    enzymes: "CYP enzymes",
    rule: "≈ 97 % eliminated",
    ruleHint: "after 5 half-lives",
    simulator: "Steady-state simulator",
    simulatorHint: "Repeated IV doses, one-compartment model. Levels are relative to the peak after one dose.",
    halfLife: "Half-life (hours)",
    interval: "Dosing interval",
    every: (h: number) => `q${h}h`,
    accumulation: "Accumulation at steady state",
    toSteady: "Time to ~97 % of steady state",
    chartTitle: "Relative concentration over time",
    time: "Time",
    level: "Level",
    peak: "Steady-state peak",
    trough: "Steady-state trough",
    hour: "h",
    enterHalfLife: "Enter a half-life between 0.1 and 200 hours.",
    remaining: "Drug remaining after each half-life",
    halfLives: (n: number) => `${n} t½`,
    adme: "ADME — the drug's journey",
    drug: "Drug",
    route: "Route",
    onset: "Onset",
    peakTime: "Peak",
    duration: "Duration",
    halfLifeLabel: "Half-life",
    metabolism: "Metabolism",
    excretion: "Excretion",
    keyPoint: "Key point",
    related: "Related sections",
    halfLifeChart: "Half-lives compared",
    logNote: "Bars use a log scale — each step to the right is 10× longer.",
    compare: "Compare two drugs",
    fasterOnset: "Faster onset",
    longerDuration: "Longer duration",
    shorterHalfLife: "Shorter half-life",
    noAnswer: "Not comparable (equal or not a fixed value)",
    cyp: "CYP450 interactions",
    substrates: "Substrates",
    inhibitors: "Inhibitors (raise levels)",
    inducers: "Inducers (lower levels)",
    risk: "risk",
    conceptsTitle: "Key concepts",
    links: { atlas: "Body Atlas", pathways: "Pathways", drugs: "Drug reference" },
  },
  ar: {
    drugs: "الأدوية",
    concepts: "المفاهيم",
    enzymes: "إنزيمات CYP",
    rule: "≈ 97 % يُطرح",
    ruleHint: "بعد 5 أعمار نصف",
    simulator: "محاكي الحالة المستقرة",
    simulatorHint: "جرعات وريدية متكررة، نموذج حجرة واحدة. المستويات نسبةً لذروة الجرعة الأولى.",
    halfLife: "عمر النصف (ساعات)",
    interval: "الفاصل بين الجرعات",
    every: (h: number) => `${h} س`,
    accumulation: "التراكم بالحالة المستقرة",
    toSteady: "وقت الاستقرار (~97 %)",
    chartTitle: "التركيز النسبي مع الوقت",
    time: "الوقت",
    level: "المستوى",
    peak: "ذروة الحالة المستقرة",
    trough: "قاع الحالة المستقرة",
    hour: "س",
    enterHalfLife: "أدخل عمر نصف بين 0.1 و 200 ساعة.",
    remaining: "المتبقي من الدواء بعد كل عمر نصف",
    halfLives: (n: number) => `${n} t½`,
    adme: "ADME — رحلة الدواء",
    drug: "الدواء",
    route: "الطريق",
    onset: "بداية التأثير",
    peakTime: "الذروة",
    duration: "المدة",
    halfLifeLabel: "عمر النصف",
    metabolism: "الاستقلاب",
    excretion: "الإطراح",
    keyPoint: "نقطة مهمة",
    related: "أقسام مرتبطة",
    halfLifeChart: "مقارنة أعمار النصف",
    logNote: "الأشرطة بمقياس لوغاريتمي — كل خطوة لليمين أطول بـ 10 مرات.",
    compare: "قارن بين دوائين",
    fasterOnset: "بداية أسرع",
    longerDuration: "مدة أطول",
    shorterHalfLife: "عمر نصف أقصر",
    noAnswer: "ما تنقارن (متساوية أو ما إلها قيمة ثابتة)",
    cyp: "تداخلات CYP450",
    substrates: "الركائز",
    inhibitors: "المثبطات (ترفع المستوى)",
    inducers: "المحفزات (تخفض المستوى)",
    risk: "خطورة",
    conceptsTitle: "مفاهيم أساسية",
    links: { atlas: "أطلس الجسم", pathways: "المسارات", drugs: "مرجع الأدوية" },
  },
};

const INTERVALS = ["4", "6", "8", "12", "24"] as const;
const drugs = pharma.drugs;
const byHalfLife = [...drugs].sort((a, b) => a.halfLifeMin - b.halfLifeMin);

const PharmacokineticsVisualizer = () => {
  const { language } = usePreferences();
  const tx = TEXT[language];
  const h = pharma.header[language];
  const [halfLifeText, setHalfLifeText] = useState("6");
  const [interval, setDosingInterval] = useState<(typeof INTERVALS)[number]>("8");
  const [drugName, setDrugName] = useState(drugs[0].name);
  const [phase, setPhase] = useState("A");
  const [compareA, setCompareA] = useState(drugs[0].name);
  const [compareB, setCompareB] = useState(drugs[1].name);

  const halfLife = parseNumber(halfLifeText);
  const validHalfLife = halfLife !== null && halfLife >= 0.1 && halfLife <= 200 ? halfLife : null;
  const tau = Number(interval);
  const until = validHalfLife ? Math.min(Math.max(tau * 6, Math.ceil((validHalfLife * 6) / tau) * tau), tau * 40) : 0;
  const curve = validHalfLife ? concentrationCurve({ halfLife: validHalfLife, tau, doses: Math.floor(until / tau) + 1, until, step: until / 300 }) : [];
  const acc = validHalfLife ? accumulationFactor(validHalfLife, tau) : null;

  const drug = drugs.find((d) => d.name === drugName) ?? drugs[0];
  const phaseObj = pharma.phases.find((p) => p.key === phase) ?? pharma.phases[0];
  const c1 = drugs.find((d) => d.name === compareA) ?? drugs[0];
  const c2 = drugs.find((d) => d.name === compareB) ?? drugs[1];
  const comparisons = [
    { label: tx.fasterOnset, winner: pick({ item: c1.name, value: c1.onsetMin }, { item: c2.name, value: c2.onsetMin }, "lower") },
    { label: tx.longerDuration, winner: pick({ item: c1.name, value: c1.durationMin }, { item: c2.name, value: c2.durationMin }, "higher") },
    { label: tx.shorterHalfLife, winner: pick({ item: c1.name, value: c1.halfLifeMin }, { item: c2.name, value: c2.halfLifeMin }, "lower") },
  ];
  const drugSelect = (value: string, onChange: (v: string) => void, label: string) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {drugs.map((d) => (
          <SelectItem key={d.name} value={d.name}>
            {d.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <AppLayout illustration="pharma" title={h.title} subtitle={h.subtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Pill} tone="primary" label={tx.drugs} value={drugs.length} />
        <StatTile icon={Atom} label={tx.concepts} value={pharma.concepts.length} />
        <StatTile icon={FlaskConical} label={tx.enzymes} value={pharma.cyp.length} />
        <StatTile icon={Hourglass} tone="good" label={tx.rule} value="5 t½" hint={tx.ruleHint} />
      </section>

      <Panel title={tx.simulator}>
        <p className="text-xs text-muted-foreground">{tx.simulatorHint}</p>
        <div className="grid gap-3 sm:grid-cols-[12rem_1fr] sm:items-end">
          <Field id="pk-halflife" label={tx.halfLife} value={halfLifeText} onChange={setHalfLifeText} />
          <div className="space-y-1">
            <p className="text-xs font-medium">{tx.interval}</p>
            <Choice label={tx.interval} value={interval} onChange={setDosingInterval} options={INTERVALS.map((v) => ({ value: v, label: tx.every(Number(v)) }))} />
          </div>
        </div>
        {validHalfLife && acc !== null ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatTile label={tx.accumulation} value={<span dir="ltr">{acc.toFixed(2)}×</span>} />
              <StatTile label={tx.toSteady} value={<span dir="ltr">{formatMinutes(timeToSteadyState(validHalfLife) * 60, language)}</span>} />
            </div>
            <ConcentrationChart points={curve} tau={tau} steadyPeak={acc} steadyTrough={acc - 1} labels={{ title: tx.chartTitle, time: tx.time, level: tx.level, peak: tx.peak, trough: tx.trough, hour: tx.hour }} />
          </>
        ) : (
          <p role="status" className="rounded-2xl border border-dashed p-3 text-center text-sm text-muted-foreground">{tx.enterHalfLife}</p>
        )}
        <div className="space-y-2">
          <p className="text-xs font-medium">{tx.remaining}</p>
          <BarList
            ariaLabel={tx.remaining}
            unit="%"
            max={100}
            rows={[1, 2, 3, 4, 5].map((n) => ({ key: String(n), label: tx.halfLives(n), value: fractionRemaining(n) * 100, display: `${+(fractionRemaining(n) * 100).toFixed(2)}`, color: "var(--viz-1)" }))}
          />
        </div>
        <SourceNote ids={["rowland-tozer"]} />
      </Panel>

      <section className="grid items-start gap-4 lg:grid-cols-2">
        <Panel title={tx.adme}>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pharma.phases.map((p, i) => (
              <li key={p.key}>
                <button
                  type="button"
                  aria-pressed={phase === p.key}
                  onClick={() => setPhase(p.key)}
                  className={cn("w-full rounded-2xl border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", phase === p.key ? "border-primary bg-primary/10" : "hover:bg-secondary/60")}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: `var(--viz-${i + 1})` }}>{p.key}</span>
                  <span className="mt-1 block text-sm font-semibold">{language === "ar" ? p.ar : p.en}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="rounded-2xl bg-secondary/40 p-3 text-sm">
            <span className="font-semibold">{language === "ar" ? phaseObj.ar : phaseObj.en}:</span> <span dir="ltr">{phaseObj.location}</span>
          </p>
          {drugSelect(drugName, setDrugName, tx.drug)}
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            {(
              [
                [tx.route, drug.route],
                [tx.onset, drug.onset],
                [tx.peakTime, drug.peak],
                [tx.duration, drug.duration],
                [tx.halfLifeLabel, drug.halfLife],
                [tx.metabolism, drug.metabolism],
                [tx.excretion, drug.excretion],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd dir="ltr" className="text-start">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="rounded-2xl border border-primary/30 bg-primary/5 p-3 text-sm">
            <span className="font-semibold">{tx.keyPoint}: </span>
            <span dir="ltr">{drug.pk}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {drug.relatedOrgans.map((o) => (
              <Badge key={o} variant="outline">{o}</Badge>
            ))}
            <span className="ms-auto flex gap-3">
              <Link to="/atlas" className="text-primary underline">{tx.links.atlas}</Link>
              <Link to="/drugs" className="text-primary underline">{tx.links.drugs}</Link>
            </span>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title={tx.halfLifeChart}>
            <BarList
              ariaLabel={tx.halfLifeChart}
              max={Math.log10(byHalfLife[byHalfLife.length - 1].halfLifeMin) + 1}
              rows={byHalfLife.map((d) => ({ key: d.name, label: d.name, value: Math.log10(d.halfLifeMin) + 1, display: formatMinutes(d.halfLifeMin, language), color: d.name === drugName ? "var(--viz-2)" : "var(--viz-1)" }))}
            />
            <p className="text-[11px] text-muted-foreground">{tx.logNote}</p>
          </Panel>
          <Panel title={tx.compare}>
            <div className="grid grid-cols-2 gap-2">
              {drugSelect(compareA, setCompareA, `${tx.drug} 1`)}
              {drugSelect(compareB, setCompareB, `${tx.drug} 2`)}
            </div>
            <dl className="space-y-2 text-sm">
              {comparisons.map((c) => (
                <div key={c.label} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/40 px-3 py-2">
                  <dt className="text-muted-foreground">{c.label}</dt>
                  <dd dir="ltr" className={cn("text-end font-semibold", !c.winner && "text-xs font-normal text-muted-foreground")}>{c.winner ?? tx.noAnswer}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </section>

      <Panel title={tx.cyp}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pharma.cyp.map((c) => (
            <div key={c.enzyme} dir="ltr" className="space-y-1 rounded-2xl border p-3 text-start text-xs">
              <div className="flex items-center justify-between text-sm font-semibold">
                {c.enzyme}
                <Badge variant="outline" className={c.risk === "High" ? "border-medical-red/40 text-medical-red" : c.risk === "Moderate" ? "border-medical-yellow/40 text-medical-yellow" : ""}>
                  {c.risk}
                </Badge>
              </div>
              <p>
                <span className="text-muted-foreground">{tx.substrates}:</span> {c.substrates}
              </p>
              <p>
                <span className="text-muted-foreground">{tx.inhibitors}:</span> {c.inhibitors}
              </p>
              <p>
                <span className="text-muted-foreground">{tx.inducers}:</span> {c.inducers}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={tx.conceptsTitle}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pharma.concepts.map((c) => (
            <div key={c.nameEn} className="space-y-1 rounded-2xl border p-3">
              <p className="font-semibold">{language === "ar" ? c.nameAr : c.nameEn}</p>
              {language === "ar" && <p dir="ltr" className="text-start text-[11px] text-muted-foreground">{c.nameEn}</p>}
              <p dir="ltr" className="text-start text-sm text-muted-foreground">{c.visual}</p>
            </div>
          ))}
        </div>
        <SourceNote ids={["rowland-tozer", "ashp-vanco"]} />
      </Panel>
    </AppLayout>
  );
};

export default PharmacokineticsVisualizer;
