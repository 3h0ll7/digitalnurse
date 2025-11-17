export interface LabValue {
  test: string;
  normalRange: string;
  unit: string;
  criticalLow?: string;
  criticalHigh?: string;
  category: string;
}

export const labValues: LabValue[] = [
  // Hematology
  {
    test: "Hemoglobin (Hgb)",
    normalRange: "Male: 13.5-17.5, Female: 12.0-15.5",
    unit: "g/dL",
    criticalLow: "<7.0",
    criticalHigh: ">20.0",
    category: "Hematology"
  },
  {
    test: "Hematocrit (Hct)",
    normalRange: "Male: 38.8-50.0, Female: 34.9-44.5",
    unit: "%",
    criticalLow: "<20",
    criticalHigh: ">60",
    category: "Hematology"
  },
  {
    test: "White Blood Cells (WBC)",
    normalRange: "4.5-11.0",
    unit: "× 10³/μL",
    criticalLow: "<2.0",
    criticalHigh: ">30.0",
    category: "Hematology"
  },
  {
    test: "Platelets",
    normalRange: "150-400",
    unit: "× 10³/μL",
    criticalLow: "<50",
    criticalHigh: ">1000",
    category: "Hematology"
  },
  {
    test: "Red Blood Cells (RBC)",
    normalRange: "Male: 4.5-5.9, Female: 4.0-5.2",
    unit: "× 10⁶/μL",
    category: "Hematology"
  },
  
  // Chemistry
  {
    test: "Sodium (Na)",
    normalRange: "135-145",
    unit: "mEq/L",
    criticalLow: "<120",
    criticalHigh: ">160",
    category: "Chemistry"
  },
  {
    test: "Potassium (K)",
    normalRange: "3.5-5.0",
    unit: "mEq/L",
    criticalLow: "<2.5",
    criticalHigh: ">6.5",
    category: "Chemistry"
  },
  {
    test: "Chloride (Cl)",
    normalRange: "98-106",
    unit: "mEq/L",
    criticalLow: "<80",
    criticalHigh: ">120",
    category: "Chemistry"
  },
  {
    test: "Glucose",
    normalRange: "70-100 (fasting)",
    unit: "mg/dL",
    criticalLow: "<40",
    criticalHigh: ">400",
    category: "Chemistry"
  },
  {
    test: "Blood Urea Nitrogen (BUN)",
    normalRange: "7-20",
    unit: "mg/dL",
    category: "Chemistry"
  },
  {
    test: "Creatinine",
    normalRange: "Male: 0.7-1.3, Female: 0.6-1.1",
    unit: "mg/dL",
    criticalHigh: ">4.0",
    category: "Chemistry"
  },
  {
    test: "Calcium",
    normalRange: "8.5-10.5",
    unit: "mg/dL",
    criticalLow: "<6.5",
    criticalHigh: ">13.0",
    category: "Chemistry"
  },
  {
    test: "Magnesium",
    normalRange: "1.7-2.2",
    unit: "mg/dL",
    criticalLow: "<1.0",
    criticalHigh: ">4.0",
    category: "Chemistry"
  },
  
  // Liver Function
  {
    test: "ALT (SGPT)",
    normalRange: "7-56",
    unit: "U/L",
    category: "Liver Function"
  },
  {
    test: "AST (SGOT)",
    normalRange: "10-40",
    unit: "U/L",
    category: "Liver Function"
  },
  {
    test: "Alkaline Phosphatase",
    normalRange: "30-120",
    unit: "U/L",
    category: "Liver Function"
  },
  {
    test: "Total Bilirubin",
    normalRange: "0.1-1.2",
    unit: "mg/dL",
    criticalHigh: ">12.0",
    category: "Liver Function"
  },
  {
    test: "Albumin",
    normalRange: "3.5-5.0",
    unit: "g/dL",
    category: "Liver Function"
  },
  
  // Coagulation
  {
    test: "PT (Prothrombin Time)",
    normalRange: "11-13.5",
    unit: "seconds",
    category: "Coagulation"
  },
  {
    test: "INR",
    normalRange: "0.8-1.2",
    unit: "ratio",
    criticalHigh: ">5.0",
    category: "Coagulation"
  },
  {
    test: "aPTT",
    normalRange: "25-35",
    unit: "seconds",
    category: "Coagulation"
  },
  
  // Cardiac
  {
    test: "Troponin I",
    normalRange: "<0.04",
    unit: "ng/mL",
    category: "Cardiac"
  },
  {
    test: "BNP",
    normalRange: "<100",
    unit: "pg/mL",
    category: "Cardiac"
  },
  {
    test: "CK-MB",
    normalRange: "<5",
    unit: "ng/mL",
    category: "Cardiac"
  },
  
  // Lipid Panel
  {
    test: "Total Cholesterol",
    normalRange: "<200",
    unit: "mg/dL",
    category: "Lipids"
  },
  {
    test: "LDL",
    normalRange: "<100",
    unit: "mg/dL",
    category: "Lipids"
  },
  {
    test: "HDL",
    normalRange: "Male: >40, Female: >50",
    unit: "mg/dL",
    category: "Lipids"
  },
  {
    test: "Triglycerides",
    normalRange: "<150",
    unit: "mg/dL",
    category: "Lipids"
  },
  
  // Arterial Blood Gas
  {
    test: "pH",
    normalRange: "7.35-7.45",
    unit: "",
    criticalLow: "<7.20",
    criticalHigh: ">7.60",
    category: "ABG"
  },
  {
    test: "PaCO2",
    normalRange: "35-45",
    unit: "mmHg",
    criticalLow: "<20",
    criticalHigh: ">70",
    category: "ABG"
  },
  {
    test: "PaO2",
    normalRange: "80-100",
    unit: "mmHg",
    criticalLow: "<60",
    category: "ABG"
  },
  {
    test: "HCO3",
    normalRange: "22-26",
    unit: "mEq/L",
    criticalLow: "<15",
    criticalHigh: ">40",
    category: "ABG"
  },
  {
    test: "Oxygen Saturation",
    normalRange: "95-100",
    unit: "%",
    criticalLow: "<90",
    category: "ABG"
  },
  
  // Thyroid
  {
    test: "TSH",
    normalRange: "0.4-4.0",
    unit: "mIU/L",
    category: "Thyroid"
  },
  {
    test: "T4 (Thyroxine)",
    normalRange: "4.5-12.0",
    unit: "μg/dL",
    category: "Thyroid"
  },
  {
    test: "T3",
    normalRange: "80-200",
    unit: "ng/dL",
    category: "Thyroid"
  }
];
