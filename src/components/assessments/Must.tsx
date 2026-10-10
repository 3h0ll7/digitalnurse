import { useState } from "react";
import { Field, Panel } from "@/components/calculators/parts";
import StepTimeline from "@/components/data/StepTimeline";
import { usePreferences } from "@/contexts/PreferencesContext";
import { assessText } from "@/data/assessments-text";
import { calcText } from "@/data/calculators-text";
import { must, type ScaleDef } from "@/lib/clinical/scores";
import { parseNumber } from "@/lib/numbers";
import ScoreResult from "./ScoreResult";
import Toggle from "./Toggle";

const Must = ({ scale }: { scale: ScaleDef }) => {
  const { language } = usePreferences();
  const tx = assessText[language];
  const cx = calcText[language];
  const [v, setV] = useState({ weight: "", height: "", previousWeight: "" });
  const [acute, setAcute] = useState(false);
  const r = must({ weight: parseNumber(v.weight), height: parseNumber(v.height), previousWeight: parseNumber(v.previousWeight), acute });
  const res = r.ok ? r.value : null;
  const failure = r.ok ? null : (r as { reason: string; field?: string });

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Panel>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["weight", "height", "previousWeight"] as const).map((k) => (
            <Field key={k} id={`must-${k}`} label={tx[k]} value={v[k]} onChange={(x) => setV((p) => ({ ...p, [k]: x }))} />
          ))}
        </div>
        <Toggle label={tx.acute} on={acute} onChange={setAcute} />
      </Panel>
      <div className="lg:sticky lg:top-4">
        <ScoreResult
          scale={scale}
          title={tx.result}
          value={res ? res.total : null}
          max={6}
          waiting={failure?.reason === "range" ? cx.outOfRange(failure.field ?? "") : cx.enter}
          labels={tx}
        >
          {res && (
            <StepTimeline
              steps={[
                { title: `${tx.bmiStep}: ${res.bmiScore}`, body: <span dir="ltr">BMI {res.bmi} kg/m²</span> },
                { title: `${tx.lossStep}: ${res.lossScore}`, body: <span dir="ltr">{res.lossPct === null ? "—" : `${res.lossPct}%`}</span> },
                { title: `${tx.acuteStep}: ${res.acuteScore}` },
              ]}
            />
          )}
        </ScoreResult>
      </div>
    </div>
  );
};

export default Must;
