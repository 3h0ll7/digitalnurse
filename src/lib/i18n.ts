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
  indications: string;
  contraindications: string;
  equipment: string;
  steps: string;
  complications: string;
  documentation: string;
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
    proceduresTitle: "Nursing Procedures",
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
    indications: "Indications",
    contraindications: "Contraindications",
    equipment: "Equipment Needed",
    steps: "Procedure Steps",
    complications: "Potential Complications",
    documentation: "Documentation",
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
    proceduresTitle: "إجراءات التمريض",
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
    indications: "الدواعي",
    contraindications: "موانع الاستخدام",
    equipment: "الأدوات اللازمة",
    steps: "خطوات الإجراء",
    complications: "المضاعفات المحتملة",
    documentation: "التوثيق",
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
