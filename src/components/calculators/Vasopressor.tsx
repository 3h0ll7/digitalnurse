import { useState } from "react";
import BandBar from "@/components/data/BandBar";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import { usePreferences } from "@/contexts/PreferencesContext";
import { calcText } from "@/data/calculators-text";
import { VASOACTIVE, vasoactive, type VasoDrug } from "@/lib/clinical/calculators";
import { parseNumber } from "@/lib/numbers";
import { Choice, Field, Num, Outcome, Panel } from "./parts";

const DRUGS = Object.keys(VASOACTIVE) as VasoDrug[];

const VasopressorCalc = () => {
  const tx = calcText[usePreferences().language];
  const [drug, setDrug] = useState<VasoDrug>("norepinephrine");
  const [mode, setMode] = useState<"rateToDose" | "doseToRate">("rateToDose");
  const [v, setV] = useState({ amount: "4", volume: "250", weight: "", rate: "", dose: "" });
  const info = VASOACTIVE[drug];

  const pickDrug = (d: VasoDrug) => {
    setDrug(d);
    const [amount, volume] = VASOACTIVE[d].mixes[0];
    setV((prev) => ({ ...prev, amount: String(amount), volume: String(volume) }));
  };

  const r = vasoactive({
    drug,
    amount: parseNumber(v.amount),
    volume: parseNumber(v.volume),
    weight: parseNumber(v.weight),
    ...(mode === "rateToDose" ? { rate: parseNumber(v.rate) } : { dose: parseNumber(v.dose) }),
  });
  const span = info.range.max * 1.4;

  return (
    <Panel>
      <div className="space-y-1">
        <label htmlFor="vaso-drug" className="block text-xs font-medium">{tx.drug}</label>
        <select id="vaso-drug" value={drug} onChange={(e) => pickDrug(e.target.value as VasoDrug)} className="h-10 w-full rounded-md border bg-background px-3 text-sm capitalize">
          {DRUGS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {info.mixes.map(([amount, volume]) => (
          <button
            key={`${amount}-${volume}`}
            type="button"
            onClick={() => setV({ ...v, amount: String(amount), volume: String(volume) })}
            className="rounded-full border px-3 py-1 text-xs hover:bg-secondary"
          >
            {tx.mix}: <Num>{amount} {info.weightBased ? "mg" : "units"} / {volume} mL</Num>
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="amount" label={info.weightBased ? `${tx.amount} (mg)` : tx.amountUnits} value={v.amount} onChange={(x) => setV({ ...v, amount: x })} />
        <Field id="bag" label={tx.bagVolume} value={v.volume} onChange={(x) => setV({ ...v, volume: x })} />
        {info.weightBased && <Field id="vaso-weight" label={tx.weight} value={v.weight} onChange={(x) => setV({ ...v, weight: x })} />}
      </div>
      <Choice label={tx.rateToDose} value={mode} onChange={setMode} options={[{ value: "rateToDose", label: tx.rateToDose }, { value: "doseToRate", label: tx.doseToRate }]} />
      {mode === "rateToDose" ? (
        <Field id="rate" label={tx.pumpRate} value={v.rate} onChange={(x) => setV({ ...v, rate: x })} />
      ) : (
        <Field id="dose" label={`${tx.targetDose} (${info.unit})`} value={v.dose} onChange={(x) => setV({ ...v, dose: x })} />
      )}
      <Outcome result={r} enter={tx.enter} outOfRange={tx.outOfRange}>
        {(res) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <StatTile tone={res.zone === "in_range" ? "good" : res.zone === "above_range" ? "critical" : "warn"} label={tx.dose} value={<Num>{res.dose}</Num>} hint={info.unit} />
              <StatTile tone="primary" label={tx.pumpRate} value={<Num>{res.rate}</Num>} hint={`${tx.concentration} ${res.concentration} ${info.weightBased ? "mcg/mL" : "units/mL"}`} />
            </div>
            <BandBar
              min={0}
              max={span}
              bands={[
                { from: 0, to: info.range.min, tone: "warn" },
                { from: info.range.min, to: info.range.max, tone: "normal" },
                { from: info.range.max, to: span, tone: "critical" },
              ]}
              value={res.dose}
              unit={info.unit}
              valueLabel={tx.zone[res.zone]}
              ariaLabel={tx.dose}
              ticks={[info.range.min, info.range.max]}
            />
            <p className="text-sm">{tx.zone[res.zone]}</p>
          </div>
        )}
      </Outcome>
      <p className="text-xs text-muted-foreground">
        {tx.referenceRange}: <Num>{info.range.min}–{info.range.max} {info.unit}</Num>
      </p>
      {drug === "vasopressin" && <p className="text-xs text-muted-foreground">{tx.vasoNote}</p>}
      <SourceNote ids={["dailymed"]} />
    </Panel>
  );
};

export default VasopressorCalc;
