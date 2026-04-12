import { useMemo, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/contexts/PreferencesContext";

const tone = {
  green: "text-emerald-300 border-emerald-400/40 bg-emerald-500/10",
  yellow: "text-yellow-200 border-yellow-400/40 bg-yellow-500/10",
  orange: "text-orange-200 border-orange-400/40 bg-orange-500/10",
  red: "text-red-200 border-red-400/40 bg-red-500/10",
  gray: "text-slate-300 border-slate-400/40 bg-slate-500/10",
  blue: "text-cyan-200 border-cyan-400/40 bg-cyan-500/10",
};

const B = ({ en, ar }: { en: string; ar: string }, isArabic: boolean) => (isArabic ? ar : en);

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card className="rounded-2xl border-white/10 bg-white/5 p-4 space-y-3">
    <h3 className="text-base font-semibold text-white">{title}</h3>
    {children}
  </Card>
);

const OptionRow = ({
  label,
  subtitle,
  selected,
  onClick,
  score,
}: {
  label: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
  score: number;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-xl border p-3 text-left transition ${
      selected
        ? "border-primary/60 bg-primary/25"
        : "border-white/15 bg-white/5 hover:border-white/35"
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm text-white">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <span className="rounded-full border border-white/20 px-2 py-1 text-xs text-cyan-100">{score}</span>
    </div>
  </button>
);

const SOFAAssessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const systems = [
    {
      key: "resp",
      title: B({ en: "Respiration", ar: "التنفس" }, isArabic),
      opts: [
        [0, "≥ 400", "Normal", "طبيعي"],
        [1, "300-399", "Mild dysfunction", "خلل خفيف"],
        [2, "200-299", "Moderate", "متوسط"],
        [3, "100-199 + ventilation", "Severe", "شديد"],
        [4, "< 100 + ventilation", "Very severe", "شديد جداً"],
      ] as const,
    },
    {
      key: "coag",
      title: B({ en: "Coagulation", ar: "التخثر" }, isArabic),
      opts: [
        [0, "PLT ≥ 150", "Normal", "طبيعي"],
        [1, "100-149", "Mild", "خفيف"],
        [2, "50-99", "Moderate", "متوسط"],
        [3, "20-49", "Severe", "شديد"],
        [4, "< 20", "Very severe", "شديد جداً"],
      ] as const,
    },
    {
      key: "liver",
      title: B({ en: "Liver", ar: "الكبد" }, isArabic),
      opts: [
        [0, "Bili <1.2", "Normal", "طبيعي"],
        [1, "1.2-1.9", "Mild", "خفيف"],
        [2, "2.0-5.9", "Moderate", "متوسط"],
        [3, "6.0-11.9", "Severe", "شديد"],
        [4, "≥ 12", "Very severe", "شديد جداً"],
      ] as const,
    },
    {
      key: "cv",
      title: B({ en: "Cardiovascular", ar: "القلب والأوعية" }, isArabic),
      opts: [
        [0, "MAP ≥70", "No hypotension", "لا يوجد هبوط ضغط"],
        [1, "MAP <70", "Mild hypotension", "هبوط ضغط خفيف"],
        [2, "Dopa ≤5 / any Dobutamine", "Low-dose vasopressor", "جرعة منخفضة"],
        [3, "Dopa >5 or Epi/Norepi ≤0.1", "Moderate vasopressor", "جرعة متوسطة"],
        [4, "Dopa >15 or Epi/Norepi >0.1", "High-dose vasopressor", "جرعة عالية"],
      ] as const,
    },
    {
      key: "neuro",
      title: B({ en: "Neurological", ar: "العصبي" }, isArabic),
      opts: [
        [0, "GCS 15", "Normal", "طبيعي"],
        [1, "GCS 13-14", "Mild", "خفيف"],
        [2, "GCS 10-12", "Moderate", "متوسط"],
        [3, "GCS 6-9", "Severe", "شديد"],
        [4, "GCS <6", "Very severe", "شديد جداً"],
      ] as const,
    },
    {
      key: "renal",
      title: B({ en: "Renal", ar: "الكلى" }, isArabic),
      opts: [
        [0, "Cr <1.2", "Normal", "طبيعي"],
        [1, "Cr 1.2-1.9", "Mild", "خفيف"],
        [2, "Cr 2.0-3.4", "Moderate", "متوسط"],
        [3, "Cr 3.5-4.9 / UO<500", "Severe", "شديد"],
        [4, "Cr ≥5 / UO<200", "Very severe", "شديد جداً"],
      ] as const,
    },
  ];
  const [sel, setSel] = useState<Record<string, number>>({});
  const [q, setQ] = useState({ rr: false, ams: false, sbp: false });
  const total = Object.values(sel).reduce((a, b) => a + b, 0);
  const qTotal = (q.rr ? 1 : 0) + (q.ams ? 1 : 0) + (q.sbp ? 1 : 0);

  const risk = useMemo(() => {
    if (total >= 15) return { c: "red", t: B({ en: "Extremely critical", ar: "حرج للغاية" }, isArabic) };
    if (total >= 12) return { c: "red", t: B({ en: "Critical", ar: "حرج" }, isArabic) };
    if (total >= 10) return { c: "orange", t: B({ en: "Very severe", ar: "شديد جداً" }, isArabic) };
    if (total >= 8) return { c: "orange", t: B({ en: "Severe dysfunction", ar: "خلل شديد" }, isArabic) };
    if (total >= 6) return { c: "yellow", t: B({ en: "Significant dysfunction", ar: "خلل مهم" }, isArabic) };
    if (total >= 4) return { c: "yellow", t: B({ en: "Moderate dysfunction", ar: "خلل متوسط" }, isArabic) };
    if (total >= 2) return { c: "green", t: B({ en: "Mild dysfunction", ar: "خلل خفيف" }, isArabic) };
    return { c: "green", t: B({ en: "Minimal dysfunction", ar: "خلل بسيط" }, isArabic) };
  }, [isArabic, total]);

  return (
    <div className="space-y-4">
      {systems.map((s) => (
        <Panel key={s.key} title={s.title}>
          <div className="space-y-2">
            {s.opts.map(([score, range, en, ar]) => (
              <OptionRow
                key={`${s.key}-${score}`}
                label={`${isArabic ? ar : en} (${range})`}
                selected={sel[s.key] === score}
                onClick={() => setSel((p) => ({ ...p, [s.key]: score }))}
                score={score}
              />
            ))}
          </div>
        </Panel>
      ))}
      <Card className={`rounded-2xl border p-4 ${tone[risk.c as keyof typeof tone]}`}>
        <p className="text-sm">{B({ en: "Total Score", ar: "المجموع الكلي" }, isArabic)}: {total} / 24</p>
        <p className="text-sm">{risk.t}</p>
      </Card>
      <Panel title="Sepsis-3">
        <p className="text-sm text-muted-foreground">{B({ en: "Sepsis = Suspected infection + SOFA ≥ 2", ar: "الإنتان = اشتباه إنتان + SOFA ≥ 2" }, isArabic)}</p>
        <p className="text-sm text-muted-foreground">{B({ en: "Septic Shock = Sepsis + Vasopressors for MAP ≥65 + Lactate >2 despite fluids", ar: "صدمة إنتانية = إنتان + رافعات ضغط لـ MAP ≥65 + لاكتيت >2 رغم السوائل" }, isArabic)}</p>
        <p className="text-sm text-yellow-200">{B({ en: "⚠️ Acute change ≥ 2 from baseline is clinically significant", ar: "⚠️ تغير حاد ≥2 من الأساس مهم سريرياً" }, isArabic)}</p>
      </Panel>
      <Panel title="qSOFA">
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["rr", "RR ≥ 22", "معدل التنفس ≥ 22"],
            ["ams", "AMS (GCS < 15)", "تغير الوعي"],
            ["sbp", "SBP ≤ 100", "الضغط الانقباضي ≤ 100"],
          ].map(([k, en, ar]) => (
            <button key={k} className={`rounded-xl border p-3 text-sm ${q[k as keyof typeof q] ? "border-primary/60 bg-primary/25" : "border-white/15"}`} onClick={() => setQ((p) => ({ ...p, [k]: !p[k as keyof typeof p] }))}>
              {isArabic ? ar : en}
            </button>
          ))}
        </div>
        <p className="text-sm text-white">qSOFA: {qTotal} / 3 {qTotal >= 2 ? `— ${B({ en: "Screen for sepsis", ar: "افحص للإنتان" }, isArabic)}` : ""}</p>
      </Panel>
    </div>
  );
};

const CAMICUAssessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const [rass, setRass] = useState<number>(0);
  const [f1, setF1] = useState<boolean | null>(null);
  const [errors, setErrors] = useState(0);
  const [f4, setF4] = useState<boolean | null>(null);

  const result = useMemo(() => {
    if (rass <= -4) return { key: "unable", text: B({ en: "Too sedated — reassess later", ar: "مخدّر جداً — أعد التقييم لاحقاً" }, isArabic), c: "gray" };
    if (f1 === false) return { key: "negative", text: B({ en: "No delirium detected", ar: "لم يُكتشف هذيان" }, isArabic), c: "green" };
    if (errors <= 2) return { key: "negative", text: B({ en: "No delirium detected", ar: "لم يُكتشف هذيان" }, isArabic), c: "green" };
    if (rass !== 0) return { key: "positive", text: B({ en: "DELIRIUM PRESENT ⚠️", ar: "الهذيان موجود ⚠️" }, isArabic), c: "red" };
    if (f4 === null) return { key: "pending", text: B({ en: "Continue Feature 4", ar: "أكمل الخطوة 4" }, isArabic), c: "blue" };
    return f4
      ? { key: "positive", text: B({ en: "DELIRIUM PRESENT ⚠️", ar: "الهذيان موجود ⚠️" }, isArabic), c: "red" }
      : { key: "negative", text: B({ en: "No delirium detected", ar: "لم يُكتشف هذيان" }, isArabic), c: "green" };
  }, [rass, f1, errors, f4, isArabic]);

  return (
    <div className="space-y-4">
      <Panel title={B({ en: "Pre-check", ar: "فحص مبدئي" }, isArabic)}>
        <p className="text-sm text-muted-foreground">{B({ en: "First assess RASS score", ar: "أولاً قيّم درجة RASS" }, isArabic)}</p>
        <Input type="number" min={-5} max={4} value={rass} onChange={(e) => setRass(Number(e.target.value))} />
      </Panel>
      <Panel title="Feature 1">
        <div className="grid grid-cols-2 gap-2">
          <Button variant={f1 === true ? "default" : "outline"} onClick={() => setF1(true)}>{B({ en: "Yes", ar: "نعم" }, isArabic)}</Button>
          <Button variant={f1 === false ? "default" : "outline"} onClick={() => setF1(false)}>{B({ en: "No", ar: "لا" }, isArabic)}</Button>
        </div>
      </Panel>
      <Panel title="Feature 2 - ASE (S-A-V-E-A-H-A-A-R-T)">
        <Input type="number" min={0} value={errors} onChange={(e) => setErrors(Number(e.target.value))} />
      </Panel>
      {rass === 0 && errors > 2 && (
        <Panel title="Feature 4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant={f4 === true ? "default" : "outline"} onClick={() => setF4(true)}>{B({ en: "Positive", ar: "إيجابي" }, isArabic)}</Button>
            <Button variant={f4 === false ? "default" : "outline"} onClick={() => setF4(false)}>{B({ en: "Negative", ar: "سلبي" }, isArabic)}</Button>
          </div>
        </Panel>
      )}
      <Card className={`rounded-2xl border p-4 ${tone[result.c as keyof typeof tone]}`}>
        <p>{result.text}</p>
      </Card>
    </div>
  );
};

const NEWS2Assessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const [scale2, setScale2] = useState(false);
  const [vals, setVals] = useState({ rr: 12, spo2: 96, oxygen: 0, sbp: 120, hr: 80, avcpu: 0, temp: 37 });
  const scoreRR = vals.rr <= 8 ? 3 : vals.rr <= 11 ? 1 : vals.rr <= 20 ? 0 : vals.rr <= 24 ? 2 : 3;
  const scoreSpO2 = scale2
    ? vals.spo2 <= 83
      ? 3
      : vals.spo2 <= 85
        ? 2
        : vals.spo2 <= 87
          ? 1
          : vals.spo2 <= 92
            ? 0
            : vals.oxygen
              ? 3
              : 0
    : vals.spo2 <= 91
      ? 3
      : vals.spo2 <= 93
        ? 2
        : vals.spo2 <= 95
          ? 1
          : 0;
  const scoreSBP = vals.sbp <= 90 ? 3 : vals.sbp <= 100 ? 2 : vals.sbp <= 110 ? 1 : vals.sbp <= 219 ? 0 : 3;
  const scoreHR = vals.hr <= 40 ? 3 : vals.hr <= 50 ? 1 : vals.hr <= 90 ? 0 : vals.hr <= 110 ? 1 : vals.hr <= 130 ? 2 : 3;
  const scoreTemp = vals.temp <= 35 ? 3 : vals.temp <= 36 ? 1 : vals.temp <= 38 ? 0 : vals.temp <= 39 ? 1 : 2;
  const total = scoreRR + scoreSpO2 + vals.oxygen + scoreSBP + scoreHR + vals.avcpu + scoreTemp;
  const singleThree = [scoreRR, scoreSpO2, scoreSBP, scoreHR, vals.avcpu, scoreTemp].some((v) => v === 3);
  const bucket = total >= 7 ? ["red", B({ en: "Emergency", ar: "طوارئ" }, isArabic)] : total >= 5 ? ["orange", B({ en: "Urgent response within 1 hour", ar: "استجابة عاجلة خلال ساعة" }, isArabic)] : singleThree ? ["yellow", B({ en: "Urgent RN review", ar: "مراجعة عاجلة من الممرض" }, isArabic)] : total >= 1 ? ["green", B({ en: "Low risk, increase frequency", ar: "خطر منخفض، زد التكرار" }, isArabic)] : ["green", B({ en: "Routine monitoring", ar: "مراقبة روتينية" }, isArabic)];
  return <div className="space-y-4">
    <Panel title="NEWS2">
      <div className="grid sm:grid-cols-2 gap-2">
        {[
          ["rr", "RR", 0, 40],
          ["spo2", "SpO2", 50, 100],
          ["sbp", "SBP", 50, 250],
          ["hr", "HR", 20, 200],
          ["temp", "Temp", 30, 42],
        ].map(([k, l, mn, mx]) => (
          <div key={k as string} className="space-y-1">
            <p className="text-xs text-muted-foreground">{l as string}</p>
            <Input type="number" min={mn as number} max={mx as number} value={(vals as any)[k as string]} onChange={(e) => setVals((p) => ({ ...p, [k as string]: Number(e.target.value) }))} />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <Button variant={scale2 ? "default" : "outline"} onClick={() => setScale2((s) => !s)}>{B({ en: "Use Scale 2 (COPD)", ar: "استخدم المقياس 2" }, isArabic)}</Button>
        <Button variant={vals.oxygen ? "default" : "outline"} onClick={() => setVals((p) => ({ ...p, oxygen: p.oxygen ? 0 : 2 }))}>{B({ en: "On Oxygen", ar: "على أوكسجين" }, isArabic)}</Button>
        <Button variant={vals.avcpu ? "default" : "outline"} onClick={() => setVals((p) => ({ ...p, avcpu: p.avcpu ? 0 : 3 }))}>{B({ en: "Any C/V/P/U", ar: "أي C/V/P/U" }, isArabic)}</Button>
      </div>
    </Panel>
    <Card className={`rounded-2xl border p-4 ${tone[bucket[0] as keyof typeof tone]}`}>
      <p>NEWS2: {total}</p><p>{bucket[1]}</p>
    </Card>
  </div>;
};

const CHA2DS2VAScAssessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const [f, setF] = useState({ chf: false, htn: false, age75: false, dm: false, stroke: false, vascular: false, age6574: false, female: false });
  const points = { chf: 1, htn: 1, age75: 2, dm: 1, stroke: 2, vascular: 1, age6574: 1, female: 1 } as const;
  const total = (Object.keys(points) as Array<keyof typeof points>).reduce((s, k) => s + (f[k] ? points[k] : 0), 0);
  const femaleOnly = f.female && total === 1;
  const rec = femaleOnly || total === 0 ? ["green", B({ en: "No anticoagulation needed", ar: "لا حاجة لمضادات التخثر" }, isArabic)] : total === 1 ? ["yellow", B({ en: "Consider anticoagulation", ar: "فكر بمضادات التخثر" }, isArabic)] : ["red", B({ en: "Anticoagulation recommended", ar: "مضادات التخثر موصى بها" }, isArabic)];
  const toggle = (k: keyof typeof f) => setF((p) => {
    const n = { ...p, [k]: !p[k] };
    if (k === "age75" && n.age75) n.age6574 = false;
    if (k === "age6574" && n.age6574) n.age75 = false;
    return n;
  });
  return <div className="space-y-4"><Panel title="CHA₂DS₂-VASc">{Object.entries(points).map(([k, p]) => <OptionRow key={k} label={`${k} ${p}`} selected={(f as any)[k]} onClick={() => toggle(k as keyof typeof f)} score={p} />)}</Panel><Card className={`rounded-2xl border p-4 ${tone[rec[0] as keyof typeof tone]}`}><p>{B({ en: "Total Score", ar: "المجموع الكلي" }, isArabic)}: {total}</p><p>{rec[1]}</p></Card></div>;
};

const WellsPEAssessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const [twoTier, setTwoTier] = useState(true);
  const items = [
    [3, "Clinical signs of DVT", "علامات DVT"], [3, "PE most likely diagnosis", "PE هو التشخيص الأرجح"], [1.5, "HR > 100", "معدل القلب > 100"], [1.5, "Immobilization/surgery", "عدم حركة/جراحة"], [1.5, "Previous DVT/PE", "تاريخ DVT/PE"], [1, "Hemoptysis", "نفث الدم"], [1, "Active cancer", "سرطان نشط"],
  ] as const;
  const [sel, setSel] = useState<boolean[]>(new Array(items.length).fill(false));
  const total = sel.reduce((s, v, i) => s + (v ? items[i][0] : 0), 0);
  const msg = twoTier ? (total <= 4 ? ["green", B({ en: "PE unlikely — Check D-dimer", ar: "PE غير مرجح — افحص D-dimer" }, isArabic)] : ["red", B({ en: "PE likely — Get CTA", ar: "PE مرجح — اعمل CTA" }, isArabic)]) : (total <= 1 ? ["green", B({ en: "Low probability", ar: "احتمالية منخفضة" }, isArabic)] : total <= 6 ? ["yellow", B({ en: "Moderate probability", ar: "احتمالية متوسطة" }, isArabic)] : ["red", B({ en: "High probability", ar: "احتمالية عالية" }, isArabic)]);
  return <div className="space-y-4"><Panel title="Wells PE">{items.map((x, i) => <OptionRow key={i} label={isArabic ? x[2] : x[1]} selected={sel[i]} onClick={() => setSel((p) => p.map((v, idx) => idx === i ? !v : v))} score={x[0]} />)}<Button variant="outline" onClick={() => setTwoTier((s) => !s)}>{twoTier ? "Two-tier" : "Three-tier"}</Button></Panel><Card className={`rounded-2xl border p-4 ${tone[msg[0] as keyof typeof tone]}`}><p>Wells: {total.toFixed(1)}</p><p>{msg[1]}</p></Card></div>;
};

const MUSTAssessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [prevWeight, setPrevWeight] = useState(75);
  const [acute, setAcute] = useState(false);
  const bmi = weight / ((height / 100) ** 2 || 1);
  const loss = prevWeight > 0 ? ((prevWeight - weight) / prevWeight) * 100 : 0;
  const bmiScore = bmi > 20 ? 0 : bmi >= 18.5 ? 1 : 2;
  const lossScore = loss < 5 ? 0 : loss <= 10 ? 1 : 2;
  const total = bmiScore + lossScore + (acute ? 2 : 0);
  const risk = total >= 2 ? ["red", B({ en: "High", ar: "عالي" }, isArabic)] : total === 1 ? ["yellow", B({ en: "Medium", ar: "متوسط" }, isArabic)] : ["green", B({ en: "Low", ar: "منخفض" }, isArabic)];
  return <div className="space-y-4"><Panel title="MUST"><div className="grid sm:grid-cols-3 gap-2"><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} /><Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} /><Input type="number" value={prevWeight} onChange={(e) => setPrevWeight(Number(e.target.value))} /></div><Button variant={acute ? "default" : "outline"} onClick={() => setAcute((s) => !s)}>{B({ en: "Acute disease + no intake >5 days", ar: "مرض حاد + بدون تغذية >5 أيام" }, isArabic)}</Button><p className="text-sm">BMI: {bmi.toFixed(1)} | Loss: {loss.toFixed(1)}%</p></Panel><Card className={`rounded-2xl border p-4 ${tone[risk[0] as keyof typeof tone]}`}><p>MUST: {total}</p><p>{risk[1]}</p></Card></div>;
};

const PHQ9Assessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const qs = [
    ["Little interest or pleasure", "قلة الاهتمام أو المتعة"],
    ["Feeling down/depressed", "الشعور بالإحباط أو الاكتئاب"],
    ["Trouble sleeping", "صعوبة النوم"],
    ["Tired/little energy", "قلة الطاقة"],
    ["Poor appetite/overeating", "ضعف الشهية أو الإفراط"],
    ["Feeling bad about yourself", "الشعور بالسوء تجاه نفسك"],
    ["Trouble concentrating", "صعوبة التركيز"],
    ["Moving/speaking slowly or restless", "بطء الحركة/الكلام أو التململ"],
    ["Thoughts of self-harm", "أفكار إيذاء النفس"],
  ];
  const [scores, setScores] = useState<number[]>(new Array(9).fill(0));
  const total = scores.reduce((a, b) => a + b, 0);
  const sev = total >= 20 ? ["red", B({ en: "Severe", ar: "شديد" }, isArabic)] : total >= 15 ? ["orange", B({ en: "Moderately severe", ar: "متوسط الشدة" }, isArabic)] : total >= 10 ? ["orange", B({ en: "Moderate", ar: "متوسط" }, isArabic)] : total >= 5 ? ["yellow", B({ en: "Mild", ar: "خفيف" }, isArabic)] : ["green", B({ en: "Minimal", ar: "بسيط" }, isArabic)];
  return <div className="space-y-4"><Panel title="PHQ-9">{qs.map((q, i) => <div key={i} className="space-y-2"><p className="text-sm text-white">{i + 1}. {isArabic ? q[1] : q[0]}</p><div className="grid grid-cols-4 gap-2">{[0, 1, 2, 3].map((n) => <Button key={n} size="sm" variant={scores[i] === n ? "default" : "outline"} onClick={() => setScores((p) => p.map((v, idx) => idx === i ? n : v))}>{n}</Button>)}</div></div>)}</Panel><Card className={`rounded-2xl border p-4 ${tone[sev[0] as keyof typeof tone]}`}><p>PHQ-9: {total}</p><p>{sev[1]}</p>{scores[8] >= 1 && <p className="text-red-100">{B({ en: "⚠️ Immediate safety assessment required", ar: "⚠️ يلزم تقييم سلامة فوري" }, isArabic)}</p>}</Card></div>;
};

const WaterlowAssessment = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const groups = [
    ["build", [[0, "Average", "متوسط"], [1, "Above average", "فوق المتوسط"], [2, "Obese", "سمين"], [3, "Below average", "تحت المتوسط"]]],
    ["skin", [[0, "Healthy", "صحي"], [1, "Dry / tissue paper / edema", "جاف / هش / متورم"], [2, "Clammy + pyrexia", "رطب + حمّى"], [3, "Discolored/broken", "متغير اللون/مكسور"]]],
    ["sexAge", [[1, "Male + 14-49", "ذكر + 14-49"], [2, "Female / 50-64", "أنثى / 50-64"], [3, "65-74", "65-74"], [4, "75-80", "75-80"], [5, "≥81", "≥81"]]],
    ["continence", [[0, "Complete/catheter", "كامل/قسطرة"], [1, "Occasional", "متقطع"], [2, "Catheter/feces only", "قسطرة/براز فقط"], [3, "Doubly incontinent", "سلس مزدوج"]]],
    ["mobility", [[0, "Fully mobile", "متحرك بالكامل"], [2, "Apathetic", "لا مبالي"], [3, "Restricted", "مقيّد"], [4, "Bedbound", "طريح"], [5, "Chairbound", "مقعد"]]],
    ["appetite", [[0, "Average", "متوسطة"], [1, "Poor", "ضعيفة"], [2, "NG/fluids only", "أنبوب/سوائل"], [3, "NBM/anorexia", "صائم/فقدان شهية"]]],
    ["special", [[0, "None", "لا يوجد"], [1, "Anemia/smoking", "فقر دم/تدخين"], [2, "PVD", "مرض وعائي"], [5, "Organ failure/major surgery", "فشل أعضاء/جراحة كبيرة"], [8, "Terminal cachexia/table>6h above waist", "دنف نهائي/جراحة طويلة"]]],
  ] as const;
  const [sel, setSel] = useState<Record<string, number>>({});
  const total = Object.values(sel).reduce((a, b) => a + b, 0);
  const risk = total >= 20 ? ["red", B({ en: "Very high risk", ar: "خطر عالي جداً" }, isArabic)] : total >= 15 ? ["orange", B({ en: "High risk", ar: "خطر عالي" }, isArabic)] : total >= 10 ? ["yellow", B({ en: "At risk", ar: "خطر" }, isArabic)] : ["green", B({ en: "Low risk", ar: "خطر منخفض" }, isArabic)];
  return <div className="space-y-4">{groups.map(([k, opts]) => <Panel key={k} title={k}>{opts.map(([p, en, ar]) => <OptionRow key={en} label={isArabic ? ar : en} selected={sel[k] === p} onClick={() => setSel((x) => ({ ...x, [k]: p }))} score={p} />)}</Panel>)}<Card className={`rounded-2xl border p-4 ${tone[risk[0] as keyof typeof tone]}`}><p>Waterlow: {total}</p><p>{risk[1]}</p></Card></div>;
};

export const AdvancedAssessment = ({ id }: { id: string }) => {
  if (id === "sofa") return <SOFAAssessment />;
  if (id === "cam-icu") return <CAMICUAssessment />;
  if (id === "news2") return <NEWS2Assessment />;
  if (id === "cha2ds2-vasc") return <CHA2DS2VAScAssessment />;
  if (id === "wells-pe") return <WellsPEAssessment />;
  if (id === "must") return <MUSTAssessment />;
  if (id === "phq9") return <PHQ9Assessment />;
  if (id === "waterlow") return <WaterlowAssessment />;
  return null;
};
