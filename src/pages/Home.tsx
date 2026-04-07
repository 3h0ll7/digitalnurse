import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppLayout from "@/components/layout/AppLayout";
import { Activity, Bot, Brain, HeartPulse, Microscope, Pill, Sparkles, TestTube2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";

const Home = () => {
  const navigate = useNavigate();
  const { t } = usePreferences();

  const quickActions = [
    {
      title: t.proceduralPlaybooks,
      description: t.proceduralPlaybooksDesc,
      icon: Activity,
      action: t.browse,
      to: "/procedures",
    },
    {
      title: t.assessmentCoPilot,
      description: t.assessmentCoPilotDesc,
      icon: HeartPulse,
      action: t.launch,
      to: "/assessments",
    },
    {
      title: t.labIntelligence,
      description: t.labIntelligenceDesc,
      icon: TestTube2,
      action: t.review,
      to: "/labs",
    },
    {
      title: t.drugReference,
      description: t.drugReferenceDesc,
      icon: Pill,
      action: t.explore,
      to: "/drugs",
    },
  ];

  const workflowTiles = [
    {
      title: t.vascularAccess,
      tag: t.priority,
      signal: t.sterileKit,
      accent: "from-[#64FFE0] to-[#209EFF]",
      to: "/procedures",
    },
    {
      title: t.neuroChecks,
      tag: t.protocol,
      signal: t.gcsNihss,
      accent: "from-[#94B9FF] to-[#4D4DFF]",
      to: "/assessments",
    },
    {
      title: t.medicationMath,
      tag: t.tools,
      signal: t.titrateDrip,
      accent: "from-[#FFB7C5] to-[#FF5F8F]",
      to: "/calculators",
    },
  ];

  const insights = [
    {
      title: t.aiBedBrief,
      description: t.aiBedBriefDesc,
      icon: Bot,
      to: "/ai-assistant",
    },
    {
      title: t.mindMapsInsight,
      description: t.mindMapsInsightDesc,
      icon: Brain,
      to: "/mind-maps",
    },
    {
      title: t.flashcardsInsight,
      description: t.flashcardsInsightDesc,
      icon: Sparkles,
      to: "/flashcards",
    },
  ];

  const vitals = [
    { label: t.neuro, status: t.stable, progress: 84 },
    { label: t.hemodynamics, status: t.responsive, progress: 72 },
    { label: t.respiratory, status: t.escalate, progress: 63 },
  ];

  return (
    <AppLayout
      title={t.homeTitle}
      subtitle={t.homeSubtitle}
      actions={
        <Button
          onClick={() => navigate("/ai-assistant")}
          className="bg-gradient-to-r from-[#23D2FF] via-[#5F5CFF] to-[#8C79FF] text-white shadow-[0_20px_45px_rgba(44,178,255,0.35)]"
        >
          <Bot size={16} /> {t.engageAI}
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[1.35fr,0.65fr]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[220px] space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.futuristicCareOS}</p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  {t.homeHeroHeading}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t.homeHeroDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("/procedures")}
                  className="bg-white/90 text-background hover:bg-white"
                >
                  {t.exploreProcedures}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/labs")}
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  {t.viewLabIntelligence}
                </Button>
              </div>
            </div>
            <div className="min-w-[200px] flex-1">
              <div className="relative flex h-full items-center justify-center rounded-[28px] border border-white/10 bg-[#060E1E]/80 p-6 text-center animate-float">
                <div className="absolute inset-4 rounded-[24px] border border-white/5" />
                <img
                  src="/brand/digital-nurse-logo-neon.svg"
                  alt="Digital Nurse neon logo"
                  className="relative z-10 w-full max-w-[220px]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {workflowTiles.map((tile) => (
            <button
              key={tile.title}
              onClick={() => navigate(tile.to)}
              className={`group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br ${tile.accent} p-4 text-start text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]`}
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
                <span>{tile.tag}</span>
                <span className="text-white/70">{tile.signal}</span>
              </div>
              <p className="mt-3 text-2xl font-semibold">{tile.title}</p>
              <span className="mt-4 text-sm text-white/80">{t.enter}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.title}
              className="group flex flex-col gap-4 rounded-2xl border-white/10 bg-card/80 p-5 shadow-[0_15px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Icon className="text-primary" size={24} />
                </div>
                <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{action.action}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{action.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate(action.to)}
                className="justify-start px-0 text-primary hover:text-white"
              >
                {t.enterWorkspace}
              </Button>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <Card className="rounded-3xl border-white/5 bg-white/5 p-0 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center gap-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">{t.vitalsStreaming}</p>
              <h3 className="mt-2 text-3xl font-semibold">{t.fasterInterventions}</h3>
              <p className="mt-2 max-w-sm text-sm text-white/70">
                {t.vitalsDescription}
              </p>
            </div>
            <div className="ml-auto grid w-full max-w-xs gap-3 text-sm">
              {vitals.map((vital) => (
                <div key={vital.label} className="rounded-2xl border border-white/10 p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                    <span>{vital.label}</span>
                    <span>{vital.status}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#57FFE2] to-[#2A8DFF]"
                      style={{ width: `${vital.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card
                key={insight.title}
                className="flex items-start gap-4 rounded-3xl border-white/10 bg-card/80 p-5 text-white shadow-[0_15px_60px_rgba(0,0,0,0.4)]"
              >
                <span className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Icon size={22} />
                </span>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(insight.to)}
                    className="px-0 text-primary hover:text-white"
                  >
                    {t.open}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          { key: "labs", label: t.labsPreview },
          { key: "assessments", label: t.assessmentsPreview },
        ].map((item) => (
          <Card key={item.key} className="rounded-3xl border-dashed border-white/20 bg-transparent p-5 text-white">
            <Microscope className="text-primary" />
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-semibold">{t.seamlessIntelligence}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.seamlessIntelligenceDesc}
            </p>
          </Card>
        ))}
      </section>
    </AppLayout>
  );
};

export default Home;
