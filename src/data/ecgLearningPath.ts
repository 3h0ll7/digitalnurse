export interface EcgLearningStage {
  stage: number;
  title: string;
  badge: string;
  estimatedTime: string;
  objectives: string[];
  clinicalScenario: string;
  masteryCheckpoint: string;
}

export const ecgLearningPath: EcgLearningStage[] = [
  {
    stage: 1,
    title: "ECG Foundations",
    badge: "BEGINNER",
    estimatedTime: "20 min",
    objectives: [
      "Identify ECG paper calibration and lead orientation.",
      "Recognize core waveform components (P, QRS, T).",
      "Use a stepwise rhythm strip review sequence.",
    ],
    clinicalScenario:
      "A stable patient presents for baseline pre-op screening. You must confirm a technically adequate tracing before interpretation.",
    masteryCheckpoint:
      "You can label waveform components correctly and explain standard calibration.",
  },
  {
    stage: 2,
    title: "Rate, Rhythm, and Axis",
    badge: "NOVICE",
    estimatedTime: "25 min",
    objectives: [
      "Calculate heart rate using regular and irregular methods.",
      "Differentiate regular versus irregular rhythms.",
      "Perform a quick frontal axis check.",
    ],
    clinicalScenario:
      "A patient with palpitations arrives to triage. You need a rapid rhythm interpretation to guide urgency.",
    masteryCheckpoint:
      "You can produce a reproducible rate/rhythm summary and classify axis as normal or deviated.",
  },
  {
    stage: 3,
    title: "Intervals and Conduction Blocks",
    badge: "INTERMEDIATE",
    estimatedTime: "30 min",
    objectives: [
      "Measure PR, QRS, and QT intervals accurately.",
      "Recognize first-degree AV block and Mobitz patterns.",
      "Differentiate right versus left bundle branch block morphology.",
    ],
    clinicalScenario:
      "A patient on multiple cardioactive medications develops dizziness. You are asked to evaluate for conduction delay.",
    masteryCheckpoint:
      "You can identify key conduction abnormalities and communicate likely clinical impact.",
  },
  {
    stage: 4,
    title: "Ischemia and Infarction Patterns",
    badge: "ADVANCED",
    estimatedTime: "35 min",
    objectives: [
      "Detect ST elevation, ST depression, and reciprocal changes.",
      "Correlate lead territories with suspected coronary involvement.",
      "Distinguish urgent STEMI features from non-specific changes.",
    ],
    clinicalScenario:
      "A patient with acute chest pain has evolving ECG changes over serial tracings. You need to escalate quickly.",
    masteryCheckpoint:
      "You can flag high-risk ischemic patterns and trigger immediate escalation pathways.",
  },
  {
    stage: 5,
    title: "Complex Rhythm Integration",
    badge: "EXPERT",
    estimatedTime: "40 min",
    objectives: [
      "Integrate rhythm, conduction, and ischemia findings into one report.",
      "Prioritize unstable arrhythmias requiring immediate intervention.",
      "Deliver concise handoff language for emergency teams.",
    ],
    clinicalScenario:
      "In a high-acuity setting, telemetry alarms and 12-lead findings conflict. You must synthesize findings into an actionable plan.",
    masteryCheckpoint:
      "You can produce a complete, prioritized ECG interpretation with clear next steps.",
  },
];
