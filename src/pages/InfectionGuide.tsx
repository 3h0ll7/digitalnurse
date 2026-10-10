import { useMemo, useState } from "react";
import { AlertTriangle, Biohazard, ClipboardCheck, Hand, Search, ShieldCheck, Syringe } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import DistributionBar from "@/components/data/DistributionBar";
import FilterChips from "@/components/data/FilterChips";
import RangeLanes from "@/components/data/RangeLanes";
import SourceNote from "@/components/data/SourceNote";
import StatTile from "@/components/data/StatTile";
import StepTimeline from "@/components/data/StepTimeline";
import Checklist from "@/components/procedures/Checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/contexts/PreferencesContext";
import {
  bundles,
  DISINFECTANTS,
  DOFFING,
  DONNING,
  EXPOSURE_STEPS,
  FIVE_MOMENTS,
  FOLLOW_UP,
  INFECTION_SOURCES,
  organisms,
  PEP,
  PRECAUTION_ORDER,
  PRECAUTIONS,
  SPAULDING,
  type OrganismGroup,
  type Precaution,
} from "@/data/infection";
import { cn } from "@/lib/utils";

/** Identity colours for the precaution types (categorical, fixed order). */
const PRECAUTION_COLOR: Record<Precaution, string> = {
  standard: "hsl(var(--muted-foreground))",
  contact: "var(--viz-3)",
  droplet: "var(--viz-1)",
  airborne: "var(--viz-2)",
  protective: "var(--viz-4)",
};

const TEXT = {
  en: {
    title: "Infection Control & Isolation",
    subtitle: "Isolation, PPE, HAI bundles & exposure safety",
    tabs: { isolation: "Isolation", ppe: "PPE", hands: "Hand hygiene", bundles: "Bundles", organisms: "Organisms", disinfection: "Disinfection", exposure: "Exposure" },
    precaution: { standard: "Standard", contact: "Contact", droplet: "Droplet", airborne: "Airborne", protective: "Protective environment" },
    organisms: "Organisms",
    bundles: "HAI bundles",
    bundleItems: "Bundle elements",
    precautionTypes: "Precaution types",
    byPrecaution: "Organisms by main precaution",
    standardAlways: "Standard Precautions apply to every patient, every time — the others are added on top.",
    ppe: "PPE",
    room: "Room",
    examples: "Examples",
    donning: "Putting on (donning)",
    doffing: "Taking off (doffing)",
    n95: "N95 vs surgical mask",
    n95Body: "N95: fit-tested respirator that filters aerosols — airborne precautions and COVID-19. Surgical mask: fluid barrier for droplet precautions and source control.",
    moments: "WHO 5 moments",
    duration: "How long to rub or wash",
    durationNote: "Whole procedure, including drying for alcohol rub.",
    cdiff: "C. difficile: gloves + gown, then wash with soap and water — it removes spores mechanically; alcohol rub does not inactivate them. Clean with a sporicidal (EPA List K) agent.",
    search: "Search organism or infection",
    all: "All",
    showing: "Showing",
    reset: "Reset",
    empty: "No organism matches.",
    transmission: "Transmission",
    infections: "Infections",
    treatment: "First-line treatment",
    resistance: "Resistance",
    alert: "Nursing alert",
    spaulding: "Spaulding classification",
    disinfectants: "Common disinfectants",
    immediate: "Immediate response",
    pep: "PEP decisions",
    followUp: "Follow-up testing",
    progress: (d: number, t: number) => `${d} of ${t} done`,
    clear: "Clear",
    checklistHint: "Tick each element for today's audit — nothing is saved.",
  },
  ar: {
    title: "مكافحة العدوى والعزل",
    subtitle: "العزل، معدات الوقاية، حزم العدوى والتعرض المهني",
    tabs: { isolation: "العزل", ppe: "معدات الوقاية", hands: "نظافة اليدين", bundles: "الحزم", organisms: "الكائنات", disinfection: "التطهير", exposure: "التعرض" },
    precaution: { standard: "قياسي", contact: "تلامسي", droplet: "رذاذي", airborne: "هوائي", protective: "بيئة وقائية" },
    organisms: "الكائنات",
    bundles: "حزم العدوى",
    bundleItems: "عناصر الحزم",
    precautionTypes: "أنواع الاحتياطات",
    byPrecaution: "الكائنات حسب الاحتياط الرئيسي",
    standardAlways: "الاحتياطات القياسية تُطبق على كل مريض وبكل وقت — والباقي يضاف فوقها.",
    ppe: "معدات الوقاية",
    room: "الغرفة",
    examples: "أمثلة",
    donning: "اللبس",
    doffing: "الخلع",
    n95: "N95 مقابل الكمامة الجراحية",
    n95Body: "N95: كمامة تنفسية مختبرة الملاءمة تفلتر الرذاذ الدقيق — للعزل الهوائي و COVID-19. الكمامة الجراحية: حاجز سوائل للعزل الرذاذي وللمريض.",
    moments: "اللحظات الخمس (WHO)",
    duration: "مدة الفرك أو الغسل",
    durationNote: "المدة الكاملة، وتشمل الجفاف بالنسبة للمعقم الكحولي.",
    cdiff: "C. difficile: كفوف + رداء، وبعدها غسل بالماء والصابون — يزيل الأبواغ ميكانيكياً؛ المعقم الكحولي ما يعطلها. نظّف بمطهر قاتل للأبواغ (EPA List K).",
    search: "ابحث عن كائن أو عدوى",
    all: "الكل",
    showing: "المعروض",
    reset: "إعادة الضبط",
    empty: "ماكو كائن مطابق.",
    transmission: "الانتقال",
    infections: "العداوى",
    treatment: "العلاج الأول",
    resistance: "المقاومة",
    alert: "تنبيه تمريضي",
    spaulding: "تصنيف سبولدنغ",
    disinfectants: "المطهرات الشائعة",
    immediate: "الاستجابة الفورية",
    pep: "قرارات الوقاية بعد التعرض (PEP)",
    followUp: "فحوصات المتابعة",
    progress: (d: number, t: number) => `${d} من ${t} مكتمل`,
    clear: "مسح",
    checklistHint: "أشّر على كل عنصر لتدقيق اليوم — ما يتخزن شي.",
  },
};

const groups: OrganismGroup[] = ["Gram+", "Gram-", "Virus", "Fungi"];
const primary = (p: Precaution[]) => p[0];
const bundleItems = bundles.reduce((n, b) => n + b.items.length, 0);

const PrecautionBadge = ({ p, label }: { p: Precaution; label: string }) => (
  <Badge variant="outline" className="gap-1.5">
    <span className="h-2 w-2 rounded-full" style={{ background: PRECAUTION_COLOR[p] }} aria-hidden="true" />
    {label}
  </Badge>
);

const InfectionGuide = () => {
  const { language } = usePreferences();
  const tx = TEXT[language];
  const [query, setQuery] = useState("");
  const [precaution, setPrecaution] = useState<Precaution | null>(null);
  const [group, setGroup] = useState("all");

  const counts = PRECAUTION_ORDER.map((p) => ({ p, count: organisms.filter((o) => primary(o.precautions) === p).length }));
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return organisms.filter(
      (o) =>
        (!precaution || o.precautions.includes(precaution)) &&
        (group === "all" || o.group === group) &&
        (!needle || [o.name, o.infections, o.transmission].some((x) => x.toLowerCase().includes(needle))),
    );
  }, [query, precaution, group]);
  const reset = () => {
    setQuery("");
    setPrecaution(null);
    setGroup("all");
  };

  return (
    <AppLayout illustration="infection" title={tx.title} subtitle={tx.subtitle}>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Biohazard} tone="primary" label={tx.organisms} value={organisms.length} />
        <StatTile icon={ShieldCheck} label={tx.precautionTypes} value={PRECAUTION_ORDER.length} />
        <StatTile icon={ClipboardCheck} tone="good" label={tx.bundles} value={bundles.length} />
        <StatTile icon={Hand} label={tx.bundleItems} value={bundleItems} />
      </section>

      <Tabs defaultValue="isolation" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-4 gap-1 sm:grid-cols-7">
          {(Object.keys(tx.tabs) as (keyof typeof tx.tabs)[]).map((k) => (
            <TabsTrigger key={k} value={k} className="px-1 text-[11px] sm:text-xs">
              {tx.tabs[k]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="isolation" className="space-y-4">
          <p className="rounded-2xl border border-primary/30 bg-primary/5 p-3 text-sm">{tx.standardAlways}</p>
          <div className="grid items-start gap-3 md:grid-cols-2">
            {PRECAUTION_ORDER.map((p) => (
              <section key={p} className="space-y-2 rounded-3xl border bg-card p-4" style={{ borderInlineStartWidth: 4, borderInlineStartColor: PRECAUTION_COLOR[p] }}>
                <h2 className="font-semibold">{tx.precaution[p]}</h2>
                <dl className="space-y-1.5 text-sm">
                  {(["ppe", "room", "examples"] as const).map((k) => (
                    <div key={k}>
                      <dt className="text-xs font-medium text-muted-foreground">{tx[k]}</dt>
                      <dd dir="ltr" className="text-start">{PRECAUTIONS[p][k]}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
          <SourceNote ids={["hicpac-2007", "cdc-covid-ipc"]} />
        </TabsContent>

        <TabsContent value="ppe" className="space-y-4">
          <div className="grid items-start gap-3 md:grid-cols-2">
            <section className="space-y-3 rounded-3xl border bg-card p-4">
              <h2 className="font-semibold">{tx.donning}</h2>
              <div dir="ltr" className="text-start">
                <StepTimeline steps={DONNING.map((title) => ({ title }))} />
              </div>
            </section>
            <section className="space-y-3 rounded-3xl border bg-card p-4">
              <h2 className="font-semibold">{tx.doffing}</h2>
              <div dir="ltr" className="text-start">
                <StepTimeline steps={DOFFING.map((title) => ({ title, tone: title === "Hand hygiene" ? "good" : "default" }))} />
              </div>
            </section>
          </div>
          <section className="rounded-3xl border bg-card p-4">
            <h2 className="font-semibold">{tx.n95}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{tx.n95Body}</p>
          </section>
          <SourceNote ids={["hicpac-2007"]} />
        </TabsContent>

        <TabsContent value="hands" className="space-y-4">
          <div className="grid items-start gap-3 md:grid-cols-2">
            <section className="space-y-3 rounded-3xl border bg-card p-4">
              <h2 className="font-semibold">{tx.moments}</h2>
              <div dir="ltr" className="text-start">
                <StepTimeline steps={FIVE_MOMENTS.map((title) => ({ title }))} />
              </div>
            </section>
            <section className="space-y-3 rounded-3xl border bg-card p-4">
              <h2 className="font-semibold">{tx.duration}</h2>
              <RangeLanes
                ariaLabel={tx.duration}
                domain={[0, 60]}
                ticks={[0, 20, 30, 40, 60]}
                unit="s"
                rows={[
                  { key: "rub", label: "Alcohol rub", min: 20, max: 30, color: "var(--viz-1)" },
                  { key: "wash", label: "Soap & water", min: 40, max: 60, color: "var(--viz-3)" },
                ]}
              />
              <p className="text-[11px] text-muted-foreground">{tx.durationNote}</p>
            </section>
          </div>
          <p role="note" className="flex items-start gap-2 rounded-2xl border border-medical-red/40 bg-medical-red/10 p-3 text-sm text-medical-red">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {tx.cdiff}
          </p>
          <SourceNote ids={["who-hand-hygiene", "idsa-cdi"]} />
        </TabsContent>

        <TabsContent value="bundles" className="space-y-3">
          <p className="text-xs text-muted-foreground">{tx.checklistHint}</p>
          <div className="grid items-start gap-3 md:grid-cols-2">
            {bundles.map((b) => (
              <section key={b.key} className="space-y-3 rounded-3xl border bg-card p-4">
                <h2 className="font-semibold">{b.name}</h2>
                <Checklist items={b.items} progress={tx.progress} clear={tx.clear} />
              </section>
            ))}
          </div>
          <SourceNote ids={["shea-2022", "cdc-ssi"]} />
        </TabsContent>

        <TabsContent value="organisms" className="space-y-4">
          <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
            <h2 className="text-sm font-semibold">{tx.byPrecaution}</h2>
            <DistributionBar
              ariaLabel={tx.byPrecaution}
              segments={counts.filter((c) => c.count > 0).map((c) => ({ key: c.p, label: tx.precaution[c.p], count: c.count, color: PRECAUTION_COLOR[c.p] }))}
              selected={precaution}
              onSelect={(k) => setPrecaution((prev) => (prev === k ? null : (k as Precaution)))}
            />
            <div className="relative">
              <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tx.search} aria-label={tx.search} className="h-11 rounded-2xl ps-11" />
            </div>
            <FilterChips
              ariaLabel={tx.organisms}
              value={group}
              onChange={setGroup}
              options={[{ value: "all", label: tx.all, count: organisms.length }, ...groups.map((g) => ({ value: g, label: g, count: organisms.filter((o) => o.group === g).length }))]}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {tx.showing} <span className="font-semibold tabular-nums text-foreground">{filtered.length}</span> / {organisms.length}
                {precaution && <> · {tx.precaution[precaution]}</>}
              </span>
              {(query || precaution || group !== "all") && (
                <Button size="sm" variant="ghost" onClick={reset}>
                  {tx.reset}
                </Button>
              )}
            </div>
          </section>
          {filtered.length === 0 ? (
            <EmptyState variant="no-results" title={tx.empty} action={<Button onClick={reset}>{tx.reset}</Button>} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((o) => (
                <section key={o.name} className="space-y-2 rounded-3xl border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 dir="ltr" className="text-start font-semibold leading-tight">{o.name}</h3>
                    <span dir="ltr" className="text-[11px] text-muted-foreground">{o.group} · {o.stain}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {o.precautions.map((p) => (
                      <PrecautionBadge key={p} p={p} label={tx.precaution[p]} />
                    ))}
                  </div>
                  <dl className="space-y-1 text-sm">
                    {(["transmission", "infections", "treatment", "resistance"] as const).map((k) => (
                      <div key={k} className="grid grid-cols-[minmax(0,7rem)_1fr] gap-2">
                        <dt className="text-xs text-muted-foreground">{tx[k]}</dt>
                        <dd dir="ltr" className="text-start text-xs">{o[k]}</dd>
                      </div>
                    ))}
                  </dl>
                  <p dir="ltr" className="rounded-xl bg-medical-yellow/10 p-2 text-start text-xs">{o.alert}</p>
                </section>
              ))}
            </div>
          )}
          <SourceNote ids={INFECTION_SOURCES} />
        </TabsContent>

        <TabsContent value="disinfection" className="space-y-4">
          <section className="space-y-3 rounded-3xl border bg-card p-4">
            <h2 className="font-semibold">{tx.spaulding}</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {SPAULDING.map((s, i) => (
                <div key={s.level} dir="ltr" className={cn("rounded-2xl border p-3 text-start", i === 0 ? "border-medical-red/40 bg-medical-red/5" : i === 1 ? "border-medical-yellow/40 bg-medical-yellow/5" : "bg-secondary/40")}>
                  <p className="font-semibold">{s.level}</p>
                  <p className="text-xs text-muted-foreground">{s.contact}</p>
                  <p className="mt-1 text-sm font-medium">→ {s.process}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-2 rounded-3xl border bg-card p-4">
            <h2 className="font-semibold">{tx.disinfectants}</h2>
            <ul dir="ltr" className="list-disc space-y-1 ps-5 text-start text-sm text-muted-foreground">
              {DISINFECTANTS.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
          <SourceNote ids={["cdc-disinfection"]} />
        </TabsContent>

        <TabsContent value="exposure" className="space-y-4">
          <div className="grid items-start gap-3 md:grid-cols-2">
            <section className="space-y-3 rounded-3xl border bg-card p-4">
              <h2 className="flex items-center gap-2 font-semibold">
                <Syringe size={16} className="text-medical-red" aria-hidden="true" /> {tx.immediate}
              </h2>
              <div dir="ltr" className="text-start">
                <StepTimeline steps={EXPOSURE_STEPS.map((title, i) => ({ title, tone: i < 4 ? "critical" : "default" }))} />
              </div>
            </section>
            <div className="space-y-3">
              <section className="space-y-2 rounded-3xl border bg-card p-4">
                <h2 className="font-semibold">{tx.pep}</h2>
                <dl dir="ltr" className="space-y-2 text-start text-sm">
                  {PEP.map((p) => (
                    <div key={p.source} className="rounded-2xl bg-secondary/40 p-2.5">
                      <dt className="font-medium">{p.source}</dt>
                      <dd className="text-xs text-muted-foreground">{p.action}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section className="space-y-3 rounded-3xl border bg-card p-4">
                <h2 className="font-semibold">{tx.followUp}</h2>
                <div dir="ltr" className="text-start">
                  <StepTimeline steps={FOLLOW_UP.map((f) => ({ title: f.when, body: f.what }))} />
                </div>
              </section>
            </div>
          </div>
          <SourceNote ids={["usphs-pep", "cdc-hcv-exposure"]} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default InfectionGuide;
