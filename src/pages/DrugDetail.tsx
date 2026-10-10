import { useMemo, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import RangeLanes from "@/components/data/RangeLanes";
import SourceNote from "@/components/data/SourceNote";
import StepTimeline from "@/components/data/StepTimeline";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/contexts/PreferencesContext";
import drugsCatalog from "@/data/drugs-catalog.json";
import { DRUG_CATEGORY_LABELS, drugDetailText, drugsText } from "@/data/drugs-i18n";
import { parseRange } from "@/lib/clinical/ranges";

/** Label on the reader's side, English clinical text in its own LTR block. */
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-0.5">
    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
    <dd dir="ltr" className="text-start text-sm">{children}</dd>
  </div>
);

const List = ({ title, items, tone }: { title: string; items: string[]; tone?: "critical" | "warn" }) =>
  items.length ? (
    <div className={tone === "critical" ? "rounded-2xl border border-medical-red/30 bg-medical-red/5 p-3" : tone === "warn" ? "rounded-2xl border border-medical-yellow/30 bg-medical-yellow/5 p-3" : "rounded-2xl border bg-secondary/40 p-3"}>
      <p className="mb-1.5 text-sm font-semibold">{title}</p>
      <ul dir="ltr" className="list-disc space-y-1 ps-4 text-start text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  ) : null;

const Panel = ({ children }: { children: ReactNode }) => <div className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">{children}</div>;

const DrugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = usePreferences();
  const tx = drugDetailText[language];
  const flags = drugsText[language];
  const drug = useMemo(() => drugsCatalog.drugs.find((item) => item.id === id), [id]);

  if (!drug) {
    return (
      <AppLayout title={tx.notFound} onBack={() => navigate("/drugs")}>
        <EmptyState variant="not-found" title={tx.notFoundBody} />
      </AppLayout>
    );
  }

  const range = drug.dosing.titrationRange ? parseRange(drug.dosing.titrationRange) : null;
  const rangeMax = range?.max ?? null;

  return (
    <AppLayout illustration="pharmacy" title={drug.genericName} subtitle={drug.brandName || undefined} onBack={() => navigate("/drugs")}>
      <Panel>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{DRUG_CATEGORY_LABELS[drug.category]?.[language] ?? drug.category}</Badge>
          {drug.highAlert && <Badge variant="outline" className="border-medical-red/40 bg-medical-red/10 text-medical-red">{flags.highAlert}</Badge>}
          {drug.emergency && <Badge variant="outline" className="border-medical-yellow/40 bg-medical-yellow/10 text-medical-yellow">{flags.emergency}</Badge>}
          {drug.weightBased && <Badge variant="outline">{flags.weightBased}</Badge>}
          {drug.sedationReference && <Badge variant="outline">{tx.sedationRef}</Badge>}
          <span dir="ltr" className="ms-auto text-xs text-muted-foreground">{drug.routes.join(" · ")}</span>
        </div>
        {drug.pronunciation && (
          <p className="text-xs text-muted-foreground">
            {tx.pronunciation}: <span dir="ltr">{drug.pronunciation}</span>
          </p>
        )}
        {range && range.min !== null && rangeMax !== null && (
          <div className="space-y-1">
            <p className="text-xs font-medium">{tx.rangeChart}</p>
            <RangeLanes
              ariaLabel={tx.rangeChart}
              domain={[0, rangeMax * 1.25]}
              ticks={[0, range.min, rangeMax]}
              unit={range.unit ?? ""}
              rows={[{ key: drug.id, label: drug.genericName, min: range.min, max: rangeMax }]}
            />
            <p dir="ltr" className="text-start text-[11px] text-muted-foreground">{drug.dosing.maxDose}</p>
          </div>
        )}
      </Panel>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 md:grid-cols-6">
          {(Object.keys(tx.tabs) as (keyof typeof tx.tabs)[]).map((key) => (
            <TabsTrigger key={key} value={key} className="whitespace-normal text-xs sm:text-sm">
              {tx.tabs[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <Panel>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label={tx.class}>{drug.overview.class}</Field>
              <Field label={tx.mechanism}>{drug.overview.mechanism}</Field>
            </dl>
            <div className="grid gap-3 sm:grid-cols-2">
              <List title={tx.indications} items={drug.overview.indications} />
              <List title={tx.contraindications} items={drug.overview.contraindications} tone="warn" />
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="dosing">
          <Panel>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label={tx.adultDose}>{drug.dosing.adultDose}</Field>
              <Field label={tx.weightBasedDose}>{drug.dosing.weightBased}</Field>
              <Field label={tx.bolusVsInfusion}>{drug.dosing.bolusVsInfusion}</Field>
              <Field label={tx.titration}>{drug.dosing.titration}</Field>
              {drug.dosing.titrationRange && <Field label={tx.titrationRange}>{drug.dosing.titrationRange}</Field>}
              {drug.dosing.mapTarget && <Field label={tx.mapTarget}>{drug.dosing.mapTarget}</Field>}
              {drug.dosing.hrTarget && <Field label={tx.hrTarget}>{drug.dosing.hrTarget}</Field>}
              <Field label={tx.target}>{drug.dosing.target}</Field>
              <Field label={tx.maxDose}>{drug.dosing.maxDose}</Field>
            </dl>
            {drug.hasTitrationGuide && (
              <div className="space-y-2 rounded-2xl border bg-secondary/30 p-3">
                <p className="text-sm font-semibold">{tx.titrationGuide}</p>
                <StepTimeline steps={tx.titrationSteps.map((title) => ({ title }))} />
              </div>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="administration">
          <Panel>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label={tx.ivRate}>{drug.administration.ivRate}</Field>
              <Field label={tx.concentration}>{drug.administration.concentration}</Field>
              <Field label={tx.dilution}>{drug.administration.dilution}</Field>
              <Field label={tx.compatibility}>{drug.administration.compatibility}</Field>
              <Field label={tx.stability}>{drug.administration.stability}</Field>
              <Field label={tx.line}>{drug.administration.line}</Field>
            </dl>
          </Panel>
        </TabsContent>

        <TabsContent value="nursing">
          <Panel>
            <div className="grid gap-3 md:grid-cols-3">
              <List title={tx.before} items={drug.nursing.before} />
              <List title={tx.during} items={drug.nursing.during} />
              <List title={tx.after} items={drug.nursing.after} />
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label={tx.monitoring}>{drug.nursing.monitoring.join(" · ")}</Field>
              <Field label={tx.holdNotify}>{drug.nursing.holdNotify}</Field>
              <Field label={tx.titrationTriggers}>{drug.nursing.titrationTriggers}</Field>
              {drug.sedationReference && <Field label={tx.sedation}>{drug.sedationReference}</Field>}
            </dl>
          </Panel>
        </TabsContent>

        <TabsContent value="interactions">
          <Panel>
            <div className="grid gap-3 md:grid-cols-3">
              <List title={tx.drugDrug} items={drug.interactions.drugDrug} />
              <List title={tx.ivIncompat} items={drug.interactions.ivIncompatibilities} tone="warn" />
              <List title={tx.food} items={drug.interactions.food} />
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="effects">
          <Panel>
            <div className="grid gap-3 md:grid-cols-3">
              <List title={tx.common} items={drug.sideEffects.common} />
              <List title={tx.serious} items={drug.sideEffects.serious} tone="warn" />
              <List title={tx.lifeThreatening} items={drug.sideEffects.lifeThreatening} tone="critical" />
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label={tx.blackBox}>{drug.sideEffects.blackBox}</Field>
              <Field label={tx.antidote}>{drug.sideEffects.antidote}</Field>
            </dl>
          </Panel>
        </TabsContent>
      </Tabs>
      <SourceNote ids={["dailymed", "ismp-high-alert"]} />
    </AppLayout>
  );
};

export default DrugDetail;
