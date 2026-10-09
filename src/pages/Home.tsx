import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import IsometricHospital from "@/components/iso/IsometricHospital";
import { Nurse } from "@/components/iso/people";
import { usePreferences } from "@/contexts/PreferencesContext";
import { SECTIONS } from "@/lib/sections";
import { greetingKey } from "@/lib/theme";

const Home = () => {
  const navigate = useNavigate();
  const { t, language } = usePreferences();
  const greeting = {
    morning: t.greetingMorning,
    evening: t.greetingEvening,
    night: t.greetingNight,
  }[greetingKey(new Date())];
  const ai = SECTIONS.find((s) => s.key === "ai");

  return (
    <AppLayout title={greeting} subtitle={t.greetingPrompt}>
      {ai && (
        <button
          type="button"
          onClick={() => navigate(ai.path)}
          className="group flex w-full items-center gap-4 rounded-3xl border bg-card p-4 text-start shadow-card transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          <span className="flex h-14 w-14 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-secondary">
            <svg viewBox="-22 -104 44 106" className="h-14 w-12" aria-hidden="true" style={{ direction: "ltr" }}>
              <Nurse at={[0, 0]} scale={1} />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-foreground">{ai.title[language]}</span>
            <span className="block text-sm text-muted-foreground">{ai.description[language]}</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
        </button>
      )}

      <section aria-labelledby="hospital-heading" className="rounded-3xl border bg-card p-3 shadow-card sm:p-6">
        <h2 id="hospital-heading" className="sr-only">
          {language === "ar" ? "خريطة المستشفى" : "Hospital map"}
        </h2>
        <IsometricHospital onOpen={(section) => navigate(section.path)} />
      </section>

      <section aria-label={language === "ar" ? "كل الأقسام" : "All sections"} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.key}
              type="button"
              title={section.description[language]}
              onClick={() => navigate(section.path)}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-start transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 text-sm font-medium leading-tight text-foreground">{section.title[language]}</span>
            </button>
          );
        })}
      </section>
    </AppLayout>
  );
};

export default Home;
