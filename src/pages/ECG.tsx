import { useMemo, useState } from "react";
import { Activity, Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePreferences } from "@/contexts/PreferencesContext";
import ecgI18n from "@/data/ecg-i18n.json";

type Language = "en" | "ar";
type Severity = "BENIGN" | "MONITOR" | "URGENT" | "LIFE_THREATENING";

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

const severityStyles: Record<Severity, string> = {
  BENIGN: "border-emerald-400/40 bg-emerald-500/20 text-emerald-100",
  MONITOR: "border-yellow-400/40 bg-yellow-500/20 text-yellow-100",
  URGENT: "border-orange-400/40 bg-orange-500/20 text-orange-100",
  LIFE_THREATENING: "border-red-400/50 bg-red-500/25 text-red-100 animate-pulse",
};

const categoryStyles: Record<string, string> = {
  NORMAL_BASICS: "border-cyan-400/40 bg-cyan-500/15 text-cyan-100",
  ATRIAL: "border-indigo-400/40 bg-indigo-500/20 text-indigo-100",
  JUNCTIONAL: "border-violet-400/40 bg-violet-500/20 text-violet-100",
  VENTRICULAR: "border-rose-400/40 bg-rose-500/20 text-rose-100",
  BLOCKS: "border-amber-400/40 bg-amber-500/20 text-amber-100",
  ST: "border-fuchsia-400/40 bg-fuchsia-500/20 text-fuchsia-100",
  LIFE: "border-red-400/50 bg-red-500/20 text-red-100",
  PACEMAKER: "border-pink-400/40 bg-pink-500/20 text-pink-100",
  ELECTROLYTE: "border-teal-400/40 bg-teal-500/20 text-teal-100",
  PEDIATRIC: "border-sky-400/40 bg-sky-500/20 text-sky-100",
};

const EcgWave = ({ type }: { type: string }) => {
  const path =
    type === "vf"
      ? "M2 35 C8 5, 14 65, 20 30 C26 10, 32 60, 38 24 C44 8, 50 62, 56 30 C62 10, 68 55, 74 32 C80 12, 86 58, 98 34"
      : type === "vt" || type === "tachy"
      ? "M2 32 L12 32 L16 10 L20 50 L24 8 L28 42 L32 32 L42 32 L46 8 L50 50 L54 10 L58 42 L62 32 L72 32 L76 8 L80 50 L84 10 L90 32 L98 32"
      : type === "torsades"
      ? "M2 32 C10 8, 18 56, 26 30 C34 14, 42 50, 50 30 C58 20, 66 44, 74 32 C82 24, 90 40, 98 30"
      : type === "st_elev"
      ? "M2 32 L16 32 L20 10 L24 52 L28 20 L36 20 L44 20 L52 20 L60 20 L68 32 L78 32 L84 18 L90 32 L98 32"
      : type === "st_depress"
      ? "M2 32 L16 32 L20 10 L24 52 L28 36 L36 36 L44 36 L52 36 L60 36 L68 32 L78 32 L84 16 L90 32 L98 32"
      : type === "t_peaked"
      ? "M2 32 L16 32 L20 10 L24 52 L28 32 L38 32 L46 10 L54 32 L62 32 L72 32 L80 8 L88 32 L98 32"
      : type === "paced_vent" || type === "paced_atrial"
      ? "M2 32 L10 32 L10 8 L12 32 L20 32 L24 10 L28 52 L32 22 L40 32 L48 32 L48 8 L50 32 L58 32 L62 10 L66 52 L70 22 L78 32 L98 32"
      : type === "flutter"
      ? "M2 32 L8 24 L14 32 L20 24 L26 32 L32 24 L38 32 L44 24 L50 32 L56 24 L62 32 L68 24 L74 32 L80 24 L86 32 L98 32"
      : "M2 32 L16 32 L20 10 L24 52 L28 18 L36 32 L48 32 L52 10 L56 52 L60 18 L68 32 L80 32 L84 10 L88 52 L92 18 L98 32";

  return (
    <svg viewBox="0 0 100 64" className="h-14 w-full rounded-xl border border-white/10 bg-[#061427]/60 p-1">
      <polyline points="0,32 100,32" stroke="#0b3856" strokeWidth="0.8" fill="none" />
      <path d={path} stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="15" cy="32" r="1.5" fill="#22d3ee" />
      <circle cx="72" cy="32" r="1.5" fill="#14b8a6" />
      {(type === "st_elev" || type === "st_depress") && <rect x="36" y="18" width="22" height="4" fill="#eab308" opacity="0.8" />}
      {(type === "paced_vent" || type === "paced_atrial") && <line x1="10" y1="8" x2="10" y2="32" stroke="#ec4899" strokeWidth="2" />}
    </svg>
  );
};

const ECG = () => {
  const { language, direction } = usePreferences();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const copy = ecgI18n[language as Language];
  const rhythms = ecgI18n.rhythms as Rhythm[];

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rhythms.filter((r) => {
      const matchesCategory = category === "ALL" || r.category === category || (category === "LIFE" && r.severity === "LIFE_THREATENING");
      const matchesSearch =
        !needle ||
        r.nameEn.toLowerCase().includes(needle) ||
        r.nameAr.toLowerCase().includes(needle) ||
        r.characteristics.toLowerCase().includes(needle) ||
        r.interventions.join(" ").toLowerCase().includes(needle);
      return matchesCategory && matchesSearch;
    });
  }, [category, rhythms, search]);

  return (
    <AppLayout title={copy.title} subtitle={copy.subtitle}>
      <section dir={direction} className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 rtl:left-auto rtl:right-4" size={18} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 text-white rtl:pl-4 rtl:pr-12"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(copy.categories).map(([key, label]) => (
            <Button
              key={key}
              onClick={() => setCategory(key)}
              size="sm"
              variant="outline"
              className={`rounded-full border px-4 py-2 text-[10px] tracking-widest ${
                category === key ? "border-primary/50 bg-primary/30 text-white" : "border-white/20 text-muted-foreground"
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      <Tabs defaultValue="rhythms" className="space-y-4">
        <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-card/70 p-2 md:grid-cols-4">
          <TabsTrigger value="rhythms">{copy.tabs.rhythms}</TabsTrigger>
          <TabsTrigger value="read">{copy.tabs.howToRead}</TabsTrigger>
          <TabsTrigger value="acls">{copy.tabs.acls}</TabsTrigger>
          <TabsTrigger value="tips">{copy.tabs.tips}</TabsTrigger>
        </TabsList>

        <TabsContent value="rhythms" className="space-y-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">{copy.labels.noResults}</p>}
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((rhythm) => (
              <Dialog key={rhythm.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer rounded-3xl border border-white/10 bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white">{rhythm.nameEn}</p>
                        <p className="text-sm text-cyan-100">{rhythm.nameAr}</p>
                      </div>
                      <Badge className={`border ${severityStyles[rhythm.severity]}`}>{copy.severity[rhythm.severity]}</Badge>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge className={`border ${categoryStyles[rhythm.category] ?? "border-white/20 bg-white/10 text-white"}`}>
                        {copy.categories[rhythm.category as keyof typeof copy.categories]}
                      </Badge>
                      <Badge className="border-white/20 bg-white/10 text-white">{copy.labels.rate}: {rhythm.rate}</Badge>
                    </div>
                    <EcgWave type={rhythm.wave} />
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950 text-white sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{rhythm.nameEn}</DialogTitle>
                    <DialogDescription className="text-cyan-100">{rhythm.nameAr}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-cyan-200">{copy.labels.category}:</span> {copy.categories[rhythm.category as keyof typeof copy.categories]}</p>
                    <p><span className="text-cyan-200">{copy.labels.rate}:</span> {rhythm.rate}</p>
                    <p><span className="text-cyan-200">{copy.labels.characteristics}:</span> {rhythm.characteristics}</p>
                    <div>
                      <p className="mb-1 text-cyan-200">{copy.labels.interventions}:</p>
                      <ul className="list-disc space-y-1 ps-5">
                        {rhythm.interventions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <p>
                      <span className="text-cyan-200">{copy.labels.tips}:</span>{" "}
                      {language === "ar" ? rhythm.tipsAr : rhythm.tipsEn}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="read" className="space-y-3">
          {copy.howToReadSteps.map((step) => (
            <details key={step.step} className="rounded-2xl border border-white/10 bg-card/70 p-4">
              <summary className="cursor-pointer list-none font-semibold text-white">
                {step.step}. {step.title}
              </summary>
              <div className="mt-2 text-sm text-slate-200">
                <p>{step.check}</p>
                <p className="mt-2 text-cyan-100">{language === "ar" ? "الطبيعي: قارن مع القيم المرجعية وخذ السياق السريري." : "Normal: Compare against reference values and clinical context."}</p>
                <Activity className="mt-3 text-cyan-300" size={16} />
              </div>
            </details>
          ))}
        </TabsContent>

        <TabsContent value="acls" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {copy.acls.map((algo) => (
              <Card key={algo.title} className="rounded-3xl border-white/10 bg-card/70 p-4">
                <p className="font-semibold text-white">{algo.title}</p>
                <p className="text-xs text-cyan-100">{algo.subtitle}</p>
                <ol className="mt-3 list-decimal space-y-1 ps-5 text-sm text-slate-100">
                  {algo.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
          <Card className="rounded-3xl border-red-400/20 bg-red-500/10 p-4">
            <p className="font-semibold text-red-100">{copy.labels.hAndTs}</p>
            <div className="mt-2 grid gap-2 text-sm text-red-50 md:grid-cols-2">
              {copy.hsTs.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {copy.clinicalTips.map((tip) => (
              <Card key={tip.title} className="rounded-3xl border-white/10 bg-card/70 p-4">
                <p className="font-semibold text-white">{tip.title}</p>
                <p className="mt-2 text-sm text-slate-200">{tip.content}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default ECG;
