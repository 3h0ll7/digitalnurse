import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDocsI18n, copyText } from "./DocsShared";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const DocsTools = () => {
  const navigate = useNavigate();
  const { copy, language, direction } = useDocsI18n();
  const [format, setFormat] = useState("SOAP");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phraseFilter, setPhraseFilter] = useState("");

  const phrases = {
    Neurological: ["Alert and oriented ×4", "PERRLA 3mm bilaterally", "MAE with equal strength"],
    Cardiovascular: ["Heart sounds S1S2 regular, no murmur", "Peripheral pulses 2+ bilaterally", "No edema noted"],
    Respiratory: ["Lungs clear bilaterally", "On room air, SpO2 98%", "Diminished breath sounds at bases"],
    Gastrointestinal: ["Abdomen soft, non-tender, non-distended", "Bowel sounds active ×4 quadrants", "Tolerating diet"],
    Genitourinary: ["Voiding without difficulty", "Foley draining clear yellow urine", "Urine output adequate"],
    "Skin/Wound": ["Skin warm, dry, intact", "Surgical site clean, dry, no erythema", "Braden score 18"],
  };

  const legalAlerts = [
    ["Restraint without 2hr reassessment", "قيود بدون تقييم كل ساعتين"],
    ["Medication given without vitals", "دواء بدون علامات حيوية"],
    ["Fall without incident report", "سقوط بدون تقرير حادثة"],
    ["Blood transfusion without consent", "نقل دم بدون موافقة"],
    ["Patient leaving AMA without documentation", "خروج ضد النصيحة بدون توثيق"],
  ];

  const abbreviations = [
    ["BID", "Twice daily", "مرتين يومياً"],
    ["TID", "Three times daily", "ثلاث مرات يومياً"],
    ["PRN", "As needed", "عند الحاجة"],
    ["NPO", "Nothing by mouth", "صائم"],
    ["VS", "Vital signs", "علامات حيوية"],
    ["WNL", "Within normal limits", "ضمن الحدود الطبيعية"],
  ];

  const doNotUse = [
    ["U", "units", "Mistaken for 0 or 4", "يُخلط مع 0 أو 4"],
    ["IU", "international units", "Mistaken for IV", "يُخلط مع IV"],
    ["QD / QOD", "daily / every other day", "Confused with each other", "يُخلطون ببعض"],
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const system = `You are a clinical nursing documentation assistant. Convert the nurse's shorthand notes into a professional, accurate ${format} note. Use standard medical terminology. Maintain factual accuracy — do not add information not provided. Output in ${language}. Model claude-sonnet-4-20250514.`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [{ role: "system", content: system }, { role: "user", content: input }], language }),
      });
      if (!resp.ok) throw new Error("AI request failed");
      const text = await resp.text();
      setOutput(text.slice(0, 4000));
    } catch {
      toast.error(language === "ar" ? "خطأ في إنشاء الملاحظة" : "Failed to generate note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title={copy.toolsRouteTitle} subtitle={copy.hubSubtitle} onBack={() => navigate("/docs")}>
      <section dir={direction} className="space-y-4">
        <Accordion type="multiple" className="space-y-3">
          <AccordionItem value="ai" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.aiAssistant}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={copy.aiInput} />
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['SOAP','DAR','Narrative','Discharge'].map((f) => <SelectItem value={f} key={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleGenerate} disabled={loading}>{copy.generateProfessional}</Button>
                <Button variant="secondary" onClick={() => copyText(output)}>{copy.copy}</Button>
                <Button variant="outline" onClick={handleGenerate}>{copy.regenerate}</Button>
              </div>
              <p className="text-xs text-amber-300">{copy.aiDisclaimer}</p>
              <Textarea value={output} onChange={(e) => setOutput(e.target.value)} placeholder={copy.loading} rows={8} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="phrases" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.quickPhrases}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Input value={phraseFilter} onChange={(e) => setPhraseFilter(e.target.value)} placeholder={copy.search} />
              {Object.entries(phrases).map(([category, items]) => (
                <div key={category}>
                  <h4 className="mb-2 text-sm font-semibold">{category}</h4>
                  <div className="grid gap-2">
                    {items.filter((it) => it.toLowerCase().includes(phraseFilter.toLowerCase())).map((item) => (
                      <button key={item} onClick={() => copyText(item)} className="rounded-lg border border-white/10 p-2 text-start text-sm hover:border-cyan-300/40">{item}</button>
                    ))}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="alerts" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.legalAlerts}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {legalAlerts.map(([en, ar]) => (
                <div key={en} className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm">
                  {language === "ar" ? ar : en}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="abbr" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.abbreviations}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="rounded-xl border border-emerald-400/20 p-3">
                <h4 className="mb-2 text-sm font-semibold text-emerald-300">Approved Abbreviations</h4>
                {abbreviations.map(([abbr, en, ar]) => (
                  <div key={abbr} className="text-sm">{abbr} — {language === "ar" ? ar : en}</div>
                ))}
              </div>
              <div className="rounded-xl border border-red-400/20 p-3">
                <h4 className="mb-2 text-sm font-semibold text-red-300">Do-Not-Use List (Joint Commission)</h4>
                {doNotUse.map(([bad, correct, whyEn, whyAr]) => (
                  <div key={bad} className="mb-2 text-sm">{bad} → {correct} ({language === "ar" ? whyAr : whyEn})</div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </AppLayout>
  );
};

export default DocsTools;
