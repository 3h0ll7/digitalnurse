import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import AppLayout from "@/components/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDocsI18n, useAutosaveDoc, copyText } from "./DocsShared";

const DocsProfessional = () => {
  const navigate = useNavigate();
  const { copy, direction, language } = useDocsI18n();
  const [procedure, setProcedure] = useState({ name: "", date: "", patient: "", outcome: "Successful", attempts: "1", notes: "" });
  const logStore = useAutosaveDoc("procedure-log", { entries: [] as typeof procedure[] });
  const eduStore = useAutosaveDoc("education-log", { required: 30, entries: [] as Array<{ title: string; hours: number; expiry: string }> });

  const chartData = useMemo(() => {
    const counts = new Map<string, number>();
    logStore.data.entries.forEach((e) => counts.set(e.name || "Custom", (counts.get(e.name || "Custom") ?? 0) + 1));
    return [...counts.entries()].map(([name, value]) => ({ name, value }));
  }, [logStore.data.entries]);

  const totalHours = eduStore.data.entries.reduce((acc, item) => acc + item.hours, 0);

  return (
    <AppLayout title={copy.professionalRouteTitle} subtitle={copy.hubSubtitle} onBack={() => navigate("/docs")}>
      <section dir={direction} className="space-y-4">
        <Accordion type="multiple" className="space-y-3">
          <AccordionItem value="shift" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.shiftArchive}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Input placeholder={copy.search} />
              <p className="text-sm text-muted-foreground">SBAR pull is available when Shift Planner local records exist.</p>
              <div className="rounded-lg border border-white/10 p-3 text-sm text-muted-foreground">{copy.noArchived}</div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="procedures" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.procedureLog}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Input placeholder="Procedure" value={procedure.name} onChange={(e) => setProcedure((p) => ({ ...p, name: e.target.value }))} />
              <Input placeholder={copy.date} value={procedure.date} onChange={(e) => setProcedure((p) => ({ ...p, date: e.target.value }))} />
              <Input placeholder="Patient/Bed" value={procedure.patient} onChange={(e) => setProcedure((p) => ({ ...p, patient: e.target.value }))} />
              <Select value={procedure.outcome} onValueChange={(v) => setProcedure((p) => ({ ...p, outcome: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Successful">{copy.successful}</SelectItem>
                  <SelectItem value="Unsuccessful">{copy.unsuccessful}</SelectItem>
                  <SelectItem value="Complications">{copy.complications}</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Notes" value={procedure.notes} onChange={(e) => setProcedure((p) => ({ ...p, notes: e.target.value }))} />
              <Button onClick={() => logStore.setData((p) => ({ ...p, entries: [procedure, ...p.entries] }))}>{copy.addEntry}</Button>
              <div className="h-52 rounded-lg border border-white/10 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06b6d4" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="edu" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.educationLog}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Course Title" id="course" />
                <Input placeholder="Hours (CEUs)" id="hours" type="number" />
              </div>
              <Button onClick={() => {
                const title = (document.getElementById("course") as HTMLInputElement)?.value;
                const hours = Number((document.getElementById("hours") as HTMLInputElement)?.value || 0);
                if (!title || !hours) return;
                eduStore.setData((p) => ({ ...p, entries: [{ title, hours, expiry: "" }, ...p.entries] }));
              }}>{copy.addEntry}</Button>
              <div className="rounded-lg border border-white/10 p-3 text-sm">
                {copy.hoursThisYear}: <b>{totalHours}</b> | {copy.requiredHours}: <b>{eduStore.data.required}</b> | {copy.remaining}: <b>{Math.max(eduStore.data.required - totalHours, 0)}</b>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.skillsChecklist}</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Airway Management (8)","Vascular Access (6)","Monitoring & Assessment (8)","Medication Administration (6)","Wound & Skin Care (5)","Emergency Response (6)","Equipment Operation (8)"
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-white/10 p-3 text-sm">{item}</div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="code" className="rounded-2xl border border-white/10 bg-card/60 px-4">
            <AccordionTrigger>{copy.codeDocumentation}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Input placeholder={language === "ar" ? "تم إعلان الكود" : "Code Called"} />
              <Input placeholder={language === "ar" ? "وقت البدء" : "Time Started"} />
              <Textarea placeholder={language === "ar" ? "أضف الأحداث مع طابع زمني تلقائي" : "Add timeline events with auto-timestamp"} />
              <div className="rounded-lg border border-white/10 p-3 text-xs text-muted-foreground">Auto-calculations: epinephrine interval q3-5 min, CPR fraction, total duration.</div>
              <Button variant="secondary" onClick={() => copyText("Printable code summary generated")}>{copy.generate}</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </AppLayout>
  );
};

export default DocsProfessional;
