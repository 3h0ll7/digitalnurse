import { useParams, useNavigate } from "react-router-dom";
import { procedures, additionalProcedures } from "@/data/procedures";
import { ChevronLeft, AlertCircle, CheckCircle2, Package, Stethoscope, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProcedureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const allProcedures = [...procedures, ...additionalProcedures];
  const procedure = allProcedures.find(p => p.id === id);

  if (!procedure) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Procedure not found</p>
          <Button onClick={() => navigate("/procedures")} className="mt-4">
            Back to Procedures
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/procedures")}>
            <ChevronLeft size={24} />
          </button>
          <div>
            <div className="text-xs opacity-90">{procedure.category}</div>
            <h1 className="text-xl font-bold">{procedure.title}</h1>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-card p-4 rounded-xl shadow-card">
          <p className="text-card-foreground">{procedure.description}</p>
        </div>

        {procedure.indications && procedure.indications.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-medical-green" size={20} />
              <h2 className="font-bold text-card-foreground">Indications</h2>
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
              <h2 className="font-bold text-card-foreground">Contraindications</h2>
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
              <h2 className="font-bold text-card-foreground">Equipment Needed</h2>
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
              <h2 className="font-bold text-card-foreground">Procedure Steps</h2>
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

        {procedure.complications && procedure.complications.length > 0 && (
          <div className="bg-card p-4 rounded-xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-medical-yellow" size={20} />
              <h2 className="font-bold text-card-foreground">Potential Complications</h2>
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
              <h2 className="font-bold text-card-foreground">Documentation</h2>
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
      </div>
    </div>
  );
};

export default ProcedureDetail;
