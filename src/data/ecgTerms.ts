export const ecgCategories = [
  "Waveforms",
  "Intervals",
  "Segments",
  "Rhythms",
  "Arrhythmias",
  "Ischemia",
  "Conduction",
  "Technical",
] as const;

export type EcgCategory = (typeof ecgCategories)[number];

export interface EcgTerm {
  id: string;
  term: string;
  category: EcgCategory;
  definition: string;
  clinicalPearl: string;
  normalValue?: string;
}

export const ecgTerms: EcgTerm[] = [
  {
    id: "p-wave",
    term: "P Wave",
    category: "Waveforms",
    definition: "Represents atrial depolarization and should be upright in lead II in sinus rhythm.",
    clinicalPearl: "A missing or inverted P wave may suggest junctional rhythm or ectopic atrial focus.",
    normalValue: "Duration <120 ms",
  },
  {
    id: "qrs-complex",
    term: "QRS Complex",
    category: "Waveforms",
    definition: "Reflects ventricular depolarization and appears as a sharp deflection on ECG.",
    clinicalPearl: "A widened QRS can indicate bundle branch block, ventricular rhythm, or hyperkalemia.",
    normalValue: "Duration <120 ms",
  },
  {
    id: "t-wave",
    term: "T Wave",
    category: "Waveforms",
    definition: "Represents ventricular repolarization after each ventricular contraction.",
    clinicalPearl: "Tall peaked T waves are an early clue for hyperkalemia.",
    normalValue: "Upright in most leads",
  },
  {
    id: "u-wave",
    term: "U Wave",
    category: "Waveforms",
    definition: "A small deflection after the T wave, often subtle or absent in healthy adults.",
    clinicalPearl: "Prominent U waves may appear in hypokalemia and bradycardia.",
  },
  {
    id: "pr-interval",
    term: "PR Interval",
    category: "Intervals",
    definition: "Time from the start of atrial depolarization to the start of ventricular depolarization.",
    clinicalPearl: "Progressive PR prolongation with dropped beats suggests Mobitz I block.",
    normalValue: "120-200 ms",
  },
  {
    id: "qt-interval",
    term: "QT Interval",
    category: "Intervals",
    definition: "Duration from the beginning of QRS to the end of the T wave.",
    clinicalPearl: "Prolonged QT increases risk for torsades de pointes.",
    normalValue: "QTc <440 ms (men), <460 ms (women)",
  },
  {
    id: "rr-interval",
    term: "R-R Interval",
    category: "Intervals",
    definition: "Distance between consecutive R waves used to determine heart rate and rhythm regularity.",
    clinicalPearl: "Marked R-R variability is common in atrial fibrillation.",
  },
  {
    id: "st-segment",
    term: "ST Segment",
    category: "Segments",
    definition: "Flat segment between QRS and T wave representing early ventricular repolarization.",
    clinicalPearl: "ST elevation in contiguous leads suggests acute myocardial injury.",
    normalValue: "Isoelectric baseline",
  },
  {
    id: "tp-segment",
    term: "TP Segment",
    category: "Segments",
    definition: "Interval from end of T wave to next P wave, often used as baseline reference.",
    clinicalPearl: "Use TP segment as baseline when evaluating subtle ST deviation.",
  },
  {
    id: "sinus-rhythm",
    term: "Normal Sinus Rhythm",
    category: "Rhythms",
    definition: "Regular rhythm originating from the sinoatrial node with P before every QRS.",
    clinicalPearl: "Confirm sinus rhythm by checking upright P waves in lead II and consistent PR intervals.",
    normalValue: "Rate 60-100 bpm",
  },
  {
    id: "sinus-bradycardia",
    term: "Sinus Bradycardia",
    category: "Rhythms",
    definition: "Sinus rhythm with heart rate below normal resting range.",
    clinicalPearl: "Common in trained athletes but concerning with hypotension or altered mental status.",
    normalValue: "Rate <60 bpm",
  },
  {
    id: "sinus-tachycardia",
    term: "Sinus Tachycardia",
    category: "Rhythms",
    definition: "Sinus rhythm with elevated heart rate, usually physiologic or compensatory.",
    clinicalPearl: "Evaluate common triggers first: pain, hypovolemia, fever, anxiety, or hypoxia.",
    normalValue: "Rate >100 bpm",
  },
  {
    id: "afib",
    term: "Atrial Fibrillation",
    category: "Arrhythmias",
    definition: "Irregularly irregular rhythm with no discrete P waves due to chaotic atrial activity.",
    clinicalPearl: "Stroke prevention decisions depend on thromboembolic risk scoring and bleeding risk.",
  },
  {
    id: "atrial-flutter",
    term: "Atrial Flutter",
    category: "Arrhythmias",
    definition: "Re-entrant atrial rhythm often producing sawtooth flutter waves.",
    clinicalPearl: "Atrial activity commonly runs near 300 bpm with variable AV conduction.",
  },
  {
    id: "vt",
    term: "Ventricular Tachycardia",
    category: "Arrhythmias",
    definition: "Rapid ventricular rhythm usually presenting with wide QRS complexes.",
    clinicalPearl: "Treat unstable VT immediately as a life-threatening rhythm.",
    normalValue: "Rate typically >120 bpm",
  },
  {
    id: "vf",
    term: "Ventricular Fibrillation",
    category: "Arrhythmias",
    definition: "Chaotic ventricular electrical activity with no organized cardiac output.",
    clinicalPearl: "Immediate defibrillation and high-quality CPR are critical.",
  },
  {
    id: "stemi",
    term: "ST-Elevation Myocardial Infarction (STEMI)",
    category: "Ischemia",
    definition: "Acute coronary occlusion causing persistent ST elevation in contiguous leads.",
    clinicalPearl: "Time-to-reperfusion strongly influences survival and myocardial salvage.",
  },
  {
    id: "nstemi",
    term: "Non-ST-Elevation Myocardial Infarction (NSTEMI)",
    category: "Ischemia",
    definition: "Myocardial injury with positive biomarkers without persistent ST elevation.",
    clinicalPearl: "Dynamic ST depression or T-wave inversion can signal active ischemia.",
  },
  {
    id: "rbbb",
    term: "Right Bundle Branch Block (RBBB)",
    category: "Conduction",
    definition: "Delayed right ventricular depolarization causing characteristic QRS morphology.",
    clinicalPearl: "Look for rsR' in V1 and broad terminal S waves in lateral leads.",
    normalValue: "QRS ≥120 ms",
  },
  {
    id: "lbbb",
    term: "Left Bundle Branch Block (LBBB)",
    category: "Conduction",
    definition: "Delayed left ventricular conduction producing broad notched QRS in lateral leads.",
    clinicalPearl: "New LBBB with ischemic symptoms warrants urgent evaluation for acute coronary syndrome.",
    normalValue: "QRS ≥120 ms",
  },
  {
    id: "lead-placement",
    term: "Lead Placement",
    category: "Technical",
    definition: "Standardized electrode positioning required to obtain accurate ECG tracings.",
    clinicalPearl: "Misplaced precordial leads can mimic infarction and trigger unnecessary workup.",
  },
];
