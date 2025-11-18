export interface Procedure {
  id: string;
  category: string;
  title: string;
  description: string;
  definition: string;
  indications: string[];
  contraindications: string[];
  equipment: string[];
  steps: string[];
  safetyAlerts: string[];
  complications: string[];
  documentation: string[];
  patientTeaching: string[];
}

export const procedures: Procedure[] = [
  {
    id: "airway-preoxygenation",
    category: "AIRWAY & RESPIRATORY",
    title: "Preoxygenation and Airway Assessment",
    description: "Standardized airway readiness check for emergent intubations and transport.",
    definition: "Nursing-led bundle to assess airway anatomy, optimize oxygen reserves, and stage equipment before airway manipulation.",
    indications: [
      "Impending airway compromise",
      "Planned rapid sequence intubation",
      "Transfer of ventilated patient",
      "Procedural sedation in high-risk patients"
    ],
    contraindications: [
      "Immediate arrest requiring crash airway",
      "Facial trauma preventing mask seal (modify technique)"
    ],
    equipment: [
      "Bag-valve-mask with PEEP valve",
      "End-tidal CO2 monitor",
      "Pulse oximeter and hemodynamic monitor",
      "Airway cart with suction, blades, ETTs",
      "Checklist or timeout tool"
    ],
    steps: [
      "Perform hand hygiene, verify patient, and announce airway timeout.",
      "Assess airway predictors (LEMON/BOOTS) and document baseline vitals.",
      "Apply monitoring (SpO2, ECG, BP, ETCO2) and elevate head of bed 20–30° if tolerated.",
      "Deliver 100% oxygen for ≥3 minutes via tight-fitting mask or NIV with PEEP 5–10 cm H2O.",
      "Prepare suction, confirm backup airway devices, and pre-attach waveform capnography.",
      "Coordinate pharmacologic plan with provider and confirm post-intubation sedation availability."
    ],
    safetyAlerts: [
      "Stop if SpO2 drops <93% despite maximal oxygenation—recruit lungs before proceeding.",
      "Avoid bagging with high pressures in suspected pneumothorax.",
      "Have difficult airway algorithm visible and backup personnel alerted."
    ],
    complications: [
      "Hypoxemia",
      "Aspiration",
      "Hemodynamic instability",
      "Equipment failure"
    ],
    documentation: [
      "Airway assessment findings and device sizes readied",
      "Preoxygenation method/duration and preprocedure vitals",
      "Team timeout confirmation",
      "Any deviations or safety concerns escalated"
    ],
    patientTeaching: [
      "Explain why oxygen mask or NIV is required before airway support.",
      "Coach deep breaths and reassure regarding monitoring alarms.",
      "Clarify that the airway team remains at bedside throughout." 
    ]
  },
  {
    id: "bvm-ventilation",
    category: "AIRWAY & RESPIRATORY",
    title: "Bag-Valve-Mask Ventilation",
    description: "Evidence-based manual ventilation for apnea or peri-intubation care.",
    definition: "Controlled positive-pressure ventilation delivered via self-inflating bag with adjunct airways to maintain oxygenation until a definitive airway is secured.",
    indications: [
      "Respiratory arrest or severe hypoventilation",
      "During sedation/anesthesia induction",
      "Transport of ventilated patients",
      "Trial of ventilation before intubation"
    ],
    contraindications: [
      "Complete upper airway obstruction without adjunct",
      "Massive facial trauma preventing seal"
    ],
    equipment: [
      "Self-inflating bag with oxygen reservoir",
      "Mask sizes and oral/nasal airways",
      "PEEP valve",
      "Capnography and pulse oximeter",
      "Suction apparatus"
    ],
    steps: [
      "Perform head-tilt–chin-lift or jaw thrust; insert airway adjunct as indicated.",
      "Create two-hand mask seal and squeeze bag over 1 second delivering 6–8 mL/kg tidal volume.",
      "Maintain rate 10–12 breaths/min while watching chest rise and capnography.",
      "Apply PEEP 5–10 cm H2O to prevent atelectasis when oxygen available.",
      "Continuously reassess airway patency, lung compliance, and gastric distention.",
      "Transition to advanced airway when ready, ensuring continuous oxygenation."
    ],
    safetyAlerts: [
      "Avoid hyperventilation—target ETCO2 35–45 mmHg.",
      "Watch for gastric insufflation; insert orogastric tube if abdomen distends.",
      "Use viral filter on exhalation port for airborne precautions."
    ],
    complications: [
      "Gastric aspiration",
      "Barotrauma",
      "Hypoventilation from poor seal",
      "Facial or airway trauma"
    ],
    documentation: [
      "Indication for manual ventilation and duration",
      "Device settings (PEEP, O2 flow) and adjuncts used",
      "Patient response (SpO2, ETCO2)",
      "Provider notifications and transition plan"
    ],
    patientTeaching: [
      "Inform conscious patients about assisted breathing and encourage synchrony.",
      "Reassure family about temporary support until breathing stabilizes.",
      "Highlight need to avoid removing mask to maintain oxygenation."
    ]
  },
  {
    id: "orotracheal-intubation-support",
    category: "AIRWAY & RESPIRATORY",
    title: "Orotracheal Intubation Support",
    description: "Nursing workflow for safe RSI assistance and confirmation.",
    definition: "Coordinated nursing actions that prepare equipment, assist with pharmacology, and verify endotracheal tube placement during rapid sequence intubation.",
    indications: [
      "Failure to maintain airway",
      "Inadequate ventilation/oxygenation",
      "Anticipated clinical deterioration",
      "Neuroprotection during refractory seizures"
    ],
    contraindications: [
      "Do not delay crash airway for checklist completion",
      "Relative: severe facial burns requiring surgical airway"
    ],
    equipment: [
      "Airway cart with video and direct laryngoscopes",
      "Endotracheal tubes with stylets",
      "Suction, bougie, supraglottic devices",
      "Sedative/paralytic medications",
      "Waveform capnography"
    ],
    steps: [
      "Confirm indication and ensure consent or emergent justification documented.",
      "Prime IV line, draw ordered medications, and label syringes per double-check protocol.",
      "Assist with positioning and monitor hemodynamics throughout induction.",
      "Hand provider selected blade/ETT, then apply cuff pressure 20–30 cm H2O.",
      "Connect ETCO2, assess breath sounds, chest rise, and ventilator graphics immediately.",
      "Secure tube, document depth, order verification CXR, and start sedation/analgesia infusions."
    ],
    safetyAlerts: [
      "Pause if systolic BP <90 mmHg—initiate push-dose vasopressor per protocol.",
      "No ETCO2 waveform equals esophageal placement—remove and reoxygenate.",
      "Clamp ETT during ventilator transitions in ARDS to prevent derecruitment."
    ],
    complications: [
      "Hypotension",
      "Esophageal or right mainstem intubation",
      "Dental trauma",
      "Aspiration"
    ],
    documentation: [
      "Pre/post vitals, meds, and dosages",
      "ETT size, depth, cuff pressure",
      "Verification methods (ETCO2, auscultation, CXR)",
      "Sedation plan and patient tolerance"
    ],
    patientTeaching: [
      "Explain sedation goals to family once patient stabilized.",
      "Describe oral care and suctioning plans to reduce pneumonia.",
      "Clarify communication options (boards, sedation vacations)."
    ]
  },
  {
    id: "noninvasive-ventilation",
    category: "AIRWAY & RESPIRATORY",
    title: "Noninvasive Ventilation (CPAP/BiPAP)",
    description: "Initiation and monitoring of NIV for COPD or pulmonary edema.",
    definition: "Application of positive airway pressure via tight-fitting mask to improve ventilation and oxygenation without intubation.",
    indications: [
      "COPD exacerbation with hypercapnia",
      "Cardiogenic pulmonary edema",
      "Obesity hypoventilation",
      "Immunocompromised hypoxemia"
    ],
    contraindications: [
      "Cardiac/respiratory arrest",
      "Inability to protect airway or clear secretions",
      "Recent facial/upper airway surgery",
      "Untreated pneumothorax"
    ],
    equipment: [
      "BiPAP/CPAP machine with humidifier",
      "Full-face or nasal mask",
      "Leak-compensating circuit",
      "Pulse oximeter and ABG access",
      "Skin barrier dressings"
    ],
    steps: [
      "Confirm order and screen for contraindications.",
      "Educate patient, position upright, and apply skin barrier.",
      "Fit mask, start ordered pressures, and titrate to target tidal volume/SpO2.",
      "Assess comfort, synchrony, leak, and vitals every 15 minutes for the first hour.",
      "Provide breaks for hydration/oral care, documenting cumulative time on/off.",
      "Escalate to invasive airway if persistent hypoxia or hemodynamic collapse occurs."
    ],
    safetyAlerts: [
      "Remove mask immediately if patient vomits or aspirates.",
      "Check ABG within 1 hour for hypercapnia improvement.",
      "Apply VAP prevention elements even on NIV."
    ],
    complications: [
      "Pressure injuries",
      "Gastric insufflation",
      "Claustrophobia",
      "Delayed intubation"
    ],
    documentation: [
      "Mode, pressures, FiO2, and duration",
      "Skin assessment findings",
      "Patient tolerance and ABG/SpO2 trends",
      "Escalation criteria discussed"
    ],
    patientTeaching: [
      "Describe purpose of mask and need for tight seal.",
      "Coach slow nasal breathing and relaxation techniques.",
      "Review plan for weaning once breathing stabilizes."
    ]
  },
  {
    id: "high-flow-nasal-cannula",
    category: "AIRWAY & RESPIRATORY",
    title: "High-Flow Nasal Cannula Titration",
    description: "Humidified high-flow oxygen delivery with escalation criteria.",
    definition: "Delivery of up to 60 L/min heated, humidified oxygen via wide-bore cannula to reduce work of breathing and improve oxygenation.",
    indications: [
      "Hypoxemic respiratory failure",
      "Post-extubation support",
      "Pediatric bronchiolitis",
      "Comfort-focused oxygenation"
    ],
    contraindications: [
      "Complete nasal obstruction",
      "High-risk airway obstruction needing surgical airway",
      "Untreated pneumothorax without chest tube"
    ],
    equipment: [
      "Heated high-flow device with blender",
      "Sterile water chamber",
      "Appropriate cannula size",
      "Humidified circuit",
      "Pulse oximetry"
    ],
    steps: [
      "Prime circuit, set temperature 34–37 °C, and FiO2 per order.",
      "Position patient upright, apply cannula ensuring prongs occupy <50% of nares.",
      "Start flow 30–40 L/min, adjust FiO2 to maintain SpO2 goal, then titrate flow up for dyspnea relief.",
      "Monitor respiratory rate, accessory muscle use, and ROX index.",
      "Humidify water chamber and change per manufacturer schedule.",
      "Escalate to NIV/intubation if ROX <3.85 or persistent distress."
    ],
    safetyAlerts: [
      "Use droplet/airborne precautions with viral infections.",
      "Never place cannula directly on skin without foam protection.",
      "Check for abdominal distention in neonates and pediatrics."
    ],
    complications: [
      "Drying if humidifier empty",
      "Skin breakdown",
      "Delayed escalation",
      "Barotrauma (rare)"
    ],
    documentation: [
      "Flow, FiO2, temperature, and ROX score",
      "Skin integrity checks",
      "Patient comfort and tolerance",
      "Escalation discussions"
    ],
    patientTeaching: [
      "Explain that high flow provides warmed, moist oxygen for easier breathing.",
      "Encourage avoidance of mouth breathing if possible.",
      "Review plan for weaning once breathing stabilizes."
    ]
  },
  {
    id: "tracheostomy-care",
    category: "AIRWAY & RESPIRATORY",
    title: "Tracheostomy Care and Suctioning",
    description: "Sterile stoma care, inner cannula maintenance, and closed suction technique.",
    definition: "Routine nursing maintenance of tracheostomy patency, skin integrity, and ventilator circuit safety to prevent infection and obstruction.",
    indications: [
      "Scheduled trach care",
      "Visible secretions or audible gurgling",
      "Difficulty passing air",
      "Post-decannulation wound management"
    ],
    contraindications: [
      "New tracheostomy <72 hours old without provider present",
      "Unstable airway requiring immediate intervention"
    ],
    equipment: [
      "Sterile trach care kit",
      "Sterile gloves and saline",
      "Closed suction catheter",
      "Split gauze, ties, skin barrier",
      "Spare trach of same size and one smaller"
    ],
    steps: [
      "Explain procedure, pre-oxygenate if ventilated, and gather supplies.",
      "Perform hand hygiene, don PPE, and suction airway using sterile technique <10 seconds per pass.",
      "Remove inner cannula, clean with sterile saline, dry, and replace or swap disposable insert.",
      "Clean stoma from inner to outer area, dry thoroughly, and place new split gauze.",
      "Change ties one side at a time with assistance to maintain security.",
      "Reassess breath sounds, cuff pressure, and patient comfort."
    ],
    safetyAlerts: [
      "Maintain cuff pressure 20–25 cm H2O; report leaks or >30 cm H2O.",
      "Stop if patient desaturates or develops arrhythmia; re-oxygenate.",
      "Keep obturator and spare trachs at bedside for accidental decannulation."
    ],
    complications: [
      "Mucus plugging",
      "Bleeding",
      "Infection",
      "Accidental decannulation"
    ],
    documentation: [
      "Type of care performed and suction depth",
      "Secretion characteristics and patient tolerance",
      "Skin integrity and cuff pressure",
      "Education provided"
    ],
    patientTeaching: [
      "Demonstrate how to support tubing during coughs to avoid dislodgement.",
      "Teach suction frequency and signs of obstruction.",
      "Review hand hygiene and sterile handling of inner cannula at home."
    ]
  },
  {
    id: "chest-tube-management",
    category: "AIRWAY & RESPIRATORY",
    title: "Chest Tube Management",
    description: "Assessment of pleural drainage systems for pneumothorax or effusion.",
    definition: "Nursing procedures that maintain chest tube patency, ensure negative pressure drainage, and detect complications early.",
    indications: [
      "Postoperative thoracic surgery",
      "Pneumothorax or hemothorax",
      "Pleural effusion requiring drainage",
      "Empyema management"
    ],
    contraindications: [
      "Do not clamp during transport unless ordered",
      "Relative: unstable insertion site bleeding"
    ],
    equipment: [
      "Commercial drainage system with suction regulator",
      "Occlusive dressings and sterile gauze",
      "Kelly clamps for system changes",
      "Pulse oximeter",
      "Pain control supplies"
    ],
    steps: [
      "Verify order for suction vs. water seal and keep system below chest level.",
      "Assess insertion site for subcutaneous emphysema, drainage, and dressing integrity.",
      "Check water-seal chamber for tidaling and air leaks; document output hourly for first 24 hours.",
      "Encourage coughing, deep breathing, and incentive spirometry.",
      "When changing systems, clamp briefly per policy, purge air, and reconnect promptly.",
      "Prepare patient and supplies for provider removal; perform occlusive dressing afterward."
    ],
    safetyAlerts: [
      "Do not strip tubing; gentle milking only per policy.",
      "If tube disconnects, place end in sterile water and call provider.",
      "Sudden cessation of output with respiratory distress may indicate obstruction."
    ],
    complications: [
      "Re-expansion pulmonary edema",
      "Infection",
      "Tube dislodgement",
      "Tension pneumothorax"
    ],
    documentation: [
      "Drainage amount/color/consistency",
      "Suction level and water seal status",
      "Respiratory assessment and pain score",
      "Patient education and mobility support"
    ],
    patientTeaching: [
      "Encourage splinting during coughing and safe ambulation with system upright.",
      "Explain alarms/bubbling and when to notify nurse.",
      "Review breathing exercises to prevent atelectasis."
    ]
  },
  {
    id: "inline-suction",
    category: "AIRWAY & RESPIRATORY",
    title: "Inline Suctioning and Bronchial Hygiene",
    description: "Closed-system suction and recruitment to prevent VAP.",
    definition: "Maintaining secretion clearance and lung recruitment in mechanically ventilated patients using closed suction and physiotherapy adjuncts.",
    indications: [
      "Visible secretions or coarse breath sounds",
      "Increased peak pressures",
      "SpO2 decline or ventilator alarms",
      "Routine VAP prevention protocols"
    ],
    contraindications: [
      "Severe bronchospasm (premedicate)",
      "Recent lung surgery with restricted suction depth"
    ],
    equipment: [
      "Closed suction catheter system",
      "Sterile saline for lavage if ordered",
      "Hyperoxygenation source",
      "Sputum trap for cultures",
      "Percussion/vibration devices"
    ],
    steps: [
      "Perform hand hygiene, don PPE, and pre-oxygenate with 100% FiO2 for 1 minute.",
      "Unlock catheter, advance without suction until resistance or predetermined depth.",
      "Apply suction <15 seconds while withdrawing and rotating catheter.",
      "Flush catheter with sterile saline, resume baseline FiO2, and assess vitals.",
      "Perform lung recruitment maneuvers if ordered.",
      "Document secretion characteristics and response."
    ],
    safetyAlerts: [
      "Stop immediately for bradycardia or arrhythmias.",
      "Avoid routine saline instillation unless required for thick secretions.",
      "Maintain closed system integrity to prevent VAP."
    ],
    complications: [
      "Hypoxemia",
      "Bronchospasm",
      "Mucosal trauma",
      "Infection"
    ],
    documentation: [
      "Number of suction passes and depth",
      "Secretion appearance",
      "Pre/post vital signs and ventilator changes",
      "Specimens sent"
    ],
    patientTeaching: [
      "Explain suction sensation and reassure that breathing support continues.",
      "Encourage signaling if distress occurs during suction.",
      "Teach family why oral care and suctioning reduce pneumonia risk."
    ]
  },
  {
    id: "vap-prevention",
    category: "AIRWAY & RESPIRATORY",
    title: "Ventilator-Associated Event Prevention Bundle",
    description: "Daily protocol for head elevation, oral care, sedation, and mobility.",
    definition: "Evidence-based care set that reduces ventilator-associated pneumonia and complications through positioning, oral hygiene, sedation management, and mobility.",
    indications: [
      "All invasively ventilated patients",
      "Tracheostomy patients on ventilation",
      "Long-term ventilator weaning programs"
    ],
    contraindications: [
      "Head-of-bed contraindicated—document and use alternative",
      "Severe hemodynamic instability limiting mobility"
    ],
    equipment: [
      "Oral care kits with chlorhexidine",
      "Subglottic suction ETT",
      "Sedation vacation checklist",
      "Mobility aids",
      "Daily goal board"
    ],
    steps: [
      "Maintain head-of-bed 30–45° unless contraindicated.",
      "Perform oral care with antiseptic every 4 hours and subglottic suctioning.",
      "Conduct spontaneous awakening/breathing trials daily with provider.",
      "Assess readiness to extubate and manage sedation to RASS targets.",
      "Implement early mobility (dangling, chair, ambulation) as tolerated.",
      "Document bundle compliance and barriers."
    ],
    safetyAlerts: [
      "Hold mobility for MAP <65 mmHg or FiO2 >0.6 unless cleared.",
      "Ensure adequate staffing during spontaneous breathing trials.",
      "Chlorhexidine contraindicated in mucositis—use alternative agent."
    ],
    complications: [
      "Self-extubation",
      "Delirium",
      "Ventilator-associated pneumonia",
      "Pressure injuries"
    ],
    documentation: [
      "Daily bundle elements completed/omitted",
      "Sedation scale and breathing trial results",
      "Mobility level achieved",
      "Barriers escalated to provider"
    ],
    patientTeaching: [
      "Set daily communication goals even when sedated through family updates.",
      "Explain purpose of oral care and head-of-bed elevation.",
      "Discuss plan for ventilator liberation and therapy participation."
    ]
  },
  {
    id: "oxygen-titration",
    category: "AIRWAY & RESPIRATORY",
    title: "Oxygen Therapy Titration and Weaning",
    description: "Goal-directed oxygen delivery aligned with global targets.",
    definition: "Adjusting oxygen delivery devices to maintain patient-specific saturation goals while minimizing hyperoxia risk.",
    indications: [
      "Hypoxemia below goal",
      "Postoperative respiratory support",
      "Acute coronary syndromes with hypoxia",
      "Palliative comfort oxygen"
    ],
    contraindications: [
      "Fire risk in procedural areas",
      "Use caution in CO2 retainers to avoid narcosis"
    ],
    equipment: [
      "Device spectrum (nasal cannula, mask, venturi, NRB)",
      "Humidifier",
      "Pulse oximeter and ABG access",
      "Oxygen signage"
    ],
    steps: [
      "Verify ordered target saturation (94–98%, 88–92% in COPD).",
      "Assess baseline vitals and device fit; humidify flows >4 L/min.",
      "Increase FiO2 stepwise until target reached; reassess after each change.",
      "Once stable, wean by reducing FiO2/flow while monitoring SpO2 and respiratory status.",
      "Document device, flow, patient response, and escalate for persistent hypoxia.",
      "Educate on fire safety and avoiding petroleum products near oxygen."
    ],
    safetyAlerts: [
      "Notify provider if FiO2 >0.6 required beyond 24 hours.",
      "Avoid open flames and sparking devices near oxygen setup.",
      "Monitor for CO2 narcosis in chronic retainers when SpO2 >92%."
    ],
    complications: [
      "Dry mucosa",
      "Skin breakdown",
      "Hypercapnia",
      "Absorption atelectasis"
    ],
    documentation: [
      "Device, flow, FiO2, and humidification",
      "SpO2/ABG trends",
      "Safety teaching and adjustments",
      "Adverse responses"
    ],
    patientTeaching: [
      "Demonstrate device care and tubing placement.",
      "Review home oxygen safety (no smoking, secure cylinders).",
      "Encourage pursed-lip breathing during weaning."
    ]
  },
  {
    id: "arterial-line-management",
    category: "CARDIOVASCULAR",
    title: "Arterial Line Setup and Maintenance",
    description: "Continuous blood pressure monitoring and blood sampling protocol.",
    definition: "Nursing management of invasive arterial catheters to ensure accurate hemodynamic data and prevent infection or thrombosis.",
    indications: [
      "Hemodynamic instability requiring beat-to-beat monitoring",
      "Frequent arterial blood gases",
      "Vasoactive infusions",
      "Major surgery"
    ],
    contraindications: [
      "Limb ischemia distal to insertion site",
      "Allergy to chlorhexidine (use alternative)",
      "Severe coagulopathy"
    ],
    equipment: [
      "Arterial line kit with catheter",
      "Pressure bag and transducer set",
      "Flushing solution (heparinized per policy)",
      "Leveling device",
      "Sterile dressing materials"
    ],
    steps: [
      "Prime tubing, remove air, and connect to transducer maintaining sterility.",
      "Level transducer at phlebostatic axis and zero to air before connecting to patient.",
      "Assist provider with insertion; secure line and apply transparent dressing.",
      "Perform fast-flush and square wave test every shift to validate waveform.",
      "Draw ABGs using closed system, discarding per protocol and flushing after each draw.",
      "Assess limb perfusion hourly and rotate immobilizer position."
    ],
    safetyAlerts: [
      "Never infuse medications through arterial line.",
      "Activate alarms—do not silence longer than two minutes.",
      "Report dampened waveform unresponsive to troubleshooting; may signal clot."
    ],
    complications: [
      "Thrombosis",
      "Bleeding",
      "Infection",
      "Air embolism"
    ],
    documentation: [
      "Insertion site, waveform quality, and flush solution",
      "Zeroing time and leveling reference",
      "Site assessments and dressing changes",
      "Samples drawn and patient tolerance"
    ],
    patientTeaching: [
      "Explain purpose of line and need to keep limb immobilized.",
      "Instruct to report numbness, tingling, or dampness at site.",
      "Discuss plan for removal once stable."
    ]
  },
  {
    id: "peripheral-iv-insertion",
    category: "CARDIOVASCULAR",
    title: "Peripheral IV Catheter Insertion",
    description: "Ultrasound-guided and landmark techniques for venous access.",
    definition: "Establishing peripheral venous access using aseptic technique to administer fluids, medications, or blood products.",
    indications: [
      "IV therapy",
      "Emergency access",
      "Diagnostic contrast administration",
      "Short-term blood sampling"
    ],
    contraindications: [
      "Infected, burned, or edematous sites",
      "Extremity with fistula, lymphedema, or mastectomy",
      "Veins distal to phlebitis"
    ],
    equipment: [
      "IV catheter of appropriate gauge",
      "Tourniquet or BP cuff",
      "Skin antiseptic",
      "Transparent dressing and stabilization device",
      "Saline flush"
    ],
    steps: [
      "Identify patient, review allergies, and explain procedure.",
      "Select site using visualization/ultrasound and cleanse skin for 30 seconds.",
      "Insert catheter bevel up at 10–30° until flashback seen, advance catheter while withdrawing stylet.",
      "Release tourniquet, connect extension tubing, flush, and secure with stabilization device/dressing.",
      "Label with date/time/gauge and document attempts.",
      "Dispose of sharps safely."
    ],
    safetyAlerts: [
      "Limit attempts to two per clinician to avoid trauma.",
      "Use ultrasound for difficult access patients to reduce infiltration.",
      "Never reinsert stylet into catheter."
    ],
    complications: [
      "Infiltration/extravasation",
      "Phlebitis",
      "Infection",
      "Nerve injury"
    ],
    documentation: [
      "Site, vein, gauge, number of attempts",
      "Patient tolerance and analgesia",
      "Condition of site and dressing",
      "Education provided"
    ],
    patientTeaching: [
      "Encourage reporting of pain, swelling, or leaking immediately.",
      "Explain dressing must stay clean and dry.",
      "Discuss plan for site rotation per policy."
    ]
  },
  {
    id: "central-line-care",
    category: "CARDIOVASCULAR",
    title: "Central Venous Catheter Maintenance",
    description: "Daily care bundle for CVC patency and CLABSI prevention.",
    definition: "Nursing practices that maintain central line sterility, verify placement, and manage lumens for infusions.",
    indications: [
      "Long-term vasoactive therapy",
      "TPN administration",
      "Frequent blood sampling",
      "Poor peripheral access"
    ],
    contraindications: [
      "Patient refusal for dressing change",
      "Unstable condition requiring postponement"
    ],
    equipment: [
      "Central line dressing kit",
      "Antimicrobial caps and needleless connectors",
      "Heparin or saline flushes",
      "Securement device",
      "CHG bathing supplies"
    ],
    steps: [
      "Perform daily necessity review and document indication.",
      "Scrub hub for 15 seconds before every access and use disinfecting caps.",
      "Change transparent dressing every 7 days or sooner if soiled, using sterile technique.",
      "Flush each lumen per policy (push-pause) and lock with prescribed solution.",
      "Label lumens for specific infusions and avoid mixing incompatible drugs.",
      "Educate patient on keeping site dry and reporting discomfort."
    ],
    safetyAlerts: [
      "Never draw blood from TPN lumen to avoid contamination.",
      "Hold dressing change if platelet count critically low unless life-threatening.",
      "Report signs of CLABSI (fever, erythema, purulence) immediately."
    ],
    complications: [
      "CLABSI",
      "Thrombosis",
      "Line occlusion",
      "Air embolism"
    ],
    documentation: [
      "Indication review and provider confirmation",
      "Dressing condition and changes",
      "Flush volumes and lumen labels",
      "Patient/family education"
    ],
    patientTeaching: [
      "Teach to keep hands away from connectors and not manipulate lumens.",
      "Explain importance of daily CHG bathing or wipes.",
      "Review symptoms requiring urgent reporting (fever, chills, swelling)."
    ]
  },
  {
    id: "vasopressor-infusion",
    category: "CARDIOVASCULAR",
    title: "Peripheral Vasopressor Infusion Safety",
    description: "Short-term peripheral administration protocol with frequent assessments.",
    definition: "Nursing safeguards for administering vasoactive medications through peripheral IVs when central access is unavailable.",
    indications: [
      "Shock requiring immediate vasopressors",
      "Bridge while securing central access",
      "Transport or procedural support"
    ],
    contraindications: [
      "IVs distal to hand/foot",
      "Infiltrated or fragile veins",
      "Known extravasation injury"
    ],
    equipment: [
      "Ultrasound-placed large-bore IV",
      "Smart pump with drug library",
      "Extravasation antidotes (phentolamine)",
      "Transparent dressing",
      "Hourly limb perfusion checklist"
    ],
    steps: [
      "Verify drug concentration and dosing using smart pump safeguards.",
      "Select proximal vein, ensure brisk blood return, and dedicate line to vasopressor.",
      "Assess site, distal pulses, and sensation every 5–15 minutes for first hour, then hourly.",
      "Keep antidote at bedside and plan for central line within six hours.",
      "Document assessments and escalate for any blanching, pain, or swelling.",
      "Transition infusion to central access promptly when available."
    ],
    safetyAlerts: [
      "Stop infusion immediately if extravasation suspected and initiate antidote.",
      "Do not piggyback other medications into pressor line.",
      "Maintain MAP goals; titrate per protocol with dual nurse verification."
    ],
    complications: [
      "Extravasation injury",
      "Arrhythmias",
      "Hypertensive crisis",
      "Ischemia"
    ],
    documentation: [
      "Drug, dose, titration range, and site assessments",
      "Patient hemodynamic response",
      "Central line plan",
      "Adverse events and interventions"
    ],
    patientTeaching: [
      "Inform patient about need for frequent arm checks and to report tingling or burning.",
      "Explain that medication supports blood pressure temporarily.",
      "Discuss plan for safer central access once stabilized."
    ]
  },
  {
    id: "medication-double-check",
    category: "CARDIOVASCULAR",
    title: "High-Alert Medication Double-Check",
    description: "Independent verification workflow for vasoactives, insulin, and anticoagulants.",
    definition: "Structured two-nurse process verifying right patient, drug, dose, concentration, route, and pump programming before administering high-risk medications.",
    indications: [
      "Infusions of vasopressors, insulin, heparin",
      "Chemotherapy or concentrated electrolytes",
      "Pediatric weight-based dosing",
      "Policy-mandated high-alert medications"
    ],
    contraindications: [
      "Emergent code situations where second nurse unavailable (document)"
    ],
    equipment: [
      "Medication order and MAR",
      "Smart pump or syringe pump",
      "Barcode administration system",
      "Calculator or dosing app",
      "Bedside labeling supplies"
    ],
    steps: [
      "Gather order, medication, and pump settings at bedside.",
      "Two nurses independently verify patient identifiers, drug, concentration, rate, and calculations.",
      "Program smart pump library entry; both nurses confirm display prior to infusion.",
      "Label tubing with drug name/time and document verification in MAR.",
      "Re-verify with second nurse for titration outside preset limits.",
      "Report discrepancies or near-misses via safety event system."
    ],
    safetyAlerts: [
      "Never rely solely on verbal confirmation; both must review original order.",
      "Use line isolation for look-alike solutions.",
      "Pause distractions—use do-not-interrupt zones during calculations."
    ],
    complications: [
      "Medication errors",
      "Pump misprogramming",
      "Patient harm from wrong dose",
      "Delayed therapy"
    ],
    documentation: [
      "Name/initials of verifying nurses",
      "Dose, rate, and reference used",
      "Any rate adjustments",
      "Event reports submitted"
    ],
    patientTeaching: [
      "Explain why two nurses are verifying medication for safety.",
      "Encourage patients to speak up about allergies or past reactions.",
      "Discuss expected effects and monitoring frequency."
    ]
  },
  {
    id: "blood-transfusion",
    category: "CARDIOVASCULAR",
    title: "Blood Transfusion Administration",
    description: "Evidence-based transfusion safety from consent to post-monitoring.",
    definition: "Administering blood components using standardized verification, infusion, and monitoring practices to minimize reactions.",
    indications: [
      "Symptomatic anemia",
      "Hemorrhagic shock",
      "Coagulopathy requiring plasma",
      "Thrombocytopenia requiring platelets"
    ],
    contraindications: [
      "Patient refusal",
      "Documented incompatible crossmatch",
      "History of severe reactions without mitigation plan"
    ],
    equipment: [
      "Blood product with compatibility paperwork",
      "IV line with filter",
      "Infusion pump",
      "Vital sign equipment",
      "Emergency medications"
    ],
    steps: [
      "Verify order, consent, and pretransfusion labs.",
      "Two nurses perform bedside match of patient ID, blood type, unit number, and expiration.",
      "Prime tubing with normal saline, initiate infusion slowly, and monitor vitals at baseline, 15 minutes, hourly, and completion.",
      "Increase rate per order if no reaction; complete within four hours.",
      "Flush line post transfusion and dispose of materials per policy.",
      "Document unit details and patient response."
    ],
    safetyAlerts: [
      "Stop infusion immediately for reaction symptoms and maintain IV access with saline.",
      "Never add medications to blood tubing.",
      "Warm blood only with approved devices for rapid transfusion."
    ],
    complications: [
      "Hemolytic reaction",
      "Febrile non-hemolytic reaction",
      "Transfusion-associated circulatory overload",
      "TRALI",
      "Hypothermia"
    ],
    documentation: [
      "Unit number, lot, blood type, and volume",
      "Start/stop times and vital signs",
      "Patient response and education",
      "Adverse reactions and reporting"
    ],
    patientTeaching: [
      "Describe reason for transfusion and expected benefits.",
      "Instruct to report itching, chills, or chest pain immediately.",
      "Explain post-transfusion lab draws or monitoring."
    ]
  },
  {
    id: "massive-transfusion",
    category: "CARDIOVASCULAR",
    title: "Massive Transfusion Protocol Support",
    description: "Coordinated nursing actions for hemorrhage control and balanced product delivery.",
    definition: "Activation and management of institutional massive transfusion protocols ensuring rapid delivery of blood components, labs, and temperature control.",
    indications: [
      "Hemorrhagic shock with >4 units anticipated in one hour",
      "Trauma with unstable vitals",
      "Postpartum hemorrhage",
      "Operative bleeding requiring rapid replacement"
    ],
    contraindications: [
      "Inability to secure IV/IO access",
      "Refusal of blood products"
    ],
    equipment: [
      "Rapid infuser or Level 1 device",
      "Blood warmers",
      "Large-bore IV/IO access",
      "Calcium replacement and lab supplies",
      "MTP checklist and communication board"
    ],
    steps: [
      "Activate MTP per criteria and notify lab/blood bank with identifiers.",
      "Obtain baseline labs (CBC, CMP, ABG, coagulation) and repeat per protocol.",
      "Administer balanced ratios while warming all products and monitoring core temperature.",
      "Track calcium, potassium, and acid-base status; replace electrolytes as needed.",
      "Coordinate surgical/interventional teams for definitive hemorrhage control.",
      "Debrief and document totals, outcomes, and waste."
    ],
    safetyAlerts: [
      "Replace calcium every 4 units of citrated blood.",
      "Prevent hypothermia with warming devices and blankets.",
      "Stop MTP promptly once bleeding controlled to avoid overload."
    ],
    complications: [
      "Coagulopathy",
      "Hypothermia",
      "Hypocalcemia",
      "Hyperkalemia",
      "Volume overload"
    ],
    documentation: [
      "MTP activation time and team members",
      "Products administered and lab trends",
      "Vital signs and temperature management",
      "Complications and escalation steps"
    ],
    patientTeaching: [
      "When feasible, explain need for rapid blood replacement to patient/family.",
      "Discuss potential need for additional surgeries or ICU stay.",
      "Provide updates on progress and hemodynamic goals."
    ]
  },
  {
    id: "im-injection",
    category: "MEDICATION ADMINISTRATION",
    title: "Intramuscular Injection Technique",
    description: "Safe medication delivery into large muscle groups with needle selection.",
    definition: "Administration of medications into muscle tissue using landmark-based technique to ensure absorption and minimize injury.",
    indications: [
      "Vaccinations",
      "Antibiotics",
      "Hormonal therapies",
      "Emergency medications"
    ],
    contraindications: [
      "Site infection or muscle atrophy",
      "Bleeding disorders without prophylaxis",
      "Allergy to medication"
    ],
    equipment: [
      "Appropriate syringe and needle length",
      "Medication vial/ampule",
      "Alcohol swabs",
      "Gauze and bandage",
      "Sharps container"
    ],
    steps: [
      "Verify order, allergies, and patient identity; perform hand hygiene.",
      "Select site (deltoid, ventrogluteal, vastus lateralis) based on volume/age.",
      "Cleanse site, allow to dry, use Z-track if medication irritating, insert needle at 90°, aspirate per policy, and inject steadily.",
      "Withdraw needle, apply gentle pressure, and dispose in sharps.",
      "Document medication, dose, site, and response.",
      "Observe for immediate adverse reactions."
    ],
    safetyAlerts: [
      "Use ventrogluteal site to avoid sciatic nerve injury.",
      "Avoid deltoid for volumes >2 mL.",
      "Employ safety devices to prevent needlesticks."
    ],
    complications: [
      "Bleeding",
      "Hematoma",
      "Nerve injury",
      "Injection site infection"
    ],
    documentation: [
      "Medication name, dose, route, site",
      "Lot number for vaccines",
      "Patient tolerance and teaching",
      "Adverse reactions"
    ],
    patientTeaching: [
      "Explain expected soreness and use of cold pack if needed.",
      "Review signs of infection or allergic reaction.",
      "Discuss schedule for next dose if series required."
    ]
  },
  {
    id: "subcutaneous-insulin",
    category: "MEDICATION ADMINISTRATION",
    title: "Subcutaneous Insulin Administration",
    description: "Basal-bolus and correction insulin delivery with glucose monitoring.",
    definition: "Precise dosing of insulin via subcutaneous tissue using safety syringes or pens to maintain glycemic targets.",
    indications: [
      "Type 1 or Type 2 diabetes",
      "Stress hyperglycemia",
      "Perioperative glycemic control",
      "Steroid-induced hyperglycemia"
    ],
    contraindications: [
      "Lipodystrophy at injection site",
      "Hypoglycemia (<70 mg/dL)",
      "Patient refusal"
    ],
    equipment: [
      "Insulin pen/syringe",
      "Alcohol swabs",
      "Glucose meter",
      "Sharps container",
      "Hypoglycemia rescue supplies"
    ],
    steps: [
      "Confirm blood glucose, review meal schedule, and verify dose with double-check if required.",
      "Rotate injection sites (abdomen, thigh, arm) avoiding 2-inch radius around navel.",
      "Cleanse skin, pinch subcutaneous tissue, insert needle at 45–90°, inject slowly, and count to 10 before withdrawing.",
      "Dispose of needle safely and recheck glucose per protocol.",
      "Document dose, time, site, and patient intake.",
      "Monitor for hypo/hyperglycemia symptoms."
    ],
    safetyAlerts: [
      "Hold rapid-acting insulin if patient NPO unless correction ordered.",
      "Confirm insulin type to avoid mix-ups.",
      "Have dextrose available for hypoglycemia treatment."
    ],
    complications: [
      "Hypoglycemia",
      "Lipohypertrophy",
      "Injection site bruising",
      "Allergic reaction"
    ],
    documentation: [
      "Blood glucose and insulin administered",
      "Site rotation records",
      "Education provided",
      "Hypoglycemia events"
    ],
    patientTeaching: [
      "Demonstrate technique and site rotation using teach-back.",
      "Review hypoglycemia symptoms and treatment.",
      "Discuss storage, expiration, and travel considerations."
    ]
  },
  {
    id: "pca-management",
    category: "MEDICATION ADMINISTRATION",
    title: "Patient-Controlled Analgesia Initiation",
    description: "Programming, monitoring, and escalation for opioid PCAs.",
    definition: "Safe setup and oversight of PCA pumps ensuring appropriate dosing, monitoring sedation, and preventing respiratory depression.",
    indications: [
      "Postoperative pain",
      "Cancer pain",
      "Sickle cell vaso-occlusive crisis",
      "Burn injuries"
    ],
    contraindications: [
      "Patient unable to understand/use button",
      "Uncontrolled sleep apnea",
      "Concurrent neuraxial opioids without monitoring",
      "Infants or cognitively impaired adults"
    ],
    equipment: [
      "PCA pump with lockbox",
      "Medication cassette",
      "Capnography or pulse oximeter",
      "Pain/sedation assessment tools",
      "Naloxone kit"
    ],
    steps: [
      "Verify order (drug, concentration, bolus, lockout, basal) with double-check.",
      "Prime tubing, connect to dedicated IV line, and program pump using drug library.",
      "Educate patient to be sole user of button and instruct family not to press.",
      "Assess pain, sedation (RASS), and respiratory status hourly for first four hours.",
      "Adjust settings per provider order based on assessments.",
      "Document totals, attempts, and interventions each shift."
    ],
    safetyAlerts: [
      "Continuous capnography recommended for high-risk patients.",
      "Avoid basal infusion in opioid-naïve patients unless ordered.",
      "Hold PCA and notify provider for RR <10 or sedation score >2."
    ],
    complications: [
      "Respiratory depression",
      "Hypotension",
      "Nausea/vomiting",
      "Pruritus"
    ],
    documentation: [
      "Pump settings, totals, and attempts",
      "Pain/sedation scores",
      "Adverse effects and treatments",
      "Education reinforcement"
    ],
    patientTeaching: [
      "Emphasize only patient should press button to match pain to dose.",
      "Explain lockout prevents overdosing.",
      "Review need to notify nurse if pain uncontrolled or symptoms occur."
    ]
  },
  {
    id: "crrt-setup",
    category: "RENAL & ELIMINATION",
    title: "Continuous Renal Replacement Therapy Setup",
    description: "Initiating and monitoring CRRT circuits with anticoagulation management.",
    definition: "Preparing, initiating, and troubleshooting continuous renal replacement therapy for hemodynamically unstable patients needing renal support.",
    indications: [
      "Acute kidney injury with fluid overload",
      "Septic shock requiring gentle solute removal",
      "Toxic ingestion",
      "Severe electrolyte imbalance"
    ],
    contraindications: [
      "Inability to secure vascular access",
      "Uncontrolled bleeding or contraindications to anticoagulation",
      "Refusal of therapy"
    ],
    equipment: [
      "CRRT machine with disposable circuit",
      "Replacement and dialysate solutions",
      "Anticoagulant (citrate or heparin)",
      "Vascular catheter",
      "Calcium infusion pump when citrate used"
    ],
    steps: [
      "Prime circuit per manufacturer instructions and remove all air.",
      "Verify prescription (dose, modality, fluid rates) and program machine.",
      "Connect to vascular access using aseptic technique and secure lines.",
      "Monitor pressures, filter life, electrolytes, and ultrafiltration hourly.",
      "Adjust fluids/anticoagulation per labs and hemodynamic status.",
      "Document intake/output balance and escalate alarms promptly."
    ],
    safetyAlerts: [
      "Check ionized calcium hourly with citrate therapy and replace promptly.",
      "Avoid air embolism by clamping lines before disconnects.",
      "Maintain warming devices to prevent hypothermia."
    ],
    complications: [
      "Circuit clotting",
      "Hypothermia",
      "Electrolyte imbalance",
      "Bleeding"
    ],
    documentation: [
      "Prescription parameters and changes",
      "Hourly intake/output and weights",
      "Lab results and replacements",
      "Alarm events and troubleshooting"
    ],
    patientTeaching: [
      "Explain reason for continuous dialysis and expected duration.",
      "Discuss limited mobility while connected and strategies for comfort.",
      "Update family on lab trends and fluid goals."
    ]
  },
  {
    id: "urinary-catheter",
    category: "RENAL & ELIMINATION",
    title: "Foley Catheter Insertion and Maintenance",
    description: "Aseptic insertion, securement, and CAUTI prevention.",
    definition: "Sterile placement of an indwelling urinary catheter and ongoing care to monitor output and prevent infection.",
    indications: [
      "Acute urinary retention",
      "Precise output monitoring in critical illness",
      "Perioperative urologic or long surgeries",
      "Comfort care when severe skin breakdown risk"
    ],
    contraindications: [
      "Suspected urethral injury",
      "Recent urologic surgery with restrictions",
      "Patient refusal"
    ],
    equipment: [
      "Catheterization kit",
      "Sterile gloves and drapes",
      "Appropriate Foley catheter",
      "Securement device",
      "Closed drainage bag"
    ],
    steps: [
      "Perform hand hygiene, explain procedure, and position patient.",
      "Open kit maintaining sterility, don sterile gloves, and drape perineum.",
      "Cleanse meatus appropriately, lubricate catheter, insert until urine flows, then advance 2–3 cm before inflating balloon.",
      "Gently pull to ensure placement, secure catheter, and position bag below bladder.",
      "Perform daily necessity review, perineal hygiene, and keep a closed system.",
      "Document insertion details, output characteristics, and removal plan."
    ],
    safetyAlerts: [
      "Use smallest catheter size to reduce urethral trauma.",
      "Maintain unobstructed flow—no dependent loops in tubing.",
      "Remove catheter as soon as no longer indicated."
    ],
    complications: [
      "Catheter-associated urinary tract infection",
      "Urethral trauma",
      "Bladder spasms",
      "Hematuria"
    ],
    documentation: [
      "Date/time, catheter type/size, balloon volume",
      "Indication and daily review",
      "Urine characteristics",
      "Patient tolerance and teaching"
    ],
    patientTeaching: [
      "Explain purpose of catheter and plan for removal.",
      "Encourage reporting of discomfort or leaking.",
      "Teach perineal hygiene and bag positioning if discharged with catheter."
    ]
  },
  {
    id: "bladder-scan-straight-catheter",
    category: "RENAL & ELIMINATION",
    title: "Bladder Scan and Intermittent Catheterization",
    description: "Bedside assessment of post-void residual with sterile straight cath when indicated.",
    definition: "Using ultrasound to quantify bladder volume and performing intermittent catheterization to relieve retention while minimizing infection risk.",
    indications: [
      "Suspected urinary retention",
      "Neurogenic bladder monitoring",
      "Postoperative voiding trials",
      "Spinal cord injury care"
    ],
    contraindications: [
      "Urethral trauma",
      "Recent urologic reconstruction",
      "Large pelvic hematoma obscuring bladder scan"
    ],
    equipment: [
      "Bladder scanner",
      "Straight catheter kit",
      "Lubricant",
      "Sterile gloves",
      "Urine collection container"
    ],
    steps: [
      "Measure bladder volume per manufacturer instructions; document pre/post void values.",
      "Perform intermittent catheterization using sterile technique if volume exceeds ordered threshold (commonly >400 mL).",
      "Drain urine slowly to avoid spasms, measure output, and remove catheter immediately.",
      "Encourage timed voiding schedule and hydration as appropriate.",
      "Repeat scans per protocol until residuals within goal.",
      "Communicate abnormal findings to provider."
    ],
    safetyAlerts: [
      "Stop insertion if resistance met—do not force.",
      "Use coude catheter for male patients with enlarged prostate per order.",
      "Monitor for autonomic dysreflexia in spinal cord injury patients."
    ],
    complications: [
      "Urethral trauma",
      "Infection",
      "Bladder spasms",
      "Vagal response"
    ],
    documentation: [
      "Bladder scan volumes",
      "Catheter size and attempt details",
      "Urine characteristics",
      "Patient tolerance"
    ],
    patientTeaching: [
      "Explain reason for bladder scan and intermittent catheterization.",
      "Teach double-voiding and scheduled toileting strategies.",
      "Discuss signs of UTI and when to seek care."
    ]
  },
  {
    id: "bowel-program-enema",
    category: "RENAL & ELIMINATION",
    title: "Bowel Program and Tap Water Enema",
    description: "Evidence-based bowel regimen for neurogenic or postoperative constipation.",
    definition: "Structured elimination plan combining timed enemas, stool softeners, and digital stimulation to promote regular bowel movements.",
    indications: [
      "Neurogenic bowel",
      "Severe constipation unresponsive to oral agents",
      "Pre-procedure colon preparation",
      "Postoperative ileus prevention"
    ],
    contraindications: [
      "Recent colorectal surgery without clearance",
      "Suspected bowel obstruction",
      "Severe neutropenia (use sterile technique)"
    ],
    equipment: [
      "Enema bag or syringe",
      "Luke-warm tap water",
      "Water-soluble lubricant",
      "Underpads and bedpan",
      "Digital stimulation glove"
    ],
    steps: [
      "Review bowel regimen orders, assess abdomen, and obtain consent.",
      "Position patient in left lateral Sims, lubricate rectal tube, and instill prescribed volume slowly.",
      "Encourage patient to retain solution 5–10 minutes while providing privacy and monitoring vitals.",
      "Assist to commode/bedpan, perform digital stimulation if ordered, and evaluate stool consistency.",
      "Reinforce hydration, fiber, and mobility strategies.",
      "Document results and patient tolerance."
    ],
    safetyAlerts: [
      "Stop for severe cramping, bleeding, or vagal symptoms.",
      "Use caution in cardiac patients due to potential bradycardia.",
      "Avoid hypertonic enemas in pediatrics unless prescribed."
    ],
    complications: [
      "Electrolyte imbalance",
      "Mucosal trauma",
      "Vagal response",
      "Perforation (rare)"
    ],
    documentation: [
      "Enema type/volume",
      "Stool characteristics",
      "Patient response",
      "Education and lifestyle coaching"
    ],
    patientTeaching: [
      "Explain schedule and importance of consistent timing.",
      "Encourage hydration, fiber, and activity within limits.",
      "Teach warning signs requiring provider notification (bleeding, severe pain)."
    ]
  },
  {
    id: "enteral-tube-placement",
    category: "GASTROINTESTINAL & NUTRITION",
    title: "Enteral Feeding Tube Placement Verification",
    description: "Multimodal verification before feeding or medication administration.",
    definition: "Confirming nasogastric or post-pyloric tube position using aspirate pH, external markings, and imaging to prevent aspiration.",
    indications: [
      "Initial tube placement",
      "Tube dislodgement suspicion",
      "Routine pre-feed safety checks",
      "Medication administration via tube"
    ],
    contraindications: [
      "Basilar skull fracture",
      "Severe facial trauma",
      "Recent nasal surgery"
    ],
    equipment: [
      "pH indicator strips",
      "60 mL syringe",
      "Stethoscope",
      "Radiography access",
      "Securement device"
    ],
    steps: [
      "Inspect tube length at nare and compare to documented mark.",
      "Aspirate contents, test pH (goal ≤5.5), and assess color/consistency.",
      "For new placements or uncertain findings, obtain radiographic confirmation before use.",
      "Secure tube with fixation device and route away from facial pressure points.",
      "Document verification method and patient tolerance.",
      "Hold feedings if verification unsuccessful and notify provider."
    ],
    safetyAlerts: [
      "Never rely on auscultation of air alone to confirm placement.",
      "Stop feeding immediately if patient coughs, desaturates, or tube length changes.",
      "Use capnography if available to detect tracheal placement during insertion."
    ],
    complications: [
      "Aspiration",
      "Sinusitis",
      "Epistaxis",
      "Esophageal perforation"
    ],
    documentation: [
      "Tube type/size and external length",
      "Verification method and results",
      "Patient response",
      "Provider notification if imaging obtained"
    ],
    patientTeaching: [
      "Explain purpose of tube and need to avoid pulling.",
      "Demonstrate how oral hygiene and positioning reduce aspiration risk.",
      "Review plan for eventual removal or replacement."
    ]
  },
  {
    id: "enteral-feeding-management",
    category: "GASTROINTESTINAL & NUTRITION",
    title: "Enteral Feeding Pump Management",
    description: "Programming, tolerance monitoring, and aspiration prevention.",
    definition: "Managing continuous or bolus enteral nutrition safely by verifying placement, programming pumps, and assessing tolerance.",
    indications: [
      "Patients unable to meet nutrition orally",
      "Critical illness requiring gut trophic feeds",
      "Head and neck cancer",
      "Neurologic dysphagia"
    ],
    contraindications: [
      "High-output fistula distal to feeding site",
      "Hemodynamic instability requiring vasopressors >0.2 µg/kg/min",
      "Active GI bleeding"
    ],
    equipment: [
      "Feeding pump and tubing",
      "Prescribed formula",
      "60 mL syringe",
      "Water for flushes",
      "Residual measurement log"
    ],
    steps: [
      "Verify tube placement, formula, and rate per order.",
      "Prime tubing, connect to feeding tube, and program pump with target rate/volume.",
      "Flush tube with water before/after medications and every 4 hours for continuous feeds.",
      "Assess abdominal distention, bowel sounds, residuals per policy, and glycemic response.",
      "Elevate head-of-bed ≥30° and use aspiration precautions.",
      "Document intake, tolerance, and any interruptions or rate changes."
    ],
    safetyAlerts: [
      "Hold feeds for residuals >500 mL unless provider instructs otherwise.",
      "Use closed-system formulas for immunocompromised patients and change per manufacturer guidance.",
      "Label tubing with date/time; discard open formula after 4–8 hours depending on product."
    ],
    complications: [
      "Aspiration pneumonia",
      "Diarrhea or constipation",
      "Hyperglycemia",
      "Tube occlusion"
    ],
    documentation: [
      "Formula type, rate, and total volume",
      "Flush volumes and residuals",
      "Tolerance and GI assessments",
      "Education reinforced"
    ],
    patientTeaching: [
      "Review schedule for feeding and water flushes.",
      "Teach how to clamp tubing before disconnecting to avoid leaks.",
      "Discuss signs of intolerance (nausea, bloating, diarrhea)."
    ]
  },
  {
    id: "tpn-safety",
    category: "GASTROINTESTINAL & NUTRITION",
    title: "Parenteral Nutrition Safety",
    description: "Central-line infusion protocol for TPN/PPN with metabolic monitoring.",
    definition: "Safe preparation, administration, and monitoring of parenteral nutrition to prevent infection, metabolic derangements, and line contamination.",
    indications: [
      "Short gut syndrome or malabsorption",
      "Inability to tolerate enteral feeds",
      "Severe pancreatitis",
      "Postoperative GI rest"
    ],
    contraindications: [
      "Inadequate central venous access",
      "Severe hyperglycemia despite insulin",
      "Patient refusal"
    ],
    equipment: [
      "Central line dedicated lumen",
      "Infusion pump",
      "In-line filter",
      "Glucose monitoring supplies",
      "Electrolyte replacement kits"
    ],
    steps: [
      "Verify formulation, check for precipitate, and compare label to order with double-check.",
      "Prime tubing with filter, connect to dedicated lumen, and program pump for ordered rate.",
      "Start infusion gradually, monitor glucose every 4–6 hours, and adjust insulin per protocol.",
      "Inspect catheter site each shift and change tubing every 24 hours.",
      "Never piggyback medications into TPN line; use separate lumen.",
      "Wean infusion slowly when discontinuing to prevent rebound hypoglycemia."
    ],
    safetyAlerts: [
      "Hold lipids for triglycerides >400 mg/dL and notify provider.",
      "Replace thiamine before starting nutrition in malnourished patients to prevent refeeding syndrome.",
      "Use dedicated pump channel with occlusion alarms enabled."
    ],
    complications: [
      "CLABSI",
      "Hyperglycemia",
      "Electrolyte imbalance",
      "Refeeding syndrome"
    ],
    documentation: [
      "Formula lot numbers and infusion rates",
      "Blood glucose and labs",
      "Line assessments and dressing changes",
      "Patient tolerance and education"
    ],
    patientTeaching: [
      "Explain why TPN requires central line and frequent labs.",
      "Discuss infection prevention measures (hand hygiene, line care).",
      "Prepare patient for gradual transition to oral/enteral nutrition."
    ]
  },
  {
    id: "wound-dressing-change",
    category: "WOUND & SKIN",
    title: "Sterile Wound Dressing Change",
    description: "Evidence-based wound assessment and sterile dressing replacement.",
    definition: "Maintaining wound bed moisture balance and sterility while assessing healing progress using aseptic technique.",
    indications: [
      "Surgical incisions",
      "Open wounds or drains",
      "Soiled or saturated dressings",
      "Provider-ordered wound care"
    ],
    contraindications: [
      "First 24 hours post-op without order",
      "Hemodynamically unstable patient",
      "Allergy to dressing components"
    ],
    equipment: [
      "Sterile dressing kit",
      "Sterile and clean gloves",
      "Normal saline or wound cleanser",
      "Appropriate dressings and securement",
      "Measuring device and camera (per policy)"
    ],
    steps: [
      "Perform hand hygiene, review orders, and explain procedure.",
      "Remove old dressing with clean gloves, assess wound, and dispose materials.",
      "Perform hand hygiene, don sterile gloves, cleanse wound from least to most contaminated area, and dry gently.",
      "Apply prescribed topical therapy and new dressing, ensuring no dead space.",
      "Label dressing with date/time and dispose of supplies per policy.",
      "Document wound measurements, tissue type, drainage, and patient tolerance."
    ],
    safetyAlerts: [
      "Stop if unexpected bleeding or evisceration occurs and notify provider immediately.",
      "Maintain warm environment to prevent shivering in large wounds.",
      "Use pain control measures before procedure."
    ],
    complications: [
      "Infection",
      "Delayed healing",
      "Bleeding",
      "Allergic reaction to products"
    ],
    documentation: [
      "Wound dimensions, tissue description, exudate",
      "Dressing type and adjuncts",
      "Patient pain score and tolerance",
      "Education and next dressing due"
    ],
    patientTeaching: [
      "Teach hand hygiene and dressing change schedule for home care.",
      "Explain signs of infection requiring evaluation.",
      "Discuss nutrition and glycemic control for healing."
    ]
  },
  {
    id: "negative-pressure-wound",
    category: "WOUND & SKIN",
    title: "Negative Pressure Wound Therapy Management",
    description: "Canister changes, seal troubleshooting, and exudate monitoring.",
    definition: "Maintaining vacuum-assisted closure systems to promote granulation and control exudate in complex wounds.",
    indications: [
      "Chronic pressure injuries",
      "Diabetic foot ulcers",
      "Surgical dehiscence",
      "Skin graft support"
    ],
    contraindications: [
      "Necrotic tissue with eschar",
      "Untreated osteomyelitis",
      "Exposed organs or vessels",
      "Malignancy in wound"
    ],
    equipment: [
      "Negative pressure device with canister",
      "Foam or gauze dressing kit",
      "Transparent drape",
      "Skin prep and barrier products",
      "Trac pad and tubing"
    ],
    steps: [
      "Medicate for pain, turn off device, and remove old dressing gently.",
      "Assess wound, cleanse per protocol, and protect periwound skin.",
      "Cut foam to size without overlapping intact skin, place in wound, and cover with drape ensuring airtight seal.",
      "Apply track pad, connect tubing, and restart device at ordered pressure (commonly −125 mmHg).",
      "Check for leaks, smooth drape edges, and document output volume/characteristics.",
      "Change canister per manufacturer or when 2/3 full."
    ],
    safetyAlerts: [
      "Stop therapy for bleeding, severe pain, or loss of seal that cannot be corrected.",
      "Use contact layer for exposed structures.",
      "Do not cut foam over wound to avoid fragments left behind."
    ],
    complications: [
      "Bleeding",
      "Tissue maceration",
      "Infection",
      "Ingrown foam"
    ],
    documentation: [
      "Dressing materials, pressure setting, and seal status",
      "Output volume/color",
      "Wound measurements",
      "Patient tolerance and teaching"
    ],
    patientTeaching: [
      "Explain device alarms and whom to contact if seal lost.",
      "Encourage limited tension on tubing during mobility.",
      "Review frequency of dressing changes and pain management plan."
    ]
  },
  {
    id: "pressure-injury-prevention",
    category: "WOUND & SKIN",
    title: "Pressure Injury Prevention Bundle",
    description: "Risk stratification, repositioning, and skin protection protocols.",
    definition: "Interdisciplinary practices that prevent pressure injuries by reducing shear, moisture, and pressure duration.",
    indications: [
      "Braden score ≤18",
      "Limited mobility",
      "Incontinence",
      "Critical illness"
    ],
    contraindications: [
      "None—modify techniques for unstable spine or hemodynamics"
    ],
    equipment: [
      "Support surfaces and repositioning devices",
      "Moisture barrier creams",
      "Heel protectors",
      "Positioning wedges",
      "Skin assessment tool"
    ],
    steps: [
      "Assess risk on admission and daily; post Braden score in care plan.",
      "Reposition at least every two hours or per individualized schedule using lift sheets to reduce shear.",
      "Float heels, manage moisture/incontinence, and optimize nutrition/hydration.",
      "Inspect skin head-to-toe once per shift and before/after procedures.",
      "Engage PT/OT for mobility optimization.",
      "Escalate equipment needs (low-air-loss mattress) promptly."
    ],
    safetyAlerts: [
      "Avoid donut cushions—they increase pressure.",
      "Check devices (splints, tubes) for hidden pressure points.",
      "Document refusal of repositioning and attempt alternative comfort measures."
    ],
    complications: [
      "Pressure injuries",
      "Moisture-associated skin damage",
      "Pain",
      "Infection"
    ],
    documentation: [
      "Risk score and interventions",
      "Repositioning schedule adherence",
      "Skin assessment findings",
      "Education to patient/caregiver"
    ],
    patientTeaching: [
      "Explain importance of frequent turns even during sleep.",
      "Teach to shift weight every 15 minutes when seated.",
      "Encourage adequate protein and hydration to support skin."
    ]
  },
  {
    id: "isolation-precautions",
    category: "INFECTION PREVENTION",
    title: "Isolation Precautions Implementation",
    description: "Selecting PPE, signage, and workflow to prevent pathogen transmission.",
    definition: "Applying standard, contact, droplet, or airborne precautions with appropriate PPE and patient placement to contain infectious agents.",
    indications: [
      "Known or suspected communicable disease",
      "Multidrug-resistant organism colonization",
      "Immunocompromised host protection",
      "Pandemic respiratory illness"
    ],
    contraindications: [
      "None—modify PPE if patient intolerant (e.g., mask for claustrophobic patients)",
      "Use additional respiratory support strategies for CO2 retainers"
    ],
    equipment: [
      "Isolation signage",
      "Hand hygiene supplies",
      "Appropriate PPE (gloves, gown, mask, respirator, eye protection)",
      "Dedicated equipment (stethoscope, BP cuff)",
      "Waste disposal bins"
    ],
    steps: [
      "Review organism-specific precautions and place signage at room entry.",
      "Stock PPE cart, provide patient/family education, and limit transport.",
      "Don PPE before entry, perform care minimizing movement of supplies, and doff PPE without contaminating clothing.",
      "Clean reusable equipment with approved disinfectant before removing from room.",
      "Coordinate with ancillary services for safe imaging/therapy pathways.",
      "Document isolation status and reassess need daily."
    ],
    safetyAlerts: [
      "Perform seal checks on N95/respirator before entering airborne rooms.",
      "Monitor for PPE supply shortages and escalate early.",
      "Provide surgical mask for patient during transport even if airborne precautions."
    ],
    complications: [
      "Isolation fatigue and delirium",
      "Skin irritation from PPE",
      "Missed care due to access barriers"
    ],
    documentation: [
      "Isolation type and start date",
      "Patient/family education",
      "Equipment dedicated to room",
      "Daily review notes"
    ],
    patientTeaching: [
      "Explain reason for isolation and expected duration.",
      "Teach hand hygiene and mask use for visitors.",
      "Provide options for communication to reduce loneliness."
    ]
  },
  {
    id: "sepsis-bundle",
    category: "CRITICAL CARE",
    title: "Hour-1 Sepsis Bundle Initiation",
    description: "Rapid screening, cultures, antibiotics, and perfusion support following Surviving Sepsis Campaign guidance.",
    definition: "Coordinated actions within one hour of sepsis recognition to obtain cultures, start broad-spectrum antibiotics, measure lactate, and initiate fluid/vasopressor therapy.",
    indications: [
      "Suspected infection with organ dysfunction",
      "Lactate ≥2 mmol/L",
      "Hypotension requiring vasopressors",
      "Positive sepsis screening tool"
    ],
    contraindications: [
      "Severe fluid restriction (adjust bolus with provider)",
      "Documented anaphylaxis to proposed antibiotics (use alternatives)"
    ],
    equipment: [
      "Sepsis screening tool",
      "Blood culture supplies",
      "Broad-spectrum antibiotics",
      "IV fluid bolus setup",
      "Lactate lab tubes"
    ],
    steps: [
      "Activate sepsis alert and notify provider/pharmacy.",
      "Obtain lactate and blood cultures before antibiotics when feasible but do not delay beyond 45 minutes.",
      "Administer broad-spectrum antibiotics per order and initiate 30 mL/kg crystalloid bolus for hypotension or lactate ≥4.",
      "Apply vasopressors if MAP <65 after fluids and reassess lactate within 2–4 hours.",
      "Use bedside huddle to review organ support needs (oxygenation, glucose control).",
      "Document bundle completion times and barriers."
    ],
    safetyAlerts: [
      "Adjust fluid bolus for heart failure or ESRD per provider.",
      "Verify antibiotic allergies and renal dosing.",
      "Escalate care level if escalating vasopressor doses required."
    ],
    complications: [
      "Fluid overload",
      "Delayed antibiotic administration",
      "Vasopressor-related ischemia",
      "Progression to septic shock"
    ],
    documentation: [
      "Sepsis screening result and time",
      "Lactate values and repeat timing",
      "Antibiotic/fluids administered with timestamps",
      "Response to therapy"
    ],
    patientTeaching: [
      "Explain signs of infection worsening and reason for aggressive therapy.",
      "Discuss monitoring lines, labs, and potential ICU transfer.",
      "Provide updates to family on progress and goals."
    ]
  },
  {
    id: "rapid-response",
    category: "CRITICAL CARE",
    title: "Rapid Response Activation and Handoff",
    description: "Escalation workflow for deteriorating patients outside ICU.",
    definition: "Structured early warning recognition, team activation, and standardized communication for patients with acute clinical deterioration.",
    indications: [
      "Acute changes in vital signs or consciousness",
      "Staff concern or gut feeling",
      "Sepsis criteria or arrhythmias",
      "Postoperative instability"
    ],
    contraindications: [
      "Cardiac arrest requiring code team instead",
      "Patients already on comfort-measures-only (clarify goals)"
    ],
    equipment: [
      "Bedside monitor and defibrillator",
      "Airway cart",
      "Medication box",
      "Documentation/notification tools",
      "SBAR handoff template"
    ],
    steps: [
      "Activate rapid response via institution-specific number and state location/concern.",
      "Apply oxygen, obtain vitals, and begin focused assessment while awaiting team.",
      "Gather chart, medication list, allergies, and latest labs for team review.",
      "Provide concise SBAR handoff upon team arrival, including events leading up to deterioration.",
      "Assist with interventions, document timeline, and arrange transfer if needed.",
      "Debrief and update family about change in condition."
    ],
    safetyAlerts: [
      "Do not hesitate to call even if vitals borderline—early activation saves lives.",
      "Ensure hallway access is clear for incoming team and equipment.",
      "Escalate to code blue if patient becomes pulseless/unresponsive."
    ],
    complications: [
      "Delayed activation",
      "Communication breakdown",
      "Unaddressed reversible causes",
      "Family distress"
    ],
    documentation: [
      "Trigger reason and time activated",
      "Interventions performed",
      "Disposition (stay vs transfer)",
      "Education provided to patient/family"
    ],
    patientTeaching: [
      "Explain purpose of rapid response team and reassure patient/family during event.",
      "Review new monitoring plans after stabilization.",
      "Provide contact for follow-up questions."
    ]
  },
  {
    id: "acls-defibrillation",
    category: "CRITICAL CARE",
    title: "ACLS Defibrillation and Cardioversion Support",
    description: "Safe operation of manual/automated defibrillators during codes.",
    definition: "Nursing responsibilities for charging, shocking, and post-shock assessment aligned with American Heart Association ACLS algorithms.",
    indications: [
      "Pulseless VT/VF",
      "Unstable tachycardia requiring synchronized cardioversion",
      "Precordial shock device checks",
      "External pacing backup"
    ],
    contraindications: [
      "Do not shock asystole/PEA (focus on CPR/meds)",
      "Avoid cardioversion in digitalis toxicity unless emergent"
    ],
    equipment: [
      "Manual defibrillator or AED",
      "Defibrillation pads",
      "ECG monitor",
      "CPR backboard",
      "Protective eyewear/gloves"
    ],
    steps: [
      "Power on defibrillator, apply pads to bare chest avoiding implanted devices.",
      "For defibrillation, select 200 J biphasic (per device), charge, ensure everyone clear, and deliver shock.",
      "Immediately resume CPR for two minutes before rhythm check.",
      "For synchronized cardioversion, activate sync mode, select energy based on rhythm, and sedate per provider order.",
      "Document shocks delivered, energy, and rhythm response.",
      "Post-event, inspect skin, replace pads, and restock equipment."
    ],
    safetyAlerts: [
      "Verbalize and visually confirm 'all clear' before shocking.",
      "Remove oxygen sources away from chest to prevent fire.",
      "Deactivate sync mode when switching back to defibrillation."
    ],
    complications: [
      "Skin burns",
      "Myocardial injury",
      "Arrhythmia conversion to asystole",
      "Patient/family psychological trauma"
    ],
    documentation: [
      "Rhythm, energy, and timing of each shock",
      "Medication/sedation administered",
      "Patient response and post-shock vitals",
      "Device checks performed"
    ],
    patientTeaching: [
      "For elective cardioversion, explain fasting, sedation, and post-procedure monitoring.",
      "In emergent cases, debrief family about steps taken.",
      "Provide discharge instructions regarding medication adherence and follow-up."
    ]
  },
  {
    id: "ecg-12lead",
    category: "DIAGNOSTICS",
    title: "12-Lead ECG Acquisition and Transmission",
    description: "Accurate lead placement, artifact reduction, and rapid transmission to cardiology.",
    definition: "Obtaining high-quality electrocardiograms using standardized lead placement to detect ischemia, arrhythmias, and conduction abnormalities.",
    indications: [
      "Chest pain or ischemic symptoms",
      "Arrhythmia monitoring",
      "Electrolyte disturbances",
      "Baseline assessment before procedures"
    ],
    contraindications: [
      "No absolute contraindications; modify for burns or wounds"
    ],
    equipment: [
      "ECG machine with electrodes",
      "Skin prep supplies",
      "Transmission modem or EMR interface",
      "Razor for hair removal",
      "Wipes for cleaning"
    ],
    steps: [
      "Verify patient identity, explain procedure, and ensure privacy.",
      "Prep skin by removing oils/hair and apply electrodes at anatomical landmarks (Limb leads, V1–V6).",
      "Ask patient to remain still and hold breath at end expiration if needed; acquire tracing.",
      "Review for artifact, repeat if necessary, and transmit/print results immediately.",
      "Label ECG with date/time, symptoms, and positioning variations.",
      "Clean equipment and document completion."
    ],
    safetyAlerts: [
      "Never place limb leads over bony prominences causing artifact.",
      "Avoid electrode placement over defibrillation pads or wounds.",
      "Check battery/lead integrity daily to prevent delays."
    ],
    complications: [
      "Skin irritation",
      "Misdiagnosis due to incorrect placement",
      "Delays in reperfusion therapy"
    ],
    documentation: [
      "Reason for ECG",
      "Any modifications to standard placement",
      "Transmission confirmation",
      "Patient tolerance"
    ],
    patientTeaching: [
      "Explain that test is painless and quick.",
      "Encourage reporting of symptoms experienced during tracing.",
      "Review next steps (labs, cardiology consult)."
    ]
  },
  {
    id: "stroke-thrombolysis",
    category: "NEUROLOGIC",
    title: "Stroke Thrombolysis Nursing Management",
    description: "Door-to-needle preparation, consent, and monitoring for alteplase or tenecteplase.",
    definition: "Nursing care that expedites imaging, labs, and eligibility screening for thrombolytic therapy while monitoring for bleeding and neurologic changes.",
    indications: [
      "Acute ischemic stroke within treatment window",
      "Disabling neurologic deficits",
      "No hemorrhage on CT",
      "Meets institutional criteria"
    ],
    contraindications: [
      "Active bleeding or recent major surgery",
      "Uncontrolled hypertension (>185/110) prior to treatment",
      "Anticoagulation with high INR",
      "Low platelet count"
    ],
    equipment: [
      "Stroke stopwatch/checklist",
      "Blood pressure management tools",
      "Large-bore IV access",
      "Infusion pump",
      "Neurologic assessment tools (NIHSS)"
    ],
    steps: [
      "Activate stroke code, obtain NIHSS, and escort patient to CT immediately.",
      "Draw labs, verify glucose, and review contraindications with provider.",
      "Obtain consent, program infusion per weight, and double-check dosing.",
      "Monitor BP every 15 minutes and neuro status for first two hours, then per protocol.",
      "Hold antiplatelets/anticoagulants for 24 hours post thrombolysis unless directed.",
      "Report any headache, vomiting, or neuro decline immediately."
    ],
    safetyAlerts: [
      "Keep emergency reversal agents (cryoprecipitate, TXA) available.",
      "Avoid invasive lines or catheters for 24 hours unless essential.",
      "Maintain BP <180/105 post infusion."
    ],
    complications: [
      "Intracranial hemorrhage",
      "Angioedema",
      "Systemic bleeding",
      "Reperfusion injury"
    ],
    documentation: [
      "Door-to-needle time",
      "NIHSS scores and neuro checks",
      "BP readings and medications",
      "Adverse events and interventions"
    ],
    patientTeaching: [
      "Explain benefits/risks of clot-busting therapy.",
      "Reinforce blood pressure control importance post treatment.",
      "Educate family on warning signs of bleeding or stroke recurrence."
    ]
  },
  {
    id: "postop-handoff",
    category: "PERIOPERATIVE",
    title: "Postoperative SBAR Handoff",
    description: "Structured PACU-to-unit report to maintain continuity and safety.",
    definition: "Using SBAR (Situation, Background, Assessment, Recommendation) or IPASS to transfer postoperative patients with emphasis on airway, analgesia, lines, and drains.",
    indications: [
      "All postoperative transfers",
      "Patients returning to ICU/ward after procedures",
      "Interventional radiology recoveries"
    ],
    contraindications: [
      "None—use remote/virtual handoff if infection isolation"
    ],
    equipment: [
      "Handoff checklist",
      "Medication administration record",
      "Monitoring devices",
      "Drain/line inventory",
      "Pain assessment tools"
    ],
    steps: [
      "Prepare receiving team before transport with estimated arrival time.",
      "Deliver SBAR focusing on procedure performed, anesthetic type, airway status, hemodynamics, analgesia, and outstanding orders.",
      "Jointly verify lines, drains, wounds, and medication infusions.",
      "Clarify pending labs, imaging, and transfusion needs.",
      "Agree on immediate priorities (pain control, positioning, respiratory support).",
      "Document handoff completion and shared understanding."
    ],
    safetyAlerts: [
      "Use read-back for critical information (allergies, drains clamped).",
      "Include family communication status to avoid misalignment.",
      "Identify early warning signs requiring rapid notification."
    ],
    complications: [
      "Missed orders",
      "Duplicated medications",
      "Line dislodgement during transport",
      "Delayed recognition of bleeding"
    ],
    documentation: [
      "Time of handoff and participants",
      "Key assessment data transmitted",
      "Outstanding tasks acknowledged",
      "Patient/family updates"
    ],
    patientTeaching: [
      "Orient patient to new care environment after transfer.",
      "Explain pain control options and mobility expectations.",
      "Review call bell use and safety precautions."
    ]
  },
  {
    id: "pain-opioid-stewardship",
    category: "PERIOPERATIVE",
    title: "Multimodal Pain Assessment and Opioid Stewardship",
    description: "Using validated scales, non-pharmacologic measures, and opioid-sparing strategies.",
    definition: "Systematic assessment of pain with individualized treatment plans combining pharmacologic and non-pharmacologic modalities while minimizing opioid risk.",
    indications: [
      "Acute postoperative pain",
      "Chronic pain flare",
      "Cancer pain",
      "Palliative symptom control"
    ],
    contraindications: [
      "Allergy or intolerance to proposed analgesics",
      "Uncontrolled respiratory depression (stabilize first)"
    ],
    equipment: [
      "Pain scales appropriate to age/cognition",
      "Non-pharmacologic aids (heat/cold packs, relaxation tools)",
      "Medication administration tools",
      "Risk assessment tools (ORT, STOP-Bang)",
      "Opioid reversal agents"
    ],
    steps: [
      "Assess pain location, quality, intensity, and functional impact using validated scale.",
      "Offer non-pharmacologic interventions and schedule non-opioid analgesics (acetaminophen, NSAIDs if appropriate).",
      "Use lowest effective opioid dose with clear parameters and monitor sedation/respiratory rate.",
      "Reassess pain within 30–60 minutes of intervention and adjust plan.",
      "Educate on bowel regimen, safe storage, and taper plans.",
      "Screen for opioid misuse risk and consult pain service when needed."
    ],
    safetyAlerts: [
      "Avoid concurrent benzodiazepines and opioids unless essential.",
      "Monitor end-tidal CO2 or oximetry for high-risk patients.",
      "Document justification for doses exceeding institutional limits."
    ],
    complications: [
      "Respiratory depression",
      "Constipation",
      "Opioid-induced hyperalgesia",
      "Dependence"
    ],
    documentation: [
      "Pain scores pre/post intervention",
      "Modalities used",
      "Side effects and mitigation",
      "Education provided"
    ],
    patientTeaching: [
      "Set realistic pain goals focused on function.",
      "Review safe use, storage, and disposal of opioids.",
      "Teach non-pharmacologic coping strategies (breathing, mindfulness)."
    ]
  },
  {
    id: "falls-prevention",
    category: "SAFETY & QUALITY",
    title: "Falls Prevention Bundle and Post-Fall Management",
    description: "Risk screening, environmental controls, and rapid response to falls.",
    definition: "Comprehensive nursing strategies to prevent inpatient falls and mitigate injury when events occur.",
    indications: [
      "Mobility or cognition impairment",
      "History of falls",
      "Sedative or antihypertensive use",
      "Orthostatic hypotension"
    ],
    contraindications: [
      "None—tailor interventions to patient goals (palliative)",
      "Balance fall risk with mobilization needs"
    ],
    equipment: [
      "Fall risk tool",
      "Non-slip socks and footwear",
      "Bed/chair alarms",
      "Gait belts",
      "Post-fall assessment kit"
    ],
    steps: [
      "Screen risk on admission and daily; display visual cues.",
      "Keep call bell within reach, bed low/locked, and provide scheduled toileting.",
      "Use gait belt and assistive devices for ambulation; involve PT/OT for high-risk patients.",
      "Conduct hourly rounding (pain, potty, position, possessions).",
      "If fall occurs, keep patient on floor until assessed, check vitals/neuro status, notify provider, and complete post-fall huddle.",
      "Implement targeted plan (hip protectors, sitter) based on findings."
    ],
    safetyAlerts: [
      "Disable bed alarms only with documented rationale.",
      "Ensure adequate lighting at night and remove clutter.",
      "Reassess medications contributing to orthostasis."
    ],
    complications: [
      "Fractures",
      "Head injury",
      "Fear of falling leading to immobility",
      "Legal risk"
    ],
    documentation: [
      "Risk score and interventions",
      "Rounding compliance",
      "Post-fall assessment findings",
      "Family notification"
    ],
    patientTeaching: [
      "Encourage calling for help before standing.",
      "Demonstrate use of mobility aids.",
      "Discuss orthostatic precautions (sit before standing)."
    ]
  },
  {
    id: "restraint-monitoring",
    category: "SAFETY & QUALITY",
    title: "Restraint Application and Ongoing Monitoring",
    description: "Least restrictive device selection, time-limited orders, and humane oversight.",
    definition: "Implementing restraints only when necessary to protect patient safety while ensuring frequent assessment and release opportunities.",
    indications: [
      "Imminent risk of pulling life-sustaining devices",
      "Severe agitation posing harm",
      "Non-violent/self-destructive behaviors",
      "Medical procedures requiring immobility"
    ],
    contraindications: [
      "Untreated hypoxia or pain as primary cause of agitation",
      "History of trauma triggering restraints (seek alternatives)",
      "Inability to monitor patient closely"
    ],
    equipment: [
      "Soft limb restraints or mitts",
      "Key for locking devices if used",
      "Padding for bony prominences",
      "Restraint documentation flow sheet",
      "De-escalation tools"
    ],
    steps: [
      "Assess and address underlying causes (pain, delirium, hypoxia) before restraint.",
      "Obtain provider order specifying type/time frame and explain plan to patient/family.",
      "Apply least restrictive device, ensuring two fingers fit between restraint and skin, and secure to bed frame.",
      "Perform circulation, sensation, and range-of-motion checks every 2 hours (every 15 minutes for violent/self-destructive restraints).",
      "Offer toileting, hydration, and repositioning at least every 2 hours and release restraints as soon as safe.",
      "Document assessments, education, and criteria for discontinuation."
    ],
    safetyAlerts: [
      "Never tie restraints to side rails or use knots that cannot be quickly released.",
      "Discontinue immediately if skin breakdown, edema, or numbness occurs.",
      "Use sitter/video monitoring as adjunct to reduce restraint duration."
    ],
    complications: [
      "Skin injury",
      "Nerve damage",
      "Psychological distress",
      "Aspiration during struggling"
    ],
    documentation: [
      "Behavior necessitating restraint",
      "Alternatives attempted",
      "Monitoring findings and care provided",
      "Time of removal"
    ],
    patientTeaching: [
      "Explain goal is safety and device will be removed once safe.",
      "Invite family participation for calming presence.",
      "Discuss alternative coping strategies to avoid future restraints."
    ]
  },
  {
    id: "seizure-precautions",
    category: "NEUROLOGIC",
    title: "Seizure Precautions and Rescue Response",
    description: "Proactive safety setup and rapid management of witnessed seizures.",
    definition: "Nursing measures that reduce injury risk, maintain airway, and deliver rescue therapy for patients with known or suspected seizures.",
    indications: [
      "History of epilepsy or recent seizure",
      "Acute neurologic insult (stroke, TBI)",
      "Metabolic derangements",
      "Medication withdrawal"
    ],
    contraindications: [
      "None—adjust interventions for patient goals (comfort care)",
      "Avoid padded rails in some ICU beds (use specialty devices)"
    ],
    equipment: [
      "Seizure pads or pillows",
      "Suction setup",
      "Supplemental oxygen",
      "Rescue medications (benzodiazepines)",
      "Timing device and documentation tools"
    ],
    steps: [
      "Implement seizure precautions (bed low, pads, suction, oxygen ready) on admission for at-risk patients.",
      "At seizure onset, note time, protect head, remove hazards, and turn patient to side without restraining movements.",
      "Administer rescue medication per protocol if seizure >5 minutes or clustering occurs.",
      "Assess airway, breathing, circulation post ictal; provide supplemental oxygen and suction secretions.",
      "Obtain glucose, labs, and notify provider with detailed description.",
      "Document characteristics, duration, triggers, and postictal status."
    ],
    safetyAlerts: [
      "Never place objects in patient’s mouth during seizure.",
      "Call rapid response for status epilepticus or injury.",
      "Maintain spinal precautions if trauma suspected."
    ],
    complications: [
      "Aspiration",
      "Status epilepticus",
      "Head trauma",
      "Hypoxia"
    ],
    documentation: [
      "Seizure type, duration, and interventions",
      "Vital signs and neuro status post event",
      "Medications administered",
      "Provider notification and patient education"
    ],
    patientTeaching: [
      "Teach aura recognition and when to seek help.",
      "Review medication adherence and triggers (sleep deprivation, alcohol).",
      "Educate family on safe positioning and rescue steps."
    ]
  },
  {
    id: "pediatric-weight-based-dosing",
    category: "PEDIATRIC CARE",
    title: "Pediatric Weight-Based Medication Safety",
    description: "Calculation, double-check, and smart pump programming for pediatric doses.",
    definition: "Ensuring accurate medication delivery to infants and children through kilogram-based dosing, concentration limits, and independent verification.",
    indications: [
      "All pediatric medication administrations",
      "High-alert drugs (insulin, opioids, vasopressors)",
      "Emergency carts with Broselow systems",
      "Procedural sedation"
    ],
    contraindications: [
      "Weight unknown—obtain accurate weight before scheduled meds",
      "Dehydrated patients (consider dry vs admission weight)"
    ],
    equipment: [
      "Calibrated pediatric scale",
      "Weight-based dosing references (Broselow, EMR tools)",
      "Smart infusion pumps",
      "Syringe pumps",
      "Double-check documentation system"
    ],
    steps: [
      "Obtain actual weight in kilograms, document, and update EMR dosing weight.",
      "Calculate dose using reliable reference, round per policy, and have second nurse verify.",
      "Program pump using weight-based library entry; confirm concentration and rate.",
      "Label syringes/bags with patient name, drug, dose, concentration, and double-check initials.",
      "Monitor patient response and adjust based on lab/clinical targets.",
      "Report and analyze any near-miss events for system improvement."
    ],
    safetyAlerts: [
      "Never convert pounds to kilograms mentally—use calculator.",
      "Beware of decimal misplacement; read back doses digit by digit.",
      "Use oral syringes for enteral meds to avoid IV administration errors."
    ],
    complications: [
      "Medication overdose or underdose",
      "Infusion pump programming errors",
      "Delayed therapy",
      "Adverse drug reactions"
    ],
    documentation: [
      "Weight, dose calculations, and verifying nurse",
      "Medication time/route",
      "Patient response",
      "Education to caregivers"
    ],
    patientTeaching: [
      "Explain dosing based on child’s weight and importance of accurate home measurements.",
      "Provide written instructions for caregivers with both mg and mL amounts.",
      "Review poison control contact information and safe storage."
    ]
  },
  {
    id: "vaccine-administration",
    category: "PRIMARY CARE",
    title: "Vaccination Administration and Cold Chain Management",
    description: "Storage, preparation, and injection technique aligned with WHO immunization standards.",
    definition: "Maintaining vaccine potency through proper storage/handling and administering injections safely with informed consent.",
    indications: [
      "Routine immunizations across lifespan",
      "Travel vaccines",
      "Post-exposure prophylaxis",
      "Outbreak response"
    ],
    contraindications: [
      "Severe allergic reaction to previous dose",
      "Moderate/severe acute illness (delay)",
      "Live vaccines in pregnancy/immunosuppression (per guideline)"
    ],
    equipment: [
      "WHO-approved vaccine refrigerator with temperature log",
      "Temperature data logger",
      "Appropriate syringes/needles",
      "Emergency anaphylaxis kit",
      "Consent forms and VIS sheets"
    ],
    steps: [
      "Check cold-chain temperature (2–8 °C) and expiry before drawing vaccine.",
      "Provide Vaccine Information Statement, screen for contraindications, and obtain consent.",
      "Use aseptic technique to draw dose, select correct route/site (IM, SC, oral), and administer using age-appropriate technique.",
      "Observe patient 15 minutes (30 if history of allergy) and document in immunization registry.",
      "Dispose sharps, return opened vials to fridge if multi-dose per policy, and restock supplies.",
      "Report adverse events to national surveillance system."
    ],
    safetyAlerts: [
      "Discard vaccines exposed to out-of-range temps unless manufacturer approves use.",
      "Label multi-dose vials with beyond-use date/time.",
      "Keep anaphylaxis kit stocked (epinephrine, antihistamine, airway equipment)."
    ],
    complications: [
      "Local pain/redness",
      "Syncope",
      "Anaphylaxis",
      "Vaccine failure from cold-chain breach"
    ],
    documentation: [
      "Vaccine name, lot, manufacturer, site, route",
      "VIS edition date",
      "Temperature log",
      "Adverse events and reporting"
    ],
    patientTeaching: [
      "Provide schedule for future doses and common side effects.",
      "Encourage hydration and arm movement post IM injection.",
      "Explain when to seek urgent care (trouble breathing, hives)."
    ]
  },
  {
    id: "prenatal-nst",
    category: "MATERNAL & NEWBORN",
    title: "Prenatal Non-Stress Test Monitoring",
    description: "Fetal heart rate assessment for high-risk pregnancies.",
    definition: "Using external fetal monitoring to evaluate accelerations associated with fetal movement, indicating adequate oxygenation.",
    indications: [
      "Maternal hypertension or diabetes",
      "Post-dates pregnancy",
      "Decreased fetal movement",
      "Multiple gestation with complications"
    ],
    contraindications: [
      "None—modify positioning for orthopnea",
      "Relative: uterine irritability requiring contraction stress test instead"
    ],
    equipment: [
      "Fetal monitor with ultrasound and toco transducers",
      "Acoustic stimulator",
      "Maternal vital sign equipment",
      "NST documentation forms",
      "Positioning wedges"
    ],
    steps: [
      "Verify maternal identity, gestational age, and indications; obtain informed consent.",
      "Position patient semi-Fowler or left lateral, apply transducers, and record baseline fetal heart rate for 20 minutes.",
      "Encourage maternal perception of fetal movement, document accelerations (≥15 bpm for ≥15 seconds) and variability.",
      "If nonreactive after 20 minutes, extend monitoring up to 40 minutes and consider acoustic stimulation or BPP per provider.",
      "Assess maternal vitals, uterine activity, and provide hydration/snacks as appropriate.",
      "Review results with provider and communicate plan (repeat testing, induction)."
    ],
    safetyAlerts: [
      "Stop monitoring and escalate for decelerations, tachysystole, or maternal distress.",
      "Avoid supine hypotension by tilting uterus off vena cava.",
      "Ensure fetal tracing labeled to prevent mix-ups in multiples."
    ],
    complications: [
      "False-nonreactive results",
      "Maternal anxiety",
      "Skin irritation from transducers"
    ],
    documentation: [
      "Fetal baseline, variability, accelerations/decelerations",
      "Maternal vitals and positioning",
      "Interventions used",
      "Provider notification and plan"
    ],
    patientTeaching: [
      "Explain purpose of NST and importance of reporting decreased fetal movement.",
      "Encourage kick counts at home.",
      "Review warning signs requiring immediate evaluation (bleeding, rupture of membranes)."
    ]
  },
  {
    id: "postpartum-hemorrhage",
    category: "MATERNAL & NEWBORN",
    title: "Postpartum Hemorrhage Emergency Response",
    description: "Stage-based obstetric hemorrhage protocol per WHO/AWHONN guidance.",
    definition: "Coordinated nursing interventions to quantify blood loss, activate hemorrhage carts, administer uterotonics, and escalate surgical management.",
    indications: [
      "Cumulative blood loss ≥500 mL vaginal or ≥1000 mL cesarean",
      "Hemodynamic instability after delivery",
      "Retained placenta",
      "Uterine atony risk factors"
    ],
    contraindications: [
      "Allergy to specific uterotonics (e.g., carboprost in asthma)",
      "Hypertension limiting methylergonovine use"
    ],
    equipment: [
      "Hemorrhage cart with uterotonics",
      "Quantified blood loss drapes",
      "Rapid infuser",
      "Bakri balloon kit",
      "Massive transfusion activation tools"
    ],
    steps: [
      "Massage uterus, assess tone, and initiate quantified blood loss measurement.",
      "Administer sequential uterotonics per protocol (oxytocin, tranexamic acid, methylergonovine, carboprost).",
      "Obtain IV access, labs (CBC, coags), and crossmatch; activate hemorrhage team if loss progresses.",
      "Apply uterine tamponade (Bakri) or prepare for OR/interventional radiology if atony persists.",
      "Monitor vitals every 5 minutes, maintain warm environment, and support breastfeeding/skin-to-skin when stable.",
      "Debrief team and provide emotional support to patient/family after stabilization."
    ],
    safetyAlerts: [
      "Avoid methylergonovine in hypertension or preeclampsia.",
      "Use carboprost cautiously in asthma; have bronchodilators ready.",
      "Document cumulative blood loss visually and via scale for accuracy."
    ],
    complications: [
      "Hypovolemic shock",
      "DIC",
      "Transfusion reactions",
      "Hysterectomy"
    ],
    documentation: [
      "Quantified blood loss",
      "Medications administered with times",
      "Vital signs and labs",
      "Patient/family communication"
    ],
    patientTeaching: [
      "Explain cause of bleeding and interventions performed.",
      "Review signs of late hemorrhage after discharge.",
      "Provide resources for emotional support and follow-up."
    ]
  },
  {
    id: "diabetes-self-management",
    category: "CHRONIC CARE",
    title: "Diabetes Self-Management Coaching",
    description: "Education on monitoring, nutrition, activity, and sick-day management.",
    definition: "Structured teaching that empowers patients to monitor glucose, administer medications, and prevent complications using ADA standards.",
    indications: [
      "New diabetes diagnosis",
      "Transition to insulin therapy",
      "Poor glycemic control",
      "Hospital-to-home discharge planning"
    ],
    contraindications: [
      "Cognitive inability to participate without caregiver",
      "Critical illness (provide simplified plan)"
    ],
    equipment: [
      "Glucose meter and supplies",
      "Medication organizers",
      "Nutrition education materials",
      "Foot care tools",
      "Teach-back checklist"
    ],
    steps: [
      "Assess health literacy, language needs, and cultural considerations.",
      "Demonstrate glucose monitoring, insulin/medication administration, and needle disposal.",
      "Review nutrition basics (plate method), carbohydrate counting, and meal timing.",
      "Discuss physical activity goals, sick-day rules, and hypoglycemia treatment.",
      "Set SMART goals with patient and provide written action plan.",
      "Arrange referrals (diabetes educator, nutritionist) and follow-up appointments."
    ],
    safetyAlerts: [
      "Teach hypoglycemia recognition and immediate treatment (15-15 rule).",
      "Encourage wearing medical ID.",
      "Reinforce foot inspection to prevent ulcers."
    ],
    complications: [
      "Hypoglycemia",
      "DKA/HHS",
      "Foot ulcers",
      "Medication errors"
    ],
    documentation: [
      "Education topics covered",
      "Patient goals and teach-back results",
      "Supplies provided",
      "Follow-up referrals"
    ],
    patientTeaching: [
      "Provide contact numbers for urgent questions.",
      "Encourage keeping glucose log and sharing with providers.",
      "Discuss vaccination needs (influenza, pneumococcal)."
    ]
  },
  {
    id: "heart-failure-discharge",
    category: "CHRONIC CARE",
    title: "Heart Failure Discharge Pathway",
    description: "Education bundle covering medications, weights, diet, and follow-up within 7 days.",
    definition: "Transition-of-care process that equips heart failure patients with self-care skills to prevent readmissions.",
    indications: [
      "Hospitalization for heart failure",
      "New reduced ejection fraction",
      "Medication adjustments",
      "Advanced therapies (LVAD, transplant)"
    ],
    contraindications: [
      "Hospice focus where aggressive management inappropriate",
      "Patient unable to participate without support (engage caregiver)"
    ],
    equipment: [
      "Daily weight log",
      "Medication reconciliation tools",
      "Low-sodium diet resources",
      "Follow-up appointment scheduler",
      "Zone management handouts"
    ],
    steps: [
      "Perform medication reconciliation, highlight new/changed drugs, and confirm affordability.",
      "Teach daily weight monitoring, symptom zones (green/yellow/red), and when to call provider.",
      "Review sodium (<2 g/day) and fluid restrictions, label reading, and diuretic timing.",
      "Arrange cardiology follow-up within 7 days and connect to telemonitoring if available.",
      "Verify understanding using teach-back and involve caregivers.",
      "Provide emergency plan for worsening symptoms."
    ],
    safetyAlerts: [
      "Double-check diuretic dosing and renal labs before discharge.",
      "Encourage vaccination to reduce respiratory triggers.",
      "Assess for depression/cognitive barriers impacting adherence."
    ],
    complications: [
      "Readmission",
      "Fluid overload",
      "Renal dysfunction",
      "Medication nonadherence"
    ],
    documentation: [
      "Education topics and teach-back outcomes",
      "Follow-up appointments",
      "Medication list provided",
      "Caregiver involvement"
    ],
    patientTeaching: [
      "Provide written action plan with contact numbers.",
      "Encourage low-sodium cooking strategies.",
      "Stress daily weight tracking and symptom reporting."
    ]
  },
  {
    id: "copd-asthma-education",
    category: "CHRONIC CARE",
    title: "COPD/Asthma Inhaler Teaching and Action Plans",
    description: "Device-specific inhaler technique coaching and exacerbation planning.",
    definition: "Patient education ensuring correct inhaler use, adherence to controller therapy, and recognition of exacerbation triggers per GOLD/GINA guidelines.",
    indications: [
      "New inhaler prescription",
      "Frequent exacerbations",
      "Hospitalization for COPD/asthma",
      "Transition to home oxygen"
    ],
    contraindications: [
      "Patient unable to coordinate inhaler actuation (provide spacer/nebulizer)",
      "Severe cognitive impairment without caregiver"
    ],
    equipment: [
      "Demo inhalers and spacers",
      "Peak flow meter",
      "Written action plan templates",
      "Trigger avoidance checklists",
      "Cleaning supplies"
    ],
    steps: [
      "Assess baseline technique using checklist, then demonstrate correct steps (shake, exhale, seal lips, inhale slowly, hold breath).",
      "Provide spacer or nebulizer alternatives for poor coordination and show cleaning schedule.",
      "Review controller vs rescue medications, dosing frequency, and adherence aids.",
      "Develop personalized action plan with peak flow or symptom zones, including when to start steroids or seek care.",
      "Discuss trigger avoidance (smoking cessation, allergens) and vaccines.",
      "Document teach-back results and provide printed materials."
    ],
    safetyAlerts: [
      "Rinse mouth after inhaled corticosteroids to prevent thrush.",
      "Monitor for tachycardia with beta-agonists, especially in cardiac patients.",
      "Emphasize not to exceed prescribed rescue inhaler doses."
    ],
    complications: [
      "Poor disease control",
      "Oral candidiasis",
      "Hospital readmissions",
      "Medication wastage"
    ],
    documentation: [
      "Devices taught and technique score",
      "Action plan provided",
      "Smoking cessation referrals",
      "Follow-up appointments"
    ],
    patientTeaching: [
      "Encourage keeping inhalers accessible and checking expiration dates.",
      "Teach family to recognize early exacerbation signs.",
      "Promote pulmonary rehab participation."
    ]
  },
  {
    id: "palliative-symptom-bundle",
    category: "PALLIATIVE & SUPPORTIVE",
    title: "Palliative Symptom Management Bundle",
    description: "Interdisciplinary approach for pain, dyspnea, anxiety, and delirium at end of life.",
    definition: "Nursing interventions that align symptom control with patient goals, integrating pharmacologic and holistic therapies.",
    indications: [
      "Advanced serious illness",
      "Hospice or comfort-focused care",
      "Refractory symptoms",
      "Goals-of-care discussions"
    ],
    contraindications: [
      "Patient preference for life-prolonging therapy only",
      "Unmanaged reversible causes requiring diagnostics"
    ],
    equipment: [
      "Symptom assessment tools (ESAS)",
      "Opioid/adjunct medication kits",
      "Fan or oxygen for dyspnea",
      "Comfort positioning supports",
      "Communication aids for family meetings"
    ],
    steps: [
      "Clarify goals of care and document code status with shared decision making.",
      "Assess symptoms frequently using standardized scales and prioritize patient-reported outcomes.",
      "Implement multimodal interventions (opioids, anxiolytics, anticholinergics, aromatherapy, massage).",
      "Coordinate with chaplaincy, social work, and palliative providers for holistic support.",
      "Educate family on expected changes (Cheyne-Stokes, decreased intake) and how to provide comfort.",
      "Review medications daily, deprescribing non-beneficial therapies."
    ],
    safetyAlerts: [
      "Titrate opioids carefully in renal/hepatic impairment.",
      "Monitor for delirium and address reversible contributors (medications, retention, constipation).",
      "Document consent for palliative sedation if indicated."
    ],
    complications: [
      "Uncontrolled symptoms",
      "Family distress",
      "Medication side effects",
      "Ethical conflicts"
    ],
    documentation: [
      "Goals-of-care discussions",
      "Symptom scores and interventions",
      "Family education",
      "Interdisciplinary involvement"
    ],
    patientTeaching: [
      "Provide anticipatory guidance on symptom trajectory.",
      "Teach repositioning, oral care, and calming techniques.",
      "Offer bereavement resources."
    ]
  },
  {
    id: "telehealth-triage",
    category: "CARE COORDINATION",
    title: "Telehealth Triage and Escalation",
    description: "Assessing remote patient concerns, prioritizing urgency, and directing to appropriate level of care.",
    definition: "Standardized telehealth workflows that collect symptoms, identify red flags, and coordinate in-person care when necessary.",
    indications: [
      "Ambulatory symptom calls",
      "Chronic disease monitoring",
      "Post-discharge follow-up",
      "Public health emergencies"
    ],
    contraindications: [
      "Call disconnects or inability to verify identity (call emergency services)",
      "Language barriers without interpreter—engage certified interpreter"
    ],
    equipment: [
      "Secure telehealth platform",
      "Triage protocols (Schmitt-Thompson, NHS pathways)",
      "Documentation system",
      "Escalation contact list",
      "Remote monitoring device data"
    ],
    steps: [
      "Verify patient identity, location, and callback number; assess immediate safety.",
      "Use structured triage questions to assess symptom severity, onset, associated factors, and self-care attempted.",
      "Identify red flags requiring emergency services and stay on line until help arranged.",
      "Provide evidence-based self-care instructions or schedule provider visit for moderate concerns.",
      "Document assessment, advice, and follow-up plan in EMR.",
      "Arrange callbacks or remote monitoring alerts for high-risk patients."
    ],
    safetyAlerts: [
      "Always ask about chest pain, shortness of breath, neuro deficits, or suicidal ideation and escalate immediately.",
      "Maintain privacy and confirm patient consent for telehealth communication.",
      "Report technology failures that delay care."
    ],
    complications: [
      "Delayed emergency care",
      "Documentation errors",
      "Data privacy breaches",
      "Patient misunderstanding of instructions"
    ],
    documentation: [
      "Caller identity, symptoms, and red flags",
      "Protocols referenced",
      "Disposition and follow-up",
      "Interpreter use and consent"
    ],
    patientTeaching: [
      "Encourage keeping medication list and vitals ready before calling.",
      "Review when to call emergency services versus telehealth line.",
      "Provide written/portal summary of instructions."
    ]
  }
];

export const additionalProcedures: Procedure[] = [];
