import { useParams, useNavigate } from "react-router-dom";
import { procedures, additionalProcedures } from "@/data/procedures";
import { AlertCircle, CheckCircle2, GraduationCap, Info, Package, ShieldAlert, Stethoscope, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import AppLayout from "@/components/layout/AppLayout";

const ProcedureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = usePreferences();

  const allProcedures = [...procedures, ...additionalProcedures];
  const procedure = allProcedures.find(p => p.id === id);

  if (!procedure) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Procedure not found</p>
          <Button onClick={() => navigate("/procedures")} className="mt-4">
            {t.backToProcedures}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      title={procedure.title}
      subtitle={procedure.category}
      onBack={() => navigate("/procedures")}
      className="space-y-4"
    >
        {procedure.definition && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-primary" size={20} />
              <h2 className="font-bold text-card-foreground">{t.definition}</h2>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{procedure.definition}</p>
          </div>
        )}

        {procedure.indications && procedure.indications.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-medical-green" size={20} />
              <h2 className="font-bold text-card-foreground">{t.indications}</h2>
            </div>
            <ul className="space-y-2">
              {procedure.indications.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-medical-green mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {procedure.contraindications && procedure.contraindications.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-medical-red" size={20} />
              <h2 className="font-bold text-card-foreground">{t.contraindications}</h2>
            </div>
            <ul className="space-y-2">
              {procedure.contraindications.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-medical-red mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {procedure.equipment && procedure.equipment.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Package className="text-primary" size={20} />
              <h2 className="font-bold text-card-foreground">{t.equipment}</h2>
            </div>
            <ul className="space-y-2">
              {procedure.equipment.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {procedure.steps && procedure.steps.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="text-primary" size={20} />
              <h2 className="font-bold text-card-foreground">{t.steps}</h2>
            </div>
            <ol className="space-y-3">
              {procedure.steps.map((step, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {procedure.safetyAlerts && procedure.safetyAlerts.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="text-medical-red" size={20} />
              <h2 className="font-bold text-card-foreground">{t.safetyAlerts}</h2>
            </div>
            <ul className="space-y-2">
              {procedure.safetyAlerts.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-medical-red mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {procedure.complications && procedure.complications.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-medical-yellow" size={20} />
              <h2 className="font-bold text-card-foreground">{t.complications}</h2>
            </div>
            <ul className="space-y-2">
              {procedure.complications.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-medical-yellow mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {procedure.documentation && procedure.documentation.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-primary" size={20} />
              <h2 className="font-bold text-card-foreground">{t.documentation}</h2>
            </div>
            <ul className="space-y-2">
              {procedure.documentation.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {procedure.patientTeaching && procedure.patientTeaching.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="text-primary" size={20} />
              <h2 className="font-bold text-card-foreground">{t.patientTeaching}</h2>
            </div>
            <ul className="space-y-2">
              {procedure.patientTeaching.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </AppLayout>
  );
};

export default ProcedureDetail;
