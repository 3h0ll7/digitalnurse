import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Beaker, Bot, ClipboardCheck, HeartPulse, PlusCircle, Stethoscope } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { procedures, additionalProcedures } from "@/data/procedures";
import { labValues } from "@/data/labValues";
import { assessmentScales } from "@/data/assessmentScales";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = usePreferences();
  const procedureCount = procedures.length + additionalProcedures.length;
  const labCategoriesSet = useMemo(() => new Set(labValues.map((lab) => lab.category)), []);
  const assessmentCategories = useMemo(
    () => new Set(assessmentScales.map((scale) => scale.category)),
    []
  );

  const quickActions = [
    {
      title: t.startProcedure,
      description: t.browseChecklists,
      icon: Stethoscope,
      action: () => navigate("/procedures"),
    },
    {
      title: t.reviewLabs,
      description: t.criticalValuesTrending,
      icon: Beaker,
      action: () => navigate("/labs"),
    },
    {
      title: t.assessmentScales,
      description: t.neurologicalScreening,
      icon: ClipboardCheck,
      action: () => navigate("/assessments"),
    },
  ];

  const insights = [
    {
      label: t.proceduresLabel,
      value: procedureCount,
      subtext: t.bedsideWorkflows,
    },
    {
      label: t.labCategories,
      value: labCategoriesSet.size,
      subtext: t.withCriticalAlerts,
    },
    {
      label: t.assessmentTools,
      value: assessmentScales.length,
      subtext: t.evidenceBasedScales,
    },
  ];

  const recentProcedures = [...procedures, ...additionalProcedures].slice(0, 4);

  return (
    <AppLayout
      title={t.clinicalCommandCenter}
      subtitle={t.digitalNurseCompanion}
      actions={
        <Button size="sm" variant="secondary" onClick={() => navigate("/ai-assistant")}>
          <Bot size={16} className="mr-2" />
          {t.askAI}
        </Button>
      }
    >
      <section>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {insights.map((item) => (
            <Card key={item.label} className="p-4 shadow-card">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-card-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.subtext}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t.quickActions}</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/procedures")}>{t.viewAllWorkflows}</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
                onClick={action.action}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t.activeProcedureList}</h2>
          <Button size="sm" variant="outline" onClick={() => navigate("/procedures")}>{t.openBoard}</Button>
        </div>
        <div className="space-y-3">
          {recentProcedures.map((procedure) => (
            <Card
              key={procedure.id}
              className="p-4 shadow-card hover:shadow-card-hover cursor-pointer"
              onClick={() => navigate(`/procedure/${procedure.id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary/70">{procedure.category}</p>
                  <h3 className="font-semibold text-card-foreground">{procedure.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {procedure.description}
                  </p>
                </div>
                <HeartPulse className="text-primary" size={18} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t.labsAndAssessments}</h2>
          <Button size="sm" onClick={() => navigate("/labs")}>
            <Beaker size={16} className="mr-2" />
            {t.labs}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Beaker className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">{t.criticalWatchlist}</p>
                <p className="text-xl font-semibold text-card-foreground">{labCategoriesSet.size} {t.labDomains}</p>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => navigate("/labs")}>
              {t.reviewPanels}
            </Button>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">{t.bedsideScoring}</p>
                <p className="text-xl font-semibold text-card-foreground">{assessmentCategories.size} {t.domains}</p>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => navigate("/assessments")}>
              {t.launchAssessments}
            </Button>
          </Card>
        </div>
      </section>

      <section>
        <Card className="p-4 border-dashed border-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t.needHelpDocumenting}</p>
              <p className="text-lg font-semibold text-card-foreground">
                {t.summonAIAssistant}
              </p>
            </div>
            <Button onClick={() => navigate("/ai-assistant")}>
              <PlusCircle size={16} className="mr-2" />
              {t.startConsult}
            </Button>
          </div>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
