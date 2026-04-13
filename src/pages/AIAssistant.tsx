import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeftRight,
  Bot,
  Copy,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  Menu,
  MessageCircle,
  Mic,
  Pill,
  RefreshCw,
  Send,
  Share2,
  Square,
  Stethoscope,
  TestTube,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { usePreferences } from "@/contexts/PreferencesContext";
import drugsCatalog from "@/data/drugs-catalog.json";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import ecgData from "@/data/ecg-i18n.json";
import { assessmentScales } from "@/data/assessmentScales";
import pathwaysData from "@/data/pathways-i18n.json";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: { 0: { transcript: string } }[];
}

type Role = "user" | "assistant";
type ClinicalMode =
  | "general"
  | "drug"
  | "ecg"
  | "note"
  | "lab"
  | "study"
  | "code"
  | "shift"
  | "interaction"
  | "scenario";

interface Message {
  id: string;
  role: Role;
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  mode: ClinicalMode;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "meta-llama/llama-3.2-3b-instruct:free";
const HISTORY_KEY = "dn-chat-history";

const modeConfig: Record<ClinicalMode, { icon: typeof MessageCircle; en: string; ar: string; prompt: string; placeholderEn: string; placeholderAr: string }> = {
  general: { icon: MessageCircle, en: "General Chat", ar: "محادثة عامة", prompt: "Answer any clinical nursing question.", placeholderEn: "Type your message...", placeholderAr: "...اكتب رسالتك" },
  drug: { icon: Pill, en: "Drug Lookup", ar: "بحث الأدوية", prompt: "You are a pharmacology expert. Focus on drug dosing, interactions, contraindications, and nursing considerations. Always include: dose, route, frequency, max dose, and key monitoring.", placeholderEn: "Ask about a drug dose, route, or contraindication...", placeholderAr: "اسأل عن الجرعة أو الطريق أو الموانع..." },
  ecg: { icon: Activity, en: "ECG Helper", ar: "مساعد ECG", prompt: "You are an ECG interpretation expert. When given a rhythm description, identify it, explain the characteristics, list interventions step-by-step with drug doses, and cite ACLS protocols.", placeholderEn: "Describe rhythm findings...", placeholderAr: "اكتب وصف النظم..." },
  note: { icon: FileText, en: "Note Writer", ar: "كاتب الملاحظات", prompt: "You are a nursing documentation specialist. Convert any input into professional nursing documentation in the requested format (SOAP, DAR, Narrative). Use standard terminology.", placeholderEn: "Paste notes to convert into SOAP/DAR...", placeholderAr: "الصق الملاحظات لتحويلها إلى SOAP/DAR..." },
  lab: { icon: TestTube, en: "Lab Interpreter", ar: "مفسر المختبرات", prompt: "You are a lab interpretation expert. When given lab values, explain if normal/abnormal, possible causes, clinical significance, and recommended nursing actions.", placeholderEn: "Enter lab values to interpret...", placeholderAr: "أدخل القيم المخبرية للتفسير..." },
  study: { icon: GraduationCap, en: "Study Tutor", ar: "مدرس دراسي", prompt: "You are a nursing educator. Explain concepts clearly with examples, mnemonics, and clinical pearls. Use simple language. Ask follow-up questions to test understanding.", placeholderEn: "What concept should we review?", placeholderAr: "ما المفهوم الذي تريد مراجعته؟" },
  code: { icon: AlertTriangle, en: "Code Protocol", ar: "بروتوكول الكود", prompt: "You are an ACLS/emergency protocol expert. Guide through emergency algorithms step-by-step: drug doses, energy levels, timing. Always follow AHA guidelines.", placeholderEn: "Describe emergency scenario...", placeholderAr: "اكتب حالة الطوارئ..." },
  shift: { icon: Handshake, en: "Shift Report", ar: "تقرير الشفت", prompt: "You are a shift handoff expert. Convert shorthand patient notes into a complete SBAR report. Include: Situation, Background, Assessment, Recommendation.", placeholderEn: "Enter handoff notes...", placeholderAr: "أدخل ملاحظات التسليم..." },
  interaction: { icon: ArrowLeftRight, en: "Drug Interactions", ar: "تداخلات دوائية", prompt: "You are a drug interaction specialist. When given 2 or more drugs, explain interactions, severity (major/moderate/minor), mechanism, and clinical recommendations.", placeholderEn: "Enter medications to check interaction...", placeholderAr: "أدخل الأدوية للتحقق من التداخل..." },
  scenario: { icon: Stethoscope, en: "Clinical Scenario", ar: "سيناريو سريري", prompt: "You are a clinical simulation instructor. Present a realistic patient scenario step by step. After each step, ask the nurse what they would do. Evaluate their answer and proceed.", placeholderEn: "Start a scenario or answer the next step...", placeholderAr: "ابدأ سيناريو أو أجب على الخطوة التالية..." },
};

const modeSuggestions: Partial<Record<ClinicalMode, { en: string; ar: string }[]>> = {
  drug: [{ en: "What is the dose of Norepinephrine for septic shock?", ar: "شنو جرعة النورإبينفرين للصدمة الإنتانية؟" }, { en: "Nursing considerations for Heparin drip", ar: "اعتبارات تمريضية لتسريب الهيبارين" }, { en: "Is Amiodarone compatible with Normal Saline?", ar: "هل الأميودارون متوافق مع Normal Saline؟" }],
  ecg: [{ en: "Patient has irregular rhythm, rate 150, no P waves", ar: "المريض نظمه غير منتظم، معدل 150، بدون موجات P" }, { en: "What is the treatment for Torsades de Pointes?", ar: "شنو علاج Torsades de Pointes؟" }, { en: "Differentiate SVT from VT", ar: "فرّق بين SVT و VT" }],
  note: [{ en: "Write SOAP note: pt alert, BP 130/80, lungs clear, pain 3/10", ar: "اكتب SOAP: مريض واعي، ضغط 130/80، رئتين نظيفتين، ألم 3/10" }, { en: "Convert to DAR: gave morphine 2mg IV for pain 7/10, pain reduced to 3/10", ar: "حول لـ DAR: أعطيت مورفين 2ملغ وريدي لألم 7/10، انخفض لـ 3/10" }],
  lab: [{ en: "K+ 6.2, Cr 3.1, BUN 45, what does this mean?", ar: "K+ 6.2، Cr 3.1، BUN 45، شنو يعني؟" }, { en: "Troponin 0.8 ng/mL in chest pain patient", ar: "تروبونين 0.8 بمريض ألم صدر" }],
  code: [{ en: "Patient found pulseless, monitor shows VFib", ar: "المريض بدون نبض، الشاشة تبيّن VFib" }, { en: "Walk me through bradycardia algorithm", ar: "مشّيني على خوارزمية بطء القلب" }],
  scenario: [{ en: "Give me a sepsis scenario", ar: "اعطيني سيناريو إنتان" }, { en: "Simulate a STEMI patient arriving at ER", ar: "حاكي مريض STEMI يوصل الطوارئ" }, { en: "Test me on DKA management", ar: "اختبرني على إدارة DKA" }],
  interaction: [{ en: "Check: Heparin + Warfarin", ar: "تحقق: هيبارين + وارفارين" }, { en: "Can I give Amiodarone with Metoprolol?", ar: "أكدر أعطي أميودارون مع ميتوبرولول؟" }],
  shift: [{ en: "62M, CHF exacerbation, on BiPAP, Lasix drip 10mg/hr, I&O -500", ar: "ذكر 62، تفاقم فشل قلب، على BiPAP، لاسكس 10ملغ/ساعة، حصيلة -500" }],
};

const quickActions = [
  { mode: "drug" as const, icon: Pill, en: "Drug Lookup", ar: "بحث دواء", starter: "What is the dose of " },
  { mode: "ecg" as const, icon: Activity, en: "ECG Rhythm", ar: "نظم ECG", starter: "Identify this rhythm: " },
  { mode: "note" as const, icon: FileText, en: "Write Note", ar: "اكتب ملاحظة", starter: "Convert to SOAP: " },
  { mode: "lab" as const, icon: TestTube, en: "Read Labs", ar: "قراءة فحوصات", starter: "Interpret these labs: " },
  { mode: "code" as const, icon: AlertTriangle, en: "Code Help", ar: "مساعدة كود", starter: "Guide me through " },
  { mode: "interaction" as const, icon: ArrowLeftRight, en: "Interactions", ar: "تداخلات", starter: "Check interaction: " },
];

const relatedMap: { key: string; en: string; ar: string; path: string }[] = [
  { key: "norepinephrine", en: "Drug Reference", ar: "مرجع الأدوية", path: "/drugs/norepinephrine" },
  { key: "acls", en: "ECG ACLS", ar: "ACLS ECG", path: "/ecg#acls" },
  { key: "sofa", en: "Sepsis (SOFA)", ar: "إنتان (SOFA)", path: "/scale/sofa" },
  { key: "gcs", en: "GCS Scale", ar: "مقياس GCS", path: "/scale/gcs" },
  { key: "vasopressor", en: "Vasopressor Calculator", ar: "حاسبة رافعات الضغط", path: "/calculators" },
];

const smartLinks: Record<string, string> = {
  Norepinephrine: "/drugs/norepinephrine",
  Epinephrine: "/drugs/epinephrine",
  Heparin: "/drugs/heparin",
  Warfarin: "/drugs/warfarin",
  Amiodarone: "/drugs/amiodarone",
  Metoprolol: "/drugs/metoprolol",
  GCS: "/scale/gcs",
  SOFA: "/scale/sofa",
  NEWS2: "/scale/news2",
  ACLS: "/ecg#acls",
  ECG: "/ecg",
  Fluids: "/fluids",
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AIAssistant = () => {
  const { language, direction } = usePreferences();
  const isArabic = language === "ar";
  const isOnline = useOnlineStatus();
  const [mode, setMode] = useState<ClinicalMode>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [scenarioTopic, setScenarioTopic] = useState("Septic Shock management");
  const [reportForm, setReportForm] = useState({ patient: "", ageSex: "", diagnosis: "", points: "", format: "SBAR" });
  const [lastError, setLastError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const drugNames = useMemo(() => drugsCatalog.drugs.map((d) => d.genericName), []);
  const ecgRhythms = useMemo(() => ecgData.rhythms ?? [], []);
  const pathwayMaps = useMemo(() => pathwaysData.maps ?? [], []);


  useEffect(() => {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!messages.length) return;
    const id = chatId ?? uid();
    if (!chatId) setChatId(id);
    const now = new Date().toISOString();
    const title = messages.find((m) => m.role === "user")?.content.slice(0, 40) || (isArabic ? "محادثة جديدة" : "New Chat");
    const next: Conversation = { id, title, mode, messages, createdAt: history.find((h) => h.id === id)?.createdAt || now, updatedAt: now };
    const updated = [next, ...history.filter((h) => h.id !== id)].slice(0, 50);
    setHistory(updated);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }, [messages]);

  const buildLocalClinicalFallback = (question: string) => {
    const q = question.toLowerCase();
    const matchedDrug = drugsCatalog.drugs.find((drug) => q.includes(drug.genericName.toLowerCase()));
    const matchedRhythm = ecgRhythms.find((rhythm) => {
      const en = String(rhythm.nameEn || "").toLowerCase();
      const ar = String(rhythm.nameAr || "").toLowerCase();
      return q.includes(en) || q.includes(ar);
    });
    const matchedAssessment = assessmentScales.find((scale) => q.includes(scale.id.toLowerCase()) || q.includes(scale.name.toLowerCase()));
    const matchedPathway = pathwayMaps.find((item) => q.includes(item.id.toLowerCase()) || q.includes(item.name.toLowerCase()));
    const fluidHints = [
      "Normal Saline 0.9% (NS): isotonic crystalloid, common in shock/hypovolemia.",
      "Lactated Ringer's (LR): balanced isotonic fluid for trauma/burns.",
      "3% Hypertonic Saline: severe symptomatic hyponatremia or raised ICP with close sodium monitoring.",
      "PRBCs: for symptomatic anemia/hemorrhagic shock with transfusion monitoring.",
    ];

    const langNote = isArabic
      ? "تم تشغيل وضع المرجع السريري المحلي تلقائياً ليتابع المساعد العمل بدون إعدادات."
      : "Local clinical reference mode activated automatically so the assistant works without setup.";

    if (matchedDrug) {
      return `${langNote}

### ${isArabic ? "ملخص دوائي" : "Drug quick reference"}
- ${isArabic ? "الدواء" : "Drug"}: ${matchedDrug.genericName}
- ${isArabic ? "الفئة" : "Class"}: ${matchedDrug.class}
- ${isArabic ? "الاستطبابات" : "Indications"}: ${matchedDrug.indications}
- ${isArabic ? "الجرعة" : "Dose"}: ${matchedDrug.dose}
- ${isArabic ? "الطريق" : "Route"}: ${matchedDrug.route}
- ${isArabic ? "المراقبة التمريضية" : "Nursing monitoring"}: ${matchedDrug.monitoring}
- ${isArabic ? "تحذير" : "Safety"}: ${matchedDrug.warnings}

${isArabic ? "⚠️ راجع البروتوكول المحلي قبل التنفيذ." : "⚠️ Verify against local protocol before acting."}`;
    }

    if (matchedRhythm) {
      return `${langNote}

### ${isArabic ? "مراجعة ECG" : "ECG quick reference"}
- ${isArabic ? "النظم" : "Rhythm"}: ${matchedRhythm.nameEn} / ${matchedRhythm.nameAr}
- ${isArabic ? "الخصائص" : "Characteristics"}: ${matchedRhythm.characteristics}
- ${isArabic ? "الشدة" : "Severity"}: ${matchedRhythm.severity}
- ${isArabic ? "التدخلات" : "Interventions"}:
${(matchedRhythm.interventions || []).map((step: string) => `  - ${step}`).join("\n")}
- ${isArabic ? "نصيحة" : "Tip"}: ${isArabic ? matchedRhythm.tipsAr : matchedRhythm.tipsEn}`;
    }

    if (matchedAssessment) {
      return `${langNote}

### ${isArabic ? "مقياس تقييم" : "Assessment scale"}
- ${isArabic ? "المقياس" : "Scale"}: ${matchedAssessment.name}
- ${isArabic ? "الوصف" : "Description"}: ${matchedAssessment.description}
- ${isArabic ? "الفئة" : "Category"}: ${matchedAssessment.category}
- ${isArabic ? "العناصر" : "Components"}: ${matchedAssessment.components.map((c) => c.factor).join(", ")}
${matchedAssessment.interpretation?.length ? `- ${isArabic ? "التفسير" : "Interpretation"}: ${matchedAssessment.interpretation.join(" | ")}` : ""}`;
    }

    if (matchedPathway) {
      return `${langNote}

### ${isArabic ? "خريطة مرضية" : "Pathophysiology map"}
- ${isArabic ? "الحالة" : "Condition"}: ${matchedPathway.name} / ${matchedPathway.ar}
- ${isArabic ? "التعريف" : "Definition"}: ${matchedPathway.definition}
- ${isArabic ? "العرض" : "Presentation"}: ${matchedPathway.presentation}
- ${isArabic ? "التمريض" : "Nursing"}: ${matchedPathway.nursing}
- ${isArabic ? "العلاج" : "Medical"}: ${matchedPathway.medical}
- ${isArabic ? "نصيحة" : "Tip"}: ${matchedPathway.tips}`;
    }

    if (q.includes("fluid") || q.includes("iv") || q.includes("saline") || q.includes("سوائل")) {
      return `${langNote}

### ${isArabic ? "مرجع السوائل" : "Fluid quick reference"}
${fluidHints.map((item) => `- ${item}`).join("\n")}

${isArabic ? "اذكر الحالة السريرية (مثلاً septic shock أو hyponatremia) لأعطيك توصية أدق." : "Share the exact clinical context (e.g., septic shock or hyponatremia) for a more precise recommendation."}`;
    }

    return `${langNote}

${isArabic ? "أقدر أساعدك فوراً في الأدوية، ECG، المختبر، التقييمات، بروتوكولات الكود، والسوائل. اكتب سؤالاً مباشراً وسأرجع لك بخلاصة عملية." : "I can immediately help with drugs, ECG, labs, assessments, code protocols, and fluids. Ask a direct clinical question for a practical summary."}`;
  };

  const streamFromEdgeFunction = async (allMessages: Message[]) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setMessages((prev) => [...prev, { id: uid(), role: "assistant", content: "" }]);

    try {
      const resp = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: "system", content: modeConfig[mode].prompt },
            ...allMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.3,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        throw new Error("openrouter_unavailable");
      }
      const data = await resp.json();
      const assistantText = data?.choices?.[0]?.message?.content?.trim();
      if (!assistantText) {
        throw new Error("empty_ai_response");
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: assistantText };
        return updated;
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      const fallback = buildLocalClinicalFallback(allMessages[allMessages.length - 1]?.content || "");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: fallback };
        return updated;
      });
    }
  };


  const sendMessage = async (override?: string) => {
    if (!isOnline) return toast.error(isArabic ? "المساعد الذكي يحتاج اتصال بالإنترنت" : "AI Assistant requires internet connection");
    const text = (override ?? input).trim();
    if (!text || isLoading) return;
    setLastError(null);
    const nextUser: Message = { id: uid(), role: "user", content: text };
    const updatedMessages = [...messages, nextUser];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);
    try {
      await streamFromEdgeFunction(updatedMessages);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        // User cancelled - don't show error
      } else {
        const errorMsg = error instanceof Error ? error.message : (isArabic ? "تعذر الحصول على رد" : "Failed to get response");
        setLastError(errorMsg);
        toast.error(errorMsg);
      }
      setMessages((prev) => prev.filter((m, i) => !(i === prev.length - 1 && m.role === "assistant" && !m.content)));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const retryLastMessage = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      setLastError(null);
      sendMessage(lastUser.content);
    }
  };

  const startVoice = () => {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      return toast.error(isArabic ? "المتصفح لا يدعم الصوت" : "Speech not supported in this browser");
    }
    const recognition = new SpeechAPI();
    recognition.lang = isArabic ? "ar-SA" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (ev) => {
      const transcript = ev.results?.[0]?.[0]?.transcript || "";
      setInput((prev) => `${prev}${prev ? " " : ""}${transcript}`.trim());
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
    window.setTimeout(() => recognition.stop(), 30000);
  };

  const renderInline = (line: string) => {
    const regex = new RegExp(`(${Object.keys(smartLinks).sort((a, b) => b.length - a.length).join("|")})`, "gi");
    const chunks = line.split(regex).filter(Boolean);
    return chunks.map((chunk, i) => {
      const key = Object.keys(smartLinks).find((k) => k.toLowerCase() === chunk.toLowerCase());
      if (key) {
        return <Link key={`${chunk}-${i}`} to={smartLinks[key]} className="text-cyan-400 underline">{chunk}</Link>;
      }
      return <span key={`${chunk}-${i}`}>{chunk}</span>;
    });
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) return <h3 key={idx} className="text-base font-semibold mt-2">{line.replace("### ", "")}</h3>;
      if (line.startsWith("#### ")) return <h4 key={idx} className="text-sm font-semibold mt-2">{line.replace("#### ", "")}</h4>;
      if (/^\d+\.\s/.test(line)) return <p key={idx} className="text-sm">{line}</p>;
      if (line.startsWith("- ") || line.startsWith("* ")) return <p key={idx} className="text-sm">• {renderInline(line.slice(2))}</p>;
      return <p key={idx} className="text-sm whitespace-pre-wrap">{renderInline(line)}</p>;
    });
  };

  const relatedSections = (text: string) => relatedMap.filter((item) => text.toLowerCase().includes(item.key)).slice(0, 3);

  const clearAll = () => {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_KEY);
    setMessages([]);
    setChatId(null);
  };

  const selectedSuggestions = modeSuggestions[mode] || [];

  return (
    <div dir={direction} className="min-h-screen bg-background pb-20 flex flex-col">
      <header className="p-4 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild><Button size="icon" variant="ghost"><Menu size={18} /></Button></SheetTrigger>
              <SheetContent side={isArabic ? "left" : "right"} className="bg-slate-950 text-white border-white/10">
                <SheetHeader><SheetTitle>{isArabic ? "سجل المحادثات" : "Chat History"}</SheetTitle></SheetHeader>
                <div className="mt-4 space-y-2">
                  <Button className="w-full" onClick={() => { setMessages([]); setChatId(null); }}>{isArabic ? "محادثة جديدة" : "New Chat"}</Button>
                  {history.map((item) => (
                    <div key={item.id} className="p-2 rounded border border-white/10">
                      <button className="text-start w-full" onClick={() => { setMode(item.mode); setMessages(item.messages); setChatId(item.id); }}>
                        <p className="text-sm truncate">{item.title}</p>
                        <p className="text-xs text-cyan-300">{new Date(item.updatedAt).toLocaleDateString()}</p>
                      </button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        const updated = history.filter((h) => h.id !== item.id);
                        setHistory(updated);
                        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
                      }}>{isArabic ? "حذف المحادثة" : "Delete Chat"}</Button>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-4 w-full" onClick={clearAll}>{isArabic ? "مسح كل السجل" : "Clear All History"}</Button>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-xl font-bold text-white">{isArabic ? "المساعد السريري الذكي" : "AI Clinical Assistant"}</h1>
              <p className="text-[10px] text-cyan-200 uppercase">{isArabic ? "مساعدك التمريضي الذكي" : "YOUR INTELLIGENT NURSING CO-PILOT"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-cyan-200">{isArabic ? "جاهز فوراً • بدون تسجيل دخول" : "Ready instantly • No sign-in"}</p>
            <div className="text-xs text-cyan-200 flex items-center gap-1"><Wifi size={14} />{isOnline ? "Online" : "Offline"}</div>
          </div>
        </div>
      </header>

      <div className="p-3 border-b border-white/10 overflow-x-auto flex gap-2">
        {Object.entries(modeConfig).map(([key, value]) => {
          const Icon = value.icon;
          const active = mode === key;
          return (
            <button key={key} onClick={() => setMode(key as ClinicalMode)} className={`min-w-[140px] text-start p-3 rounded-xl border ${active ? "border-cyan-400 bg-cyan-500/20" : "border-white/10 bg-slate-900/70"}`}>
              <Icon size={16} className="mb-1 text-cyan-300" />
              <p className="text-xs font-semibold">{isArabic ? value.ar : value.en}</p>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mode === "interaction" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/70 border border-white/10">
            <Input list="drugs" value={drugA} onChange={(e) => setDrugA(e.target.value)} placeholder={isArabic ? "الدواء الأول" : "Drug A"} />
            <Input list="drugs" value={drugB} onChange={(e) => setDrugB(e.target.value)} placeholder={isArabic ? "الدواء الثاني" : "Drug B"} />
            <Button onClick={() => sendMessage(`Check the interaction between ${drugA} and ${drugB}. Categorize severity as Major/Moderate/Minor. Explain the mechanism, clinical effect, and nursing recommendation.`)}>{isArabic ? "تحقق من التداخل" : "Check Interaction"}</Button>
            <datalist id="drugs">{drugNames.map((name) => <option key={name} value={name} />)}</datalist>
          </div>
        )}

        {mode === "shift" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/70 border border-white/10">
            <Input placeholder={isArabic ? "المريض/السرير" : "Patient"} value={reportForm.patient} onChange={(e) => setReportForm((p) => ({ ...p, patient: e.target.value }))} />
            <Input placeholder={isArabic ? "العمر/الجنس" : "Age/Sex"} value={reportForm.ageSex} onChange={(e) => setReportForm((p) => ({ ...p, ageSex: e.target.value }))} />
            <Input placeholder={isArabic ? "التشخيص" : "Diagnosis"} value={reportForm.diagnosis} onChange={(e) => setReportForm((p) => ({ ...p, diagnosis: e.target.value }))} />
            <Input placeholder={isArabic ? "النقاط الرئيسية" : "Key points"} value={reportForm.points} onChange={(e) => setReportForm((p) => ({ ...p, points: e.target.value }))} />
            <Button onClick={() => sendMessage(`Create ${reportForm.format} shift report. Patient: ${reportForm.patient}. Age/Sex: ${reportForm.ageSex}. Diagnosis: ${reportForm.diagnosis}. Notes: ${reportForm.points}.`)}>{isArabic ? "إنشاء التقرير" : "Generate Report"}</Button>
          </div>
        )}

        {mode === "scenario" && (
          <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10 space-y-2">
            <p className="text-sm">{isArabic ? "اختر موضوع" : "Choose a topic"}</p>
            <div className="flex flex-wrap gap-2">
              {["Septic Shock management", "STEMI protocol", "DKA management", "Code Blue (VFib arrest)", "Anaphylaxis"].map((topic) => (
                <Button key={topic} size="sm" variant={scenarioTopic === topic ? "default" : "outline"} onClick={() => setScenarioTopic(topic)}>{topic}</Button>
              ))}
            </div>
            <Button onClick={() => sendMessage(`Start Scenario: ${scenarioTopic}. Ask one question at a time, evaluate my response, then continue. End with score card.`)}>{isArabic ? "ابدأ السيناريو" : "Start Scenario"}</Button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{isArabic ? "اختر إجراء سريع للبدء" : "Choose a quick action to get started"}</p>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.mode} onClick={() => { setMode(action.mode); setInput(action.starter); }} className="rounded-xl border border-cyan-400/20 bg-slate-900/70 p-3 text-center hover:bg-cyan-500/10">
                    <Icon className="mx-auto text-cyan-300 mb-2" size={18} />
                    <p className="text-xs">{isArabic ? action.ar : action.en}</p>
                  </button>
                );
              })}
            </div>
            {selectedSuggestions.length > 0 && (
              <div className="space-y-2">
                {selectedSuggestions.map((s) => (
                  <button key={s.en} className="w-full text-start p-3 rounded-lg bg-card hover:bg-accent text-sm" onClick={() => setInput(isArabic ? s.ar : s.en)}>{isArabic ? s.ar : s.en}</button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((message, index) => {
            const related = message.role === "assistant" ? relatedSections(message.content) : [];
            return (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-2xl p-3 ${message.role === "user" ? "bg-cyan-600 text-white" : "bg-slate-900 border border-white/10"}`}>
                  {message.role === "assistant" ? renderMarkdown(message.content) : <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
                  {message.role === "assistant" && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(message.content); toast.success(isArabic ? "تم النسخ!" : "Copied!"); }}><Copy size={14} /> {isArabic ? "نسخ" : "Copy"}</Button>
                      <Button size="sm" variant="ghost" onClick={async () => {
                        if (navigator.share) await navigator.share({ text: message.content });
                        else { await navigator.clipboard.writeText(message.content); toast.success(isArabic ? "تم النسخ!" : "Copied!"); }
                      }}><Share2 size={14} /> {isArabic ? "مشاركة" : "Share"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        const lastUser = [...messages].reverse().find((m) => m.role === "user");
                        if (lastUser) sendMessage(lastUser.content);
                      }}>{isArabic ? "أعد التوليد" : "Regenerate"}</Button>
                    </div>
                  )}
                  {related.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="text-cyan-300 mb-1">📎 {isArabic ? "أقسام ذات صلة:" : "Related in Digital Nurse:"}</p>
                      <div className="flex gap-2 flex-wrap">
                        {related.map((r) => <Link key={r.path} to={r.path} className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-200">{isArabic ? r.ar : r.en}</Link>)}
                      </div>
                    </div>
                  )}
                  {isStreaming && index === messages.length - 1 && message.role === "assistant" && <span className="inline-block w-1.5 h-4 bg-muted-foreground animate-pulse rounded-sm" />}
                </div>
              </div>
            );
          })
        )}

        {isLoading && !isStreaming && (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-3 w-fit">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-xs">{isArabic ? "...الذكاء الاصطناعي يفكر" : "AI is thinking..."}</span>
              <Button size="sm" variant="ghost" onClick={() => abortControllerRef.current?.abort()}><Square size={14} /></Button>
            </div>
          </div>
        )}

        {lastError && !isLoading && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-3 w-fit">
            <p className="text-sm text-destructive mb-2">{lastError}</p>
            <Button size="sm" variant="outline" onClick={retryLastMessage} className="gap-1">
              <RefreshCw size={14} />
              {isArabic ? "إعادة المحاولة" : "Retry"}
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 bg-background/90 backdrop-blur">
        <div className="bg-medical-yellow/10 border-l-4 border-medical-yellow rounded p-2 mb-2 flex gap-2">
          <AlertCircle size={14} className="mt-0.5" />
          <p className="text-[11px] text-muted-foreground">{isArabic ? "⚠️ محتوى مولّد بالذكاء الاصطناعي — تحقق دائماً من الإرشادات السريرية قبل قرارات رعاية المريض" : "⚠️ AI-generated content — always verify with clinical guidelines before patient care decisions"}</p>
        </div>
        <div className="flex gap-2 items-end">
          <Textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isArabic ? modeConfig[mode].placeholderAr : modeConfig[mode].placeholderEn}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button type="button" variant={isListening ? "destructive" : "outline"} onClick={() => (isListening ? recognitionRef.current?.stop() : startVoice())}>
            <Mic size={18} />
          </Button>
          <Button type="button" onClick={() => sendMessage()} disabled={!input.trim() || isLoading}>
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
          {isListening ? <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> : null}
          {isListening ? (isArabic ? "...أستمع" : "Listening...") : (isArabic ? "اضغط للتحدث" : "Tap to speak")}
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
