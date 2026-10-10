import { useState } from "react";
import BarList from "@/components/data/BarList";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import { usePreferences } from "@/contexts/PreferencesContext";
import { calcText } from "@/data/calculators-text";
import { bsa, burnFluids, ibw } from "@/lib/clinical/calculators";
import { parseNumber } from "@/lib/numbers";
import { Choice, Field, Num, Outcome, Panel } from "./parts";

export const IbwCalc = () => {
  const tx = calcText[usePreferences().language];
  const [sex, setSex] = useState<"male" | "female">("male");
  const [v, setV] = useState({ height: "", actual: "" });
  const actual = parseNumber(v.actual);
  const r = ibw(sex, parseNumber(v.height), actual);
  return (
    <Panel>
      <Choice label={tx.sex} value={sex} onChange={setSex} options={[{ value: "male", label: tx.male }, { value: "female", label: tx.female }]} />
      <div className="grid grid-cols-2 gap-3">
        <Field id="ibw-height" label={tx.height} value={v.height} onChange={(x) => setV({ ...v, height: x })} />
        <Field id="ibw-actual" label={tx.actual} value={v.actual} onChange={(x) => setV({ ...v, actual: x })} />
      </div>
      <Outcome result={r} enter={tx.enter} outOfRange={tx.outOfRange}>
        {(res) => (
          <div className="space-y-3">
            {res.shortStature && <p className="rounded-2xl bg-medical-yellow/10 p-3 text-xs text-medical-yellow">{tx.shortStature}</p>}
            <div className="grid grid-cols-2 gap-2">
              <StatTile tone="primary" label={tx.ibw} value={<Num>{res.ibw} kg</Num>} />
              <StatTile label={tx.abw} value={<Num>{res.abw !== null ? `${res.abw} kg` : "—"}</Num>} hint={res.percentOver !== null ? `${tx.overIbw}: ${res.percentOver}%` : undefined} />
              <StatTile label={`${tx.tidal} 6 mL/kg`} value={<Num>{Math.round(res.ibw * 6)} mL</Num>} />
              <StatTile label={`${tx.tidal} 8 mL/kg`} value={<Num>{Math.round(res.ibw * 8)} mL</Num>} />
            </div>
            {actual !== null && (
              <BarList
                ariaLabel="Weights"
                unit="kg"
                rows={[
                  { key: "actual", label: tx.actual.replace(" (kg)", ""), value: actual, color: "var(--viz-2)" },
                  { key: "ibw", label: tx.ibw, value: res.ibw, color: "var(--viz-1)" },
                  ...(res.abw !== null ? [{ key: "abw", label: tx.abw, value: res.abw, color: "var(--viz-3)" }] : []),
                ]}
              />
            )}
          </div>
        )}
      </Outcome>
      <p className="text-xs text-muted-foreground">{tx.dosingWeight}</p>
      <SourceNote ids={["devine"]} />
    </Panel>
  );
};

export const BsaCalc = () => {
  const tx = calcText[usePreferences().language];
  const [formula, setFormula] = useState<"mosteller" | "dubois">("mosteller");
  const [v, setV] = useState({ weight: "", height: "", tbsa: "" });
  const weight = parseNumber(v.weight);
  const area = bsa(weight, parseNumber(v.height), formula);
  const burns = burnFluids(weight, parseNumber(v.tbsa));
  return (
    <>
      <Panel title={tx.bsa}>
        <Choice label={tx.formula} value={formula} onChange={setFormula} options={[{ value: "mosteller", label: "Mosteller" }, { value: "dubois", label: "Du Bois" }]} />
        <div className="grid grid-cols-2 gap-3">
          <Field id="bsa-weight" label={tx.weight} value={v.weight} onChange={(x) => setV({ ...v, weight: x })} />
          <Field id="bsa-height" label={tx.height} value={v.height} onChange={(x) => setV({ ...v, height: x })} />
        </div>
        <Outcome result={area} enter={tx.enter} outOfRange={tx.outOfRange}>
          {(m2) => <StatTile tone="primary" label={tx.bsa} value={<Num>{m2} m²</Num>} hint="Adult ≈ 1.7–2.0 m²" />}
        </Outcome>
        <SourceNote ids={["mosteller"]} />
      </Panel>
      <Panel title={tx.tbsa}>
        <p dir="ltr" className="text-start text-xs text-muted-foreground">
          Rule of nines (adult): head 9 · each arm 9 · front trunk 18 · back trunk 18 · each leg 18 · perineum 1
        </p>
        <Field id="tbsa" label={tx.tbsa} value={v.tbsa} onChange={(x) => setV({ ...v, tbsa: x })} />
        <Outcome result={burns} enter={tx.enter} outOfRange={tx.outOfRange}>
          {({ parkland, atls }) => (
            <div className="space-y-3">
              {[
                { title: tx.parkland, plan: parkland },
                { title: tx.atls, plan: atls },
              ].map(({ title, plan }) => (
                <div key={title} className="space-y-2 rounded-2xl border p-3">
                  <p className="text-xs font-semibold">{title}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <StatTile label={tx.total24h} value={<Num>{plan.total.toLocaleString("en")} mL</Num>} />
                    <StatTile label={tx.first8h} value={<Num>{plan.first8hRate} mL/h</Num>} />
                    <StatTile label={tx.next16h} value={<Num>{plan.next16hRate} mL/h</Num>} />
                  </div>
                  <div dir="ltr" className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
                    <span className="h-full" style={{ width: "33.3%", background: "var(--viz-2)" }} title={tx.first8h} />
                    <span className="h-full flex-1" style={{ background: "var(--viz-1)" }} title={tx.next16h} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">{tx.fromInjury}</p>
            </div>
          )}
        </Outcome>
        <SourceNote ids={["atls"]} />
      </Panel>
    </>
  );
};
