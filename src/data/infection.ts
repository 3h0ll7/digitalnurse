import type { SourceId } from "./sources";

export type Precaution = "standard" | "contact" | "droplet" | "airborne" | "protective";
export type OrganismGroup = "Gram+" | "Gram-" | "Virus" | "Fungi";

export interface Organism {
  name: string;
  group: OrganismGroup;
  stain: string;
  transmission: string;
  /** Every precaution required beyond Standard; ["standard"] when Standard alone is enough. */
  precautions: Precaution[];
  infections: string;
  treatment: string;
  resistance: string;
  alert: string;
}

export const PRECAUTION_ORDER: Precaution[] = ["standard", "contact", "droplet", "airborne", "protective"];

/** Isolation cards — clinical text in English, translated labels live with the page. */
export const PRECAUTIONS: Record<Precaution, { ppe: string; room: string; examples: string }> = {
  standard: {
    ppe: "Hand hygiene; gloves, gown, mask and eye protection according to the expected exposure",
    room: "No special room",
    examples: "Every patient, every time — plus respiratory hygiene, safe injection practice and sharps safety",
  },
  contact: {
    ppe: "Gloves + gown on room entry",
    room: "Single room preferred (or cohort); dedicated equipment",
    examples: "MRSA, VRE, ESBL, CRE, MDR Pseudomonas/Acinetobacter, C. auris, C. difficile, norovirus, scabies",
  },
  droplet: {
    ppe: "Surgical mask on room entry (+ eye protection per Standard Precautions)",
    room: "Single room; patient wears a mask for transport",
    examples: "Influenza, pertussis, N. meningitidis, H. influenzae type b, mumps, rubella, Group A strep (until 24 h of therapy)",
  },
  airborne: {
    ppe: "Fit-tested N95 (or higher) respirator before entry",
    room: "Airborne infection isolation room (negative pressure), door closed",
    examples: "Tuberculosis, measles, varicella / disseminated zoster (+ Contact), COVID-19 (+ gown, gloves, eye protection)",
  },
  protective: {
    ppe: "Standard Precautions only unless the patient has an infection",
    room: "Allogeneic HSCT: HEPA-filtered, positive pressure, ≥ 12 air changes/h, sealed room; no plants or flowers",
    examples: "Protects the patient from environmental fungi — not an isolation category for an infected patient",
  },
};

export const organisms: Organism[] = [
  { name: "Staphylococcus aureus (MRSA)", group: "Gram+", stain: "Gram-positive cocci", transmission: "Contact", precautions: ["contact"], infections: "SSTI, pneumonia, bloodstream infection", treatment: "Vancomycin (severe), linezolid", resistance: "mecA-mediated beta-lactam resistance", alert: "Contact precautions per facility MDRO policy; dedicate equipment" },
  { name: "Enterococcus faecium (VRE)", group: "Gram+", stain: "Gram-positive cocci", transmission: "Contact", precautions: ["contact"], infections: "UTI, bacteraemia, wound infection", treatment: "Linezolid or daptomycin", resistance: "VanA/VanB vancomycin resistance", alert: "Single room and high-touch surface cleaning" },
  { name: "Streptococcus pyogenes (Group A)", group: "Gram+", stain: "Gram-positive cocci in chains", transmission: "Droplet; contact with wound drainage", precautions: ["droplet", "contact"], infections: "Pharyngitis, cellulitis, necrotising fasciitis", treatment: "Penicillin or cefazolin (+ clindamycin for toxin-mediated disease)", resistance: "Macrolide resistance increasing", alert: "Droplet until 24 h of effective therapy; add Contact for major skin, wound or burn infection incl. necrotising fasciitis" },
  { name: "Streptococcus pneumoniae", group: "Gram+", stain: "Gram-positive diplococci", transmission: "Respiratory secretions (endogenous colonisation)", precautions: ["standard"], infections: "CAP, meningitis, otitis", treatment: "Ceftriaxone ± vancomycin", resistance: "Penicillin and macrolide resistance", alert: "Standard Precautions (Droplet only if transmission is documented on the unit); watch oxygenation and sepsis signs" },
  { name: "Clostridioides difficile", group: "Gram+", stain: "Gram-positive spore-forming rod", transmission: "Contact (faecal–oral, spores on surfaces)", precautions: ["contact"], infections: "Antibiotic-associated colitis", treatment: "Oral vancomycin or fidaxomicin", resistance: "Spores persist in the environment", alert: "Gloves + gown; soap-and-water hand hygiene; sporicidal (EPA List K, e.g. 1:10 bleach) cleaning" },
  { name: "Listeria monocytogenes", group: "Gram+", stain: "Gram-positive rod", transmission: "Foodborne; mother to newborn", precautions: ["standard"], infections: "Meningitis, bacteraemia", treatment: "Ampicillin + gentamicin", resistance: "Intrinsically resistant to cephalosporins", alert: "Standard Precautions; high risk in pregnancy and immunocompromise" },
  { name: "Escherichia coli (ESBL)", group: "Gram-", stain: "Gram-negative rod", transmission: "Contact", precautions: ["contact"], infections: "UTI, bacteraemia, intra-abdominal infection", treatment: "Carbapenem for serious ESBL infection", resistance: "ESBL enzymes", alert: "Contact precautions per facility MDRO policy" },
  { name: "Klebsiella pneumoniae (CRE)", group: "Gram-", stain: "Gram-negative rod", transmission: "Contact", precautions: ["contact"], infections: "Pneumonia, bloodstream infection", treatment: "Ceftazidime-avibactam per susceptibility", resistance: "Carbapenemase production", alert: "Alert infection prevention immediately" },
  { name: "Pseudomonas aeruginosa (MDR)", group: "Gram-", stain: "Gram-negative rod", transmission: "Contact", precautions: ["contact"], infections: "VAP, burn wound infection, sepsis", treatment: "Piperacillin-tazobactam or cefepime per susceptibility", resistance: "Efflux pumps and porin loss", alert: "Contact precautions for MDR isolates (Standard if susceptible); device care and moisture control" },
  { name: "Acinetobacter baumannii (MDR)", group: "Gram-", stain: "Gram-negative coccobacillus", transmission: "Contact", precautions: ["contact"], infections: "VAP, bloodstream infection", treatment: "Ampicillin-sulbactam ± combination per susceptibility", resistance: "Frequent MDR/XDR patterns", alert: "Contact precautions for MDR isolates; dedicated stethoscope and terminal disinfection" },
  { name: "Neisseria meningitidis", group: "Gram-", stain: "Gram-negative diplococci", transmission: "Droplet", precautions: ["droplet"], infections: "Meningitis, meningococcaemia", treatment: "Ceftriaxone", resistance: "Occasional reduced penicillin susceptibility", alert: "Droplet until 24 h of effective therapy; chemoprophylaxis for close contacts" },
  { name: "Haemophilus influenzae type b", group: "Gram-", stain: "Gram-negative coccobacillus", transmission: "Droplet", precautions: ["droplet"], infections: "Epiglottitis, pneumonia, meningitis", treatment: "Ceftriaxone", resistance: "Beta-lactamase production", alert: "Droplet until 24 h of therapy; keep airway equipment ready in epiglottitis" },
  { name: "Influenza A/B", group: "Virus", stain: "—", transmission: "Droplet", precautions: ["droplet"], infections: "Influenza, viral pneumonia", treatment: "Oseltamivir", resistance: "Seasonal antiviral resistance shifts", alert: "Droplet for 7 days after onset or 24 h after fever resolves (whichever longer); start oseltamivir as soon as possible in hospitalised patients regardless of symptom duration" },
  { name: "SARS-CoV-2 (COVID-19)", group: "Virus", stain: "—", transmission: "Respiratory aerosols/droplets (inhalation), contact", precautions: ["airborne", "contact"], infections: "COVID-19", treatment: "Supportive + protocol antivirals", resistance: "Variant immune escape", alert: "Fit-tested N95 + gown + gloves + eye protection for all care; single room, door closed; prioritise AIIR for aerosol-generating procedures" },
  { name: "Measles (rubeola)", group: "Virus", stain: "—", transmission: "Airborne", precautions: ["airborne"], infections: "Measles with rash and pneumonia", treatment: "Supportive + vitamin A", resistance: "—", alert: "AIIR immediately, door closed; only immune staff enter" },
  { name: "Varicella-zoster virus", group: "Virus", stain: "—", transmission: "Airborne + contact", precautions: ["airborne", "contact"], infections: "Chickenpox, disseminated zoster", treatment: "Aciclovir", resistance: "Aciclovir resistance in severe immunocompromise", alert: "Airborne + Contact until all lesions are crusted" },
  { name: "Mumps virus", group: "Virus", stain: "—", transmission: "Droplet", precautions: ["droplet"], infections: "Parotitis, meningitis", treatment: "Supportive", resistance: "—", alert: "Droplet for 5 days after onset of swelling; check staff immunity" },
  { name: "Candida auris", group: "Fungi", stain: "Yeast", transmission: "Contact (persists on surfaces)", precautions: ["contact"], infections: "Bloodstream and invasive candidiasis", treatment: "Echinocandin", resistance: "Frequent multidrug resistance", alert: "Notify lab and infection prevention; List P (C. auris) disinfectant" },
  { name: "Aspergillus fumigatus", group: "Fungi", stain: "Mould", transmission: "Environmental spores — not person-to-person", precautions: ["standard"], infections: "Invasive pulmonary aspergillosis", treatment: "Voriconazole", resistance: "Azole resistance emerging", alert: "Standard Precautions; prevent acquisition in allogeneic HSCT patients with a Protective Environment" },
  { name: "Pneumocystis jirovecii", group: "Fungi", stain: "Atypical fungus", transmission: "Mostly reactivation/colonisation", precautions: ["standard"], infections: "Pneumocystis pneumonia (PJP)", treatment: "Trimethoprim-sulfamethoxazole", resistance: "Sulfa intolerance", alert: "Standard Precautions; do not room with an immunocompromised patient" },
];

export interface Bundle {
  key: "clabsi" | "cauti" | "vap" | "ssi";
  name: string;
  items: string[];
  sources: SourceId[];
}

export const bundles: Bundle[] = [
  {
    key: "clabsi",
    name: "CLABSI",
    items: [
      "Hand hygiene before insertion and every manipulation",
      "Maximal sterile barrier precautions at insertion",
      "Chlorhexidine-alcohol skin antisepsis, allowed to dry",
      "Avoid the femoral site in adults when possible",
      "Disinfect hubs/needleless connectors before every access",
      "Review line necessity daily; remove promptly",
    ],
    sources: ["shea-2022"],
  },
  {
    key: "cauti",
    name: "CAUTI",
    items: [
      "Insert only for appropriate indications",
      "Aseptic insertion by trained staff",
      "Maintain a closed drainage system",
      "Secure the catheter; keep the bag below the bladder and flow unobstructed",
      "Review necessity daily; remove as soon as possible",
    ],
    sources: ["shea-2022"],
  },
  {
    key: "vap",
    name: "VAP",
    items: [
      "Use NIV or high-flow oxygen to avoid intubation when appropriate",
      "Minimise sedation; daily spontaneous awakening paired with a breathing trial",
      "Early exercise and mobilisation",
      "Head of bed 30–45°",
      "Daily toothbrushing (oral care without chlorhexidine)",
      "Subglottic secretion drainage if ventilation > 48–72 h is expected",
    ],
    sources: ["shea-2022"],
  },
  {
    key: "ssi",
    name: "SSI",
    items: [
      "Antibiotics within 60 min before incision (120 min for vancomycin/fluoroquinolones)",
      "Alcohol-based skin antisepsis",
      "Do not remove hair unless necessary; use clippers, not razors",
      "Maintain normothermia",
      "Perioperative glucose < 200 mg/dL",
    ],
    sources: ["cdc-ssi", "shea-2022"],
  },
];

export const DONNING = ["Hand hygiene", "Gown", "Mask or respirator (seal check)", "Eye protection", "Gloves (over gown cuffs)"];
export const DOFFING = ["Gloves", "Hand hygiene", "Gown", "Hand hygiene", "Eye protection", "Hand hygiene", "Mask or respirator (after leaving the room)", "Hand hygiene"];

export const FIVE_MOMENTS = ["Before touching a patient", "Before a clean/aseptic procedure", "After body fluid exposure risk", "After touching a patient", "After touching patient surroundings"];

export const SPAULDING = [
  { level: "Critical", contact: "Enters sterile tissue or the vascular system", process: "Sterilisation" },
  { level: "Semi-critical", contact: "Mucous membranes or non-intact skin", process: "High-level disinfection" },
  { level: "Non-critical", contact: "Intact skin only", process: "Low/intermediate-level disinfection" },
];

export const DISINFECTANTS = [
  "Alcohol 70%: rapid skin/device wipe; not sporicidal",
  "Sodium hypochlorite (bleach): sporicidal at 1:10 — follow the product's contact time",
  "Chlorhexidine: skin antisepsis with persistent activity; let it dry fully",
  "Hydrogen peroxide (accelerated): broad environmental activity",
  "Quaternary ammonium: routine non-critical surfaces; not sporicidal",
  "Povidone-iodine: skin prep; leave on until dry (about 2 min)",
];

export const EXPOSURE_STEPS = [
  "Stop the procedure safely",
  "Wash the wound with soap and water",
  "Flush exposed mucous membranes with water or saline",
  "Do not squeeze, scrub or apply caustic agents",
  "Report immediately to your supervisor / occupational health",
  "Document the exposure (device, depth, fluid, source)",
  "Assess the source patient's HIV, HBV and HCV status",
  "Draw baseline labs for the exposed worker",
  "Start HIV PEP if indicated — within hours, no later than 72 h",
  "Arrange follow-up testing and counselling",
];

export const PEP = [
  { source: "HIV-positive source", action: "Start HIV PEP as soon as possible (hours, not days); 28-day course per protocol" },
  { source: "HBV-positive source", action: "Check vaccination and anti-HBs; HBIG + vaccine if non-immune" },
  { source: "HCV-positive source", action: "No PEP; test early (HCV RNA ≥ 3 weeks) and refer if positive" },
];

export const FOLLOW_UP = [
  { when: "Baseline", what: "HIV, HBV, HCV testing" },
  { when: "≥ 3 weeks", what: "HCV RNA (if HCV source)" },
  { when: "6 weeks", what: "HIV test" },
  { when: "4 months", what: "HIV (4th-gen Ag/Ab) · anti-HCV with reflex RNA (4–6 months)" },
];

export const INFECTION_SOURCES: SourceId[] = ["hicpac-2007", "hicpac-mdro", "cdc-covid-ipc", "idsa-cdi", "cdc-flu"];
