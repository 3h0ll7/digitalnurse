import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/contexts/PreferencesContext";

type IsolationType = "contact" | "droplet" | "airborne" | "protective";

interface OrganismCard {
  name: string;
  type: "Gram+" | "Gram-" | "Virus" | "Fungi";
  gramStain: string;
  transmission: string;
  isolationType: IsolationType;
  commonInfections: string;
  firstLineTreatment: string;
  resistance: string;
  nursingAlert: string;
}

const bundles = {
  clabsi: [
    "Maximal sterile barriers",
    "CHG skin prep",
    "Optimal site selection",
    "Daily line necessity review",
    "Scrub the hub 15 sec",
  ],
  cauti: [
    "Appropriate indications only",
    "Aseptic insertion",
    "Maintain closed system",
    "Daily necessity review",
    "Remove catheter ASAP",
  ],
  vap: [
    "HOB 30-45°",
    "Daily sedation vacation + SBT",
    "DVT prophylaxis",
    "Oral care CHG q2-4h",
    "ETT cuff 20-30 cmH2O",
  ],
  ssi: [
    "CHG skin prep",
    "Antibiotics within 1 hr pre-incision",
    "Maintain normothermia",
    "Maintain euglycemia",
  ],
} as const;

const organisms: OrganismCard[] = [
  { name: "Staphylococcus aureus (MRSA)", type: "Gram+", gramStain: "Gram positive cocci", transmission: "Contact", isolationType: "contact", commonInfections: "SSTI, pneumonia, bloodstream infection", firstLineTreatment: "Vancomycin (severe), Linezolid", resistance: "mecA mediated beta-lactam resistance", nursingAlert: "Strict contact isolation and equipment dedication" },
  { name: "Enterococcus faecium (VRE)", type: "Gram+", gramStain: "Gram positive cocci", transmission: "Contact", isolationType: "contact", commonInfections: "UTI, bacteremia, wound infection", firstLineTreatment: "Linezolid or Daptomycin", resistance: "VanA/VanB resistance to vancomycin", nursingAlert: "Private room and high-touch surface cleaning" },
  { name: "Streptococcus pyogenes (Group A)", type: "Gram+", gramStain: "Gram positive cocci chains", transmission: "Droplet", isolationType: "droplet", commonInfections: "Pharyngitis, cellulitis, necrotizing fasciitis", firstLineTreatment: "Penicillin or Cefazolin", resistance: "Macrolide resistance increasing", nursingAlert: "Mask within 3-6 ft for active respiratory symptoms" },
  { name: "Streptococcus pneumoniae", type: "Gram+", gramStain: "Gram positive diplococci", transmission: "Droplet", isolationType: "droplet", commonInfections: "CAP, meningitis, otitis", firstLineTreatment: "Ceftriaxone +/- Vancomycin", resistance: "Penicillin and macrolide resistance", nursingAlert: "Monitor oxygenation and sepsis signs" },
  { name: "Clostridioides difficile", type: "Gram+", gramStain: "Gram positive spore-forming rod", transmission: "Contact", isolationType: "contact", commonInfections: "Antibiotic-associated colitis", firstLineTreatment: "Oral Vancomycin or Fidaxomicin", resistance: "Spore persistence in environment", nursingAlert: "SOAP AND WATER only; alcohol does not kill spores" },
  { name: "Listeria monocytogenes", type: "Gram+", gramStain: "Gram positive rod", transmission: "Foodborne", isolationType: "contact", commonInfections: "Meningitis, bacteremia", firstLineTreatment: "Ampicillin + Gentamicin", resistance: "Cephalosporin intrinsic resistance", nursingAlert: "High risk in pregnancy and immunocompromised" },
  { name: "Escherichia coli (ESBL)", type: "Gram-", gramStain: "Gram negative rod", transmission: "Contact", isolationType: "contact", commonInfections: "UTI, bacteremia, intra-abdominal infection", firstLineTreatment: "Carbapenem for severe ESBL", resistance: "ESBL enzymes", nursingAlert: "Escalate culture updates quickly" },
  { name: "Klebsiella pneumoniae (CRE)", type: "Gram-", gramStain: "Gram negative rod", transmission: "Contact", isolationType: "contact", commonInfections: "Pneumonia, bloodstream infection", firstLineTreatment: "Ceftazidime-avibactam per susceptibility", resistance: "Carbapenemase production", nursingAlert: "Alert infection control immediately" },
  { name: "Pseudomonas aeruginosa", type: "Gram-", gramStain: "Gram negative rod", transmission: "Contact", isolationType: "contact", commonInfections: "VAP, burn wound infection, sepsis", firstLineTreatment: "Piperacillin-tazobactam, Cefepime", resistance: "Multidrug efflux and porin loss", nursingAlert: "Ensure proper device care and moisture control" },
  { name: "Acinetobacter baumannii", type: "Gram-", gramStain: "Gram negative coccobacillus", transmission: "Contact", isolationType: "contact", commonInfections: "VAP, bloodstream infection", firstLineTreatment: "Ampicillin-sulbactam +/- combo", resistance: "Frequent MDR/XDR patterns", nursingAlert: "Dedicated stethoscope and terminal disinfection" },
  { name: "Neisseria meningitidis", type: "Gram-", gramStain: "Gram negative diplococci", transmission: "Droplet", isolationType: "droplet", commonInfections: "Meningitis, meningococcemia", firstLineTreatment: "Ceftriaxone", resistance: "Occasional penicillin reduced susceptibility", nursingAlert: "Urgent droplet precautions and prophylaxis for contacts" },
  { name: "Haemophilus influenzae", type: "Gram-", gramStain: "Gram negative coccobacillus", transmission: "Droplet", isolationType: "droplet", commonInfections: "Epiglottitis, pneumonia, meningitis", firstLineTreatment: "Ceftriaxone", resistance: "Beta-lactamase production", nursingAlert: "Keep airway equipment ready in epiglottitis" },
  { name: "Influenza A/B", type: "Virus", gramStain: "N/A", transmission: "Droplet", isolationType: "droplet", commonInfections: "Influenza illness, viral pneumonia", firstLineTreatment: "Oseltamivir", resistance: "Seasonal antiviral resistance shifts", nursingAlert: "Masking and early antivirals within 48h when possible" },
  { name: "SARS-CoV-2 (COVID-19)", type: "Virus", gramStain: "N/A", transmission: "Droplet/Airborne in AGP", isolationType: "droplet", commonInfections: "COVID-19 respiratory disease", firstLineTreatment: "Supportive + protocol antivirals", resistance: "Variant immune escape", nursingAlert: "Upgrade to N95 for aerosol-generating procedures" },
  { name: "Measles (Rubeola)", type: "Virus", gramStain: "N/A", transmission: "Airborne", isolationType: "airborne", commonInfections: "Measles with rash and pneumonia", firstLineTreatment: "Supportive + Vitamin A", resistance: "No routine antiviral resistance issue", nursingAlert: "Place in AIIR immediately; door closed" },
  { name: "Varicella-Zoster Virus", type: "Virus", gramStain: "N/A", transmission: "Airborne + contact", isolationType: "airborne", commonInfections: "Chickenpox, disseminated zoster", firstLineTreatment: "Acyclovir", resistance: "Acyclovir resistance in severe immunocompromise", nursingAlert: "Airborne/contact precautions until lesions crusted" },
  { name: "Mumps virus", type: "Virus", gramStain: "N/A", transmission: "Droplet", isolationType: "droplet", commonInfections: "Parotitis, meningitis", firstLineTreatment: "Supportive care", resistance: "No major resistance pattern", nursingAlert: "Isolate and assess vaccination history" },
  { name: "Candida auris", type: "Fungi", gramStain: "Yeast", transmission: "Contact", isolationType: "contact", commonInfections: "Bloodstream and invasive candidiasis", firstLineTreatment: "Echinocandin", resistance: "Frequent multidrug resistance", nursingAlert: "Notify lab and infection control for special cleaning" },
  { name: "Aspergillus fumigatus", type: "Fungi", gramStain: "Mold", transmission: "Airborne spores", isolationType: "protective", commonInfections: "Invasive pulmonary aspergillosis", firstLineTreatment: "Voriconazole", resistance: "Azole resistance emerging", nursingAlert: "Use protective environment for ANC < 500" },
  { name: "Pneumocystis jirovecii", type: "Fungi", gramStain: "Atypical fungus", transmission: "Airborne", isolationType: "protective", commonInfections: "PJP pneumonia", firstLineTreatment: "TMP-SMX", resistance: "Sulfa intolerance/resistance possible", nursingAlert: "Monitor oxygen demand and steroid indication" },
];

const InfectionGuide = () => {
  const { language } = usePreferences();
  const isAr = language === "ar";
  const [search, setSearch] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const filteredOrganisms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return organisms.filter((o) => !q || `${o.name} ${o.type} ${o.commonInfections}`.toLowerCase().includes(q));
  }, [search]);

  const copy = {
    title: isAr ? "دليل مكافحة العدوى والعزل" : "Infection Control & Isolation Guide",
    subtitle: isAr ? "الوقاية من العدوى وسلامة الكادر" : "Isolation, PPE, HAI & Exposure Safety",
    tabs: [
      isAr ? "احتياطات العزل" : "Isolation Precautions",
      isAr ? "دليل معدات الوقاية" : "PPE Guide",
      isAr ? "نظافة اليدين" : "Hand Hygiene",
      isAr ? "حزم منع عدوى المستشفيات" : "HAI Bundles",
      isAr ? "مرجع الكائنات" : "Organism Reference",
      isAr ? "التعقيم والتطهير" : "Sterilization & Disinfection",
      isAr ? "بروتوكول وخز الإبرة" : "Needle Stick Protocol",
    ],
  };

  return (
    <AppLayout title={copy.title} subtitle={copy.subtitle}>
      <Tabs defaultValue="tab1" className="space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-3xl border border-white/10 bg-card/70 p-2">
          {copy.tabs.map((tab, index) => (
            <TabsTrigger key={tab} value={`tab${index + 1}`} className="rounded-2xl px-4 py-2 text-xs">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="tab1" className="space-y-4">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <h3 className="text-lg font-semibold text-white">{isAr ? "الاحتياطات القياسية" : "Standard Precautions"}</h3>
            <p className="mt-2 text-sm text-slate-200">{isAr ? "تُطبق دائماً لجميع المرضى: نظافة اليدين، آداب السعال، معدات الوقاية حسب التقييم، التخلص الآمن من الأدوات الحادة، وتنظيف البيئة." : "Always apply to every patient: hand hygiene, respiratory etiquette, risk-based PPE, safe sharps handling, and environmental cleaning."}</p>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { key: "contact", sign: "🟩", titleEn: "Contact", titleAr: "تلامسي", ppe: "Gloves + Gown", organisms: "MRSA, VRE, C. diff (SOAP & WATER only), ESBL, CRE, Scabies, Norovirus" },
              { key: "droplet", sign: "🟦", titleEn: "Droplet", titleAr: "رذاذي", ppe: "Surgical mask within 3-6 ft", organisms: "Influenza, Pertussis, Meningococcal, Mumps, Rubella, COVID-19, Group A Strep" },
              { key: "airborne", sign: "🟥", titleEn: "Airborne", titleAr: "هوائي", ppe: "N95 + AIIR negative pressure + door CLOSED", organisms: "TB (until 3 negative AFB), Measles, Varicella, Disseminated Zoster" },
              { key: "protective", sign: "🟨", titleEn: "Protective/Reverse", titleAr: "عكسي/وقائي", ppe: "Protect immunocompromised patients", organisms: "ANC < 500, BMT; positive pressure, HEPA filter, staff PPE on entry" },
            ].map((item) => (
              <Card key={item.key} className="rounded-3xl border-white/10 bg-card/80 p-4">
                <h4 className="text-base font-semibold text-white">{item.sign} {isAr ? item.titleAr : item.titleEn}</h4>
                <p className="mt-2 text-sm text-cyan-100">{item.ppe}</p>
                <p className="mt-2 text-sm text-slate-200">{organisms.length ? (isAr ? "الكائنات:" : "Organisms:") : ""} {item.organisms}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tab2" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
              <h3 className="font-semibold text-white">{isAr ? "ترتيب ارتداء PPE" : "Donning Order"}</h3>
              <p className="mt-2 text-sm text-slate-200">Hand hygiene → Gown → Mask → Eye protection → Gloves</p>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
              <h3 className="font-semibold text-white">{isAr ? "ترتيب خلع PPE" : "Doffing Order"}</h3>
              <p className="mt-2 text-sm text-slate-200">Gloves → Hand hygiene → Gown → Hand hygiene → Eye protection → Hand hygiene → Mask → Hand hygiene</p>
            </Card>
          </div>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <h3 className="font-semibold text-white">{isAr ? "اختيار PPE حسب نوع العزل" : "PPE Selection Matrix"}</h3>
            <div className="mt-3 grid gap-2 text-sm">
              <p><span className="text-cyan-100">Contact:</span> Gloves + Gown</p>
              <p><span className="text-cyan-100">Droplet:</span> Surgical mask (+ eye protection if splash risk)</p>
              <p><span className="text-cyan-100">Airborne:</span> Fit-tested N95, AIIR room, door closed</p>
              <p><span className="text-cyan-100">Protective:</span> Staff PPE on entry, mask patient during transport</p>
            </div>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm">
            <h3 className="font-semibold text-white">N95 vs Surgical Mask</h3>
            <p className="mt-2 text-slate-200"><span className="text-cyan-100">N95:</span> airborne particles, seal-checked respirator, needed for TB/measles/varicella and AGP.</p>
            <p className="mt-1 text-slate-200"><span className="text-cyan-100">Surgical:</span> droplet barrier, loose fit, routine droplet isolation.</p>
          </Card>
        </TabsContent>

        <TabsContent value="tab3" className="space-y-4">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
            <h3 className="font-semibold text-white">WHO 5 Moments</h3>
            <ol className="mt-2 list-decimal space-y-1 ps-5">
              <li>Before touching a patient</li>
              <li>Before clean/aseptic procedure</li>
              <li>After body fluid exposure risk</li>
              <li>After touching a patient</li>
              <li>After touching patient surroundings</li>
            </ol>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
            <h3 className="font-semibold text-white">8-Step Technique</h3>
            <ol className="mt-2 list-decimal space-y-1 ps-5">
              <li>Palm to palm</li><li>Right palm over left dorsum and vice versa</li><li>Palm to palm fingers interlaced</li><li>Backs of fingers to opposing palms</li><li>Rotational rubbing thumbs</li><li>Rotational rubbing fingertips in palm</li><li>Wrists</li><li>Rinse/dry and close tap safely</li>
            </ol>
            <p className="mt-3">Alcohol rub: 20-30 sec | Soap & Water: 40-60 sec</p>
          </Card>
          <Card className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
            <div className="flex items-start gap-2"><AlertTriangle size={18} className="mt-0.5" /><p><strong>C. diff requires SOAP AND WATER — alcohol does NOT kill spores!</strong></p></div>
          </Card>
        </TabsContent>

        <TabsContent value="tab4" className="space-y-4">
          {([
            ["clabsi", isAr ? "حزمة CLABSI" : "CLABSI Bundle"],
            ["cauti", isAr ? "حزمة CAUTI" : "CAUTI Bundle"],
            ["vap", isAr ? "حزمة VAP" : "VAP Bundle"],
            ["ssi", isAr ? "حزمة SSI" : "SSI Bundle"],
          ] as const).map(([key, title]) => (
            <Card key={key} className="rounded-3xl border-white/10 bg-card/70 p-4">
              <h3 className="font-semibold text-white">{title}</h3>
              <div className="mt-2 space-y-2">
                {bundles[key].map((item, index) => {
                  const id = `${key}-${index}`;
                  return (
                    <label key={id} className="flex items-center gap-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        checked={!!checks[id]}
                        onChange={(e) => setChecks((prev) => ({ ...prev, [id]: e.target.checked }))}
                      />
                      {item}
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tab5" className="space-y-4">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAr ? "ابحث عن كائن..." : "Search organism..."} className="bg-white/5 pl-10 rtl:pl-3 rtl:pr-10" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Badge className="bg-white/10">Gram+ 6</Badge><Badge className="bg-white/10">Gram- 6</Badge><Badge className="bg-white/10">Virus 5</Badge><Badge className="bg-white/10">Fungi 3</Badge><Badge className="bg-primary/20">Total 20</Badge>
            </div>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {filteredOrganisms.map((org) => (
              <Card key={org.name} className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
                <h3 className="text-base font-semibold text-white">{org.name}</h3>
                <p className="mt-2"><span className="text-cyan-100">Type:</span> {org.type} | <span className="text-cyan-100">Gram:</span> {org.gramStain}</p>
                <p><span className="text-cyan-100">Transmission:</span> {org.transmission}</p>
                <p><span className="text-cyan-100">Isolation:</span> {org.isolationType}</p>
                <p><span className="text-cyan-100">Common infections:</span> {org.commonInfections}</p>
                <p><span className="text-cyan-100">First-line treatment:</span> {org.firstLineTreatment}</p>
                <p><span className="text-cyan-100">Resistance patterns:</span> {org.resistance}</p>
                <p><span className="text-cyan-100">Nursing alert:</span> {org.nursingAlert}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tab6" className="space-y-4">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
            <h3 className="font-semibold text-white">Spaulding Classification</h3>
            <p className="mt-2"><span className="text-cyan-100">Critical:</span> enters sterile tissue/vascular system → sterilization required.</p>
            <p><span className="text-cyan-100">Semi-Critical:</span> contacts mucous membrane/non-intact skin → high-level disinfection.</p>
            <p><span className="text-cyan-100">Non-Critical:</span> contacts intact skin → low/intermediate disinfection.</p>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
            <h3 className="font-semibold text-white">Common Disinfectants</h3>
            <ul className="mt-2 space-y-1">
              <li>Alcohol (70%): rapid skin/device wipe, contact ~30 sec.</li>
              <li>Bleach (Sodium hypochlorite): spores/viruses, contact 1-10 min (per dilution).</li>
              <li>CHG: skin antisepsis, persistent activity, allow dry fully.</li>
              <li>Hydrogen Peroxide: broad environmental activity, typical 1 min+.</li>
              <li>Quats: routine non-critical surfaces, usually 3-10 min.</li>
              <li>Betadine (Povidone-iodine): pre-procedure skin prep, let dry 2 min.</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="tab7" className="space-y-4">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
            <h3 className="font-semibold text-white">10-Step Immediate Response</h3>
            <ol className="mt-2 list-decimal space-y-1 ps-5">
              <li>Stop procedure safely.</li><li>Wash wound with soap and water.</li><li>Flush mucous membranes with water/saline.</li><li>Do not squeeze or scrub aggressively.</li><li>Report immediately to supervisor.</li><li>Document exposure details.</li><li>Identify source patient status.</li><li>Draw baseline labs for worker.</li><li>Initiate PEP if indicated (prefer &lt;2 hr).</li><li>Arrange follow-up and counseling.</li>
            </ol>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
            <h3 className="font-semibold text-white">PEP Decision Guide</h3>
            <p className="mt-2"><span className="text-cyan-100">HIV+ source:</span> start HIV PEP urgently, continue per protocol.</p>
            <p><span className="text-cyan-100">HBV+ source:</span> check vaccine/anti-HBs; give HBIG + vaccine if non-immune.</p>
            <p><span className="text-cyan-100">HCV+ source:</span> no routine PEP; early RNA monitoring and specialist referral.</p>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 text-sm text-slate-200">
            <h3 className="font-semibold text-white">Follow-up Schedule</h3>
            <p className="mt-2">Testing checkpoints: 6 weeks, 3 months, 6 months.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default InfectionGuide;
