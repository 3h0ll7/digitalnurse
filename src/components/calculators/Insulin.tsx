import { useState } from "react";
import BarList from "@/components/data/BarList";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import StepTimeline from "@/components/data/StepTimeline";
import { usePreferences } from "@/contexts/PreferencesContext";
import { calcText } from "@/data/calculators-text";
import { insulinDrip, slidingScale, type Sensitivity } from "@/lib/clinical/calculators";
import { parseNumber } from "@/lib/numbers";
import { Choice, Field, Num, Outcome, Panel } from "./parts";

const DKA_STEPS = [
  "Check potassium before the first dose: below 3.3 mmol/L, replace potassium and hold insulin.",
  "Start fluids first, then insulin by Option A or B.",
  "Check glucose hourly; aim for a fall of about 50–75 mg/dL per hour.",
  "When glucose falls below 250 mg/dL, add dextrose and reduce insulin to 0.02–0.05 units/kg/h.",
  "Continue until ketoacidosis resolves; overlap basal subcutaneous insulin 1–2 h before stopping the drip.",
];

const InsulinCalc = () => {
  const tx = calcText[usePreferences().language];
  const [tab, setTab] = useState<"drip" | "scale">("drip");
  const [sensitivity, setSensitivity] = useState<Sensitivity>("medium");
  const [v, setV] = useState({ weight: "", k: "", conc: "1" });
  const r = insulinDrip(parseNumber(v.weight), parseNumber(v.k));
  const conc = parseNumber(v.conc);
  const perMl = (units: number) => (conc && conc > 0 ? `${Math.round((units / conc) * 10) / 10} mL/h` : undefined);
  const bands = slidingScale(sensitivity);

  return (
    <>
      <Choice label={tx.drip} value={tab} onChange={setTab} options={[{ value: "drip", label: tx.drip }, { value: "scale", label: tx.scale }]} />
      {tab === "drip" ? (
        <Panel>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field id="ins-weight" label={tx.weight} value={v.weight} onChange={(x) => setV({ ...v, weight: x })} />
            <Field id="ins-k" label={tx.potassium} value={v.k} onChange={(x) => setV({ ...v, k: x })} />
            <Field id="ins-conc" label={tx.insulinConc} value={v.conc} onChange={(x) => setV({ ...v, conc: x })} />
          </div>
          <Outcome result={r} enter={tx.enter} outOfRange={tx.outOfRange}>
            {(res) => (
              <div className="space-y-3">
                {res.holdForPotassium && (
                  <p role="alert" className="rounded-2xl border border-medical-red/40 bg-medical-red/10 p-3 text-sm font-medium text-medical-red">{tx.holdInsulin}</p>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  <StatTile tone="primary" label={tx.optionA} value={<Num>{res.optionA.bolus} u + {res.optionA.rate} u/h</Num>} hint={perMl(res.optionA.rate)} />
                  <StatTile tone="primary" label={tx.optionB} value={<Num>{res.optionB.rate} u/h</Num>} hint={perMl(res.optionB.rate)} />
                </div>
              </div>
            )}
          </Outcome>
          <div dir="ltr" className="text-start">
            <StepTimeline steps={DKA_STEPS.map((title) => ({ title }))} />
          </div>
          <SourceNote ids={["ada-dka"]} />
        </Panel>
      ) : (
        <Panel>
          <p className="rounded-2xl bg-medical-yellow/10 p-3 text-xs text-medical-yellow">{tx.scaleBanner}</p>
          <Choice
            label={tx.sensitivity}
            value={sensitivity}
            onChange={setSensitivity}
            options={[{ value: "low", label: tx.sensitivityLow }, { value: "medium", label: tx.sensitivityMedium }, { value: "high", label: tx.sensitivityHigh }]}
          />
          <BarList ariaLabel={tx.scale} unit="units" max={15} rows={bands.map((b) => ({ key: b.label, label: `${b.label} mg/dL`, value: b.units, display: `${b.units} u` }))} />
          <p className="text-sm font-medium text-medical-red">{tx.over400}</p>
          <SourceNote ids={["ada-hospital"]} />
        </Panel>
      )}
    </>
  );
};

export default InsulinCalc;
