import { FileText, FolderHeart, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";
import { useDocsI18n } from "./DocsShared";

const DocsHub = () => {
  const navigate = useNavigate();
  const { copy, direction } = useDocsI18n();

  const cards = [
    { key: "patient", title: copy.patientDocumentation, icon: FolderHeart, route: "/docs/patient" },
    { key: "professional", title: copy.professionalRecords, icon: ShieldCheck, route: "/docs/professional" },
    { key: "tools", title: copy.smartTools, icon: Sparkles, route: "/docs/tools" },
  ];

  return (
    <AppLayout title={copy.hubTitle} subtitle={copy.hubSubtitle} badgeLabel="Documentation" subBadgeLabel="Bilingual AR/EN">
      <section dir={direction} className="space-y-5">
        <div className="rounded-3xl border border-cyan-400/20 bg-card/70 p-5 backdrop-blur-xl">
          <div className="relative">
            <FileText className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
            <Input className="h-11 pe-10" placeholder={copy.searchPlaceholder} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{copy.sectionLanding}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                onClick={() => navigate(card.route)}
                className="group rounded-3xl border border-white/10 bg-gradient-to-br from-card to-card/40 p-5 text-start shadow-[0_10px_60px_rgba(13,177,255,0.2)] transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="mt-6 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200">
                  <span>{copy.openSection}</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </AppLayout>
  );
};

export default DocsHub;
