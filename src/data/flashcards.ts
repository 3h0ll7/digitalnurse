export interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  tags: string[];
}

export const flashcards: Flashcard[] = [
  {
    id: "cardiac-1",
    topic: "Cardiac Assessment",
    question: "What is the priority intervention for a patient with suspected myocardial infarction arriving with chest pain?",
    answer:
      "Administer chewable aspirin (160-325 mg) after ruling out contraindications and activate the cath lab/EMS response while preparing for rapid ECG acquisition.",
    tags: ["ACS", "Emergency", "Medication"],
  },
  {
    id: "cardiac-2",
    topic: "Cardiac Rhythms",
    question: "Which rhythm requires immediate synchronized cardioversion when the patient has a pulse but is unstable?",
    answer:
      "Unstable supraventricular tachycardia or ventricular tachycardia with a pulse requires synchronized cardioversion after sedation if time permits.",
    tags: ["Telemetry", "V Tach", "SVT"],
  },
  {
    id: "cardiac-3",
    topic: "Heart Failure",
    question: "Name two key nursing assessments that detect fluid overload in acute decompensated heart failure.",
    answer:
      "Daily weights with >2 lb gain in 24 hours and auscultation revealing new crackles or S3 heart sounds indicate worsening fluid overload.",
    tags: ["Weights", "Lungs", "CHF"],
  },
  {
    id: "cardiac-4",
    topic: "Cardiac Pharmacology",
    question: "Which lab must be monitored closely when titrating IV heparin for a patient with pulmonary embolism?",
    answer:
      "Activated partial thromboplastin time (aPTT) every 6 hours until therapeutic, then daily, along with platelet counts to screen for HIT.",
    tags: ["Heparin", "Coagulation", "Labs"],
  },
  {
    id: "cardiac-5",
    topic: "Post-PCI Care",
    question: "What are the first signs of retroperitoneal bleeding after femoral access coronary intervention?",
    answer:
      "Sudden hypotension, tachycardia, and back/flank pain with a drop in hemoglobin indicate possible retroperitoneal bleeding and require rapid provider notification.",
    tags: ["Complication", "Bleeding", "Cath Lab"],
  },
  {
    id: "resp-1",
    topic: "Airway Management",
    question: "How should a nurse confirm endotracheal tube placement immediately after intubation?",
    answer:
      "Assess bilateral breath sounds, observe chest rise, use end-tidal CO₂ detection, and obtain a stat chest X-ray to confirm tip location 2-3 cm above the carina.",
    tags: ["Intubation", "Ventilation", "Critical Care"],
  },
  {
    id: "resp-2",
    topic: "COPD Exacerbation",
    question: "Which oxygen delivery device is preferred for a COPD patient needing controlled FiO₂?",
    answer:
      "A Venturi mask delivers precise FiO₂ and prevents knocking out hypoxic drive while titrating oxygen safely in COPD exacerbations.",
    tags: ["Venturi", "Oxygen", "COPD"],
  },
  {
    id: "resp-3",
    topic: "Asthma Management",
    question: "List the sequence for using rescue medications during status asthmaticus.",
    answer:
      "Initiate high-flow oxygen, administer rapid-acting inhaled beta₂-agonists plus anticholinergics, followed by systemic corticosteroids and prepare for magnesium sulfate if refractory.",
    tags: ["Emergency", "Bronchodilator", "Steroids"],
  },
  {
    id: "resp-4",
    topic: "Ventilator Alarms",
    question: "What does a high-pressure ventilator alarm usually indicate and what is the first nursing action?",
    answer:
      "It suggests increased airway resistance from secretions, biting, or kinked tubing; first assess the patient, silence the alarm, and suction or unkink as needed.",
    tags: ["Mechanical Vent", "Airway", "Assessment"],
  },
  {
    id: "resp-5",
    topic: "Pulmonary Embolism",
    question: "Which clinical triad should prompt rapid evaluation for pulmonary embolism?",
    answer:
      "Sudden dyspnea, pleuritic chest pain, and tachycardia (sometimes with unexplained hypoxia) should raise suspicion for pulmonary embolism.",
    tags: ["PE", "Assessment", "Vitals"],
  },
  {
    id: "neuro-1",
    topic: "Stroke Assessment",
    question: "Within what time frame should IV alteplase be initiated for eligible ischemic stroke patients?",
    answer:
      "Administer IV alteplase within 4.5 hours of last-known-well time after confirming no hemorrhage on CT and meeting inclusion criteria.",
    tags: ["Stroke", "Thrombolytic", "Time"],
  },
  {
    id: "neuro-2",
    topic: "ICP Monitoring",
    question: "Name three nursing interventions to decrease intracranial pressure.",
    answer:
      "Maintain head-of-bed 30 degrees, keep neck midline to promote venous return, and prevent coughing or Valsalva by providing sedation and stool softeners.",
    tags: ["Neuro ICU", "Positioning", "Sedation"],
  },
  {
    id: "neuro-3",
    topic: "Seizure Precautions",
    question: "What equipment must remain at bedside for a patient with new-onset seizures?",
    answer:
      "Keep oxygen, suction setup, and padding available; ensure IV access for benzodiazepines and document aura, duration, and postictal state.",
    tags: ["Safety", "Equipment", "Documentation"],
  },
  {
    id: "neuro-4",
    topic: "Spinal Cord Injury",
    question: "Which assessment finding suggests neurogenic shock after high cervical injury?",
    answer:
      "Bradycardia with hypotension and warm, dry skin below the lesion indicate loss of sympathetic tone consistent with neurogenic shock.",
    tags: ["Shock", "Autonomic", "SCI"],
  },
  {
    id: "neuro-5",
    topic: "Delirium Prevention",
    question: "Identify two nonpharmacologic strategies to reduce ICU delirium.",
    answer:
      "Provide frequent reorientation with clocks/calendars and maintain sleep-wake cycles through dimming lights at night and mobilizing by day.",
    tags: ["ICU", "CAM-ICU", "Sleep"],
  },
  {
    id: "endo-1",
    topic: "Diabetes Management",
    question: "What is the first nursing action for a hospitalized patient with blood glucose of 50 mg/dL who is alert?",
    answer:
      "Give 15 grams of rapid-acting carbohydrates (juice or glucose gel), recheck glucose in 15 minutes, and repeat until levels exceed 70 mg/dL.",
    tags: ["Hypoglycemia", "Protocol", "Endocrine"],
  },
  {
    id: "endo-2",
    topic: "DKA Care",
    question: "Which laboratory value guides transitioning from IV insulin to subcutaneous insulin in DKA?",
    answer:
      "When the anion gap closes and the patient tolerates oral intake, overlap subcutaneous basal insulin with the IV infusion for 1-2 hours before stopping.",
    tags: ["DKA", "Insulin", "Electrolytes"],
  },
  {
    id: "endo-3",
    topic: "Thyroid Storm",
    question: "List the priority medication sequence for treating thyroid storm.",
    answer:
      "Administer beta blockers for symptom control, give PTU or methimazole to block synthesis, follow with iodine solution to inhibit release, and add glucocorticoids.",
    tags: ["Hyperthyroid", "Medication", "Crisis"],
  },
  {
    id: "endo-4",
    topic: "SIADH vs DI",
    question: "How does urine specific gravity differ between SIADH and diabetes insipidus?",
    answer:
      "SIADH presents with concentrated urine (specific gravity >1.030), whereas diabetes insipidus causes very dilute urine (<1.005).",
    tags: ["Urine", "Pituitary", "Labs"],
  },
  {
    id: "endo-5",
    topic: "Adrenal Crisis",
    question: "What is the emergency treatment for suspected adrenal crisis?",
    answer:
      "Rapid IV isotonic fluids, immediate IV hydrocortisone, correction of hypoglycemia, and treatment of precipitating illness are essential.",
    tags: ["Steroids", "Hypotension", "Critical"],
  },
  {
    id: "renal-1",
    topic: "Acute Kidney Injury",
    question: "Which urine output threshold defines oliguria requiring provider notification?",
    answer:
      "Urine output less than 0.5 mL/kg/hr for more than 6 hours meets KDIGO criteria for stage 1 AKI and warrants escalation.",
    tags: ["Output", "KDIGO", "Monitoring"],
  },
  {
    id: "renal-2",
    topic: "Dialysis Care",
    question: "What assessment is mandatory before hemodialysis via AV fistula?",
    answer:
      "Palpate for a thrill and auscultate for a bruit; absence requires immediate provider notification before use.",
    tags: ["Access", "AV Fistula", "Assessment"],
  },
  {
    id: "renal-3",
    topic: "Peritoneal Dialysis",
    question: "Which finding indicates possible peritonitis in a peritoneal dialysis patient?",
    answer:
      "Cloudy effluent with abdominal pain, fever, or rebound tenderness strongly suggests peritonitis and requires culture and antibiotics.",
    tags: ["Complication", "Infection", "PD"],
  },
  {
    id: "renal-4",
    topic: "Electrolytes",
    question: "What ECG change is most concerning in severe hyperkalemia?",
    answer:
      "Peaked T waves progressing to widened QRS complexes signal dangerous hyperkalemia needing calcium, insulin-dextrose, and dialysis if refractory.",
    tags: ["Hyperkalemia", "ECG", "Emergency"],
  },
  {
    id: "renal-5",
    topic: "Urinary Retention",
    question: "When should a post-op bladder scan volume prompt straight catheterization?",
    answer:
      "Most protocols recommend catheterization for symptomatic patients with >400 mL retained or asymptomatic volumes exceeding 600 mL.",
    tags: ["Post-op", "Bladder", "Protocol"],
  },
  {
    id: "gi-1",
    topic: "Enteral Feeding",
    question: "How often should gastric residual volumes be checked for critically ill patients receiving tube feeds?",
    answer:
      "Every 4 hours during the first 48 hours, then per policy; hold feeds for residuals >500 mL twice and assess for intolerance.",
    tags: ["Tube Feed", "ICU", "Nutrition"],
  },
  {
    id: "gi-2",
    topic: "GI Bleed",
    question: "What is the first-line pharmacologic therapy for suspected variceal upper GI bleeding?",
    answer:
      "Initiate octreotide infusion and broad-spectrum antibiotics while arranging emergent endoscopy with band ligation.",
    tags: ["Varices", "Hepatic", "Medication"],
  },
  {
    id: "gi-3",
    topic: "Pancreatitis",
    question: "Which lab value best indicates biliary pancreatitis?",
    answer:
      "Elevated serum lipase with concurrent elevation of liver enzymes (ALT >150 U/L) points toward gallstone pancreatitis.",
    tags: ["LFTs", "Assessment", "Critical"],
  },
  {
    id: "gi-4",
    topic: "C. difficile",
    question: "State two infection control measures for patients with C. difficile colitis.",
    answer:
      "Use contact precautions with soap-and-water hand hygiene and dedicate equipment to prevent spore transmission.",
    tags: ["Isolation", "Hand Hygiene", "Infection"],
  },
  {
    id: "gi-5",
    topic: "Liver Failure",
    question: "Which assessment finding signals worsening hepatic encephalopathy?",
    answer:
      "Asterixis (flapping tremor) with increasing confusion or slowed response indicates rising ammonia and requires lactulose titration.",
    tags: ["Neuro", "Hepatic", "Assessment"],
  },
  {
    id: "ob-1",
    topic: "Labor & Delivery",
    question: "What is the nursing response to a prolonged fetal heart rate deceleration?",
    answer:
      "Reposition the patient to the left side, stop oxytocin, administer oxygen via face mask, increase IV fluids, and notify the provider for further evaluation.",
    tags: ["FHR", "OB", "Intrauterine Resuscitation"],
  },
  {
    id: "ob-2",
    topic: "Postpartum Hemorrhage",
    question: "Which uterotonic is contraindicated in hypertensive patients?",
    answer:
      "Methylergonovine (Methergine) should be avoided in hypertension due to risk of severe vasoconstriction; choose oxytocin or carboprost instead.",
    tags: ["PPH", "Medication", "Contraindication"],
  },
  {
    id: "ob-3",
    topic: "Preeclampsia",
    question: "What assessments are necessary while infusing magnesium sulfate for seizure prophylaxis?",
    answer:
      "Monitor deep tendon reflexes, respiratory rate, and urine output; loss of reflexes or RR <12/min suggests toxicity and requires calcium gluconate.",
    tags: ["OB", "Magnesium", "Safety"],
  },
  {
    id: "ob-4",
    topic: "Breastfeeding",
    question: "How soon should a newborn begin breastfeeding after delivery for optimal success?",
    answer:
      "Initiate skin-to-skin contact and breastfeeding within the first hour after birth to promote latch and oxytocin release.",
    tags: ["Newborn", "Education", "Lactation"],
  },
  {
    id: "ob-5",
    topic: "Newborn Assessment",
    question: "What is the normal range for a newborn respiratory rate in the first hour of life?",
    answer:
      "A respiratory rate of 30-60 breaths per minute with periodic breathing is expected; sustained tachypnea warrants evaluation.",
    tags: ["Vitals", "Assessment", "Neonate"],
  },
  {
    id: "peds-1",
    topic: "Pediatric Dosage",
    question: "What calculation method is commonly used for pediatric maintenance IV fluids?",
    answer:
      "Use the Holliday-Segar method: 100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, and 20 mL/kg for each kg above 20.",
    tags: ["Fluids", "Math", "Pediatrics"],
  },
  {
    id: "peds-2",
    topic: "Respiratory Distress",
    question: "List two early signs of respiratory distress in infants.",
    answer:
      "Nasal flaring and intercostal retractions often precede cyanosis; prompt airway support is required.",
    tags: ["Assessment", "Infant", "Airway"],
  },
  {
    id: "peds-3",
    topic: "Dehydration",
    question: "Which physical assessment best reflects moderate dehydration in a toddler?",
    answer:
      "Delayed capillary refill (>2 seconds), dry mucous membranes, and decreased tear production indicate moderate dehydration.",
    tags: ["Hydration", "Assessment", "Peds"],
  },
  {
    id: "peds-4",
    topic: "Immunizations",
    question: "At what age is the first MMR vaccine administered?",
    answer:
      "The first dose of the MMR vaccine is given at 12-15 months of age with a second dose at 4-6 years.",
    tags: ["Vaccines", "Schedule", "Wellness"],
  },
  {
    id: "peds-5",
    topic: "Pain Assessment",
    question: "Which pain scale is appropriate for preverbal infants?",
    answer:
      "Use the FLACC scale (Face, Legs, Activity, Cry, Consolability) for infants and nonverbal children.",
    tags: ["Pain", "Assessment", "Scale"],
  },
  {
    id: "psych-1",
    topic: "Suicide Precautions",
    question: "What environmental modifications are required for patients on suicide watch?",
    answer:
      "Remove sharps, cords, and personal belongings, provide paper gowns if needed, and ensure 1:1 observation with documented safety checks.",
    tags: ["Safety", "Behavioral Health", "Policy"],
  },
  {
    id: "psych-2",
    topic: "Restraint Use",
    question: "How often must circulation be assessed in patients with limb restraints?",
    answer:
      "Check circulation, sensation, and skin integrity at least every 15 minutes for violent restraints and every 2 hours for nonviolent per policy.",
    tags: ["Regulatory", "Assessment", "Safety"],
  },
  {
    id: "psych-3",
    topic: "Serotonin Syndrome",
    question: "Which triad of symptoms suggests serotonin syndrome?",
    answer:
      "Autonomic instability (hyperthermia), neuromuscular hyperactivity (clonus, tremor), and altered mental status indicate serotonin toxicity.",
    tags: ["Medication", "Emergency", "Assessment"],
  },
  {
    id: "psych-4",
    topic: "Depression Screening",
    question: "Name a validated tool for inpatient depression screening.",
    answer:
      "The PHQ-9 is a widely used, validated nine-item questionnaire for assessing depression severity.",
    tags: ["Screening", "Behavioral Health", "Assessment"],
  },
  {
    id: "psych-5",
    topic: "Substance Withdrawal",
    question: "Which scale guides benzodiazepine dosing for alcohol withdrawal?",
    answer:
      "The CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol) scale directs symptom-triggered therapy.",
    tags: ["CIWA", "Protocol", "Alcohol"],
  },
  {
    id: "emerg-1",
    topic: "Sepsis Bundle",
    question: "What interventions must be completed within 1 hour for suspected sepsis?",
    answer:
      "Obtain lactate level, draw blood cultures, administer broad-spectrum antibiotics, start 30 mL/kg crystalloid for hypotension or lactate ≥4, and apply vasopressors if needed.",
    tags: ["Bundle", "Critical Care", "Timing"],
  },
  {
    id: "emerg-2",
    topic: "Anaphylaxis",
    question: "What is the first-line treatment for anaphylaxis?",
    answer:
      "Administer intramuscular epinephrine 0.3-0.5 mg to the lateral thigh immediately, followed by airway support, antihistamines, and steroids.",
    tags: ["Allergy", "Epinephrine", "Emergency"],
  },
  {
    id: "emerg-3",
    topic: "Burn Management",
    question: "Describe the Parkland formula for initial fluid resuscitation in burns.",
    answer:
      "Give 4 mL × body weight (kg) × %TBSA of lactated Ringer's in the first 24 hours; deliver half in the first 8 hours from time of injury.",
    tags: ["Burns", "Fluids", "Critical"],
  },
  {
    id: "emerg-4",
    topic: "Trauma",
    question: "What is the primary survey sequence in trauma resuscitation?",
    answer:
      "Follow ABCDE: Airway with C-spine protection, Breathing, Circulation with hemorrhage control, Disability (neuro status), and Exposure/Environment control.",
    tags: ["ATLS", "Priorities", "Emergency"],
  },
  {
    id: "emerg-5",
    topic: "Shock States",
    question: "Which hemodynamic pattern differentiates distributive shock from hypovolemic shock?",
    answer:
      "Distributive shock shows low SVR with warm extremities and high cardiac output early, while hypovolemic shock presents with low preload, low CO, and cool clammy skin.",
    tags: ["Hemodynamics", "Assessment", "Critical"],
  },
];
