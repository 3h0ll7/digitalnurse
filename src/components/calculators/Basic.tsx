import { useState } from "react";
import BandBar from "@/components/data/BandBar";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import { usePreferences } from "@/contexts/PreferencesContext";
import { calcText } from "@/data/calculators-text";
import { bmi, cockcroftGault, dosageVolume } from "@/lib/clinical/calculators";
import { dripRate } from "@/lib/clinical/fluids";
import { parseNumber } from "@/lib/numbers";
import { Choice, Field, Num, Outcome, Panel } from "./parts";

const useText = () => calcText[usePreferences().language];

export const DosageCalc = () => {
  const tx = useText();
  const [v, setV] = useState({ ordered: "", available: "", volume: "" });
  const r = dosageVolume(parseNumber(v.ordered), parseNumber(v.available), parseNumber(v.volume));
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="ordered" label={tx.ordered} value={v.ordered} onChange={(x) => setV({ ...v, ordered: x })} />
        <Field id="available" label={tx.available} value={v.available} onChange={(x) => setV({ ...v, available: x })} />
        <Field id="volume" label={tx.volume} value={v.volume} onChange={(x) => setV({ ...v, volume: x })} />
      </div>
      <Outcome result={r} enter={tx.enter} outOfRange={tx.outOfRange}>
        {(mL) => <StatTile tone="primary" label={tx.result} value={<Num>{mL} mL</Num>} hint="(ordered ÷ on hand) × volume" />}
      </Outcome>
    </Panel>
  );
};

export const DripCalc = () => {
  const tx = useText();
  const [v, setV] = useState({ volume: "", hours: "", drop: "20" });
  const r = dripRate(parseNumber(v.volume), parseNumber(v.hours), parseNumber(v.drop));
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="volume" label={tx.totalVolume} value={v.volume} onChange={(x) => setV({ ...v, volume: x })} />
        <Field id="hours" label={tx.hours} value={v.hours} onChange={(x) => setV({ ...v, hours: x })} />
        <Field id="drop" label={tx.dropFactor} value={v.drop} onChange={(x) => setV({ ...v, drop: x })} />
      </div>
      <Outcome result={r ? { ok: true, value: r } : { ok: false, reason: "empty" }} enter={tx.enter} outOfRange={tx.outOfRange}>
        {(d) => (
          <div className="grid grid-cols-2 gap-2">
            <StatTile tone="primary" label={tx.mlPerHour} value={<Num>{d.mlPerHour}</Num>} />
            <StatTile tone="primary" label={tx.dropsPerMin} value={<Num>{Math.round(d.dropsPerMin)}</Num>} />
          </div>
        )}
      </Outcome>
    </Panel>
  );
};

const BMI_BANDS = [
  { from: 12, to: 18.5, tone: "warn" as const },
  { from: 18.5, to: 25, tone: "normal" as const },
  { from: 25, to: 30, tone: "warn" as const },
  { from: 30, to: 35, tone: "critical" as const },
  { from: 35, to: 40, tone: "critical" as const },
  { from: 40, to: 50, tone: "critical" as const },
];

export const BmiCalc = () => {
  const tx = useText();
  const [v, setV] = useState({ weight: "", height: "" });
  const r = bmi(parseNumber(v.weight), parseNumber(v.height));
  return (
    <Panel>
      <div className="grid grid-cols-2 gap-3">
        <Field id="weight" label={tx.weight} value={v.weight} onChange={(x) => setV({ ...v, weight: x })} />
        <Field id="height" label={tx.height} value={v.height} onChange={(x) => setV({ ...v, height: x })} />
      </div>
      <Outcome result={r} enter={tx.enter} outOfRange={tx.outOfRange}>
        {({ bmi: value, cls }) => (
          <div className="space-y-3">
            <StatTile tone={cls === "normal" ? "good" : cls.startsWith("obese") ? "critical" : "warn"} label="BMI (kg/m²)" value={<Num>{value}</Num>} hint={tx.bmiClass[cls]} />
            <BandBar min={12} max={50} bands={BMI_BANDS} value={value} unit="kg/m²" valueLabel={tx.bmiClass[cls]} ariaLabel="BMI" ticks={[18.5, 25, 30, 35, 40]} />
          </div>
        )}
      </Outcome>
      <SourceNote ids={["who-bmi"]} />
    </Panel>
  );
};

export const CrclCalc = () => {
  const tx = useText();
  const [v, setV] = useState({ age: "", weight: "", scr: "" });
  const [sex, setSex] = useState<"male" | "female">("male");
  const r = cockcroftGault(parseNumber(v.age), parseNumber(v.weight), parseNumber(v.scr), sex);
  return (
    <Panel>
      <Choice label={tx.sex} value={sex} onChange={setSex} options={[{ value: "male", label: tx.male }, { value: "female", label: tx.female }]} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="age" label={tx.age} value={v.age} onChange={(x) => setV({ ...v, age: x })} />
        <Field id="weight" label={tx.weight} value={v.weight} onChange={(x) => setV({ ...v, weight: x })} />
        <Field id="scr" label={tx.creatinine} value={v.scr} onChange={(x) => setV({ ...v, scr: x })} />
      </div>
      <Outcome result={r} enter={tx.enter} outOfRange={tx.outOfRange}>
        {(crcl) => (
          <div className="space-y-3">
            <StatTile tone={crcl >= 60 ? "good" : crcl >= 30 ? "warn" : "critical"} label={tx.crcl} value={<Num>{crcl} mL/min</Num>} />
            <BandBar
              min={0}
              max={150}
              bands={[{ from: 0, to: 15, tone: "critical" }, { from: 15, to: 30, tone: "critical" }, { from: 30, to: 60, tone: "warn" }, { from: 60, to: 150, tone: "normal" }]}
              value={crcl}
              unit="mL/min"
              ariaLabel={tx.crcl}
              ticks={[15, 30, 60, 90]}
            />
          </div>
        )}
      </Outcome>
      <p className="text-xs text-muted-foreground">{tx.crclNote}</p>
      <SourceNote ids={["cockcroft-gault"]} />
    </Panel>
  );
};
