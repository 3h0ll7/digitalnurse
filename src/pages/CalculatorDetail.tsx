import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import { CALCULATORS } from "@/components/calculators/registry";
import { usePreferences } from "@/contexts/PreferencesContext";
import calculatorsI18n from "@/data/calculators-i18n.json";
import { calcText } from "@/data/calculators-text";

const CalculatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = usePreferences();
  const back = () => navigate("/calculators");
  const entry = CALCULATORS.find((c) => c.id === id);

  if (!entry) {
    const tx = calcText[language];
    return (
      <AppLayout title={tx.notFound} onBack={back}>
        <EmptyState variant="not-found" title={tx.notFoundBody} />
      </AppLayout>
    );
  }

  const { name, description } = calculatorsI18n[language].calculators[entry.id];
  const { Component } = entry;
  return (
    <AppLayout illustration="station" title={name} subtitle={description} onBack={back}>
      <Component />
    </AppLayout>
  );
};

export default CalculatorDetail;
