import { useState } from "react";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import StepTimeline from "@/components/data/StepTimeline";
import { usePreferences } from "@/contexts/PreferencesContext";
import { calcText } from "@/data/calculators-text";
import { localToday, pregnancyDates } from "@/lib/clinical/calculators";
import { parseNumber } from "@/lib/numbers";
import { Choice, Field, Num, Outcome, Panel } from "./parts";

const MILESTONES = [
  { from: 11, to: 13.86, title: "Nuchal translucency / first-trimester screening", when: "11+0 – 13+6 w" },
  { from: 18, to: 22, title: "Anatomy ultrasound", when: "18 – 22 w" },
  { from: 24, to: 28, title: "Gestational diabetes screening", when: "24 – 28 w" },
  { from: 36, to: 37.86, title: "Group B streptococcus screening", when: "36+0 – 37+6 w" },
  { from: 37, to: 38.86, title: "Early term", when: "37+0 – 38+6 w" },
  { from: 39, to: 40.86, title: "Full term", when: "39+0 – 40+6 w" },
  { from: 41, to: 41.86, title: "Late term", when: "41+0 – 41+6 w" },
  { from: 42, to: 44, title: "Post-term", when: "≥ 42+0 w" },
];

const PregnancyCalc = () => {
  const { language } = usePreferences();
  const tx = calcText[language];
  const [by, setBy] = useState<"lmp" | "us">("lmp");
  const [v, setV] = useState({ lmp: "", cycle: "28", usDate: "", weeks: "", days: "0" });
  const r =
    by === "lmp"
      ? pregnancyDates({ lmp: v.lmp || undefined, cycle: parseNumber(v.cycle), today: localToday() })
      : pregnancyDates({ usDate: v.usDate || undefined, usWeeks: parseNumber(v.weeks), usDays: parseNumber(v.days), today: localToday() });
  const formatDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(language === "ar" ? "ar-IQ" : "en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });

  return (
    <Panel>
      <Choice label={tx.byLmp} value={by} onChange={setBy} options={[{ value: "lmp", label: tx.byLmp }, { value: "us", label: tx.byUs }]} />
      {by === "lmp" ? (
        <div className="grid grid-cols-2 gap-3">
          <Field id="lmp" type="date" label={tx.lmp} value={v.lmp} onChange={(x) => setV({ ...v, lmp: x })} />
          <Field id="cycle" label={tx.cycle} value={v.cycle} onChange={(x) => setV({ ...v, cycle: x })} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Field id="us-date" type="date" label={tx.usDate} value={v.usDate} onChange={(x) => setV({ ...v, usDate: x })} />
          <Field id="us-weeks" label={tx.weeks} value={v.weeks} onChange={(x) => setV({ ...v, weeks: x })} />
          <Field id="us-days" label={tx.days} value={v.days} onChange={(x) => setV({ ...v, days: x })} />
        </div>
      )}
      <Outcome result={r} enter={tx.enter} outOfRange={tx.outOfRange}>
        {(res) => {
          const gaWeeksDecimal = res.gaTotalDays / 7;
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatTile tone="primary" label={tx.edd} value={formatDate(res.edd)} />
                <StatTile label={tx.ga} value={<Num>{res.gaWeeks}+{res.gaDays}</Num>} hint={tx.term[res.termStatus]} />
                <StatTile label={tx.trimester} value={<Num>{res.trimester}</Num>} />
                <StatTile label={tx.daysLeft} value={<Num>{res.daysLeft}</Num>} />
              </div>
              <div dir="ltr" className="relative h-3 rounded-full bg-muted" role="img" aria-label={`${tx.ga} ${res.gaWeeks}+${res.gaDays}`}>
                <span className="absolute inset-y-0 start-0 rounded-full bg-primary" style={{ width: `${Math.min(100, (res.gaTotalDays / 294) * 100)}%` }} />
                {[13, 28, 37, 40].map((w) => (
                  <span key={w} className="absolute -bottom-4 -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground" style={{ left: `${(w * 7 * 100) / 294}%` }}>
                    {w}w
                  </span>
                ))}
              </div>
              <div className="pt-3">
                <p className="mb-2 text-sm font-semibold">{tx.milestones}</p>
                <div dir="ltr" className="text-start">
                  <StepTimeline
                    steps={MILESTONES.map((m) => ({
                      title: m.title,
                      body: m.when,
                      marker: gaWeeksDecimal > m.to ? "✓" : gaWeeksDecimal >= m.from ? "●" : undefined,
                      tone: gaWeeksDecimal > m.to ? "good" : gaWeeksDecimal >= m.from ? "warn" : "default",
                    }))}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Outcome>
      <SourceNote ids={["acog-term", "acog-screening"]} />
    </Panel>
  );
};

export default PregnancyCalc;
