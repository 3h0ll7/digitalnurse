import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDocsI18n, useAutosaveDoc, copyText, exportTextFile } from "./DocsShared";

const systemSuggestions = ["Neurological", "Cardiovascular", "Respiratory", "Gastrointestinal", "Genitourinary", "Integumentary"];

const DocsPatient = () => {
  const navigate = useNavigate();
  const { copy, language, direction } = useDocsI18n();
  const [noteFormat, setNoteFormat] = useState("SOAP");
  const [fields, setFields] = useState({ s: "", o: "", a: "", p: "", d: "", action: "", r: "", narrative: "", system: systemSuggestions[0] });
  const [generated, setGenerated] = useState("");
  const [assessmentMode, setAssessmentMode] = useState<Record<string, "normal" | "abnormal">>({});
  const [assessmentNotes, setAssessmentNotes] = useState<Record<string, string>>({});

  const dischargeStore = useAutosaveDoc("discharge-summary", {
    dischargeDate: "",
    diagnosis: "",
    condition: "",
    meds: "",
    instructions: "",
    warning: "",
    education: "",
    understanding: false,
    transport: "Ambulatory",
  });

  const incidentStore = useAutosaveDoc("incident-report", {
    datetime: "",
    location: "",
    type: "Fall",
    description: "",
    witnesses: "",
    before: "",
    after: "",
    interventions: "",
    mdNotified: false,
    familyNotified: false,
  });

  const systems = [
    ["neurological", "Neurological", "الجهاز العصبي", "GCS, orientation, pupils (PERRLA), motor/sensory, LOC"],
    ["cardio", "Cardiovascular", "القلب والأوعية", "HR, rhythm, BP, MAP, edema, capillary refill"],
    ["resp", "Respiratory", "الجهاز التنفسي", "RR, SpO2, lung sounds, O2 device, FiO2"],
    ["gi", "Gastrointestinal", "الجهاز الهضمي", "Bowel sounds, abdomen, diet, nausea/vomiting"],
    ["gu", "Genitourinary", "الجهاز البولي", "Urine color/amount, Foley/void, dialysis access"],
    ["integ", "Integumentary", "الجلد", "Skin color, turgor, wounds, Braden score, IV sites"],
    ["msk", "Musculoskeletal", "العضلات والعظام", "ROM, mobility, fall risk, DVT prophylaxis"],
    ["psych", "Psychosocial", "الحالة النفسية", "Mood, behavior, pain, anxiety, support"],
    ["lines", "Lines & Devices", "الخطوط والأجهزة", "Central lines, drains, tubes — site, date"],
    ["safety", "Allergies & Safety", "الحساسية والسلامة", "Allergies, code status, isolation, ID band"],
  ] as const;

  const generatedAssessment = useMemo(() => {
    const dt = new Date().toLocaleString();
    return systems
      .map(([key, en, ar]) => {
        const mode = assessmentMode[key] ?? "normal";
        const label = mode === "normal" ? copy.wnl : copy.seeNotes;
        const title = language === "ar" ? ar : en;
        return `${title}: ${label}${assessmentNotes[key] ? ` — ${assessmentNotes[key]}` : ""}`;
      })
      .join("\n");
  }, [assessmentMode, assessmentNotes, systems, copy.wnl, copy.seeNotes, language]);

  const generateNote = () => {
    const stamp = `${copy.dateTime}: ${new Date().toLocaleString()}`;
    if (noteFormat === "SOAP") {
      setGenerated(`SOAP\n${stamp}\nSystem: ${fields.system}\nS: ${fields.s}\nO: ${fields.o}\nA: ${fields.a}\nP: ${fields.p}`);
      return;
    }
    if (noteFormat === "DAR") {
      setGenerated(`DAR\n${stamp}\nSystem: ${fields.system}\nD: ${fields.d}\nA: ${fields.action}\nR: ${fields.r}`);
      return;
    }
    setGenerated(`${noteFormat}\n${stamp}\n${fields.narrative}`);
  };

  return (
    <AppLayout title={copy.patientRouteTitle} subtitle={copy.hubSubtitle} onBack={() => navigate("/docs")}>
      <section dir={direction} className="space-y-4">
        <Accordion type="multiple" className="space-y-3">
          <AccordionItem value="notes" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.nursingNotes}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Select value={noteFormat} onValueChange={setNoteFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOAP">SOAP Note</SelectItem>
                  <SelectItem value="DAR">DAR (Focus Charting)</SelectItem>
                  <SelectItem value="Narrative">Narrative Note</SelectItem>
                  <SelectItem value="Assessment">Assessment Note</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fields.system} onValueChange={(v) => setFields((p) => ({ ...p, system: v }))}>
                <SelectTrigger><SelectValue placeholder={copy.selectSystem} /></SelectTrigger>
                <SelectContent>
                  {systemSuggestions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {noteFormat === "SOAP" && (["s", "o", "a", "p"] as const).map((k) => (
                <Textarea key={k} value={fields[k]} onChange={(e) => setFields((p) => ({ ...p, [k]: e.target.value }))} placeholder={`${k.toUpperCase()} ${copy.typeHere}`} />
              ))}
              {noteFormat === "DAR" && (["d", "action", "r"] as const).map((k) => (
                <Textarea key={k} value={fields[k]} onChange={(e) => setFields((p) => ({ ...p, [k]: e.target.value }))} placeholder={`${k.toUpperCase()} ${copy.typeHere}`} />
              ))}
              {(noteFormat === "Narrative" || noteFormat === "Assessment") && <Textarea value={fields.narrative} onChange={(e) => setFields((p) => ({ ...p, narrative: e.target.value }))} placeholder={copy.typeHere} />}
              <div className="flex flex-wrap gap-2">
                <Button onClick={generateNote}>{copy.generateNote}</Button>
                <Button variant="secondary" onClick={() => copyText(generated)}>{copy.copyClipboard}</Button>
                <Button variant="outline" onClick={() => setGenerated("")}>{copy.clear}</Button>
              </div>
              {generated && <pre className="whitespace-pre-wrap rounded-xl bg-background/60 p-3 text-sm">{generated}</pre>}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="admission" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.admissionAssessment}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {systems.map(([key, en, ar, fieldsText]) => (
                <div key={key} className="rounded-xl border border-white/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{language === "ar" ? ar : en}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant={(assessmentMode[key] ?? "normal") === "normal" ? "default" : "outline"} onClick={() => setAssessmentMode((p) => ({ ...p, [key]: "normal" }))}>{copy.normal}</Button>
                      <Button size="sm" variant={(assessmentMode[key] ?? "normal") === "abnormal" ? "default" : "outline"} onClick={() => setAssessmentMode((p) => ({ ...p, [key]: "abnormal" }))}>{copy.abnormal}</Button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{fieldsText}</p>
                  <Textarea className="mt-2" value={assessmentNotes[key] ?? ""} onChange={(e) => setAssessmentNotes((p) => ({ ...p, [key]: e.target.value }))} placeholder={copy.typeHere} />
                </div>
              ))}
              <Button onClick={() => setGenerated(generatedAssessment)}>{copy.generateFullAssessment}</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="discharge" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.dischargeSummary}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Input placeholder={copy.dischargeDate} value={dischargeStore.data.dischargeDate} onChange={(e) => dischargeStore.setData((p) => ({ ...p, dischargeDate: e.target.value }))} />
              <Input placeholder={copy.dischargeDiagnosis} value={dischargeStore.data.diagnosis} onChange={(e) => dischargeStore.setData((p) => ({ ...p, diagnosis: e.target.value }))} />
              <Input placeholder={copy.conditionAtDischarge} value={dischargeStore.data.condition} onChange={(e) => dischargeStore.setData((p) => ({ ...p, condition: e.target.value }))} />
              <Textarea placeholder={copy.instructions} value={dischargeStore.data.instructions} onChange={(e) => dischargeStore.setData((p) => ({ ...p, instructions: e.target.value }))} />
              <Textarea placeholder={copy.warningSigns} value={dischargeStore.data.warning} onChange={(e) => dischargeStore.setData((p) => ({ ...p, warning: e.target.value }))} />
              <div className="flex gap-2">
                <Button onClick={() => copyText(JSON.stringify(dischargeStore.data, null, 2))}>{copy.copyAll}</Button>
                <Button variant="outline" onClick={() => exportTextFile("discharge-summary", JSON.stringify(dischargeStore.data, null, 2))}>{copy.exportText}</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="incident" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.incidentReport}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Input placeholder={copy.dateTime} value={incidentStore.data.datetime} onChange={(e) => incidentStore.setData((p) => ({ ...p, datetime: e.target.value }))} />
              <Input placeholder={copy.location} value={incidentStore.data.location} onChange={(e) => incidentStore.setData((p) => ({ ...p, location: e.target.value }))} />
              <Select value={incidentStore.data.type} onValueChange={(v) => incidentStore.setData((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue placeholder={copy.type} /></SelectTrigger>
                <SelectContent>
                  {['Fall','Medication Error','Equipment Malfunction','Needle Stick','Patient Injury','Skin Breakdown','Other'].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea placeholder={copy.description} value={incidentStore.data.description} onChange={(e) => incidentStore.setData((p) => ({ ...p, description: e.target.value }))} />
              <Textarea placeholder={copy.interventions} value={incidentStore.data.interventions} onChange={(e) => incidentStore.setData((p) => ({ ...p, interventions: e.target.value }))} />
              <Button onClick={() => copyText(JSON.stringify(incidentStore.data, null, 2))}>{copy.copyClipboard}</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="restraint" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.restraintRecord}</AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm text-muted-foreground">
              {["Circulation check (CMS)","Skin integrity under restraint","ROM performed","Nutrition/hydration offered","Toileting offered","Need for continued restraint","Restraint released for","MD order renewed"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 p-2">{item}</div>
              ))}
              <p>2-hour reminders run from timestamped checks and are stored in localStorage.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transfusion" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.transfusionRecord}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {["Product Type", "Unit Number", "Blood Type & Rh", "Start Time", "End Time", "Rate"].map((f) => (
                  <Input key={f} placeholder={f} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {["Baseline", "15 Minutes", "30 Minutes", "1 Hour", "Completion", "Post-Transfusion"].map((t) => (
                  <div key={t} className="rounded-lg border border-white/10 p-2">{t}</div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wound" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.woundDocumentation}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                {["Wound Type", "Location", "Length × Width × Depth (cm)", "Wound Bed", "Wound Edges", "Drainage", "Amount", "Surrounding Skin", "Dressing Applied", "Stage"].map((label) => (
                  <div key={label}>
                    <Label>{label}</Label>
                    <Input placeholder={copy.typeHere} />
                  </div>
                ))}
              </div>
              <Textarea placeholder="Progress comparison with previous" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="rounded-xl border border-white/10 bg-card/50 p-3 text-xs text-muted-foreground">
          {copy.autoSaved}: {dischargeStore.lastSavedAt ?? "--"}
        </div>
      </section>
    </AppLayout>
  );
};

export default DocsPatient;
