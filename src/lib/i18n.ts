export type SupportedLanguage = "en" | "ar";

interface Translation {
  proceduresTitle: string;
  searchProcedures: string;
  allLabel: string;
  noProcedures: string;
  quickViewTitle: string;
  quickViewDescription: string;
  viewFullProcedure: string;
  navProcedures: string;
  navCalculators: string;
  navAssistant: string;
  navFlashcards: string;
  navMindMaps: string;
  navHome: string;
  navLabs: string;
  navAssessments: string;
  indications: string;
  contraindications: string;
  definition: string;
  equipment: string;
  steps: string;
  safetyAlerts: string;
  complications: string;
  documentation: string;
  patientTeaching: string;
  backToProcedures: string;
  flashcardsTitle: string;
  flashcardsSubtitle: string;
  searchFlashcards: string;
  allTopics: string;
  tapToReveal: string;
  settingsTitle: string;
  settingsDescription: string;
  languageLabel: string;
  themeLabel: string;
  lightTheme: string;
  darkTheme: string;
  close: string;
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    proceduresTitle: "Nursing Procedures – Top 50 Global Standards",
    searchProcedures: "Search procedures...",
    allLabel: "All",
    noProcedures: "No procedures found",
    quickViewTitle: "Procedure overview",
    quickViewDescription: "Review the summary below or open the full checklist for step-by-step guidance.",
    viewFullProcedure: "Open full procedure",
    navProcedures: "Procedures",
    navCalculators: "Calculators",
    navAssistant: "AI Assistant",
    navFlashcards: "Flashcards",
    navMindMaps: "Mind Maps",
    navHome: "Home",
    navLabs: "Labs",
    navAssessments: "Assess",
    indications: "Indications",
    contraindications: "Contraindications",
    definition: "Definition",
    equipment: "Equipment Needed",
    steps: "Procedure Steps",
    safetyAlerts: "Safety Alerts & Red Flags",
    complications: "Potential Complications",
    documentation: "Documentation",
    patientTeaching: "Patient Teaching",
    backToProcedures: "Back to Procedures",
    flashcardsTitle: "Nursing Flashcards",
    flashcardsSubtitle: "Rapid clinical refreshers",
    searchFlashcards: "Search questions, answers, or tags",
    allTopics: "All",
    tapToReveal: "Tap to reveal the answer",
    settingsTitle: "Preferences",
    settingsDescription: "Choose a language and color theme that matches your environment.",
    languageLabel: "Language",
    themeLabel: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    close: "Close",
  },
  ar: {
    proceduresTitle: "إجراءات التمريض – أفضل 50 معيارًا عالميًا",
    searchProcedures: "ابحث عن الإجراءات...",
    allLabel: "الكل",
    noProcedures: "لا توجد إجراءات",
    quickViewTitle: "نظرة عامة على الإجراء",
    quickViewDescription: "اطلع على الملخص أدناه أو افتح الدليل الكامل للخطوات التفصيلية.",
    viewFullProcedure: "عرض الإجراء الكامل",
    navProcedures: "الإجراءات",
    navCalculators: "الحاسبات",
    navAssistant: "المساعد الذكي",
    navFlashcards: "البطاقات التعليمية",
    navMindMaps: "الخرائط الذهنية",
    navHome: "الرئيسية",
    navLabs: "المختبرات",
    navAssessments: "التقييمات",
    indications: "الدواعي",
    contraindications: "موانع الاستخدام",
    definition: "التعريف",
    equipment: "الأدوات اللازمة",
    steps: "خطوات الإجراء",
    safetyAlerts: "تنبيهات السلامة والعلامات التحذيرية",
    complications: "المضاعفات المحتملة",
    documentation: "التوثيق",
    patientTeaching: "تثقيف المريض",
    backToProcedures: "العودة للإجراءات",
    flashcardsTitle: "بطاقات تمريضية",
    flashcardsSubtitle: "مراجعات سريرية سريعة",
    searchFlashcards: "ابحث في الأسئلة أو الإجابات",
    allTopics: "الكل",
    tapToReveal: "اضغط لإظهار الإجابة",
    settingsTitle: "التفضيلات",
    settingsDescription: "اختر اللغة والوضع اللوني المناسب لبيئة عملك.",
    languageLabel: "اللغة",
    themeLabel: "الوضع",
    lightTheme: "فاتح",
    darkTheme: "داكن",
    close: "إغلاق",
  },
};

export const languages: { value: SupportedLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];
