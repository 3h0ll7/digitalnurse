import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, FileText, GraduationCap, ListChecks, Package, ShieldAlert } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import Checklist from "@/components/procedures/Checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/contexts/PreferencesContext";
import { procedures } from "@/data/procedures";
import { PROCEDURE_CATEGORY_LABELS, procText } from "@/data/procedures-text";
import { cn } from "@/lib/utils";

const TONES = {
  good: { box: "border-medical-green/30 bg-medical-green/5", icon: "text-medical-green" },
  critical: { box: "border-medical-red/30 bg-medical-red/5", icon: "text-medical-red" },
  warn: { box: "border-medical-yellow/30 bg-medical-yellow/5", icon: "text-medical-yellow" },
  default: { box: "bg-card", icon: "text-primary" },
} as const;

const ListCard = ({ title, items, icon, tone = "default" }: { title: string; items: string[]; icon: ReactNode; tone?: keyof typeof TONES }) =>
  items.length ? (
    <section className={cn("space-y-2 rounded-3xl border p-4", TONES[tone].box)}>
      <h2 className={cn("flex items-center gap-2 text-sm font-semibold", TONES[tone].icon)}>
        {icon}
        <span className="text-foreground">{title}</span>
      </h2>
      <ul dir="ltr" className="list-disc space-y-1.5 ps-5 text-start text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  ) : null;

const ProcedureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = usePreferences();
  const tx = procText[language];
  const back = () => navigate("/procedures");
  const p = procedures.find((x) => x.id === id);

  if (!p) {
    return (
      <AppLayout title={t.procedureNotFound} onBack={back}>
        <EmptyState variant="not-found" title={t.procedureNotFound} />
      </AppLayout>
    );
  }

  const category = PROCEDURE_CATEGORY_LABELS[p.category]?.[language] ?? p.category;

  return (
    <AppLayout illustration="icu" title={p.title} subtitle={category} onBack={back}>
      <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <p dir="ltr" className="text-start text-sm">{p.definition || p.description}</p>
        <ul className="flex flex-wrap gap-2 text-xs">
          {[
            { icon: ListChecks, label: tx.steps, value: p.steps.length, cls: "bg-primary/10 text-primary" },
            { icon: Package, label: tx.equipment, value: p.equipment.length, cls: "bg-secondary text-foreground" },
            { icon: ShieldAlert, label: tx.alerts, value: p.safetyAlerts.length, cls: "bg-medical-red/10 text-medical-red" },
          ].map(({ icon: Icon, label, value, cls }) => (
            <li key={label} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium", cls)}>
              <Icon size={13} aria-hidden="true" />
              <span className="tabular-nums">{value}</span> {label}
            </li>
          ))}
        </ul>
      </section>

      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-5 gap-1">
          {(["overview", "prepare", "steps", "safety", "after"] as const).map((k) => (
            <TabsTrigger key={k} value={k} className="px-1 text-[11px] sm:text-sm">
              {tx.tabs[k]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="grid gap-3 md:grid-cols-2">
          <ListCard title={t.indications} items={p.indications} icon={<CheckCircle2 size={16} aria-hidden="true" />} tone="good" />
          <ListCard title={t.contraindications} items={p.contraindications} icon={<AlertCircle size={16} aria-hidden="true" />} tone="warn" />
        </TabsContent>

        <TabsContent value="prepare">
          <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Package size={16} className="text-primary" aria-hidden="true" /> {t.equipment}
            </h2>
            <p className="text-xs text-muted-foreground">{tx.checklistHint}</p>
            <Checklist key={`${p.id}-eq`} items={p.equipment} progress={tx.progress} clear={tx.clear} />
          </section>
        </TabsContent>

        <TabsContent value="steps">
          <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ListChecks size={16} className="text-primary" aria-hidden="true" /> {t.steps}
            </h2>
            <p className="text-xs text-muted-foreground">{tx.checklistHint}</p>
            <Checklist key={`${p.id}-steps`} items={p.steps} numbered progress={tx.progress} clear={tx.clear} />
          </section>
        </TabsContent>

        <TabsContent value="safety" className="grid gap-3 md:grid-cols-2">
          <ListCard title={t.safetyAlerts} items={p.safetyAlerts} icon={<ShieldAlert size={16} aria-hidden="true" />} tone="critical" />
          <ListCard title={t.complications} items={p.complications} icon={<AlertCircle size={16} aria-hidden="true" />} tone="warn" />
        </TabsContent>

        <TabsContent value="after" className="grid gap-3 md:grid-cols-2">
          <ListCard title={t.documentation} items={p.documentation} icon={<FileText size={16} aria-hidden="true" />} />
          <ListCard title={t.patientTeaching} items={p.patientTeaching} icon={<GraduationCap size={16} aria-hidden="true" />} />
        </TabsContent>
      </Tabs>
      <p className="text-[11px] text-muted-foreground">{tx.sourceNote}</p>
    </AppLayout>
  );
};

export default ProcedureDetail;
