import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronDown, Copy, Download, Languages, Palette, Share2, Star, Upload } from "lucide-react";
import { usePreferences, type ThemeMode } from "@/contexts/PreferencesContext";

type FontSize = "14" | "16" | "18";
type StartPage = "/home" | "/drugs" | "/ecg" | "/assessments" | "/calculators" | "/docs" | "/ai-assistant";
type AIDefaultMode = "general" | "drug" | "ecg" | "note" | "lab" | "study";
type AIResponseLanguage = "same" | "en" | "ar";
type ProfileState = { name: string; credentials: string; department: string; hospital: string; experience: string };

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const APP_URL = "https://digital-nurse-buddy.lovable.app";
const CHAT_HISTORY_KEY = "dn-chat-history";

const sectionKeys = ["home", "drugs", "ecg", "assessments", "calculators", "docs", "ai-assistant", "settings"];

const Settings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, theme, setTheme } = usePreferences();
  const isArabic = language === "ar";
  const [fontSize, setFontSize] = useState<FontSize>(() => (window.localStorage.getItem("dn-font-size") as FontSize) || "16");
  const [startPage, setStartPage] = useState<StartPage>(() => (window.localStorage.getItem("dn-start-page") as StartPage) || "/home");
  const [profile, setProfile] = useState<ProfileState>(() => {
    const raw = window.localStorage.getItem("dn-profile");
    return raw ? JSON.parse(raw) : { name: "", credentials: "", department: "", hospital: "", experience: "" };
  });
  const [aiMode, setAiMode] = useState<AIDefaultMode>(() => (window.localStorage.getItem("dn-ai-default-mode") as AIDefaultMode) || "general");
  const [aiResponseLanguage, setAiResponseLanguage] = useState<AIResponseLanguage>(() => (window.localStorage.getItem("dn-ai-response-language") as AIResponseLanguage) || "same");
  const [saveChatHistory, setSaveChatHistory] = useState(window.localStorage.getItem("dn-save-chat-history") !== "false");
  const [rating, setRating] = useState<number>(() => Number(window.localStorage.getItem("dn-rating") || 0));
  const [featureSuggestion, setFeatureSuggestion] = useState("");
  const [bugForm, setBugForm] = useState({ section: "home", description: "", screenshot: "" });
  const [pendingDelete, setPendingDelete] = useState<null | (() => void)>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const tx = isArabic
    ? {
        header: "الإعدادات",
        subHeader: "خصّص تجربتك",
        general: "عام",
        profile: "الملف الشخصي (اختياري)",
        profileSub: "يُستخدم بالتوثيق والتقارير — غير مطلوب",
        ai: "المساعد الذكي",
        data: "البيانات والتخزين",
        install: "التثبيت والمشاركة",
        feedback: "التقييم والملاحظات",
        about: "حول التطبيق",
      }
    : {
        header: "Settings",
        subHeader: "CUSTOMIZE YOUR EXPERIENCE",
        general: "General",
        profile: "Profile (Optional)",
        profileSub: "Used in documentation and reports — not required",
        ai: "AI Assistant",
        data: "Data & Storage",
        install: "Install & Share",
        feedback: "Feedback",
        about: "About",
      };

  useEffect(() => {
    window.localStorage.setItem("dn-font-size", fontSize);
    document.documentElement.style.setProperty("--font-base", `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    window.localStorage.setItem("dn-start-page", startPage);
  }, [startPage]);

  useEffect(() => {
    window.localStorage.setItem("dn-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    window.localStorage.setItem("dn-ai-default-mode", aiMode);
  }, [aiMode]);

  useEffect(() => {
    window.localStorage.setItem("dn-ai-response-language", aiResponseLanguage);
  }, [aiResponseLanguage]);

  useEffect(() => {
    window.localStorage.setItem("dn-save-chat-history", String(saveChatHistory));
  }, [saveChatHistory]);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 220;
    const cells = 29;
    const unit = size / cells;
    const hash = [...APP_URL].reduce((acc, ch, i) => (acc + ch.charCodeAt(0) * (i + 1)) % 999983, 17);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000";

    const finder = (x: number, y: number) => {
      ctx.fillRect(x * unit, y * unit, 7 * unit, 7 * unit);
      ctx.fillStyle = "#fff";
      ctx.fillRect((x + 1) * unit, (y + 1) * unit, 5 * unit, 5 * unit);
      ctx.fillStyle = "#000";
      ctx.fillRect((x + 2) * unit, (y + 2) * unit, 3 * unit, 3 * unit);
    };

    finder(1, 1);
    finder(21, 1);
    finder(1, 21);

    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        const inFinder = (x <= 8 && y <= 8) || (x >= 20 && y <= 8) || (x <= 8 && y >= 20);
        if (inFinder) continue;
        const value = (x * 31 + y * 17 + hash + (x ^ y)) % 7;
        if (value < 3) ctx.fillRect(x * unit, y * unit, unit, unit);
      }
    }
  }, []);

  const storageBreakdown = useMemo(() => {
    const bytesByCategory = { chat: 0, assessments: 0, shifts: 0, favorites: 0, cache: 0, other: 0 };

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i) || "";
      const value = window.localStorage.getItem(key) || "";
      const bytes = new Blob([key + value]).size;
      if (key.includes("chat")) bytesByCategory.chat += bytes;
      else if (key.includes("assessment") || key.includes("scale")) bytesByCategory.assessments += bytes;
      else if (key.includes("shift")) bytesByCategory.shifts += bytes;
      else if (key.includes("favorite")) bytesByCategory.favorites += bytes;
      else if (key.includes("cache") || key.includes("recent")) bytesByCategory.cache += bytes;
      else bytesByCategory.other += bytes;
    }

    const total = Object.values(bytesByCategory).reduce((sum, current) => sum + current, 0);
    return { bytesByCategory, totalMb: total / (1024 * 1024), total };
  }, [saveChatHistory, profile, fontSize, startPage, aiMode, aiResponseLanguage, rating]);

  const confirmDelete = (fn: () => void) => setPendingDelete(() => fn);

  const downloadData = () => {
    const dump: Record<string, string | null> = {};
    Object.keys(window.localStorage).forEach((key) => {
      dump[key] = window.localStorage.getItem(key);
    });
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital-nurse-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        Object.entries(payload).forEach(([key, value]) => {
          if (typeof value === "string") window.localStorage.setItem(key, value);
        });
        window.location.reload();
      } catch {
        alert(isArabic ? "فشل استيراد الملف" : "Failed to import file");
      }
    };
    reader.readAsText(file);
  };

  const shareText = isArabic
    ? "شوف Digital Nurse — تطبيق مرجع سريري مجاني لممرضي العناية المركزة والطوارئ. 60+ دواء، ECG، تقييمات، حاسبات، ومساعد ذكي. بدون تسجيل! https://digital-nurse-buddy.lovable.app"
    : "Check out Digital Nurse — a free clinical reference app for ICU & ER nurses with 60+ drug references, ECG rhythms, assessments, calculators, and AI assistant. No login required! https://digital-nurse-buddy.lovable.app";

  const shareViaNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Digital Nurse", text: shareText, url: APP_URL });
      return;
    }
    await navigator.clipboard.writeText(APP_URL);
  };

  const submitBug = () => {
    const subject = encodeURIComponent("Digital Nurse Bug Report");
    const body = encodeURIComponent(`Section: ${bugForm.section}\n\nDescription:\n${bugForm.description}\n\nScreenshot(base64):\n${bugForm.screenshot.slice(0, 2000)}`);
    window.location.href = `mailto:0oygxhsn@gmail.com?subject=${subject}&body=${body}`;
  };

  const submitFeature = () => {
    const subject = encodeURIComponent("Digital Nurse Feature Request");
    const body = encodeURIComponent(featureSuggestion);
    window.location.href = `mailto:0oygxhsn@gmail.com?subject=${subject}&body=${body}`;
  };

  const aiStatus = window.navigator.onLine ? (isArabic ? "جاهز" : "Ready") : (isArabic ? "غير متاح" : "Not available");

  return (
    <AppLayout title={tx.header} subtitle={tx.subHeader} onBack={() => navigate(-1)} className="space-y-5">
      <Section title={tx.general}>
        <SettingCard icon={<Languages size={16} />} label={isArabic ? "اللغة" : "Language"}>
          <div className="flex gap-2">
            <Button variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>🇬🇧 English</Button>
            <Button variant={language === "ar" ? "default" : "outline"} onClick={() => setLanguage("ar")}>🇮🇶 العربية</Button>
          </div>
        </SettingCard>

        <SettingCard icon={<Palette size={16} />} label={isArabic ? "المظهر" : "Appearance"}>
          <div className="flex flex-wrap gap-2">
            {([
              ["dark", isArabic ? "داكن" : "Dark"],
              ["light", isArabic ? "فاتح" : "Light"],
              ["auto", isArabic ? "تلقائي" : "Auto"],
            ] as const).map(([value, label]) => (
              <Button key={value} variant={theme === value ? "default" : "outline"} onClick={() => setTheme(value as ThemeMode)}>{label}</Button>
            ))}
          </div>
        </SettingCard>

        <SettingCard label={isArabic ? "حجم الخط" : "Text Size"}>
          <div className="flex gap-2">
            {([
              ["14", isArabic ? "صغير" : "Small"],
              ["16", isArabic ? "متوسط" : "Medium"],
              ["18", isArabic ? "كبير" : "Large"],
            ] as const).map(([size, label]) => (
              <Button key={size} variant={fontSize === size ? "default" : "outline"} onClick={() => setFontSize(size)}>{label}</Button>
            ))}
          </div>
          <p style={{ fontSize: `${fontSize}px` }} className="text-muted-foreground mt-2">{isArabic ? "معاينة حجم النص الحالي" : "Current text size preview"}</p>
        </SettingCard>

        <SettingCard label={isArabic ? "صفحة البداية" : "Start page"}>
          <Select value={startPage} onValueChange={(v) => setStartPage(v as StartPage)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="/home">Home</SelectItem>
              <SelectItem value="/drugs">Drugs</SelectItem>
              <SelectItem value="/ecg">ECG</SelectItem>
              <SelectItem value="/assessments">Assessments</SelectItem>
              <SelectItem value="/calculators">Calculators</SelectItem>
              <SelectItem value="/docs">Shift Planner</SelectItem>
              <SelectItem value="/ai-assistant">AI Assistant</SelectItem>
            </SelectContent>
          </Select>
        </SettingCard>
      </Section>

      <Section title={tx.profile} subtitle={tx.profileSub}>
        <div className="grid gap-3">
          <Input placeholder={isArabic ? "مثال: حسن سلمان، ممرض" : "e.g. Hassan Salman, RN"} value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder={isArabic ? "مثال: بكالوريوس تمريض" : "e.g. BSN, RN, CCRN"} value={profile.credentials} onChange={(e) => setProfile((p) => ({ ...p, credentials: e.target.value }))} />
          <Select value={profile.department || ""} onValueChange={(v) => setProfile((p) => ({ ...p, department: v }))}>
            <SelectTrigger><SelectValue placeholder={isArabic ? "القسم/الوحدة" : "Unit/Department"} /></SelectTrigger>
            <SelectContent>{["ICU", "ER/ED", "Medical", "Surgical", "Pediatric", "NICU", "Cardiac", "Oncology", "Dialysis", "Burns", "OB/GYN", "OR", "Recovery", "Outpatient", "Other"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder={isArabic ? "مثال: مستشفى الصدر التعليمي" : "e.g. Al-Sadder Teaching Hospital"} value={profile.hospital} onChange={(e) => setProfile((p) => ({ ...p, hospital: e.target.value }))} />
          <Input type="number" placeholder={isArabic ? "سنوات الخبرة" : "Years of Experience"} value={profile.experience} onChange={(e) => setProfile((p) => ({ ...p, experience: e.target.value }))} />
          <Button variant="destructive" onClick={() => setProfile({ name: "", credentials: "", department: "", hospital: "", experience: "" })}>{isArabic ? "مسح الملف الشخصي" : "Clear Profile"}</Button>
        </div>
      </Section>

      <Section title={tx.ai}>
        <SettingCard label={isArabic ? "حالة الذكاء" : "AI Status"}><span>{aiStatus}</span></SettingCard>
        <SettingCard label={isArabic ? "وضع الذكاء الافتراضي" : "Default AI Mode"}>
          <Select value={aiMode} onValueChange={(v) => setAiMode(v as AIDefaultMode)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{[["general", "General Chat"], ["drug", "Drug Lookup"], ["ecg", "ECG Helper"], ["note", "Note Writer"], ["lab", "Lab Interpreter"], ["study", "Study Tutor"]].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </SettingCard>
        <SettingCard label={isArabic ? "لغة رد الذكاء" : "AI Response Language"}>
          <Select value={aiResponseLanguage} onValueChange={(v) => setAiResponseLanguage(v as AIResponseLanguage)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="same">{isArabic ? "نفس لغة التطبيق" : "Same as app"}</SelectItem>
              <SelectItem value="en">Always English</SelectItem>
              <SelectItem value="ar">Always Arabic</SelectItem>
            </SelectContent>
          </Select>
        </SettingCard>
        <SettingCard label={isArabic ? "حفظ سجل المحادثات" : "Save Chat History"}><Switch checked={saveChatHistory} onCheckedChange={setSaveChatHistory} /></SettingCard>
        <Button variant="destructive" onClick={() => confirmDelete(() => window.localStorage.removeItem(CHAT_HISTORY_KEY))}>{isArabic ? "مسح كل المحادثات" : "Clear All Chats"}</Button>
      </Section>

      <Section title={tx.data}>
        <Card className="bg-card/80 border-white/10">
          <CardContent className="pt-6 space-y-2">
            <p>{isArabic ? `المساحة المستخدمة: ${storageBreakdown.totalMb.toFixed(2)} ميغابايت من 10` : `Storage Used: ${storageBreakdown.totalMb.toFixed(2)} MB of 10 MB`}</p>
            <Progress value={(storageBreakdown.total / (10 * 1024 * 1024)) * 100} />
            <p className="text-sm text-muted-foreground">Chat History: {(storageBreakdown.bytesByCategory.chat / (1024 * 1024)).toFixed(2)} MB</p>
            <p className="text-sm text-muted-foreground">Saved Assessments: {(storageBreakdown.bytesByCategory.assessments / (1024 * 1024)).toFixed(2)} MB</p>
            <p className="text-sm text-muted-foreground">Shift Plans: {(storageBreakdown.bytesByCategory.shifts / (1024 * 1024)).toFixed(2)} MB</p>
            <p className="text-sm text-muted-foreground">Favorites: {(storageBreakdown.bytesByCategory.favorites / (1024 * 1024)).toFixed(2)} MB</p>
            <p className="text-sm text-muted-foreground">Cached Data: {(storageBreakdown.bytesByCategory.cache / (1024 * 1024)).toFixed(2)} MB</p>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadData}><Download size={14} className="me-2" />{isArabic ? "تصدير بياناتي" : "Export My Data"}</Button>
          <Button variant="outline" asChild><label><Upload size={14} className="me-2" />{isArabic ? "استيراد بيانات" : "Import Data"}<input hidden type="file" accept="application/json" onChange={importData} /></label></Button>
          <Button variant="destructive" onClick={() => confirmDelete(() => { window.localStorage.clear(); window.location.reload(); })}>{isArabic ? "مسح كل بيانات التطبيق" : "Clear All App Data"}</Button>
          <Button variant="destructive" onClick={() => confirmDelete(() => window.localStorage.removeItem(CHAT_HISTORY_KEY))}>{isArabic ? "مسح سجل المحادثات" : "Clear Chat History"}</Button>
          <Button variant="destructive" onClick={() => confirmDelete(() => Object.keys(window.localStorage).filter((k) => k.includes("shift")).forEach((k) => window.localStorage.removeItem(k)))}>{isArabic ? "مسح بيانات الشفتات" : "Clear Shift Plans"}</Button>
          <Button variant="destructive" onClick={() => confirmDelete(() => Object.keys(window.localStorage).filter((k) => k.includes("favorite")).forEach((k) => window.localStorage.removeItem(k)))}>{isArabic ? "مسح المفضلة" : "Clear Favorites"}</Button>
        </div>
      </Section>

      <Section title={tx.install}>
        <Card className="bg-card/80 border-white/10"><CardContent className="pt-6 space-y-3">
          <p>{isArabic ? "ثبّت Digital Nurse على جهازك لوصول أسرع واستخدام بدون إنترنت" : "Install Digital Nurse on your device for faster access and offline use"}</p>
          {installed ? <p>✅ {isArabic ? "التطبيق مثبّت" : "App installed"}</p> : installPrompt ? <Button onClick={async () => { await installPrompt.prompt(); }}>{isArabic ? "تثبيت" : "Install"}</Button> : <p>{isArabic ? "افتح بـ Chrome أو Edge للتثبيت" : "Open in Chrome or Edge to install"}</p>}
        </CardContent></Card>
        <SettingCard icon={<Share2 size={16} />} label={isArabic ? "شارك Digital Nurse" : "Share Digital Nurse"}>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(APP_URL)}><Copy size={14} className="me-1" />Copy Link</Button>
            <Button variant="outline" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")}>WhatsApp</Button>
            <Button variant="outline" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(shareText)}`, "_blank")}>Telegram</Button>
            <Button variant="outline" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")}>Twitter/X</Button>
            <Button onClick={shareViaNative}>{isArabic ? "مشاركة" : "Native Share"}</Button>
          </div>
          <canvas ref={canvasRef} width={220} height={220} className="rounded-md border border-white/20 bg-white p-2 mt-3" />
        </SettingCard>
      </Section>

      <Section title={tx.feedback}>
        <SettingCard label={isArabic ? "كيف تقيّم Digital Nurse؟" : "How would you rate Digital Nurse?"}>
          <div className="flex gap-2">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => { setRating(n); window.localStorage.setItem("dn-rating", String(n)); }}><Star className={n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} /></button>)}</div>
          {rating >= 4 ? <p>{isArabic ? "شكراً! شاركه مع زملائك؟" : "Thank you! Share with your colleagues?"}</p> : rating > 0 ? <p>{isArabic ? "نعتذر. أخبرنا كيف نتحسن:" : "We're sorry. Tell us how to improve:"}</p> : null}
        </SettingCard>

        <SettingCard label={isArabic ? "الإبلاغ عن خطأ" : "Report a Bug"}>
          <Select value={bugForm.section} onValueChange={(v) => setBugForm((p) => ({ ...p, section: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{sectionKeys.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea value={bugForm.description} onChange={(e) => setBugForm((p) => ({ ...p, description: e.target.value }))} placeholder={isArabic ? "وصف الخطأ" : "Describe the bug"} />
          <Input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setBugForm((p) => ({ ...p, screenshot: String(reader.result || "") }));
            reader.readAsDataURL(file);
          }} />
          <Button onClick={submitBug}>Submit</Button>
        </SettingCard>

        <SettingCard label={isArabic ? "اقترح ميزة" : "Suggest a Feature"}>
          <Textarea value={featureSuggestion} onChange={(e) => setFeatureSuggestion(e.target.value)} />
          <Button onClick={submitFeature}>Submit</Button>
        </SettingCard>
      </Section>

      <Section title={tx.about}>
        <Card className="bg-card/80 border-white/10">
          <CardHeader><CardTitle>Digital Nurse</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>v2.0.0 · {isArabic ? "نيسان 2026" : "April 2026"} · Web (PWA)</p>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-primary">{isArabic ? "آخر التحديثات" : "What's New"}<ChevronDown size={14} /></CollapsibleTrigger>
              <CollapsibleContent className="text-muted-foreground space-y-1 mt-2">
                <p>v2.0: AI Assistant modes, 500 terminology terms, lab + ABG interpreter, assessments, calculators, infection control.</p>
                <p>v1.0: Drug reference, ECG, fluids, shift planner, documentation hub.</p>
              </CollapsibleContent>
            </Collapsible>
            <p>{isArabic ? "بناه حسن سلمان" : "Built by Hassan Salman"}</p>
            <p>{isArabic ? "ممرض عناية مركزة · النجف، العراق" : "ICU Nurse · Najaf, Iraq"}</p>
            <a href="https://github.com/3h0ll7" target="_blank" rel="noreferrer" className="text-primary underline">github.com/3h0ll7</a>
            <a href="https://x.com/3h0ll7" target="_blank" rel="noreferrer" className="block text-primary underline">@3h0ll7</a>
            <p>{isArabic ? "هذا التطبيق أداة مرجعية سريرية للمهنيين الصحيين. وهو ليس بديلاً عن الحكم السريري، بروتوكولات المستشفى، أو أوامر الطبيب. تحقق دائماً من المعلومات مع الإرشادات الحالية المبنية على الأدلة. المطوّر غير مسؤول عن القرارات السريرية المتخذة باستخدام هذا التطبيق." : "This app is a clinical reference tool for healthcare professionals. It is NOT a substitute for clinical judgment, hospital protocols, or physician orders. Always verify information with current evidence-based guidelines. The developer is not liable for clinical decisions made using this app."}</p>
            <p>{isArabic ? "Digital Nurse يحترم خصوصيتك. كل البيانات تُخزّن محلياً على جهازك. لا يتم جمع أو نقل أو مشاركة أي بيانات مع أي طرف ثالث. بدون تحليلات. بدون تتبع." : "Digital Nurse respects your privacy. All data is stored locally on your device. No data is collected, transmitted, or shared with any third party. No analytics. No tracking."}</p>
            <p>{isArabic ? "مصادر البيانات السريرية: إرشادات AHA ACLS، معايير Sepsis-3، إرشادات KDIGO، معايير Berlin ARDS، نظافة اليدين WHO، احتياطات العزل CDC" : "Clinical data sources: AHA ACLS Guidelines, Sepsis-3 Criteria, KDIGO Guidelines, Berlin ARDS Criteria, WHO Hand Hygiene, CDC Isolation Precautions"}</p>
          </CardContent>
        </Card>
      </Section>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? "هل أنت متأكد؟" : "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>{isArabic ? "لا يمكن التراجع." : "This cannot be undone."}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? "إلغاء" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={() => { pendingDelete?.(); setPendingDelete(null); }}>{isArabic ? "احذف" : "Delete"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
  <section className="space-y-3">
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    <div className="space-y-3">{children}</div>
  </section>
);

const SettingCard = ({ icon, label, children }: { icon?: ReactNode; label: string; children: ReactNode }) => (
  <Card className="bg-card/80 border-white/10">
    <CardContent className="pt-6 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">{icon}{label}</div>
      {children}
    </CardContent>
  </Card>
);

export default Settings;
