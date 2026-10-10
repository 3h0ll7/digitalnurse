import { useState } from "react";
import { Field, Panel } from "@/components/calculators/parts";
import StepTimeline, { type Step } from "@/components/data/StepTimeline";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { assessText, TONE_CLASS } from "@/data/assessments-text";
import { camIcu } from "@/lib/clinical/scores";
import { parseNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";

const CamIcu = () => {
  const tx = assessText[usePreferences().language];
  const [rass, setRass] = useState("");
  const [acuteChange, setAcuteChange] = useState<boolean | null>(null);
  const [attention, setAttention] = useState("");
  const [thinking, setThinking] = useState("");
  const rassValue = parseNumber(rass);
  const validRass = rassValue !== null && Number.isInteger(rassValue) && rassValue >= -5 && rassValue <= 4 ? rassValue : null;
  const state = camIcu({ rass: validRass, acuteChange, attentionErrors: parseNumber(attention), thinkingErrors: parseNumber(thinking) });

  const reached = (step: "feature1" | "feature2" | "feature4") => {
    if (state.status === "incomplete") return ["feature1", "feature2", "feature4"].indexOf(state.next) >= ["feature1", "feature2", "feature4"].indexOf(step);
    if (state.status === "negative") return { feature1: 1, feature2: 2, feature4: 4 }[step] <= state.stoppedAt;
    if (state.status === "positive") return step !== "feature4" || state.via === "feature4";
    return false;
  };
  const show = {
    f1: validRass !== null && validRass > -4,
    f2: acuteChange === true,
    f4: acuteChange === true && (parseNumber(attention) ?? 0) > 2 && validRass === 0,
  };

  const tone = state.status === "positive" ? "critical" : state.status === "negative" ? "good" : "warn";
  const steps: Step[] = [
    { title: tx.f1, tone: acuteChange === null ? "default" : acuteChange ? "critical" : "good", marker: "1" },
    { title: tx.f2, tone: !reached("feature2") || attention === "" ? "default" : (parseNumber(attention) ?? 0) > 2 ? "critical" : "good", marker: "2" },
    { title: tx.f3, tone: validRass === null ? "default" : validRass !== 0 ? "critical" : "good", marker: "3" },
    { title: tx.f4, tone: thinking === "" ? "default" : (parseNumber(thinking) ?? 0) > 1 ? "critical" : "good", marker: "4" },
  ];

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-3">
        <Panel>
          <Field id="cam-rass" label={tx.rassStep} value={rass} onChange={setRass} />
        </Panel>
        {show.f1 && (
          <Panel title={tx.f1}>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={acuteChange === true ? "default" : "outline"} onClick={() => setAcuteChange(true)}>{tx.yes}</Button>
              <Button variant={acuteChange === false ? "default" : "outline"} onClick={() => setAcuteChange(false)}>{tx.no}</Button>
            </div>
          </Panel>
        )}
        {show.f1 && show.f2 && (
          <Panel>
            <Field id="cam-attention" label={tx.f2} value={attention} onChange={setAttention} />
          </Panel>
        )}
        {show.f4 && (
          <Panel>
            <Field id="cam-thinking" label={tx.f4} value={thinking} onChange={setThinking} />
          </Panel>
        )}
      </div>
      <section aria-live="polite" className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5 lg:sticky lg:top-4">
        <h2 className="text-sm font-semibold">{tx.result}</h2>
        <p role="status" className={cn("rounded-2xl border p-3 text-sm font-semibold", state.status === "incomplete" ? "border-dashed font-normal text-muted-foreground" : TONE_CLASS[tone])}>
          {tx.camResult[state.status]}
        </p>
        {state.status === "negative" && <p className="text-xs text-muted-foreground">{tx.camStopped(state.stoppedAt)}</p>}
        {state.status === "positive" && <p className="text-xs text-muted-foreground">{tx.camVia[state.via]}</p>}
        <StepTimeline steps={steps} />
      </section>
    </div>
  );
};

export default CamIcu;
