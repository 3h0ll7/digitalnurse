import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const CalculatorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<string>("");

  const calculators: { [key: string]: any } = {
    dosage: {
      name: "Dosage Calculation",
      fields: [
        { id: "ordered", label: "Ordered Dose (mg)", type: "number" },
        { id: "available", label: "Available Dose (mg)", type: "number" },
        { id: "volume", label: "Volume Available (mL)", type: "number" },
      ],
      calculate: (values: any) => {
        const dose = (values.ordered / values.available) * values.volume;
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
      calculate: (values: any) => {
        const mlPerHour = values.volume / values.time;
        const dropsPerMin = (mlPerHour * values.dropFactor) / 60;
        return `Rate: ${mlPerHour.toFixed(1)} mL/hr or ${dropsPerMin.toFixed(0)} drops/min`;
      },
    },
    bmi: {
      name: "BMI Calculator",
      fields: [
        { id: "weight", label: "Weight (kg)", type: "number" },
        { id: "height", label: "Height (cm)", type: "number" },
      ],
      calculate: (values: any) => {
        const heightM = values.height / 100;
        const bmi = values.weight / (heightM * heightM);
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
      calculate: (values: any) => {
        const ccr =
          ((140 - values.age) * values.weight) /
          (72 * values.creatinine) *
          (values.sex === "Female" ? 0.85 : 1);
        return `Creatinine Clearance: ${ccr.toFixed(1)} mL/min`;
      },
    },
  };

  const calculator = calculators[id || ""];
  const [values, setValues] = useState<{ [key: string]: any }>({});

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
          {calculator.fields.map((field: any) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === "select" ? (
                <select
                  id={field.id}
                  className="w-full p-2 border rounded-md bg-background"
                  onChange={(e) =>
                    setValues({ ...values, [field.id]: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {field.options.map((opt: string) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  onChange={(e) =>
                    setValues({ ...values, [field.id]: parseFloat(e.target.value) })
                  }
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
