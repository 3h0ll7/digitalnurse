import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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

const calculators: Record<string, CalculatorDefinition> = {
  dosage: {
    name: "Dosage Calculation",
    fields: [
      { id: "ordered", label: "Ordered Dose (mg)", type: "number" },
      { id: "available", label: "Available Dose (mg)", type: "number" },
      { id: "volume", label: "Volume Available (mL)", type: "number" },
    ],
    calculate: (values) => {
      const ordered = getNumericValue(values.ordered);
      const available = getNumericValue(values.available);
      const volume = getNumericValue(values.volume);
      if (available === 0) {
        return "Available dose must be greater than 0";
      }
      const dose = (ordered / available) * volume;
      return `Administer: ${dose.toFixed(2)} mL`;
    },
  },
  "iv-drip": {
    name: "IV Drip Rate",
    fields: [
      { id: "volume", label: "Total Volume (mL)", type: "number" },
      { id: "time", label: "Time (hours)", type: "number" },
      { id: "dropFactor", label: "Drop Factor (gtts/mL)", type: "number" },
    ],
    calculate: (values) => {
      const volume = getNumericValue(values.volume);
      const time = getNumericValue(values.time);
      const dropFactor = getNumericValue(values.dropFactor);
      if (time === 0) {
        return "Time must be greater than 0";
      }
      const mlPerHour = volume / time;
      const dropsPerMin = (mlPerHour * dropFactor) / 60;
      return `Rate: ${mlPerHour.toFixed(1)} mL/hr or ${dropsPerMin.toFixed(0)} drops/min`;
    },
  },
  bmi: {
    name: "BMI Calculator",
    fields: [
      { id: "weight", label: "Weight (kg)", type: "number" },
      { id: "height", label: "Height (cm)", type: "number" },
    ],
    calculate: (values) => {
      const heightM = getNumericValue(values.height) / 100;
      const weight = getNumericValue(values.weight);
      if (heightM === 0) {
        return "Height must be greater than 0";
      }
      const bmi = weight / (heightM * heightM);
      let category = "";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal weight";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";
      return `BMI: ${bmi.toFixed(1)} - ${category}`;
    },
  },
  creatinine: {
    name: "Creatinine Clearance",
    fields: [
      { id: "age", label: "Age (years)", type: "number" },
      { id: "weight", label: "Weight (kg)", type: "number" },
      { id: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number" },
      { id: "sex", label: "Sex", type: "select", options: ["Male", "Female"] },
    ],
    calculate: (values) => {
      const age = getNumericValue(values.age);
      const weight = getNumericValue(values.weight);
      const creatinine = getNumericValue(values.creatinine);
      if (creatinine === 0) {
        return "Serum creatinine must be greater than 0";
      }
      const femaleAdjustment = values.sex === "Female" ? 0.85 : 1;
      const ccr = ((140 - age) * weight) / (72 * creatinine) * femaleAdjustment;
      return `Creatinine Clearance: ${ccr.toFixed(1)} mL/min`;
    },
  },
};

const CalculatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<string>("");
  const calculator = id ? calculators[id] : undefined;
  const [values, setValues] = useState<CalculatorValues>({});

  if (!calculator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Calculator not found</p>
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
                  <option value="">Select...</option>
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
            Calculate
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
