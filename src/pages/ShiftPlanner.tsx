import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Clock3, Download, Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { usePreferences } from "@/contexts/PreferencesContext";
import shiftI18n from "@/data/shift-i18n.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type ShiftType = "day" | "night" | "evening";
type MainTab = "brain" | "sbar" | "timeline" | "tools";

type Patient = {
  id: string;
  name: string;
  bed: string;
  room: string;
  ageGender: string;
  diagnosis: string;
  attending: string;
  codeStatus: "Full Code" | "DNR";
  allergies: string;
  isolation: string;
  admissionDay: string;
  vitals: Array<{ time: string; hr: string; bp: string; map: string; spo2: string; temp: string; rr: string; o2: string; fio2: string; rass: string; gcs: string; pain: string }>;
  drips: Array<{ drug: string; rate: string; concentration: string; started: string }>;
  lines: Array<{ type: string; site: string; dateInserted: string; size: string; due: string }>;
  io: Array<{ time: string; intake: string; output: string; urine: string; drain: string }>;
  labs: Array<{ name: string; status: "Ordered" | "Collected" | "Resulted" }>;
  meds: Array<{ time: string; medication: string; dose: string; route: string; status: "Due" | "Given" | "Held" | "Refused" }>;
  tasks: Array<{ label: string; priority: "Urgent" | "Routine" | "PRN"; done: boolean; time: string }>;
  notes: Array<{ text: string; at: string }>;
};

type ShiftState = {
  shiftType: ShiftType;
  nurseName: string;
  patientCount: number;
  patients: Patient[];
  timeline: Array<{ time: string; category: string; detail: string }>;
  sbarText: string;
  updatedAt: string;
};

const storageKey = "digital-nurse-shift-planner-v1";

const emptyPatient = (i: number): Patient => ({
  id: crypto.randomUUID(),
  name: "",
  bed: "",
  room: "",
  ageGender: "",
  diagnosis: "",
  attending: "",
  codeStatus: "Full Code",
  allergies: "",
  isolation: "",
  admissionDay: "",
  vitals: [{ time: "", hr: "", bp: "", map: "", spo2: "", temp: "", rr: "", o2: "", fio2: "", rass: "", gcs: "", pain: "" }],
  drips: [{ drug: "", rate: "", concentration: "", started: "" }],
  lines: [{ type: "", site: "", dateInserted: "", size: "", due: "" }],
  io: [{ time: "", intake: "", output: "", urine: "", drain: "" }],
  labs: [{ name: "CBC", status: "Ordered" }],
  meds: [{ time: "", medication: "", dose: "", route: "", status: "Due" }],
  tasks: [],
  notes: [{ text: "", at: new Date().toISOString() }],
});

const defaultState = (): ShiftState => ({
  shiftType: "day",
  nurseName: "",
  patientCount: 3,
  patients: [emptyPatient(1), emptyPatient(2), emptyPatient(3)],
  timeline: [],
  sbarText: "",
  updatedAt: new Date().toISOString(),
});

const ShiftPlanner = () => {
  const { language, direction } = usePreferences();
  const tx = shiftI18n[language as "en" | "ar"];
  const [tab, setTab] = useState<MainTab>("brain");
  const [now, setNow] = useState(new Date());
  const [state, setState] = useState<ShiftState>(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultState();
    try {
      return JSON.parse(raw) as ShiftState;
    } catch {
      return defaultState();
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const auto = setInterval(() => {
      const next = { ...state, updatedAt: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(next));
      setState(next);
    }, 30000);
    return () => clearInterval(auto);
  }, [state]);

  const shiftLength = state.shiftType === "evening" ? 8 : 12;

  const totals = useMemo(() => {
    return state.patients.map((p) => {
      const intake = p.io.reduce((acc, i) => acc + (Number(i.intake) || 0), 0);
      const output = p.io.reduce((acc, i) => acc + (Number(i.output) || 0), 0);
      return { intake, output, net: intake - output };
    });
  }, [state.patients]);

  const updatePatient = (index: number, patch: Partial<Patient>) => {
    setState((prev) => {
      const patients = [...prev.patients];
      patients[index] = { ...patients[index], ...patch };
      return { ...prev, patients, updatedAt: new Date().toISOString() };
    });
  };

  const addPatient = () => {
    setState((prev) => {
      if (prev.patientCount >= 6) return prev;
      return {
        ...prev,
        patientCount: prev.patientCount + 1,
        patients: [...prev.patients, emptyPatient(prev.patientCount + 1)],
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const removePatient = (idx: number) => {
    setState((prev) => ({
      ...prev,
      patientCount: Math.max(1, prev.patientCount - 1),
      patients: prev.patients.filter((_, i) => i !== idx),
      updatedAt: new Date().toISOString(),
    }));
  };

  const generateReport = () => {
    const text = state.patients
      .map((p, i) => `#${i + 1} ${p.name || "-"}\nS: ${p.diagnosis}\nB: ${p.allergies} | ${p.codeStatus}\nA: HR ${p.vitals[0]?.hr || "-"}, BP ${p.vitals[0]?.bp || "-"}, Net ${totals[i]?.net || 0}\nR: ${p.tasks.filter((t) => !t.done).map((t) => t.label).join(", ") || "-"}`)
      .join("\n\n");
    setState((prev) => ({ ...prev, sbarText: text }));
  };

  const copyReport = async () => {
    if (!state.sbarText) return;
    await navigator.clipboard.writeText(state.sbarText);
  };

  const exportShift = () => {
    const text = JSON.stringify(state, null, 2);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shift-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout title={tx.title} subtitle={tx.subtitle}>
      <section dir={direction} className="rounded-3xl border border-white/10 bg-card/75 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-cyan-300/40 bg-cyan-400/10 text-cyan-100">
            <Clock3 size={14} className="mr-2" /> {tx.shift.dateTime}: {now.toLocaleString(language === "ar" ? "ar-EG" : "en-US")}
          </Badge>
          {(["day", "night", "evening"] as ShiftType[]).map((s) => (
            <Button key={s} size="sm" variant={state.shiftType === s ? "default" : "outline"} onClick={() => setState((p) => ({ ...p, shiftType: s }))}>
              {tx.shift[s]}
            </Button>
          ))}
          <Input className="max-w-xs bg-white/5" placeholder={tx.shift.yourName} value={state.nurseName} onChange={(e) => setState((p) => ({ ...p, nurseName: e.target.value }))} />
          <Button variant="outline" onClick={() => { if (window.confirm(tx.shift.startNewConfirm)) setState(defaultState()); }}>{tx.shift.startNew}</Button>
          <Button onClick={exportShift}><Download size={16} className="mr-2" />{tx.shift.export}</Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{tx.shift.lastUpdated}: {new Date(state.updatedAt).toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US")} · {tx.shift.autoSaved}</p>
      </section>

      <Tabs value={tab} onValueChange={(v) => setTab(v as MainTab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brain">{tx.tabs.brain}</TabsTrigger>
          <TabsTrigger value="sbar">{tx.tabs.sbar}</TabsTrigger>
          <TabsTrigger value="timeline">{tx.tabs.timeline}</TabsTrigger>
          <TabsTrigger value="tools">{tx.tabs.tools}</TabsTrigger>
        </TabsList>

        <TabsContent value="brain" className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" onClick={addPatient}><Plus size={16} className="mr-2" />{tx.patient.addPatient}</Button>
          </div>
          {state.patients.map((patient, i) => (
            <Card key={patient.id} className="rounded-3xl border-white/10 bg-card/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">{tx.patient[`patient${Math.min(i + 1, 3) as 1 | 2 | 3}`]} </h3>
                <Button size="sm" variant="ghost" onClick={() => removePatient(i)}><Trash2 size={14} className="mr-1" />{tx.patient.removePatient}</Button>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <Input placeholder={tx.patient.patient} value={patient.name} onChange={(e) => updatePatient(i, { name: e.target.value })} />
                <Input placeholder={tx.patient.bed} value={patient.bed} onChange={(e) => updatePatient(i, { bed: e.target.value })} />
                <Input placeholder={tx.patient.room} value={patient.room} onChange={(e) => updatePatient(i, { room: e.target.value })} />
                <Input placeholder={tx.patient.ageGender} value={patient.ageGender} onChange={(e) => updatePatient(i, { ageGender: e.target.value })} />
                <Input placeholder={tx.patient.diagnosis} value={patient.diagnosis} onChange={(e) => updatePatient(i, { diagnosis: e.target.value })} />
                <Input placeholder={tx.patient.attending} value={patient.attending} onChange={(e) => updatePatient(i, { attending: e.target.value })} />
              </div>
              <details className="mt-3 rounded-2xl border border-white/10 p-3">
                <summary>{tx.sections.vitals} (HR/BP/MAP/SpO2/Temp/RR/O2/FiO2/RASS/GCS/Pain)</summary>
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-6">
                  {Object.keys(patient.vitals[0]).map((k) => (
                    <Input key={k} placeholder={k.toUpperCase()} value={patient.vitals[0][k as keyof Patient["vitals"][number]]} onChange={(e) => {
                      const vitals = [...patient.vitals];
                      vitals[0] = { ...vitals[0], [k]: e.target.value };
                      updatePatient(i, { vitals });
                    }} className={k === "map" && Number(patient.vitals[0].map) < 65 ? "border-red-400" : ""} />
                  ))}
                </div>
              </details>
              <details className="mt-3 rounded-2xl border border-white/10 p-3">
                <summary>{tx.sections.drips}</summary>
                {patient.drips.map((d, di) => (
                  <div key={di} className="mt-2 grid gap-2 md:grid-cols-4">
                    <Input placeholder="Drug / الدواء" value={d.drug} onChange={(e) => {
                      const drips = [...patient.drips]; drips[di].drug = e.target.value; updatePatient(i, { drips });
                    }} />
                    <Input placeholder="Rate / السرعة" value={d.rate} onChange={(e) => { const drips = [...patient.drips]; drips[di].rate = e.target.value; updatePatient(i, { drips }); }} />
                    <Input placeholder="Concentration / التركيز" value={d.concentration} onChange={(e) => { const drips = [...patient.drips]; drips[di].concentration = e.target.value; updatePatient(i, { drips }); }} />
                    <Input placeholder="Started / وقت البدء" value={d.started} onChange={(e) => { const drips = [...patient.drips]; drips[di].started = e.target.value; updatePatient(i, { drips }); }} />
                  </div>
                ))}
              </details>
              <details className="mt-3 rounded-2xl border border-white/10 p-3">
                <summary>{tx.sections.io}</summary>
                <div className="mt-2 grid gap-2 md:grid-cols-5">
                  {(["time", "intake", "output", "urine", "drain"] as const).map((field) => (
                    <Input key={field} placeholder={field} value={patient.io[0][field]} onChange={(e) => {
                      const io = [...patient.io]; io[0][field] = e.target.value; updatePatient(i, { io });
                    }} />
                  ))}
                </div>
                <p className="mt-2 text-sm">{tx.sections.io}: {totals[i]?.intake || 0}/{totals[i]?.output || 0} | Net {totals[i]?.net || 0}</p>
              </details>
              <details className="mt-3 rounded-2xl border border-white/10 p-3">
                <summary>{tx.sections.notes}</summary>
                <Textarea className="mt-2 bg-white/5" value={patient.notes[0]?.text || ""} onChange={(e) => {
                  const notes = [...patient.notes];
                  notes[0] = { text: e.target.value, at: new Date().toISOString() };
                  updatePatient(i, { notes });
                }} />
              </details>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sbar">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4">
            <div className="mb-3 flex gap-2">
              <Button onClick={generateReport}>{tx.common.generateReport}</Button>
              <Button variant="outline" onClick={copyReport}>{tx.common.copy}</Button>
              <Button variant="outline" onClick={() => window.print()}>{tx.common.print}</Button>
            </div>
            <Textarea rows={12} value={state.sbarText} onChange={(e) => setState((p) => ({ ...p, sbarText: e.target.value }))} placeholder="Situation / Background / Assessment / Recommendation" className="bg-white/5" />
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 space-y-3">
            <p>{tx.common.shiftStart}: 00:00 · {tx.common.shiftEnd}: {shiftLength}:00</p>
            <p>{tx.common.hoursElapsed}: {new Date().getHours()} · {tx.common.hoursRemaining}: {Math.max(0, shiftLength - new Date().getHours())}</p>
            <Button size="sm" onClick={() => setState((p) => ({ ...p, timeline: [...p.timeline, { time: new Date().toLocaleTimeString(), category: "event", detail: "" }] }))}>{tx.common.addEvent}</Button>
            {state.timeline.map((e, idx) => (
              <div key={idx} className="grid gap-2 md:grid-cols-3">
                <Input value={e.time} onChange={(ev) => setState((p) => ({ ...p, timeline: p.timeline.map((item, i) => i === idx ? { ...item, time: ev.target.value } : item) }))} placeholder={tx.common.time} />
                <Input value={e.category} onChange={(ev) => setState((p) => ({ ...p, timeline: p.timeline.map((item, i) => i === idx ? { ...item, category: ev.target.value } : item) }))} placeholder={tx.common.event} />
                <Input value={e.detail} onChange={(ev) => setState((p) => ({ ...p, timeline: p.timeline.map((item, i) => i === idx ? { ...item, detail: ev.target.value } : item) }))} placeholder="detail" />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card className="rounded-3xl border-white/10 bg-card/70 p-4 space-y-2">
            <p className="font-semibold">Hourly Rounding / الجولة كل ساعة</p>
            <div className="grid gap-2 md:grid-cols-5">
              {[
                ["Pain", "الألم"],
                ["Position", "الوضعية"],
                ["Potty", "الحاجة للحمام"],
                ["Periphery", "الأطراف والمحيط"],
                ["Plan", "الخطة"],
              ].map(([en, ar]) => (
                <label key={en} className="flex items-center gap-2 rounded-xl border border-white/10 p-2">
                  <input type="checkbox" />
                  <span>{language === "ar" ? ar : en}</span>
                </label>
              ))}
            </div>
            <p>Fall Risk Alert / تنبيه خطر السقوط</p>
            <p>Restraint Check / فحص القيود</p>
            <p>Bed Alarm / تنبيه منبه السرير</p>
            <p>Blood Sugar / سكر الدم</p>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default ShiftPlanner;
