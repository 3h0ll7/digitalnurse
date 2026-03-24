import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { translations } from "@/lib/i18n";

type Translation = (typeof translations)["en"];

type CalculatorField = {
  id: string;
  label: string;
  type: "number" | "select";
  options?: string[];
};

type CalculatorValues = Record<string, number | string>;

type CalculatorDefinition = {
  name: string;
  fields: CalculatorField[];
  calculate: (values: CalculatorValues) => string;
};

const getNumericValue = (value: number | string | undefined) => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? 0 : value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const getCalculators = (t: Translation): Record<string, CalculatorDefinition> => ({
  dosage: {
    name: t.dosageCalculation,
    fields: [
      { id: "ordered", label: t.orderedDose, type: "number" },
      { id: "available", label: t.availableDose, type: "number" },
      { id: "volume", label: t.volumeAvailable, type: "number" },
    ],
    calculate: (values) => {
      const ordered = getNumericValue(values.ordered);
      const available = getNumericValue(values.available);
      const volume = getNumericValue(values.volume);
      if (available === 0) {
        return t.availableDoseError;
      }
      const dose = (ordered / available) * volume;
      return `${t.administer} ${dose.toFixed(2)} mL`;
    },
  },
  "iv-drip": {
    name: t.ivDripRate,
    fields: [
      { id: "volume", label: t.totalVolume, type: "number" },
      { id: "time", label: t.timeHours, type: "number" },
      { id: "dropFactor", label: t.dropFactor, type: "number" },
    ],
    calculate: (values) => {
      const volume = getNumericValue(values.volume);
      const time = getNumericValue(values.time);
      const dropFactor = getNumericValue(values.dropFactor);
      if (time === 0) {
        return t.timeError;
      }
      const mlPerHour = volume / time;
      const dropsPerMin = (mlPerHour * dropFactor) / 60;
      return `${t.rate} ${mlPerHour.toFixed(1)} ${t.mlHr} / ${dropsPerMin.toFixed(0)} ${t.dropsMin}`;
    },
  },
  bmi: {
    name: t.bmiCalculator,
    fields: [
      { id: "weight", label: t.weightKg, type: "number" },
      { id: "height", label: t.heightCm, type: "number" },
    ],
    calculate: (values) => {
      const heightM = getNumericValue(values.height) / 100;
      const weight = getNumericValue(values.weight);
      if (heightM === 0) {
        return t.heightError;
      }
      const bmi = weight / (heightM * heightM);
      let category = "";
      if (bmi < 18.5) category = t.underweight;
      else if (bmi < 25) category = t.normalWeight;
      else if (bmi < 30) category = t.overweight;
      else category = t.obese;
      return `${t.bmiLabel} ${bmi.toFixed(1)} - ${category}`;
    },
  },
  creatinine: {
    name: t.creatinineClearance,
    fields: [
      { id: "age", label: t.ageYears, type: "number" },
      { id: "weight", label: t.weightKg, type: "number" },
      { id: "creatinine", label: t.serumCreatinine, type: "number" },
      { id: "sex", label: t.sexLabel, type: "select", options: [t.male, t.female] },
    ],
    calculate: (values) => {
      const age = getNumericValue(values.age);
      const weight = getNumericValue(values.weight);
      const creatinine = getNumericValue(values.creatinine);
      if (creatinine === 0) {
        return t.serumCreatinineError;
      }
      const femaleAdjustment = values.sex === t.female ? 0.85 : 1;
      const ccr = ((140 - age) * weight) / (72 * creatinine) * femaleAdjustment;
      return `${t.creatinineClearanceResult} ${ccr.toFixed(1)} mL/min`;
    },
  },
});

const CalculatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = usePreferences();
  const [result, setResult] = useState<string>("");
  const [values, setValues] = useState<CalculatorValues>({});

  const calculators = useMemo(() => getCalculators(t), [t]);
  const calculator = id ? calculators[id] : undefined;

  if (!calculator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>{t.calculatorNotFound}</p>
      </div>
    );
  }

  const handleCalculate = () => {
    const result = calculator.calculate(values);
    setResult(result);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/calculators")}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{calculator.name}</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-4 space-y-4">
          {calculator.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === "select" ? (
                <select
                  id={field.id}
                  className="w-full p-2 border rounded-md bg-background"
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                  }
                >
                  <option value="">{t.selectOption}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues((prev) => ({
                      ...prev,
                      [field.id]: value === "" ? "" : Number(value),
                    }));
                  }}
                />
              )}
            </div>
          ))}

          <Button onClick={handleCalculate} className="w-full">
            {t.calculate}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-medical-blue-light rounded-lg">
              <p className="font-bold text-primary text-lg">{result}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CalculatorDetail;
