import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/contexts/PreferencesContext";
import calculatorsI18n from "@/data/calculators-i18n.json";

const n = (value: string | number | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const round = (value: number, digits = 2) => Number.isFinite(value) ? Number(value.toFixed(digits)) : 0;
const validRange = (value: number, min: number, max: number) => value >= min && value <= max;

const CalculatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, direction, language } = usePreferences();
  const cx = calculatorsI18n[language];

  const [values, setValues] = useState<Record<string, string>>({
    sex: "Male",
    vasoDrug: "norepinephrine",
    vasoAmount: "4",
    vasoVolume: "250",
    vasoRate: "10",
    vasoDesiredDose: "0.05",
    vasoMode: "rateToDose",
    heparinProtocol: "standard",
    heparinConcentration: "50",
    insulinConcentration: "1",
    insulinTab: "drip",
    insulinSensitivity: "medium",
    bsaFormula: "mosteller",
    eddTab: "lmp",
    cycleLength: "28",
    usWeeks: "12",
    usDays: "0"
  });
  const [showReference, setShowReference] = useState(true);

  const setField = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const baseCalculators = {
    dosage: {
      name: cx.calculators.dosage.name,
      ui: () => {
        const ordered = n(values.ordered);
        const available = n(values.available);
        const volume = n(values.volume);
        const result = available > 0 ? round((ordered / available) * volume) : null;
        return (
          <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
            <Field id="ordered" label={t.orderedDose} value={values.ordered} onChange={setField} />
            <Field id="available" label={t.availableDose} value={values.available} onChange={setField} />
            <Field id="volume" label={t.volumeAvailable} value={values.volume} onChange={setField} />
            <ResultBlock label={t.rateResult} value={result === null ? t.availableDoseError : `${result} mL`} />
          </Card>
        );
      }
    },
    "iv-drip": {
      name: cx.calculators["iv-drip"].name,
      ui: () => {
        const volume = n(values.volume);
        const time = n(values.time);
        const dropFactor = n(values.dropFactor);
        const mlPerHour = time > 0 ? round(volume / time) : null;
        const drops = time > 0 ? round(((volume / time) * dropFactor) / 60, 0) : null;
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <Field id="volume" label={t.totalVolume} value={values.volume} onChange={setField} />
          <Field id="time" label={t.timeHours} value={values.time} onChange={setField} />
          <Field id="dropFactor" label={t.dropFactor} value={values.dropFactor} onChange={setField} />
          <ResultBlock label={t.rateResult} value={mlPerHour === null ? t.timeError : `${mlPerHour} mL/hr | ${drops} drops/min`} />
        </Card>;
      }
    },
    bmi: {
      name: cx.calculators.bmi.name,
      ui: () => {
        const weight = n(values.weight);
        const height = n(values.height);
        const bmi = height > 0 ? weight / (height / 100) ** 2 : null;
        const category = !bmi ? "" : bmi < 18.5 ? t.underweight : bmi < 25 ? t.normalWeight : bmi < 30 ? t.overweight : t.obese;
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <Field id="weight" label={t.weightKg} value={values.weight} onChange={setField} />
          <Field id="height" label={t.heightCm} value={values.height} onChange={setField} />
          <ResultBlock label="BMI" value={bmi === null ? t.heightError : `${round(bmi, 1)} - ${category}`} />
        </Card>;
      }
    },
    creatinine: {
      name: cx.calculators.creatinine.name,
      ui: () => {
        const age = n(values.age);
        const weight = n(values.weight);
        const creatinine = n(values.creatinine);
        const sexAdj = values.sex === "Female" ? 0.85 : 1;
        const ccr = creatinine > 0 ? (((140 - age) * weight) / (72 * creatinine)) * sexAdj : null;
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <Field id="age" label={t.ageYears} value={values.age} onChange={setField} />
          <Field id="weight" label={t.weightKg} value={values.weight} onChange={setField} />
          <Field id="creatinine" label={t.serumCreatinine} value={values.creatinine} onChange={setField} />
          <div className="space-y-1"><Label>{t.sex}</Label><select className="w-full rounded-md border border-white/10 bg-background/60 p-2" value={values.sex} onChange={(e)=>setField("sex",e.target.value)}><option value="Male">{t.male}</option><option value="Female">{t.female}</option></select></div>
          <ResultBlock label={t.creatinineClearanceResult} value={ccr === null ? t.creatinineError : `${round(ccr, 1)} mL/min`} />
        </Card>;
      }
    }
  };

  const vasoData = {
    norepinephrine: { conc: [[4,250,16],[8,250,32]], unit: "mcg/kg/min", max: 3.3, standardHigh: 0.3, high: 1 },
    epinephrine: { conc: [[1,250,4],[4,250,16]], unit: "mcg/kg/min", max: 1, standardHigh: 0.2, high: 0.5 },
    dopamine: { conc: [[400,250,1600],[800,250,3200]], unit: "mcg/kg/min", max: 20, standardHigh: 10, high: 20 },
    dobutamine: { conc: [[250,250,1000],[500,250,2000]], unit: "mcg/kg/min", max: 20, standardHigh: 10, high: 20 },
    phenylephrine: { conc: [[20,250,80],[40,250,160]], unit: "mcg/kg/min", max: 9.1, standardHigh: 2, high: 5 },
    vasopressin: { conc: [[20,100,0.2],[40,100,0.4]], unit: "units/min", max: 0.04, standardHigh: 0.04, high: 0.04 }
  } as const;

  const advanced = {
    vasopressor: {
      name: cx.calculators.vasopressor.name,
      ui: () => {
        const drug = values.vasoDrug as keyof typeof vasoData;
        const drugData = vasoData[drug];
        const weight = n(values.vasoWeight);
        const concentration = n(values.vasoAmount) / n(values.vasoVolume) * (drug === "vasopressin" ? 1 : 1000);
        const rate = n(values.vasoRate);
        const desired = n(values.vasoDesiredDose);
        const isVaso = drug === "vasopressin";
        const dose = values.vasoMode === "rateToDose"
          ? (isVaso ? (rate * concentration) / 60 : (rate * concentration) / ((weight || 1) * 60))
          : desired;
        const pumpRate = values.vasoMode === "doseToRate"
          ? (isVaso ? (desired * 60) / (concentration || 1) : (desired * weight * 60) / (concentration || 1))
          : rate;
        const badgeClass = dose > drugData.max ? "bg-red-500/20 text-red-300" : dose > drugData.standardHigh ? "bg-yellow-500/20 text-yellow-300" : "bg-emerald-500/20 text-emerald-300";

        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Drug</Label><select className="w-full rounded-md border border-white/10 bg-background/60 p-2" value={values.vasoDrug} onChange={(e)=>{const nd=e.target.value as keyof typeof vasoData;setField("vasoDrug",nd);setField("vasoAmount",String(vasoData[nd].conc[0][0]));setField("vasoVolume",String(vasoData[nd].conc[0][1]));}}>
              {Object.keys(vasoData).map((k)=><option key={k} value={k}>{k}</option>)}
            </select></div>
            {!isVaso && <Field id="vasoWeight" label="Patient Weight (kg)" value={values.vasoWeight} onChange={setField} />}
          </div>
          <div className="grid gap-3 md:grid-cols-2"><Field id="vasoAmount" label={isVaso ? "Drug units" : "Drug mg"} value={values.vasoAmount} onChange={setField} /><Field id="vasoVolume" label="Volume (mL)" value={values.vasoVolume} onChange={setField} /></div>
          <div><Label>{language === "ar" ? "احسب بواسطة" : "Calculate by"}</Label><div className="mt-2 flex gap-2"><button onClick={()=>setField("vasoMode","rateToDose")} className={`px-3 py-1 rounded-full border ${values.vasoMode==="rateToDose"?"border-primary text-primary":"border-white/20"}`}>Rate → Dose</button><button onClick={()=>setField("vasoMode","doseToRate")} className={`px-3 py-1 rounded-full border ${values.vasoMode==="doseToRate"?"border-primary text-primary":"border-white/20"}`}>Dose → Rate</button></div></div>
          {values.vasoMode === "rateToDose" ? <Field id="vasoRate" label="Pump Rate (mL/hr)" value={values.vasoRate} onChange={setField} /> : <Field id="vasoDesiredDose" label={isVaso ? "Desired Dose (units/min)" : "Desired Dose (mcg/kg/min)"} value={values.vasoDesiredDose} onChange={setField} />}
          <div className={`rounded-xl p-3 ${badgeClass}`}>
            <p className="font-semibold">{values.vasoMode === "rateToDose" ? `Dose: ${round(dose, 3)} ${drugData.unit}` : `Pump Rate: ${round(pumpRate, 2)} mL/hr`}</p>
            <p className="text-xs mt-1">{dose > drugData.max ? cx.labels.exceedsMax : dose > drugData.standardHigh ? cx.labels.exceedsStandard : cx.labels.withinRange}</p>
          </div>
          {isVaso && <p className="text-xs text-muted-foreground">{cx.labels.vasoNote}</p>}
          <button className="flex items-center gap-2 text-xs text-muted-foreground" onClick={()=>setShowReference((p)=>!p)}><ChevronDown size={14} className={showReference ? "rotate-180" : ""} /> {language === "ar" ? "المرجع" : "Reference"}</button>
          {showReference && <div className="text-xs text-muted-foreground space-y-1">
            <p>Norepinephrine 0.01-3.3 mcg/kg/min | Epinephrine 0.01-1.0 | Dopamine 1-20</p>
            <p>Dobutamine 2-20 | Phenylephrine 0.1-9.1 | Vasopressin 0.01-0.04 units/min</p>
          </div>}
        </Card>;
      }
    },
    heparin: {
      name: cx.calculators.heparin.name,
      ui: () => {
        const protocolMap = { standard: { bolus: 80, rate: 18 }, low: { bolus: 60, rate: 12 }, nobolus: { bolus: 0, rate: 18 } };
        const p = protocolMap[values.heparinProtocol as keyof typeof protocolMap] ?? protocolMap.standard;
        const wt = n(values.heparinWeight); const conc = n(values.heparinConcentration) || 50;
        const bolus = Math.min(wt * p.bolus, 10000); const rateUnits = Math.min(wt * p.rate, 2500); const pump = rateUnits / conc;
        const aptt = n(values.aptt);
        const adj = aptt < 35 ? { text: "Re-bolus + Increase", delta: 4 } : aptt <= 45 ? { text: "Re-bolus + Increase", delta: 2 } : aptt <= 70 ? { text: "Therapeutic", delta: 0 } : aptt <= 90 ? { text: "Decrease", delta: -2 } : { text: "Hold 1hr + Decrease", delta: -3 };
        const newRateUnits = Math.max(0, Math.min((p.rate + adj.delta) * wt, 2500));
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <Field id="heparinWeight" label="Weight (kg)" value={values.heparinWeight} onChange={setField} />
          <Field id="heparinConcentration" label="Concentration (units/mL)" value={values.heparinConcentration} onChange={setField} />
          <div><Label>Protocol</Label><select value={values.heparinProtocol} onChange={(e)=>setField("heparinProtocol",e.target.value)} className="w-full rounded-md border border-white/10 bg-background/60 p-2"><option value="standard">Standard DVT/PE</option><option value="low">Low Intensity ACS</option><option value="nobolus">No Bolus</option></select></div>
          <ResultBlock label="Initial Orders" value={`Bolus ${round(bolus)} units (${round(bolus/conc,1)} mL) | Initial ${round(rateUnits)} units/hr | Pump ${round(pump,2)} mL/hr`} />
          <Field id="aptt" label="Enter aPTT Result (sec)" value={values.aptt} onChange={setField} />
          <ResultBlock label="aPTT Titration" value={`${adj.text} | New Rate ${round(newRateUnits/conc,2)} mL/hr | Recheck aPTT in 6 hours`} />
          {(wt * p.bolus > 10000 || wt * p.rate > 2500) && <p className="text-red-300 text-xs">Warning: safety caps applied (max bolus 10,000 units / max rate 2,500 units/hr).</p>}
        </Card>;
      }
    },
    insulin: {
      name: cx.calculators.insulin.name,
      ui: () => {
        const wt = n(values.insulinWeight); const bg = n(values.insulinBG); const conc = n(values.insulinConcentration) || 1;
        const bolus = bg > 300 ? wt * 0.1 : 0; const rate1 = wt * 0.1; const rate2 = wt * 0.14;
        const table = bg > 300 ? "Increase by 1-2 units/hr" : bg >= 250 ? "Maintain current rate" : bg >= 200 ? "Decrease by 50% + Start D5" : bg >= 150 ? "Decrease to 0.02-0.05 units/kg/hr" : bg >= 70 ? "Consider stopping drip + SubQ transition" : "HOLD drip + Treat hypoglycemia";
        const sensitivityMap = {
          low: [[150,0],[200,1],[250,2],[300,3],[350,4],[400,5]],
          medium: [[150,0],[200,2],[250,4],[300,6],[350,8],[400,10]],
          high: [[150,0],[200,3],[250,6],[300,9],[350,12],[400,15]]
        } as const;
        const scale = sensitivityMap[values.insulinSensitivity as keyof typeof sensitivityMap] ?? sensitivityMap.medium;
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <div className="flex gap-2"><button className={`px-3 py-1 rounded-full border ${values.insulinTab==="drip"?"border-primary text-primary":"border-white/20"}`} onClick={()=>setField("insulinTab","drip")}>Insulin Drip</button><button className={`px-3 py-1 rounded-full border ${values.insulinTab==="scale"?"border-primary text-primary":"border-white/20"}`} onClick={()=>setField("insulinTab","scale")}>Sliding Scale</button></div>
          {values.insulinTab === "drip" ? <>
            <Field id="insulinWeight" label="Weight (kg)" value={values.insulinWeight} onChange={setField} />
            <Field id="insulinBG" label="Blood Glucose (mg/dL)" value={values.insulinBG} onChange={setField} />
            <Field id="insulinConcentration" label="Concentration (units/mL)" value={values.insulinConcentration} onChange={setField} />
            <ResultBlock label="Initial Drip" value={`Bolus ${round(bolus,1)} units (if BG > 300) | Option A ${round(rate1,2)} units/hr (${round(rate1/conc,2)} mL/hr) | Option B ${round(rate2,2)} units/hr (${round(rate2/conc,2)} mL/hr)`} />
            <ResultBlock label="Titration" value={table} />
            <p className="text-xs text-amber-300">⚠️ Check K+ before insulin; do NOT start if K+ &lt; 3.3.</p>
          </> : <>
            <div><Label>Sliding Scale</Label><select value={values.insulinSensitivity} onChange={(e)=>setField("insulinSensitivity",e.target.value)} className="w-full rounded-md border border-white/10 bg-background/60 p-2"><option value="low">Low Sensitivity</option><option value="medium">Medium Sensitivity</option><option value="high">High Sensitivity</option></select></div>
            <div className="rounded-xl border border-white/10 p-3 text-sm space-y-1">{scale.map(([cut,dose],i)=><p key={cut}>{i===0?"< 150":`${cut-1}-${cut+49}`} mg/dL → {dose} units</p>)}<p>≥ 400 mg/dL → Notify MD</p></div>
          </>}
        </Card>;
      }
    },
    ibw: {
      name: cx.calculators.ibw.name,
      ui: () => {
        const isMale = values.ibwGender !== "female";
        const heightCm = n(values.ibwHeightCm);
        const inches = heightCm / 2.54;
        const ibw = (isMale ? 50 : 45.5) + 2.3 * (inches - 60);
        const actual = n(values.ibwActual);
        const abw = ibw + 0.4 * (actual - ibw);
        const pct = ibw > 0 ? ((actual - ibw) / ibw) * 100 : 0;
        const status = actual <= ibw ? "text-emerald-300" : actual <= ibw * 1.3 ? "text-yellow-300" : actual <= ibw * 2 ? "text-orange-300" : "text-red-300";
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <div><Label>Gender</Label><select className="w-full rounded-md border border-white/10 bg-background/60 p-2" value={values.ibwGender} onChange={(e)=>setField("ibwGender",e.target.value)}><option value="male">Male</option><option value="female">Female</option></select></div>
          <Field id="ibwHeightCm" label="Height (cm)" value={values.ibwHeightCm} onChange={setField} />
          <Field id="ibwActual" label="Actual Weight (kg)" value={values.ibwActual} onChange={setField} />
          <ResultBlock label="IBW / ABW" value={`IBW ${round(ibw,2)} kg | ABW ${round(abw,2)} kg | % over ${round(pct,1)}% | TV 6 mL/kg ${round(ibw*6,0)} mL | TV 8 mL/kg ${round(ibw*8,0)} mL`} />
          <p className={`text-xs ${status}`}>{actual <= ibw ? "At or below ideal weight" : actual <= ibw * 1.3 ? "Overweight — consider ABW for select drugs" : actual <= ibw * 2 ? "Obese — use ABW for Vancomycin, IBW for ventilator" : "Morbidly obese — consider pharmacy consult for dosing"}</p>
        </Card>;
      }
    },
    bsa: {
      name: cx.calculators.bsa.name,
      ui: () => {
        const w = n(values.bsaWeight); const h = n(values.bsaHeight);
        const bsa = values.bsaFormula === "dubois" ? 0.007184 * h ** 0.725 * w ** 0.425 : Math.sqrt((h * w) / 3600);
        const burn = n(values.burnPct);
        const total = 4 * w * burn;
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <Field id="bsaWeight" label="Weight (kg)" value={values.bsaWeight} onChange={setField} />
          <Field id="bsaHeight" label="Height (cm)" value={values.bsaHeight} onChange={setField} />
          <div><Label>Formula</Label><select className="w-full rounded-md border border-white/10 bg-background/60 p-2" value={values.bsaFormula} onChange={(e)=>setField("bsaFormula",e.target.value)}><option value="mosteller">Mosteller</option><option value="dubois">Du Bois</option></select></div>
          <ResultBlock label="BSA" value={`${round(bsa,2)} m² (normal adult 1.7-2.0)`} />
          <div className="rounded-xl border border-white/10 p-3 text-xs space-y-1"><p>Rule of 9s (Adult): Head 9, each arm 9, front torso 18, back torso 18, each leg 18, perineum 1.</p><p>Pediatric: Head 18, each arm 9, front 18, back 18, each leg 14.</p></div>
          <Field id="burnPct" label="Enter Burn % TBSA" value={values.burnPct} onChange={setField} />
          <ResultBlock label="Parkland Output" value={`24hr ${round(total,0)} mL | First 8hr ${round(total/2/8,0)} mL/hr | Next 16hr ${round(total/2/16,0)} mL/hr`} />
        </Card>;
      }
    },
    edd: {
      name: cx.calculators.edd.name,
      ui: () => {
        const today = new Date();
        const lmpDate = values.lmpDate ? new Date(values.lmpDate) : null;
        const cycle = n(values.cycleLength) || 28;
        const usDate = values.usDate ? new Date(values.usDate) : null;
        const gaDays = n(values.usWeeks) * 7 + n(values.usDays);
        const edd = values.eddTab === "lmp" && lmpDate
          ? new Date(lmpDate.getTime() + (280 + (cycle - 28)) * 86400000)
          : values.eddTab === "us" && usDate
          ? new Date(usDate.getTime() + (280 - gaDays) * 86400000)
          : null;
        const currentGaDays = edd ? Math.max(0, 280 - Math.floor((edd.getTime() - today.getTime()) / 86400000)) : 0;
        const weeks = Math.floor(currentGaDays / 7); const days = currentGaDays % 7;
        const trimester = weeks < 14 ? "1st" : weeks < 28 ? "2nd" : weeks <= 42 ? "3rd" : "Post-term";
        const progress = Math.min(100, round((currentGaDays / 280) * 100, 1));
        const color = trimester === "1st" ? "bg-purple-500" : trimester === "2nd" ? "bg-blue-500" : trimester === "3rd" ? "bg-green-500" : "bg-red-500";
        return <Card className="p-4 space-y-3 bg-card/70 border-white/10 text-white">
          <div className="flex gap-2"><button className={`px-3 py-1 rounded-full border ${values.eddTab==="lmp"?"border-primary text-primary":"border-white/20"}`} onClick={()=>setField("eddTab","lmp")}>By LMP</button><button className={`px-3 py-1 rounded-full border ${values.eddTab==="us"?"border-primary text-primary":"border-white/20"}`} onClick={()=>setField("eddTab","us")}>By Ultrasound</button></div>
          {values.eddTab === "lmp" ? <><div><Label>LMP Date</Label><Input type="date" value={values.lmpDate || ""} onChange={(e)=>setField("lmpDate",e.target.value)} /></div><Field id="cycleLength" label="Cycle Length" value={values.cycleLength} onChange={setField} /></> : <><div><Label>US Date</Label><Input type="date" value={values.usDate || ""} onChange={(e)=>setField("usDate",e.target.value)} /></div><div className="grid grid-cols-2 gap-3"><Field id="usWeeks" label="Weeks" value={values.usWeeks} onChange={setField} /><Field id="usDays" label="Days" value={values.usDays} onChange={setField} /></div></>}
          <ResultBlock label="Pregnancy Output" value={edd ? `EDD ${edd.toLocaleDateString()} | GA ${weeks} weeks + ${days} days | ${trimester} trimester | ${Math.max(0, Math.floor((edd.getTime()-today.getTime())/86400000))} days remaining` : cx.labels.requiredField} />
          <div className="h-2 rounded-full bg-white/10"><div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} /></div>
          <p className="text-xs text-muted-foreground">12 NT scan • 20 anatomy scan • 28 GDM • 36 GBS • 37 full term • 40 EDD • 42 induce</p>
        </Card>;
      }
    }
  } as const;

  const calculator = useMemo(() => {
    const map = { ...baseCalculators, ...advanced } as Record<string, { name: string; ui: () => JSX.Element }>;
    return id ? map[id] : undefined;
  }, [id, values, language, showReference]);

  if (!calculator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t.calculatorNotFound}</p>
      </div>
    );
  }

  return (
    <div dir={direction} className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/calculators")}>
            <ChevronLeft size={24} className="rtl:rotate-180" />
          </button>
          <h1 className="text-xl font-bold">{calculator.name}</h1>
        </div>
      </header>
      <div className="p-4 space-y-4">{calculator.ui()}</div>
    </div>
  );
};

const Field = ({ id, label, value, onChange }: { id: string; label: string; value: string | undefined; onChange: (id: string, value: string) => void }) => (
  <div className="space-y-1">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type="number" min={0} value={value || ""} onChange={(e) => onChange(id, e.target.value)} />
  </div>
);

const ResultBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-medical-blue-light/20 border border-primary/20 p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-semibold text-primary">{value}</p>
  </div>
);

export default CalculatorDetail;
