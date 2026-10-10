import { useState } from "react";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import { usePreferences } from "@/contexts/PreferencesContext";
import { calcText } from "@/data/calculators-text";
import { heparinAdjust, heparinInitial, type HeparinProtocol } from "@/lib/clinical/calculators";
import { parseNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";
import { Choice, Field, Num, Outcome, Panel } from "./parts";

const NOMOGRAM = [
  { aptt: "< 35", action: "rebolus_increase", detail: "80 u/kg, +4 u/kg/h" },
  { aptt: "35–45", action: "rebolus_increase", detail: "40 u/kg, +2 u/kg/h" },
  { aptt: "46–70", action: "no_change", detail: "—" },
  { aptt: "71–90", action: "decrease", detail: "−2 u/kg/h" },
  { aptt: "> 90", action: "hold_decrease", detail: "hold 1 h, −3 u/kg/h" },
] as const;

const rowFor = (aptt: number) => (aptt < 35 ? 0 : aptt <= 45 ? 1 : aptt <= 70 ? 2 : aptt <= 90 ? 3 : 4);

const HeparinCalc = () => {
  const tx = calcText[usePreferences().language];
  const [protocol, setProtocol] = useState<HeparinProtocol>("vte");
  const [v, setV] = useState({ weight: "", conc: "100", aptt: "", current: "" });
  const weight = parseNumber(v.weight);
  const conc = parseNumber(v.conc);
  const init = heparinInitial(protocol, weight);
  const aptt = parseNumber(v.aptt);
  const currentPerKg = parseNumber(v.current) ?? (protocol === "vte" ? 18 : 12);
  const adj = heparinAdjust(aptt, weight, currentPerKg);
  const mL = (units: number) => (conc && conc > 0 ? ` · ${Math.round((units / conc) * 10) / 10} mL` : "");

  return (
    <>
      <Panel>
        <Choice label={tx.protocol} value={protocol} onChange={setProtocol} options={[{ value: "vte", label: "VTE" }, { value: "acs", label: "ACS" }]} />
        <p className="text-xs text-muted-foreground">{tx[protocol]}</p>
        <div className="grid grid-cols-2 gap-3">
          <Field id="hep-weight" label={tx.weight} value={v.weight} onChange={(x) => setV({ ...v, weight: x })} />
          <Field id="hep-conc" label={tx.heparinConc} value={v.conc} onChange={(x) => setV({ ...v, conc: x })} />
        </div>
        <Outcome result={init} enter={tx.enter} outOfRange={tx.outOfRange}>
          {(r) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                <StatTile tone="primary" label={tx.bolus} value={<Num>{r.bolus.toLocaleString("en")} u</Num>} hint={mL(r.bolus).replace(" · ", "")} />
                <StatTile tone="primary" label={tx.infusion} value={<Num>{r.rate.toLocaleString("en")} u/h</Num>} hint={conc ? `${Math.round((r.rate / conc) * 100) / 100} mL/h` : undefined} />
              </div>
              {r.capped && <p className="text-xs text-medical-yellow">{tx.capped}</p>}
            </>
          )}
        </Outcome>
      </Panel>
      <Panel>
        <div className="grid grid-cols-2 gap-3">
          <Field id="aptt" label={tx.aptt} value={v.aptt} onChange={(x) => setV({ ...v, aptt: x })} />
          <Field id="current" label={tx.currentRate} value={v.current} onChange={(x) => setV({ ...v, current: x })} />
        </div>
        <Outcome result={adj} enter={tx.enter} outOfRange={tx.outOfRange}>
          {(r) => (
            <div className="space-y-2">
              <p className="text-sm font-semibold">{tx.action[r.action]}</p>
              <div className="grid grid-cols-2 gap-2">
                <StatTile label={tx.rebolus} value={<Num>{r.rebolus ? `${r.rebolus.toLocaleString("en")} u` : "—"}</Num>} />
                <StatTile tone="primary" label={tx.newRate} value={<Num>{r.newRate.toLocaleString("en")} u/h</Num>} hint={`${r.newRatePerKg} u/kg/h${mL(r.newRate) ? ` ·${mL(r.newRate).replace(" · ", " ")}/h` : ""}`} />
              </div>
              <p className="text-xs text-muted-foreground">{tx.recheck}</p>
            </div>
          )}
        </Outcome>
        <table dir="ltr" className="w-full text-start text-xs">
          <tbody>
            {NOMOGRAM.map((row, i) => (
              <tr key={row.aptt} className={cn("border-t", aptt !== null && rowFor(aptt) === i && "bg-primary/10 font-semibold")}>
                <td className="py-1.5 pe-2 tabular-nums">{row.aptt} s</td>
                <td className="py-1.5 pe-2">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">{tx.apttNote}</p>
        <SourceNote ids={["raschke", "acc-aha-acs"]} />
      </Panel>
    </>
  );
};

export default HeparinCalc;
