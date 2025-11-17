export interface AssessmentScale {
  id: string;
  name: string;
  description: string;
  category: string;
  components: ScaleComponent[];
  interpretation?: string[];
}

export interface ScaleComponent {
  factor: string;
  options: ScoreOption[];
}

export interface ScoreOption {
  description: string;
  points: number;
}

export const assessmentScales: AssessmentScale[] = [
  {
    id: "gcs",
    name: "Glasgow Coma Scale (GCS)",
    description: "Neurological assessment tool to evaluate level of consciousness",
    category: "Neurological",
    components: [
      {
        factor: "Eye Opening",
        options: [
          { description: "Spontaneous", points: 4 },
          { description: "To verbal command", points: 3 },
          { description: "To pain", points: 2 },
          { description: "No response", points: 1 }
        ]
      },
      {
        factor: "Verbal Response",
        options: [
          { description: "Oriented", points: 5 },
          { description: "Confused", points: 4 },
          { description: "Inappropriate words", points: 3 },
          { description: "Incomprehensible sounds", points: 2 },
          { description: "No response", points: 1 }
        ]
      },
      {
        factor: "Motor Response",
        options: [
          { description: "Obeys commands", points: 6 },
          { description: "Localizes pain", points: 5 },
          { description: "Withdrawal from pain", points: 4 },
          { description: "Flexion to pain", points: 3 },
          { description: "Extension to pain", points: 2 },
          { description: "No response", points: 1 }
        ]
      }
    ],
    interpretation: [
      "Total Score: 3-15",
      "13-15: Mild brain injury",
      "9-12: Moderate brain injury",
      "3-8: Severe brain injury",
      "<8: Consider intubation"
    ]
  },
  {
    id: "braden",
    name: "Braden Scale (Pressure Ulcer Risk)",
    description: "Assessment tool for pressure ulcer risk",
    category: "Skin Integrity",
    components: [
      {
        factor: "Sensory Perception",
        options: [
          { description: "Completely Limited", points: 1 },
          { description: "Very Limited", points: 2 },
          { description: "Slightly Limited", points: 3 },
          { description: "No Impairment", points: 4 }
        ]
      },
      {
        factor: "Moisture",
        options: [
          { description: "Constantly Moist", points: 1 },
          { description: "Often Moist", points: 2 },
          { description: "Occasionally Moist", points: 3 },
          { description: "Rarely Moist", points: 4 }
        ]
      },
      {
        factor: "Activity",
        options: [
          { description: "Bedfast", points: 1 },
          { description: "Chairfast", points: 2 },
          { description: "Walks Occasionally", points: 3 },
          { description: "Walks Frequently", points: 4 }
        ]
      },
      {
        factor: "Mobility",
        options: [
          { description: "Completely Immobile", points: 1 },
          { description: "Very Limited", points: 2 },
          { description: "Slightly Limited", points: 3 },
          { description: "No Limitation", points: 4 }
        ]
      },
      {
        factor: "Nutrition",
        options: [
          { description: "Very Poor", points: 1 },
          { description: "Probably Inadequate", points: 2 },
          { description: "Adequate", points: 3 },
          { description: "Excellent", points: 4 }
        ]
      },
      {
        factor: "Friction and Shear",
        options: [
          { description: "Problem", points: 1 },
          { description: "Potential Problem", points: 2 },
          { description: "No Apparent Problem", points: 3 }
        ]
      }
    ],
    interpretation: [
      "Total Score: 6-23",
      "≤9: Severe risk",
      "10-12: High risk",
      "13-14: Moderate risk",
      "15-18: Mild risk",
      "≥19: No risk"
    ]
  },
  {
    id: "morse-fall",
    name: "Morse Fall Scale",
    description: "Risk assessment tool for patient fall risk",
    category: "Safety",
    components: [
      {
        factor: "History of Falling",
        options: [
          { description: "No", points: 0 },
          { description: "Yes", points: 25 }
        ]
      },
      {
        factor: "Secondary Diagnosis",
        options: [
          { description: "No", points: 0 },
          { description: "Yes", points: 15 }
        ]
      },
      {
        factor: "Ambulatory Aid",
        options: [
          { description: "None/Bed rest/Nurse assist", points: 0 },
          { description: "Crutches/Cane/Walker", points: 15 },
          { description: "Furniture", points: 30 }
        ]
      },
      {
        factor: "IV/Heparin Lock",
        options: [
          { description: "No", points: 0 },
          { description: "Yes", points: 20 }
        ]
      },
      {
        factor: "Gait",
        options: [
          { description: "Normal/Bed rest/Wheelchair", points: 0 },
          { description: "Weak", points: 10 },
          { description: "Impaired", points: 20 }
        ]
      },
      {
        factor: "Mental Status",
        options: [
          { description: "Oriented to own ability", points: 0 },
          { description: "Overestimates/Forgets limitations", points: 15 }
        ]
      }
    ],
    interpretation: [
      "Total Score: 0-125",
      "0-24: No risk",
      "25-50: Low risk",
      "≥51: High risk"
    ]
  },
  {
    id: "pain-scale",
    name: "Pain Scale (0-10)",
    description: "Numeric rating scale for pain assessment",
    category: "Pain",
    components: [
      {
        factor: "Pain Intensity",
        options: [
          { description: "0 - No pain", points: 0 },
          { description: "1-3 - Mild pain", points: 1 },
          { description: "4-6 - Moderate pain", points: 4 },
          { description: "7-9 - Severe pain", points: 7 },
          { description: "10 - Worst pain imaginable", points: 10 }
        ]
      }
    ],
    interpretation: [
      "0: No pain",
      "1-3: Mild pain",
      "4-6: Moderate pain",
      "7-10: Severe pain"
    ]
  },
  {
    id: "apgar",
    name: "APGAR Score",
    description: "Assessment of newborn condition immediately after birth",
    category: "Neonatal",
    components: [
      {
        factor: "Appearance (Color)",
        options: [
          { description: "Blue/Pale", points: 0 },
          { description: "Body pink, extremities blue", points: 1 },
          { description: "Completely pink", points: 2 }
        ]
      },
      {
        factor: "Pulse (Heart Rate)",
        options: [
          { description: "Absent", points: 0 },
          { description: "<100 bpm", points: 1 },
          { description: ">100 bpm", points: 2 }
        ]
      },
      {
        factor: "Grimace (Reflex Irritability)",
        options: [
          { description: "No response", points: 0 },
          { description: "Grimace", points: 1 },
          { description: "Cry/Active withdrawal", points: 2 }
        ]
      },
      {
        factor: "Activity (Muscle Tone)",
        options: [
          { description: "Limp", points: 0 },
          { description: "Some flexion", points: 1 },
          { description: "Active motion", points: 2 }
        ]
      },
      {
        factor: "Respiration",
        options: [
          { description: "Absent", points: 0 },
          { description: "Slow, irregular", points: 1 },
          { description: "Good, crying", points: 2 }
        ]
      }
    ],
    interpretation: [
      "Total Score: 0-10",
      "Assessed at 1 and 5 minutes",
      "7-10: Normal",
      "4-6: Moderately abnormal",
      "0-3: Severely abnormal"
    ]
  },
  {
    id: "rass",
    name: "RASS (Richmond Agitation-Sedation Scale)",
    description: "Assessment of agitation and sedation levels",
    category: "Neurological",
    components: [
      {
        factor: "Level",
        options: [
          { description: "+4 Combative - Violent, danger to staff", points: 4 },
          { description: "+3 Very Agitated - Pulls/removes tubes", points: 3 },
          { description: "+2 Agitated - Frequent movement", points: 2 },
          { description: "+1 Restless - Anxious but movements not aggressive", points: 1 },
          { description: "0 Alert and Calm", points: 0 },
          { description: "-1 Drowsy - Not fully alert but sustained awakening", points: -1 },
          { description: "-2 Light Sedation - Briefly awakens to voice", points: -2 },
          { description: "-3 Moderate Sedation - Movement to voice", points: -3 },
          { description: "-4 Deep Sedation - No response to voice, movement to physical stimulation", points: -4 },
          { description: "-5 Unarousable - No response to voice or physical stimulation", points: -5 }
        ]
      }
    ],
    interpretation: [
      "Positive scores: Agitation",
      "0: Alert and calm (goal for most patients)",
      "Negative scores: Sedation"
    ]
  }
];
