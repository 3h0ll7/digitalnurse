import type { ComponentType } from "react";
import { Activity, Baby, Calculator as CalcIcon, Droplet, Droplets, Scale, Square, Syringe, User, Waves, type LucideIcon } from "lucide-react";
import { BmiCalc, CrclCalc, DosageCalc, DripCalc } from "./Basic";
import { BsaCalc, IbwCalc } from "./BodySize";
import HeparinCalc from "./Heparin";
import InsulinCalc from "./Insulin";
import PregnancyCalc from "./Pregnancy";
import VasopressorCalc from "./Vasopressor";

export type CalculatorCategory = "dosing" | "body" | "obstetric" | "general";

export interface CalculatorEntry {
  id: "dosage" | "iv-drip" | "bmi" | "creatinine" | "vasopressor" | "heparin" | "insulin" | "ibw" | "bsa" | "edd";
  category: CalculatorCategory;
  icon: LucideIcon;
  /** ISMP lists vasoactive drugs, heparin and IV insulin as high-alert medications. */
  highAlert?: boolean;
  Component: ComponentType;
}

export const CALCULATORS: CalculatorEntry[] = [
  { id: "dosage", category: "dosing", icon: Droplet, Component: DosageCalc },
  { id: "iv-drip", category: "dosing", icon: Droplets, Component: DripCalc },
  { id: "vasopressor", category: "dosing", icon: Activity, highAlert: true, Component: VasopressorCalc },
  { id: "heparin", category: "dosing", icon: Waves, highAlert: true, Component: HeparinCalc },
  { id: "insulin", category: "dosing", icon: Syringe, highAlert: true, Component: InsulinCalc },
  { id: "bmi", category: "body", icon: Scale, Component: BmiCalc },
  { id: "ibw", category: "body", icon: User, Component: IbwCalc },
  { id: "bsa", category: "body", icon: Square, Component: BsaCalc },
  { id: "creatinine", category: "general", icon: CalcIcon, Component: CrclCalc },
  { id: "edd", category: "obstetric", icon: Baby, Component: PregnancyCalc },
];

export const CATEGORY_ORDER: CalculatorCategory[] = ["dosing", "body", "general", "obstetric"];
