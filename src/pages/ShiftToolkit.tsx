import { useEffect, useMemo, useState } from "react";
import { Bell, BellOff, Copy, Play, Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";


type ShiftMode = "day" | "night";

interface Milestone { time: string; en: string; ar: string }
interface TimeItem { time: string; en: string; ar: string }

interface MedEntry { id: string; drug: string; dose: string; route: string; patient: string; times: string[]; given: Record<string, string>; }
interface LabReminder { id: string; time: string; en: string; ar: string }
interface TimerEntry { id: string; key: string; labelEn: string; labelAr: string; frequencyMin: number; startedAt: number; history: number[] }
interface IoEntry { id: string; kind: "intake" | "output"; category: string; amount: number; timestamp: number }
interface PatientEntry { id: string; bed: string; initials: string; ageSex: string; dx: string; code: string; allergies: string; diet: string; activity: string; isolation: string; lines: string; drains: string; meds: string; notes: string; acuity: "critical" | "unstable" | "stable" | "dc" }

const SHIFT_KEY = "dn-shift-mode";
const SHIFT_TIME_KEY = "dn-shift-time";
const NOTIFY_KEY = "dn-shift-notifications";
const ROUNDING_KEY = "dn-shift-rounding";
const MED_KEY = "dn-shift-meds";
const LAB_KEY = "dn-shift-labs";
const TIMER_KEY = "dn-shift-timers";
const IO_KEY = "dn-shift-io";
const CHECKLIST_KEY = "dn-shift-checklist";
const WELLNESS_KEY = "dn-shift-wellness";
const PATIENTS_KEY = "dn-shift-patients";

const dayMilestones: Milestone[] = [
  { time: "07:00", en: "Shift Start — Get report", ar: "بداية الشفت — استلم التقرير" },
  { time: "07:30", en: "First Assessment + AM Meds", ar: "أول تقييم + أدوية الصباح" },
  { time: "08:00", en: "AM Labs review", ar: "مراجعة فحوصات الصباح" },
  { time: "09:00", en: "MD Rounds", ar: "جولة الأطباء" },
  { time: "10:00", en: "Reassessment", ar: "إعادة التقييم" },
  { time: "12:00", en: "Noon Meds + Lunch", ar: "أدوية الظهر + غداء" },
  { time: "14:00", en: "Chart catch-up", ar: "تحديث الملفات" },
  { time: "16:00", en: "PM Assessment + PM Meds", ar: "تقييم المساء + أدوية المساء" },
  { time: "18:00", en: "End-of-Shift prep", ar: "تحضير نهاية الشفت" },
  { time: "18:45", en: "SBAR Handoff", ar: "تسليم SBAR" },
  { time: "19:00", en: "Shift End", ar: "نهاية الشفت" },
];

const nightMilestones: Milestone[] = [
  { time: "19:00", en: "Shift Start — Get report", ar: "بداية الشفت — استلم التقرير" },
  { time: "19:30", en: "First Assessment + PM Meds", ar: "أول تقييم + أدوية المساء" },
  { time: "21:00", en: "HS Meds (bedtime)", ar: "أدوية وقت النوم" },
  { time: "22:00", en: "Quiet Time begins — dim lights", ar: "بداية وقت الهدوء — خفف الإضاءة" },
  { time: "00:00", en: "Midnight Meds + Assessment", ar: "أدوية منتصف الليل + تقييم" },
  { time: "02:00", en: "Neuro/Safety checks", ar: "فحوصات عصبية/سلامة" },
  { time: "04:00", en: "AM Labs draw", ar: "سحب فحوصات الصباح" },
  { time: "05:00", en: "AM Vitals + Assessment", ar: "علامات حيوية + تقييم الصباح" },
  { time: "06:00", en: "AM Meds + Chart review", ar: "أدوية الصباح + مراجعة الملف" },
  { time: "06:30", en: "I&O totals + SBAR prep", ar: "مجاميع الداخل والخارج + تحضير SBAR" },
  { time: "06:45", en: "SBAR Handoff", ar: "تسليم SBAR" },
  { time: "07:00", en: "Shift End", ar: "نهاية الشفت" },
];

const schedulePresets = [
  { key: "BID", en: "Twice daily", ar: "مرتين يومياً", times: ["09:00", "21:00"] },
  { key: "TID", en: "Three times daily", ar: "ثلاث مرات", times: ["08:00", "14:00", "20:00"] },
  { key: "QID", en: "Four times daily", ar: "أربع مرات", times: ["06:00", "12:00", "18:00", "00:00"] },
  { key: "Q4h", en: "Every 4 hours", ar: "كل 4 ساعات", times: ["06:00", "10:00", "14:00", "18:00", "22:00", "02:00"] },
  { key: "Q6h", en: "Every 6 hours", ar: "كل 6 ساعات", times: ["06:00", "12:00", "18:00", "00:00"] },
  { key: "Q8h", en: "Every 8 hours", ar: "كل 8 ساعات", times: ["06:00", "14:00", "22:00"] },
  { key: "Q12h", en: "Every 12 hours", ar: "كل 12 ساعة", times: ["08:00", "20:00"] },
  { key: "Daily AM", en: "Once daily morning", ar: "مرة صباحاً", times: ["08:00"] },
  { key: "HS", en: "At bedtime", ar: "وقت النوم", times: ["21:00"] },
  { key: "AC", en: "Before meals", ar: "قبل الأكل", times: ["07:30", "11:30", "17:30"] },
  { key: "PC", en: "After meals", ar: "بعد الأكل", times: ["08:30", "12:30", "18:30"] },
];

const dayLabs: TimeItem[] = [
  { time: "07:00", en: "AM Labs review (CBC, BMP, results from night draw)", ar: "مراجعة فحوصات الصباح" },
  { time: "08:00", en: "Fasting labs (Lipid, Glucose)", ar: "فحوصات صيام" },
  { time: "09:00", en: "Trough levels (Vancomycin — draw 30 min before dose)", ar: "مستوى Trough (فانكومايسين)" },
  { time: "10:00", en: "Peak levels (1 hour post-dose)", ar: "مستوى Peak (ساعة بعد الجرعة)" },
  { time: "12:00", en: "2-hour post-prandial glucose", ar: "سكر بعد ساعتين من الأكل" },
  { time: "PRN", en: "Stat labs as ordered", ar: "فحوصات طارئة حسب الأمر" },
];

const nightLabs: TimeItem[] = [
  { time: "22:00", en: "HS blood glucose", ar: "سكر وقت النوم" },
  { time: "00:00", en: "Midnight labs if ordered", ar: "فحوصات منتصف الليل" },
  { time: "02:00", en: "Q6h labs (ICU — lactate, ABG)", ar: "فحوصات كل 6 ساعات (لاكتيت، غازات)" },
  { time: "04:00", en: "AM lab draw (CBC, BMP, Coag, LFTs)", ar: "سحب فحوصات الصباح" },
  { time: "05:00", en: "Blood cultures (if temp > 38.3°C)", ar: "زرع دم (إذا حرارة > 38.3)" },
  { time: "06:00", en: "Fasting labs (draw before breakfast)", ar: "فحوصات صيام (قبل الفطور)" },
  { time: "06:00", en: "Trough levels — draw before AM dose", ar: "مستوى Trough — اسحب قبل جرعة الصباح" },
];

const hourlyItems = [
  { id: "pain", en: "Pain Assessment (0-10)", ar: "تقييم الألم (0-10)", nightOnly: false },
  { id: "reposition", en: "Reposition patient", ar: "تغيير وضعية المريض", nightOnly: false },
  { id: "iv", en: "IV site check", ar: "فحص موقع الوريدي", nightOnly: false },
  { id: "io", en: "I&O recording", ar: "تسجيل الداخل والخارج", nightOnly: false },
  { id: "call", en: "Call light in reach", ar: "جرس الاستدعاء بمتناول اليد", nightOnly: false },
  { id: "alarm", en: "Bed alarm on (if needed)", ar: "منبه السرير (إذا مطلوب)", nightOnly: false },
  { id: "fall", en: "Fall precautions", ar: "احتياطات السقوط", nightOnly: false },
  { id: "restrain", en: "Restraint check (if applicable)", ar: "فحص القيود (إذا مطبقة)", nightOnly: false },
  { id: "vent", en: "Ventilator/O2 check", ar: "فحص التهوية/الأوكسجين", nightOnly: false },
  { id: "drain", en: "Drain/tube output", ar: "إخراج الأنابيب والمصارف", nightOnly: false },
  { id: "mouth", en: "Mouth care (Q2h)", ar: "العناية الفموية (كل ساعتين)", nightOnly: true },
  { id: "turn", en: "Turn schedule (Q2h)", ar: "جدول التقليب (كل ساعتين)", nightOnly: true },
  { id: "quiet", en: "Quiet environment", ar: "بيئة هادئة", nightOnly: true },
  { id: "hob", en: "Bed position (HOB 30°)", ar: "وضعية السرير (رأس 30°)", nightOnly: false },
];

const safetyTemplates = [
  { key: "neuro", en: "Neuro Checks", ar: "فحوصات عصبية", options: [15, 60, 120, 240], default: 120 },
  { key: "restraint", en: "Restraint Checks", ar: "فحص القيود", options: [15, 120], default: 120 },
  { key: "fall", en: "Fall Rounds", ar: "جولات السقوط", options: [60, 120], default: 60 },
  { key: "suicide", en: "Suicide Precautions", ar: "احتياطات الانتحار", options: [15, 30, 60], default: 15 },
  { key: "glucose", en: "Blood Glucose", ar: "فحص السكر", options: [60, 240, 360], default: 360 },
  { key: "vent", en: "Vent Checks", ar: "فحص التهوية", options: [120, 240], default: 120 },
  { key: "chest", en: "Chest Tube", ar: "فحص أنبوب الصدر", options: [60, 120], default: 120 },
];

const dayChecklist = [
  "Complete all charting", "Review & sign off orders", "Update care plan", "I&O totals calculated", "PM assessment complete", "PM vitals done", "PM medications given", "New orders addressed", "Pending labs checked", "SBAR report prepared", "Narcotics count with oncoming", "Safety check: alarms, bed, rails", "Room tidy, supplies stocked", "Code cart checked (if assigned)",
];
const dayChecklistAr = [
  "أكمل كل التوثيق", "راجع ووقّع الأوامر", "حدّث خطة الرعاية", "حساب مجاميع الداخل والخارج", "تقييم المساء مكتمل", "علامات المساء مكتملة", "أدوية المساء أُعطيت", "الأوامر الجديدة نُفذت", "الفحوصات المعلقة فُحصت", "تقرير SBAR جاهز", "عدّ المخدرات مع القادم", "فحص السلامة: منبهات، سرير، حواجز", "الغرفة مرتبة، المستلزمات متوفرة", "فحص عربة الطوارئ (إذا مكلف)",
];

const nightChecklist = [
  "Complete all charting", "AM assessment documented", "AM vitals done (0600)", "AM labs reviewed & flagged", "I&O 24hr totals calculated", "AM medications given (0600)", "Fasting labs drawn", "Blood sugars current", "Lines/tubes/drains assessed", "SBAR report prepared", "Narcotics count with oncoming", "Safety check: alarms, restraints", "Patient clean, linens changed", "Room organized for day shift",
];
const nightChecklistAr = [
  "أكمل كل التوثيق", "تقييم الصباح موثق", "علامات الصباح (0600) مكتملة", "فحوصات الصباح رُوجعت وعُلّمت", "مجاميع 24 ساعة محسوبة", "أدوية الصباح (0600) أُعطيت", "فحوصات الصيام سُحبت", "قراءات السكر محدّثة", "الخطوط والأنابيب والمصارف قُيّمت", "تقرير SBAR جاهز", "عدّ المخدرات مع القادم", "فحص السلامة: منبهات، قيود", "المريض نظيف، البياضات تبدلت", "الغرفة مرتبة للشفت الصباحي",
];

const dayPhrases = [
  ["Good morning, I'm your nurse today", "صباح الخير، أنا ممرضك اليوم"],
  ["The doctor will see you during rounds", "الطبيب راح يشوفك بالجولة"],
  ["Have you eaten breakfast?", "أكلت فطور؟"],
  ["We need to get you up and walking today", "لازم تقوم وتمشي اليوم"],
  ["Physical therapy will come see you", "العلاج الطبيعي راح يجيك"],
  ["Your discharge is being planned", "يتم التحضير لخروجك"],
  ["Do you have any questions for the doctor?", "عندك أسئلة للطبيب؟"],
  ["I need to change your dressing", "لازم أغير ضمادك"],
  ["Your family can visit after 10 AM", "عائلتك تكدر تزور بعد 10 الصبح"],
  ["Let me explain your medications before discharge", "خلّيني أشرحلك أدويتك قبل الخروج"],
] as const;

const nightPhrases = [
  ["I need to check your vitals quickly, then you can go back to sleep", "أحتاج أفحص علاماتك بسرعة، بعدين ارجع نام"],
  ["Do you need pain medication?", "تحتاج مسكن ألم؟"],
  ["Keep the call bell close if you need anything", "خلّي جرس الاستدعاء قريب إذا تحتاج شي"],
  ["I'm dimming the lights for you", "راح أخفف الإضاءة لك"],
  ["Your labs will be drawn around 4 AM", "الفحوصات راح تنسحب حوالي 4 الصبح"],
  ["Please don't get up without calling us", "لا تقوم بدون ما تنادينا"],
  ["Your next medication is at midnight", "دواءك الجاي بمنتصف الليل"],
  ["I need to reposition you to protect your skin", "لازم أغير وضعيتك لحماية جلدك"],
  ["The doctor has been notified", "الطبيب تم إبلاغه"],
  ["Your blood sugar is normal", "سكرك طبيعي"],
] as const;

const parseTimeToToday = (time: string, anchor = new Date()) => {
  const [hh, mm] = time.split(":").map(Number);
  const d = new Date(anchor);
  d.setHours(hh, mm ?? 0, 0, 0);
  return d;
};

const ShiftToolkit = () => {
  const { language } = usePreferences();
  const isAr = language === "ar";
  const [tab, setTab] = useState("timer");
  const [now, setNow] = useState(new Date());
  const [shiftMode, setShiftMode] = useState<ShiftMode>((localStorage.getItem(SHIFT_KEY) as ShiftMode) || "day");
  const [shiftTimes, setShiftTimes] = useState<{ dayStart: string; dayEnd: string; nightStart: string; nightEnd: string }>(() => {
    const raw = localStorage.getItem(SHIFT_TIME_KEY);
    if (raw) return JSON.parse(raw);
    return { dayStart: "07:00", dayEnd: "19:00", nightStart: "19:00", nightEnd: "07:00" };
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem(NOTIFY_KEY) !== "false");
  const [hourlyChecks, setHourlyChecks] = useState<Record<string, boolean>>({});
  const [roundingHistory, setRoundingHistory] = useState<number[]>(() => JSON.parse(localStorage.getItem(ROUNDING_KEY) || "[]"));
  const [meds, setMeds] = useState<MedEntry[]>(() => JSON.parse(localStorage.getItem(MED_KEY) || "[]"));
  const [labs, setLabs] = useState<LabReminder[]>(() => JSON.parse(localStorage.getItem(LAB_KEY) || "[]"));
  const [timers, setTimers] = useState<TimerEntry[]>(() => JSON.parse(localStorage.getItem(TIMER_KEY) || "[]"));
  const [ioEntries, setIoEntries] = useState<IoEntry[]>(() => JSON.parse(localStorage.getItem(IO_KEY) || "[]"));
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(() => JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "{}"));
  const [wellnessEnabled, setWellnessEnabled] = useState(localStorage.getItem(WELLNESS_KEY) !== "false");
  const [patients, setPatients] = useState<PatientEntry[]>(() => JSON.parse(localStorage.getItem(PATIENTS_KEY) || "[]"));

  const [medForm, setMedForm] = useState({ drug: "", dose: "", route: "", patient: "", times: "" });
  const [labForm, setLabForm] = useState({ time: "", en: "", ar: "" });
  const [patientForm, setPatientForm] = useState<PatientEntry>({
    id: "", bed: "", initials: "", ageSex: "", dx: "", code: "", allergies: "", diet: "", activity: "", isolation: "", lines: "", drains: "", meds: "", notes: "", acuity: "stable"
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(SHIFT_KEY, shiftMode);
    localStorage.setItem(SHIFT_TIME_KEY, JSON.stringify(shiftTimes));
    localStorage.setItem(NOTIFY_KEY, String(notificationsEnabled));
    localStorage.setItem(ROUNDING_KEY, JSON.stringify(roundingHistory));
    localStorage.setItem(MED_KEY, JSON.stringify(meds));
    localStorage.setItem(LAB_KEY, JSON.stringify(labs));
    localStorage.setItem(TIMER_KEY, JSON.stringify(timers));
    localStorage.setItem(IO_KEY, JSON.stringify(ioEntries));
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklistState));
    localStorage.setItem(WELLNESS_KEY, String(wellnessEnabled));
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  }, [shiftMode, shiftTimes, notificationsEnabled, roundingHistory, meds, labs, timers, ioEntries, checklistState, wellnessEnabled, patients]);

  useEffect(() => {
    const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    const rawHour = localStorage.getItem("dn-round-hour");
    if (rawHour !== hourKey) {
      setHourlyChecks({});
      localStorage.setItem("dn-round-hour", hourKey);
    }
  }, [now]);

  const requestNotify = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const notify = (title: string, body: string) => {
    if (!notificationsEnabled || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const currentShiftWindow = useMemo(() => {
    const start = shiftMode === "day" ? shiftTimes.dayStart : shiftTimes.nightStart;
    const end = shiftMode === "day" ? shiftTimes.dayEnd : shiftTimes.nightEnd;
    const s = parseTimeToToday(start, now);
    const e = parseTimeToToday(end, now);
    if (e <= s) e.setDate(e.getDate() + 1);
    if (now < s) {
      s.setDate(s.getDate() - 1);
      e.setDate(e.getDate() - 1);
    }
    return { start: s, end: e };
  }, [now, shiftMode, shiftTimes]);

  const progress = useMemo(() => {
    const total = currentShiftWindow.end.getTime() - currentShiftWindow.start.getTime();
    const elapsed = Math.max(0, now.getTime() - currentShiftWindow.start.getTime());
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const remainingMs = Math.max(0, currentShiftWindow.end.getTime() - now.getTime());
    const remH = Math.floor(remainingMs / 3_600_000);
    const remM = Math.floor((remainingMs % 3_600_000) / 60_000);
    return { pct, remH, remM, remainingMs, total };
  }, [now, currentShiftWindow]);

  const ringColor = progress.remH < 1 ? "#ef4444" : progress.remainingMs / progress.total < 0.25 ? "#f97316" : progress.remainingMs / progress.total < 0.5 ? "#facc15" : "#22c55e";

  const milestones = shiftMode === "day" ? dayMilestones : nightMilestones;

  useEffect(() => {
    requestNotify();
  }, []);

  useEffect(() => {
    const key = `dn-ms-${shiftMode}-${now.toDateString()}`;
    const fired = new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
    milestones.forEach((m) => {
      const t = parseTimeToToday(m.time, now);
      if (shiftMode === "night" && Number(m.time.slice(0, 2)) < 12) t.setDate(t.getDate() + 1);
      if (Math.abs(now.getTime() - t.getTime()) < 60_000 && !fired.has(m.time)) {
        notify(isAr ? "تذكير الشفت" : "Shift Milestone", isAr ? m.ar : m.en);
        fired.add(m.time);
      }
    });
    localStorage.setItem(key, JSON.stringify(Array.from(fired)));
  }, [now, milestones, shiftMode, isAr]);

  const timelineMeds = useMemo(() => {
    const arr: Array<{ med: MedEntry; time: string; date: Date; status: "upcoming" | "overdue" | "given" }> = [];
    meds.forEach((med) => {
      med.times.forEach((time) => {
        const date = parseTimeToToday(time, now);
        if (date.getTime() < now.getTime() - 12 * 3_600_000) date.setDate(date.getDate() + 1);
        const stamp = med.given?.[time];
        const status: "upcoming" | "overdue" | "given" = stamp ? "given" : date < now ? "overdue" : "upcoming";
        arr.push({ med, time, date, status });
      });
    });
    return arr.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [meds, now]);

  useEffect(() => {
    const key = `dn-med-alert-${now.toDateString()}`;
    const sent = new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
    timelineMeds.forEach((item) => {
      const mins = (item.date.getTime() - now.getTime()) / 60000;
      const id = `${item.med.id}-${item.time}`;
      if (mins <= 10 && mins > 9 && !sent.has(id) && item.status !== "given") {
        notify(
          isAr ? "تذكير دواء" : "Medication Reminder",
          isAr ? `⏰ دواء بعد 10 دقائق: ${item.med.drug} ${item.med.dose} لـ ${item.med.patient}` : `⏰ Medication due in 10 min: ${item.med.drug} ${item.med.dose} for ${item.med.patient}`
        );
        sent.add(id);
      }
    });
    localStorage.setItem(key, JSON.stringify(Array.from(sent)));
  }, [timelineMeds, now, isAr]);

  const shiftChecklist = shiftMode === "day" ? dayChecklist : nightChecklist;
  const shiftChecklistAr = shiftMode === "day" ? dayChecklistAr : nightChecklistAr;

  const totalIntake = ioEntries.filter((e) => e.kind === "intake").reduce((s, e) => s + e.amount, 0);
  const totalOutput = ioEntries.filter((e) => e.kind === "output").reduce((s, e) => s + e.amount, 0);
  const net = totalIntake - totalOutput;

  const compliance = Math.min(12, roundingHistory.length);
  const allRoundComplete = hourlyItems.filter((i) => !i.nightOnly || shiftMode === "night").every((i) => hourlyChecks[i.id]);

  useEffect(() => {
    if (allRoundComplete) {
      const stamp = Date.now();
      setRoundingHistory((prev) => [stamp, ...prev].slice(0, 24));
      notify(isAr ? "التقييم مكتمل" : "Rounding Complete", new Date(stamp).toLocaleTimeString());
    }
  }, [allRoundComplete]);

  const tabs = [
    ["timer", isAr ? "المؤقت" : "Timer"],
    ["rounds", isAr ? "التقييم" : "Rounds"],
    ["meds", isAr ? "الأدوية" : "Meds"],
    ["labs", isAr ? "الفحوصات" : "Labs"],
    ["safety", isAr ? "السلامة" : "Safety"],
    ["io", isAr ? "الداخل/الخارج" : "I&O"],
    ["checklist", isAr ? "التسليم" : "Checklist"],
    ["wellness", isAr ? "الرفاه" : "Wellness"],
    ["patients", isAr ? "المرضى" : "Patients"],
    ["phrases", isAr ? "عبارات" : "Phrases"],
  ] as const;

  return (
    <AppLayout
      title={isAr ? "أدوات الشفت" : "Shift Toolkit"}
      subtitle={isAr ? "أدوات ذكية لكل شفت" : "SMART TOOLS FOR EVERY SHIFT"}
      badgeLabel={isAr ? "وضع الشفت" : "Shift Mode"}
      subBadgeLabel={shiftMode === "day" ? (isAr ? "الشفت الصباحي" : "Day Shift") : (isAr ? "شفت الليل" : "Night Shift")}
    >
      <Card className="bg-card/70 border-white/10">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant={shiftMode === "day" ? "default" : "outline"} onClick={() => setShiftMode("day")}>☀️ {isAr ? "الشفت الصباحي (7ص-7م)" : "Day Shift (7A-7P)"}</Button>
            <Button variant={shiftMode === "night" ? "default" : "outline"} onClick={() => setShiftMode("night")}>🌙 {isAr ? "شفت الليل (7م-7ص)" : "Night Shift (7P-7A)"}</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>{isAr ? "بداية اليوم" : "Day start"}</Label><Input type="time" value={shiftTimes.dayStart} onChange={(e) => setShiftTimes((p) => ({ ...p, dayStart: e.target.value }))} /></div>
            <div><Label>{isAr ? "نهاية اليوم" : "Day end"}</Label><Input type="time" value={shiftTimes.dayEnd} onChange={(e) => setShiftTimes((p) => ({ ...p, dayEnd: e.target.value }))} /></div>
            <div><Label>{isAr ? "بداية الليل" : "Night start"}</Label><Input type="time" value={shiftTimes.nightStart} onChange={(e) => setShiftTimes((p) => ({ ...p, nightStart: e.target.value }))} /></div>
            <div><Label>{isAr ? "نهاية الليل" : "Night end"}</Label><Input type="time" value={shiftTimes.nightEnd} onChange={(e) => setShiftTimes((p) => ({ ...p, nightEnd: e.target.value }))} /></div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            <span>{isAr ? "الإشعارات" : "Notifications"}</span>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-white/10 p-2">
        <div className="flex gap-2">
          {tabs.map(([key, label]) => <Button key={key} variant={tab === key ? "default" : "ghost"} onClick={() => setTab(key)}>{label}</Button>)}
        </div>
      </ScrollArea>

      {tab === "timer" && (
        <Card className="bg-card/70 border-white/10">
          <CardContent className="p-6 space-y-5">
            <div className="mx-auto relative h-64 w-64">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
                <circle cx="60" cy="60" r="52" stroke={ringColor} strokeWidth="8" fill="none" strokeDasharray={327} strokeDashoffset={327 - (327 * progress.pct) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-bold">{Math.round(progress.pct)}%</div>
                <div className="text-xs text-muted-foreground">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <div className="text-sm mt-2">{isAr ? `متبقي ${progress.remH} ساعة ${progress.remM} دقيقة` : `${progress.remH} hours ${progress.remM} minutes remaining`}</div>
              </div>
            </div>
            <div className="space-y-2">
              {milestones.map((m) => <div key={m.time} className="text-sm flex justify-between border-b border-white/5 pb-1"><span>{m.time}</span><span>{isAr ? m.ar : m.en}</span></div>)}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "rounds" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "التقييم لكل ساعة" : "Hourly Rounding"}</CardTitle></CardHeader><CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{isAr ? "الساعة الحالية" : "Current Hour"}: {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          {hourlyItems.filter((i) => shiftMode === "night" || !i.nightOnly).map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm"><Checkbox checked={!!hourlyChecks[item.id]} onCheckedChange={(v) => setHourlyChecks((p) => ({ ...p, [item.id]: !!v }))} />{isAr ? item.ar : item.en}</label>
          ))}
          {allRoundComplete && <div className="rounded-lg bg-emerald-500/15 p-3 text-sm">✅ {isAr ? `التقييم مكتمل لـ ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : `Rounding complete for ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</div>}
          <div className="text-sm font-medium">{isAr ? `التزام التقييم: ${compliance}/12 ساعة` : `Rounding Compliance: ${compliance}/12 hours`}</div>
          <div className="space-y-1 text-xs">
            {roundingHistory.slice(0, 12).map((t) => {
              const d = new Date(t);
              const minsPast = d.getMinutes();
              const late = minsPast > 15;
              return <div key={t} className={`p-2 rounded ${late ? "bg-yellow-500/20" : "bg-emerald-500/20"}`}>{d.toLocaleTimeString()}</div>;
            })}
          </div>
        </CardContent></Card>
      )}

      {tab === "meds" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "جدولة الأدوية" : "Medication Scheduler"}</CardTitle></CardHeader><CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder={isAr ? "الدواء" : "Drug"} value={medForm.drug} onChange={(e) => setMedForm((p) => ({ ...p, drug: e.target.value }))} />
            <Input placeholder={isAr ? "الجرعة" : "Dose"} value={medForm.dose} onChange={(e) => setMedForm((p) => ({ ...p, dose: e.target.value }))} />
            <Input placeholder={isAr ? "الطريقة" : "Route"} value={medForm.route} onChange={(e) => setMedForm((p) => ({ ...p, route: e.target.value }))} />
            <Input placeholder={isAr ? "المريض/السرير" : "Patient/Bed"} value={medForm.patient} onChange={(e) => setMedForm((p) => ({ ...p, patient: e.target.value }))} />
          </div>
          <Input placeholder={isAr ? "الأوقات 08:00,14:00" : "Times 08:00,14:00"} value={medForm.times} onChange={(e) => setMedForm((p) => ({ ...p, times: e.target.value }))} />
          <div className="flex gap-2 flex-wrap">{schedulePresets.map((p) => <Button key={p.key} variant="outline" size="sm" onClick={() => setMedForm((v) => ({ ...v, times: p.times.join(",") }))}>{p.key}</Button>)}</div>
          <Button onClick={() => {
            if (!medForm.drug || !medForm.times) return;
            setMeds((prev) => [...prev, { id: crypto.randomUUID(), drug: medForm.drug, dose: medForm.dose, route: medForm.route, patient: medForm.patient, times: medForm.times.split(",").map((s) => s.trim()), given: {} }]);
            setMedForm({ drug: "", dose: "", route: "", patient: "", times: "" });
          }}><Plus size={14} className="mr-1" />{isAr ? "إضافة" : "Add"}</Button>

          <div className="space-y-2">
            <div className="text-sm font-medium">{isAr ? "الجرعة القادمة" : "Next Upcoming"}</div>
            {timelineMeds.slice(0, 20).map((item) => (
              <div key={`${item.med.id}-${item.time}`} className={`rounded-lg p-2 text-sm ${item.status === "overdue" ? "bg-red-500/20" : item.status === "given" ? "bg-emerald-500/20" : "bg-white/5"}`}>
                <div className="flex justify-between"><span>{item.time} - {item.med.drug} {item.med.dose}</span><span>{item.med.patient}</span></div>
                {item.status !== "given" && <Button size="sm" variant="ghost" onClick={() => setMeds((prev) => prev.map((m) => m.id === item.med.id ? { ...m, given: { ...m.given, [item.time]: new Date().toISOString() } } : m))}>{isAr ? "أُعطي" : "Given"}</Button>}
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}

      {tab === "labs" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "تذكير الفحوصات" : "Labs Reminder"}</CardTitle></CardHeader><CardContent className="space-y-2">
          {[...(shiftMode === "day" ? dayLabs : nightLabs), ...labs].map((l, idx) => <div key={`${l.time}-${idx}`} className="text-sm rounded p-2 bg-white/5 flex justify-between"><span>{l.time}</span><span>{isAr ? l.ar : l.en}</span></div>)}
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="08:00" value={labForm.time} onChange={(e) => setLabForm((p) => ({ ...p, time: e.target.value }))} />
            <Input placeholder="EN" value={labForm.en} onChange={(e) => setLabForm((p) => ({ ...p, en: e.target.value }))} />
            <Input placeholder="AR" value={labForm.ar} onChange={(e) => setLabForm((p) => ({ ...p, ar: e.target.value }))} />
          </div>
          <Button onClick={() => setLabs((p) => [...p, { id: crypto.randomUUID(), ...labForm }])}>{isAr ? "إضافة" : "Add Lab"}</Button>
        </CardContent></Card>
      )}

      {tab === "safety" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "فحوصات السلامة" : "Safety Timers"}</CardTitle></CardHeader><CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {safetyTemplates.map((tpl) => {
              const active = timers.find((t) => t.key === tpl.key);
              const remaining = active ? Math.max(0, active.frequencyMin * 60_000 - (Date.now() - active.startedAt)) : 0;
              const pct = active ? remaining / (active.frequencyMin * 60_000) : 1;
              const bg = pct < 0.1 ? "bg-red-500/20" : pct < 0.5 ? "bg-yellow-500/20" : "bg-emerald-500/20";
              return <div key={tpl.key} className={`rounded-lg p-3 ${bg}`}>
                <div className="font-medium text-sm">{isAr ? tpl.ar : tpl.en}</div>
                {!active ? (
                  <div className="flex gap-2 mt-2 flex-wrap">{tpl.options.map((m) => <Button key={m} size="sm" variant="outline" onClick={() => setTimers((prev) => [...prev.filter((x) => x.key !== tpl.key), { id: crypto.randomUUID(), key: tpl.key, labelEn: tpl.en, labelAr: tpl.ar, frequencyMin: m, startedAt: Date.now(), history: [] }])}>{m}m</Button>)}</div>
                ) : (
                  <div className="space-y-2 mt-2"><div className="text-sm">{Math.floor(remaining / 60000)}:{String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0")}</div><Button size="sm" onClick={() => setTimers((prev) => prev.map((t) => t.key === tpl.key ? { ...t, startedAt: Date.now(), history: [Date.now(), ...t.history].slice(0, 20) } : t))}>{isAr ? "تم" : "Done"}</Button></div>
                )}
              </div>;
            })}
          </div>
        </CardContent></Card>
      )}

      {tab === "io" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "حاسبة الداخل والخارج" : "I&O Calculator"}</CardTitle></CardHeader><CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {["IV Fluids", "IV Medications", "Oral Intake", "Tube Feeding", "Blood Products", "IV Flushes"].map((c) => <Button key={c} size="sm" variant="outline" onClick={() => setIoEntries((p) => [...p, { id: crypto.randomUUID(), kind: "intake", category: c, amount: 100, timestamp: Date.now() }])}>+ {c}</Button>)}
            {["Urine Output", "Vomiting", "Stool", "NG/OG Drainage", "Drain Output", "Blood Loss"].map((c) => <Button key={c} size="sm" variant="outline" onClick={() => setIoEntries((p) => [...p, { id: crypto.randomUUID(), kind: "output", category: c, amount: 100, timestamp: Date.now() }])}>- {c}</Button>)}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded p-2 bg-blue-500/20">{isAr ? "الداخل" : "Intake"}: {totalIntake} mL</div>
            <div className="rounded p-2 bg-orange-500/20">{isAr ? "الخارج" : "Output"}: {totalOutput} mL</div>
            <div className={`rounded p-2 ${net >= 0 ? "bg-sky-500/20" : "bg-red-500/20"}`}>{isAr ? "الحصيلة الصافية" : "Net Balance"}: {net > 0 ? "+" : ""}{net} mL</div>
          </div>
          <div className="max-h-52 overflow-auto space-y-1 text-xs">{ioEntries.slice().reverse().map((e) => <div key={e.id} className="flex justify-between bg-white/5 rounded p-1"><span>{e.kind} {e.category}</span><span>{e.amount}mL</span></div>)}</div>
        </CardContent></Card>
      )}

      {tab === "checklist" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "قائمة نهاية الشفت" : "End-of-Shift Checklist"}</CardTitle></CardHeader><CardContent className="space-y-2">
          {shiftChecklist.map((item, i) => {
            const key = `${shiftMode}-${i}`;
            return <label key={key} className="flex gap-2 text-sm"><Checkbox checked={!!checklistState[key]} onCheckedChange={(v) => setChecklistState((p) => ({ ...p, [key]: !!v }))} />{isAr ? shiftChecklistAr[i] : item}</label>;
          })}
          {shiftChecklist.every((_, i) => checklistState[`${shiftMode}-${i}`]) && <div className="rounded p-3 bg-emerald-500/15">✅ {isAr ? "جاهز لتسليم التقرير" : "Ready to give report"}</div>}
        </CardContent></Card>
      )}

      {tab === "wellness" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "رفاه الممرض" : "Nurse Wellness"}</CardTitle></CardHeader><CardContent className="space-y-3">
          <div className="flex items-center gap-2"><span>{isAr ? "تفعيل التذكيرات" : "Enable reminders"}</span><Switch checked={wellnessEnabled} onCheckedChange={setWellnessEnabled} /></div>
          <div className="space-y-2 text-sm">
            {(shiftMode === "day" ? ["💧 Drink water Q2h", "🍎 Lunch break 12:00", "🧘 Stretch Q4h", "🚶 Movement Q3h"] : ["💧 Drink water Q2h", "🍎 Snack Q4h", "🧘 Stretch Q3h", "☕ 03:00 caffeine cutoff", "😴 Sleep tip at shift end"]).map((r) => <div key={r} className="rounded p-2 bg-white/5">{r}</div>)}
          </div>
        </CardContent></Card>
      )}

      {tab === "patients" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "لوحة المرضى" : "Patient Board"}</CardTitle></CardHeader><CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Input placeholder={isAr ? "السرير" : "Bed"} value={patientForm.bed} onChange={(e) => setPatientForm((p) => ({ ...p, bed: e.target.value }))} />
            <Input placeholder={isAr ? "المريض" : "Initials"} value={patientForm.initials} onChange={(e) => setPatientForm((p) => ({ ...p, initials: e.target.value }))} />
            <Input placeholder={isAr ? "العمر/الجنس" : "Age/Sex"} value={patientForm.ageSex} onChange={(e) => setPatientForm((p) => ({ ...p, ageSex: e.target.value }))} />
            <Input placeholder={isAr ? "التشخيص" : "Dx"} value={patientForm.dx} onChange={(e) => setPatientForm((p) => ({ ...p, dx: e.target.value }))} />
            <Input placeholder={isAr ? "حالة الإنعاش" : "Code"} value={patientForm.code} onChange={(e) => setPatientForm((p) => ({ ...p, code: e.target.value }))} />
            <Input placeholder={isAr ? "الحساسية" : "Allergies"} value={patientForm.allergies} onChange={(e) => setPatientForm((p) => ({ ...p, allergies: e.target.value }))} />
          </div>
          <Button onClick={() => {
            if (!patientForm.bed) return;
            setPatients((p) => [...p.slice(0, 5), { ...patientForm, id: crypto.randomUUID() }]);
            setPatientForm({ id: "", bed: "", initials: "", ageSex: "", dx: "", code: "", allergies: "", diet: "", activity: "", isolation: "", lines: "", drains: "", meds: "", notes: "", acuity: "stable" });
          }}><Plus size={14} className="mr-1" />{isAr ? "إضافة مريض" : "Add Patient"}</Button>
          <div className="space-y-2">{patients.map((p) => <div key={p.id} className="rounded p-2 bg-white/5 text-sm flex justify-between"><div>{p.bed} · {p.initials} · {p.dx}</div><Button size="icon" variant="ghost" onClick={() => setPatients((list) => list.filter((x) => x.id !== p.id))}><Trash2 size={14} /></Button></div>)}</div>
        </CardContent></Card>
      )}

      {tab === "phrases" && (
        <Card className="bg-card/70 border-white/10"><CardHeader><CardTitle>{isAr ? "عبارات سريعة" : "Quick Communication Phrases"}</CardTitle></CardHeader><CardContent className="space-y-2">
          {(shiftMode === "day" ? dayPhrases : nightPhrases).map(([en, ar]) => (
            <div key={en} className="rounded p-2 bg-white/5 text-sm space-y-1">
              <div>{isAr ? ar : en}</div>
              <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(isAr ? ar : en)}><Copy size={14} className="mr-1" />{isAr ? "نسخ" : "Copy"}</Button><Button size="sm" variant="outline" onClick={() => speechSynthesis.speak(new SpeechSynthesisUtterance(isAr ? ar : en))}><Play size={14} className="mr-1" />{isAr ? "نطق" : "Speak"}</Button></div>
            </div>
          ))}
        </CardContent></Card>
      )}
    </AppLayout>
  );
};

export default ShiftToolkit;
