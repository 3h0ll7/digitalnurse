import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { assessmentScales } from "@/data/assessmentScales";
import AppLayout from "@/components/layout/AppLayout";
import { usePreferences } from "@/contexts/PreferencesContext";

const ScaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = usePreferences();
  const scale = assessmentScales.find((s) => s.id === id);
  const [selections, setSelections] = useState<{ [key: string]: number }>({});

  if (!scale) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t.scaleNotFound}</p>
      </div>
    );
  }

  const totalScore = Object.values(selections).reduce((sum, val) => sum + val, 0);

  return (
    <AppLayout
      title={scale.name}
      subtitle={scale.category}
      onBack={() => navigate("/assessments")}
      className="space-y-4"
    >
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{scale.description}</p>
        </Card>

        {scale.components.map((component, idx) => (
          <Card key={idx} className="p-4">
            <h3 className="font-bold text-card-foreground mb-3">
              {component.factor}
            </h3>
            <div className="space-y-2">
              {component.options.map((option, optIdx) => (
                <label
                  key={optIdx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={component.factor}
                    value={option.points}
                    checked={selections[component.factor] === option.points}
                    onChange={() =>
                      setSelections({
                        ...selections,
                        [component.factor]: option.points,
                      })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <span className="text-sm">{option.description}</span>
                    <span className="ml-2 rtl:ml-0 rtl:mr-2 text-xs text-muted-foreground">
                      ({option.points} {option.points === 1 ? t.point : t.points})
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </Card>
        ))}

        {Object.keys(selections).length > 0 && (
          <Card className="p-4 bg-primary text-primary-foreground">
            <h3 className="font-bold text-lg mb-2">{t.totalScore}: {totalScore}</h3>
            {scale.interpretation && (
              <div className="mt-3 space-y-1">
                {scale.interpretation.map((line, idx) => (
                  <p key={idx} className="text-sm opacity-90">{line}</p>
                ))}
              </div>
            )}
          </Card>
        )}

        <Button onClick={() => setSelections({})} variant="outline" className="w-full">
          {t.reset}
        </Button>
    </AppLayout>
  );
};

export default ScaleDetail;
