import { useState } from "react";
import { Field, Panel } from "@/components/calculators/parts";
import { usePreferences } from "@/contexts/PreferencesContext";
import { assessText } from "@/data/assessments-text";
import { calcText } from "@/data/calculators-text";
import { news2, type ScaleDef } from "@/lib/clinical/scores";
import { parseNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";
import ScoreResult from "./ScoreResult";
import Toggle from "./Toggle";

const News2 = ({ scale }: { scale: ScaleDef }) => {
  const { language } = usePreferences();
  const tx = assessText[language];
  const cx = calcText[language];
  const [v, setV] = useState({ rr: "", spo2: "", sbp: "", hr: "", temp: "" });
  const [flags, setFlags] = useState({ onOxygen: false, cvpu: false, scale2: false });
  const r = news2({
    rr: parseNumber(v.rr),
    spo2: parseNumber(v.spo2),
    sbp: parseNumber(v.sbp),
    hr: parseNumber(v.hr),
    temp: parseNumber(v.temp),
    ...flags,
  });
  const res = r.ok ? r.value : null;
  const failure = r.ok ? null : (r as { reason: string; field?: string });
  const fields = ["rr", "spo2", "sbp", "hr", "temp"] as const;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Panel title={tx.vitals}>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((k) => (
            <Field key={k} id={`news-${k}`} label={tx[k]} value={v[k]} onChange={(x) => setV((p) => ({ ...p, [k]: x }))} />
          ))}
        </div>
        <div className="grid gap-2">
          <Toggle label={tx.onOxygen} on={flags.onOxygen} onChange={(on) => setFlags((p) => ({ ...p, onOxygen: on }))} />
          <Toggle label={tx.cvpu} on={flags.cvpu} onChange={(on) => setFlags((p) => ({ ...p, cvpu: on }))} />
          <Toggle label={tx.scale2} on={flags.scale2} onChange={(on) => setFlags((p) => ({ ...p, scale2: on }))} />
        </div>
      </Panel>
      <div className="lg:sticky lg:top-4">
        <ScoreResult
          scale={scale}
          title={tx.result}
          value={res ? res.total : null}
          max={20}
          waiting={failure?.reason === "range" ? cx.outOfRange(failure.field ?? "") : cx.enter}
          labels={tx}
          flags={res?.singleThree && res.total < 5 ? [tx.singleThree] : []}
        >
          {res && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{tx.breakdown}</p>
              <ul className="grid grid-cols-2 gap-1.5 text-xs">
                {(Object.keys(res.parts) as (keyof typeof res.parts)[]).map((k) => (
                  <li key={k} className={cn("flex items-center justify-between rounded-xl border px-2 py-1", res.parts[k] === 3 && "border-medical-red/40 bg-medical-red/10")}>
                    <span>{tx.params[k]}</span>
                    <span className="font-semibold tabular-nums">{res.parts[k]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScoreResult>
      </div>
    </div>
  );
};

export default News2;
