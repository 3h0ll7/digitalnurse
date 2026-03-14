import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/contexts/PreferencesContext";

type CalculatorValues = Record<string, number | string>;

const getNumericValue = (value: number | string | undefined) => {
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const CalculatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, direction } = usePreferences();
  const [result, setResult] = useState<string>("");
  const [values, setValues] = useState<CalculatorValues>({});

  type CalculatorField = {
    id: string;
    label: string;
    type: "number" | "select";
    options?: { value: string; label: string }[];
  };

  type CalculatorDefinition = {
    name: string;
    fields: CalculatorField[];
    calculate: (values: CalculatorValues) => string;
  };

  const calculators: Record<string, CalculatorDefinition> = {
    dosage: {
      name: t.dosageCalculation,
      fields: [
        { id: "ordered", label: t.orderedDose, type: "number" },
        { id: "available", label: t.availableDose, type: "number" },
        { id: "volume", label: t.volumeAvailable, type: "number" },
      ],
      calculate: (vals) => {
        const ordered = getNumericValue(vals.ordered);
        const available = getNumericValue(vals.available);
        const volume = getNumericValue(vals.volume);
        if (available === 0) return t.availableDoseError;
        const dose = (ordered / available) * volume;
        return `${t.administer}: ${dose.toFixed(2)} mL`;
      },
    },
    "iv-drip": {
      name: t.ivDripRate,
      fields: [
        { id: "volume", label: t.totalVolume, type: "number" },
        { id: "time", label: t.timeHours, type: "number" },
        { id: "dropFactor", label: t.dropFactor, type: "number" },
      ],
      calculate: (vals) => {
        const volume = getNumericValue(vals.volume);
        const time = getNumericValue(vals.time);
        const dropFactor = getNumericValue(vals.dropFactor);
        if (time === 0) return t.timeError;
        const mlPerHour = volume / time;
        const dropsPerMin = (mlPerHour * dropFactor) / 60;
        return `${t.rateResult}: ${mlPerHour.toFixed(1)} mL/hr | ${dropsPerMin.toFixed(0)} drops/min`;
      },
    },
    bmi: {
      name: t.bmiCalculator,
      fields: [
        { id: "weight", label: t.weightKg, type: "number" },
        { id: "height", label: t.heightCm, type: "number" },
      ],
      calculate: (vals) => {
        const heightM = getNumericValue(vals.height) / 100;
        const weight = getNumericValue(vals.weight);
        if (heightM === 0) return t.heightError;
        const bmi = weight / (heightM * heightM);
        let category = "";
        if (bmi < 18.5) category = t.underweight;
        else if (bmi < 25) category = t.normalWeight;
        else if (bmi < 30) category = t.overweight;
        else category = t.obese;
        return `BMI: ${bmi.toFixed(1)} - ${category}`;
      },
    },
    creatinine: {
      name: t.creatinineClearance,
      fields: [
        { id: "age", label: t.ageYears, type: "number" },
        { id: "weight", label: t.weightKg, type: "number" },
        { id: "creatinine", label: t.serumCreatinine, type: "number" },
        { id: "sex", label: t.sex, type: "select", options: [{ value: "Male", label: t.male }, { value: "Female", label: t.female }] },
      ],
      calculate: (vals) => {
        const age = getNumericValue(vals.age);
        const weight = getNumericValue(vals.weight);
        const creatinine = getNumericValue(vals.creatinine);
        if (creatinine === 0) return t.creatinineError;
        const femaleAdjustment = vals.sex === "Female" ? 0.85 : 1;
        const ccr = ((140 - age) * weight) / (72 * creatinine) * femaleAdjustment;
        return `${t.creatinineClearanceResult}: ${ccr.toFixed(1)} mL/min`;
      },
    },
  };

  const calculator = id ? calculators[id] : undefined;

  if (!calculator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t.calculatorNotFound}</p>
      </div>
    );
  }

  const handleCalculate = () => {
    setResult(calculator.calculate(values));
  };

  return (
    <div dir={direction} className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/calculators")}>
            <ChevronLeft size={24} className="rtl:rotate-180" />
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
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                >
                  <option value="">{t.select}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues((prev) => ({ ...prev, [field.id]: value === "" ? "" : Number(value) }));
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
