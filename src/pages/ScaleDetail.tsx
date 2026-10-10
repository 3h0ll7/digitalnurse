import { useNavigate, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import CamIcu from "@/components/assessments/CamIcu";
import ItemsScale from "@/components/assessments/ItemsScale";
import Must from "@/components/assessments/Must";
import News2 from "@/components/assessments/News2";
import SourceNote from "@/components/data/SourceNote";
import { usePreferences } from "@/contexts/PreferencesContext";
import { assessmentScales } from "@/data/assessmentScales";
import { assessText, CATEGORY_LABELS } from "@/data/assessments-text";

const ScaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = usePreferences();
  const tx = assessText[language];
  const back = () => navigate("/assessments");
  const scale = assessmentScales.find((s) => s.id === id);

  if (!scale) {
    return (
      <AppLayout title={tx.notFound} onBack={back}>
        <EmptyState variant="not-found" title={tx.notFoundBody} />
      </AppLayout>
    );
  }

  return (
    <AppLayout illustration="triage" title={scale.short} subtitle={CATEGORY_LABELS[scale.category][language]} onBack={back}>
      <section className="space-y-1 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <p dir="ltr" className="text-start font-semibold">{scale.name}</p>
        <p dir="ltr" className="text-start text-sm text-muted-foreground">{scale.description}</p>
      </section>

      {scale.kind === "news2" ? <News2 scale={scale} /> : scale.kind === "must" ? <Must scale={scale} /> : scale.kind === "cam-icu" ? <CamIcu /> : <ItemsScale key={scale.id} scale={scale} />}

      {scale.notes && scale.notes.length > 0 && (
        <section className="space-y-2 rounded-3xl border bg-secondary/40 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <BookOpen size={16} className="text-primary" aria-hidden="true" /> {tx.notes}
          </h2>
          <ul dir="ltr" className="list-disc space-y-1 ps-5 text-start text-sm text-muted-foreground">
            {scale.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}
      <SourceNote ids={scale.sources} />
    </AppLayout>
  );
};

export default ScaleDetail;
