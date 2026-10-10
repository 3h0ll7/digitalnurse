import { useMemo, useState } from "react";
import { Activity, AlertTriangle, HeartPulse, ListChecks, Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import DistributionBar from "@/components/data/DistributionBar";
import FilterChips from "@/components/data/FilterChips";
import RangeLanes from "@/components/data/RangeLanes";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import StepTimeline from "@/components/data/StepTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/contexts/PreferencesContext";
import ecgI18n from "@/data/ecg-i18n.json";
import { filterRhythms, matchesCategory, RHYTHM_RATES, severityCounts, type Severity } from "@/lib/clinical/ecg";
import { cn } from "@/lib/utils";

interface Rhythm {
  id: number;
  category: string;
  nameEn: string;
  nameAr: string;
  rate: string;
  characteristics: string;
  interventions: string[];
  tipsEn: string;
  tipsAr: string;
  severity: Severity;
  wave: string;
}

const rhythms = ecgI18n.rhythms as Rhythm[];
const counts = severityCounts(rhythms);
const lifeCount = counts.find((c) => c.severity === "LIFE_THREATENING")?.count ?? 0;

const SEVERITY_BADGE: Record<Severity, string> = {
  BENIGN: "border-medical-green/40 bg-medical-green/10 text-medical-green",
  MONITOR: "border-medical-blue/40 bg-medical-blue/10 text-medical-blue",
  URGENT: "border-medical-yellow/40 bg-medical-yellow/10 text-medical-yellow",
  LIFE_THREATENING: "border-medical-red/40 bg-medical-red/10 text-medical-red",
};

const SEVERITY_COLOR: Record<Severity, string> = {
  BENIGN: "hsl(var(--medical-green))",
  MONITOR: "hsl(var(--medical-blue))",
  URGENT: "hsl(var(--medical-yellow))",
  LIFE_THREATENING: "hsl(var(--medical-red))",
};

const WAVES: Record<string, string> = {
  vf: "M2 35 C8 5, 14 65, 20 30 C26 10, 32 60, 38 24 C44 8, 50 62, 56 30 C62 10, 68 55, 74 32 C80 12, 86 58, 98 34",
  vt: "M2 32 L12 32 L16 10 L20 50 L24 8 L28 42 L32 32 L42 32 L46 8 L50 50 L54 10 L58 42 L62 32 L72 32 L76 8 L80 50 L84 10 L90 32 L98 32",
  torsades: "M2 32 C10 8, 18 56, 26 30 C34 14, 42 50, 50 30 C58 20, 66 44, 74 32 C82 24, 90 40, 98 30",
  st_elev: "M2 32 L16 32 L20 10 L24 52 L28 20 L36 20 L44 20 L52 20 L60 20 L68 32 L78 32 L84 18 L90 32 L98 32",
  st_depress: "M2 32 L16 32 L20 10 L24 52 L28 36 L36 36 L44 36 L52 36 L60 36 L68 32 L78 32 L84 16 L90 32 L98 32",
  t_peaked: "M2 32 L16 32 L20 10 L24 52 L28 32 L38 32 L46 10 L54 32 L62 32 L72 32 L80 8 L88 32 L98 32",
  paced: "M2 32 L10 32 L10 8 L12 32 L20 32 L24 10 L28 52 L32 22 L40 32 L48 32 L48 8 L50 32 L58 32 L62 10 L66 52 L70 22 L78 32 L98 32",
  flutter: "M2 32 L8 24 L14 32 L20 24 L26 32 L32 24 L38 32 L44 24 L50 32 L56 24 L62 32 L68 24 L74 32 L80 24 L86 32 L98 32",
  normal: "M2 32 L16 32 L20 10 L24 52 L28 18 L36 32 L48 32 L52 10 L56 52 L60 18 L68 32 L80 32 L84 10 L88 52 L92 18 L98 32",
};
const waveFor = (type: string) => WAVES[type === "tachy" ? "vt" : type.startsWith("paced") ? "paced" : type] ?? WAVES.normal;

/** Schematic strip: decorative, the rhythm name and rate carry the meaning. */
const EcgWave = ({ type }: { type: string }) => (
  <svg viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden="true" className="h-14 w-full rounded-xl border bg-secondary/40 p-1 text-primary" style={{ direction: "ltr" }}>
    <line x1="0" y1="32" x2="100" y2="32" stroke="hsl(var(--border))" strokeWidth="0.8" />
    <path d={waveFor(type)} stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ECG = () => {
  const { language } = usePreferences();
  const copy = ecgI18n[language];
  const lx = copy.labels;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [severity, setSeverity] = useState<Severity | null>(null);

  const filtered = useMemo(() => filterRhythms(rhythms, { category, severity, query: search }), [category, severity, search]);
  const categoryOptions = Object.entries(copy.categories).map(([value, label]) => ({
    value,
    label,
    count: rhythms.filter((r) => matchesCategory(r, value)).length,
  }));
  const hasFilters = Boolean(search || category !== "ALL" || severity);
  const reset = () => {
    setSearch("");
    setCategory("ALL");
    setSeverity(null);
  };

  return (
    <AppLayout illustration="ecg" title={copy.title} subtitle={copy.subtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={HeartPulse} tone="primary" label={lx.total} value={rhythms.length} />
        <StatTile icon={AlertTriangle} tone="critical" label={lx.lifeThreatening} value={lifeCount} />
        <StatTile icon={ListChecks} label={lx.algorithms} value={copy.acls.length} hint="AHA 2020" />
        <StatTile icon={Activity} tone="good" label={lx.normal} value={<span dir="ltr">60–100</span>} hint="bpm" />
      </section>

      <section className="grid items-start gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
          <h2 className="text-sm font-semibold">{lx.bySeverity}</h2>
          <DistributionBar
            ariaLabel={lx.bySeverity}
            segments={counts.map((c) => ({ key: c.severity, label: copy.severity[c.severity], count: c.count, color: SEVERITY_COLOR[c.severity] }))}
            selected={severity}
            onSelect={(key) => setSeverity((prev) => (prev === key ? null : (key as Severity)))}
          />
        </div>
        <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
          <h2 className="text-sm font-semibold">{lx.rateChart}</h2>
          <RangeLanes
            ariaLabel={lx.rateChart}
            domain={[0, 350]}
            ticks={[0, 60, 100, 150, 250, 350]}
            unit="bpm"
            reference={{ from: 60, to: 100, label: lx.rateRef }}
            rows={RHYTHM_RATES.map((r) => ({ key: String(r.id), label: r.label, min: r.min, max: r.max }))}
          />
          <p className="text-[11px] text-muted-foreground">{lx.rateNote}</p>
        </div>
      </section>

      <Tabs defaultValue="rhythms" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">
          <TabsTrigger value="rhythms">{copy.tabs.rhythms}</TabsTrigger>
          <TabsTrigger value="read">{copy.tabs.howToRead}</TabsTrigger>
          <TabsTrigger value="acls">{copy.tabs.acls}</TabsTrigger>
          <TabsTrigger value="tips">{copy.tabs.tips}</TabsTrigger>
        </TabsList>

        <TabsContent value="rhythms" className="space-y-4">
          <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
            <div className="relative">
              <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.searchPlaceholder} aria-label={copy.searchPlaceholder} className="h-11 rounded-2xl ps-11" />
            </div>
            <FilterChips ariaLabel={lx.category} value={category} onChange={setCategory} options={categoryOptions} hideEmpty />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {lx.showing} <span className="font-semibold tabular-nums text-foreground">{filtered.length}</span> / {rhythms.length}
                {severity && <> · {copy.severity[severity]}</>}
              </span>
              {hasFilters && (
                <Button size="sm" variant="ghost" onClick={reset}>
                  {language === "ar" ? "إعادة الضبط" : "Reset"}
                </Button>
              )}
            </div>
          </section>

          {filtered.length === 0 ? (
            <EmptyState variant="no-results" title={lx.noResults} action={<Button onClick={reset}>{language === "ar" ? "إعادة الضبط" : "Reset"}</Button>} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((rhythm) => (
                <Dialog key={rhythm.id}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="flex flex-col gap-3 rounded-3xl border bg-card p-4 text-start transition-colors hover:border-primary/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex w-full items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span dir="ltr" className="block text-start font-semibold leading-tight">{rhythm.nameEn}</span>
                          <span className="block text-xs text-muted-foreground">{rhythm.nameAr}</span>
                        </span>
                        <Badge variant="outline" className={cn("shrink-0", SEVERITY_BADGE[rhythm.severity])}>{copy.severity[rhythm.severity]}</Badge>
                      </span>
                      <EcgWave type={rhythm.wave} />
                      <span className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                        <span className="font-medium text-primary">{copy.categories[rhythm.category as keyof typeof copy.categories]}</span>
                        <span dir="ltr" className="ms-auto text-muted-foreground">{rhythm.rate}</span>
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle dir="ltr" className="text-start">{rhythm.nameEn}</DialogTitle>
                      <DialogDescription className="text-start">{rhythm.nameAr}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={SEVERITY_BADGE[rhythm.severity]}>{copy.severity[rhythm.severity]}</Badge>
                        <Badge variant="outline">{copy.categories[rhythm.category as keyof typeof copy.categories]}</Badge>
                      </div>
                      <EcgWave type={rhythm.wave} />
                      <dl className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <dt className="text-xs font-medium text-muted-foreground">{lx.rate}</dt>
                          <dd dir="ltr" className="text-start">{rhythm.rate}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-muted-foreground">{lx.characteristics}</dt>
                          <dd dir="ltr" className="text-start">{rhythm.characteristics}</dd>
                        </div>
                      </dl>
                      <div className={cn("rounded-2xl border p-3", rhythm.severity === "LIFE_THREATENING" ? "border-medical-red/30 bg-medical-red/5" : "bg-secondary/40")}>
                        <p className="mb-2 text-xs font-semibold">{lx.interventions}</p>
                        <div dir="ltr" className="text-start">
                          <StepTimeline steps={rhythm.interventions.map((title) => ({ title }))} />
                        </div>
                      </div>
                      <p className="rounded-2xl bg-primary/5 p-3">
                        <span className="font-semibold">{lx.tips}: </span>
                        {language === "ar" ? rhythm.tipsAr : rhythm.tipsEn}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-3">
          <ol className="grid gap-3 md:grid-cols-2">
            {copy.howToReadSteps.map((step) => (
              <li key={step.step} className="flex gap-3 rounded-3xl border bg-card p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{step.step}</span>
                <div className="min-w-0 space-y-1.5">
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.check}</p>
                  {step.normal && (
                    <p className="rounded-xl bg-medical-green/10 px-2.5 py-1.5 text-xs">
                      <span className="font-semibold text-medical-green">{lx.normal}: </span>
                      <span dir="ltr">{step.normal}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <SourceNote ids={["aha-qt", "udmi-4"]} />
        </TabsContent>

        <TabsContent value="acls" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {copy.acls.map((algo, i) => (
              <section key={algo.title} className="space-y-3 rounded-3xl border bg-card p-4 shadow-card">
                <div>
                  <h3 className="font-semibold">{algo.title}</h3>
                  <p className="text-xs text-muted-foreground">{algo.subtitle}</p>
                </div>
                <StepTimeline steps={algo.steps.map((title) => ({ title, tone: i < 2 ? "critical" : "default" }))} />
              </section>
            ))}
          </div>
          <section className="rounded-3xl border border-medical-red/30 bg-medical-red/5 p-4">
            <h3 className="font-semibold text-medical-red">{lx.hAndTs}</h3>
            <ul dir="ltr" className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-start text-sm sm:grid-cols-2">
              {copy.hsTs.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-medical-red" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <SourceNote ids={["aha-acls"]} />
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid gap-3 md:grid-cols-2">
            {copy.clinicalTips.map((tip) => (
              <section key={tip.title} className="rounded-3xl border bg-card p-4">
                <h3 className="font-semibold">{tip.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tip.content}</p>
              </section>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default ECG;
