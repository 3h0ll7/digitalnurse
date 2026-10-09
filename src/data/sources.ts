/** References cited next to clinical facts and numbers. Add an entry before citing it. */
export interface Source {
  label: string;
  year?: string;
  url?: string;
}

export const SOURCES = {
  "who-bmi": { label: "WHO Technical Report Series 894 — Obesity", year: "2000" },
  "aha-acls": { label: "AHA Guidelines for CPR & ECC — Adult Advanced Life Support", year: "2020", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines" },
  "berlin-ards": { label: "ARDS Definition Task Force (Berlin definition), JAMA", year: "2012" },
  winters: { label: "Albert, Dell & Winters — expected PaCO₂ in metabolic acidosis, Ann Intern Med", year: "1967" },
  "cap-critical": { label: "CAP accreditation checklist GEN.41320 — critical results are defined by each laboratory" },
  "nice-cg174": { label: "NICE CG174 — Intravenous fluid therapy in adults in hospital", year: "2017", url: "https://www.nice.org.uk/guidance/cg174" },
  "holliday-segar": { label: "Holliday & Segar — maintenance fluid requirements, Pediatrics", year: "1957" },
  "ukka-hyperk": { label: "UK Kidney Association — Treatment of acute hyperkalaemia in adults", year: "2020" },
  "hyponatraemia-2014": { label: "Spasovski et al. — Clinical practice guideline on hyponatraemia, Eur J Endocrinol", year: "2014" },
  "ismp-high-alert": { label: "ISMP List of High-Alert Medications in Acute Care Settings", year: "2024", url: "https://www.ismp.org/recommendations/high-alert-medications-acute-list" },
  dailymed: { label: "FDA product labels (DailyMed)", url: "https://dailymed.nlm.nih.gov/" },
  "ada-hospital": { label: "ADA Standards of Care in Diabetes — Diabetes care in the hospital", year: "2025" },
  "acog-term": { label: "ACOG Committee Opinion 579 — Definition of term pregnancy", year: "2013" },
  devine: { label: "Devine — ideal body weight formula, Drug Intell Clin Pharm", year: "1974" },
  mosteller: { label: "Mosteller — simplified BSA calculation, N Engl J Med", year: "1987" },
  "cockcroft-gault": { label: "Cockcroft & Gault — creatinine clearance, Nephron", year: "1976" },
  atls: { label: "ATLS Student Course Manual, 10th edition (burn resuscitation)", year: "2018" },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;
