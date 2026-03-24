export type SupportedLanguage = "en" | "ar";

interface Translation {
  // Navigation
  navDashboard: string;
  navProcedures: string;
  navLabs: string;
  navAssess: string;
  navCalculators: string;
  navAssistant: string;
  navFlashcards: string;

  // Dashboard
  clinicalCommandCenter: string;
  digitalNurseCompanion: string;
  askAI: string;
  quickActions: string;
  viewAllWorkflows: string;
  startProcedure: string;
  browseChecklists: string;
  reviewLabs: string;
  criticalValuesTrending: string;
  assessmentScales: string;
  neurologicalScreening: string;
  proceduresLabel: string;
  bedsideWorkflows: string;
  labCategories: string;
  withCriticalAlerts: string;
  assessmentTools: string;
  evidenceBasedScales: string;
  activeProcedureList: string;
  openBoard: string;
  labsAndAssessments: string;
  labs: string;
  criticalWatchlist: string;
  labDomains: string;
  reviewPanels: string;
  bedsideScoring: string;
  domains: string;
  launchAssessments: string;
  needHelpDocumenting: string;
  summonAIAssistant: string;
  startConsult: string;

  // Procedures
  proceduresTitle: string;
  searchProcedures: string;
  allLabel: string;
  noProcedures: string;
  quickViewTitle: string;
  quickViewDescription: string;
  viewFullProcedure: string;
  evidenceBasedWorkflows: string;
  clinicalTools: string;
  preProcedure: string;
  preProcedureDesc: string;
  intraProcedure: string;
  intraProcedureDesc: string;
  postProcedure: string;
  postProcedureDesc: string;

  // Procedure Detail
  indications: string;
  contraindications: string;
  equipment: string;
  steps: string;
  complications: string;
  documentation: string;
  backToProcedures: string;
  procedureNotFound: string;

  // Labs
  labPanels: string;
  criticalValuesRanges: string;
  searchTestsOrCategories: string;
  normalLabel: string;
  criticalLabel: string;
  noLabTestsFound: string;

  // Assessments
  assessmentHub: string;
  riskScoresBedsideTools: string;
  searchAssessments: string;
  interactive: string;
  noAssessmentsFound: string;

  // Scale Detail
  scaleNotFound: string;
  totalScore: string;
  reset: string;
  point: string;
  points: string;

  // Calculators
  clinicalCalculators: string;
  smartDosingTools: string;
  dosageCalculation: string;
  dosageCalcDesc: string;
  ivDripRate: string;
  ivDripRateDesc: string;
  bmiCalculator: string;
  bmiCalcDesc: string;
  creatinineClearance: string;
  creatinineClearanceDesc: string;

  // Calculator Detail
  orderedDose: string;
  availableDose: string;
  volumeAvailable: string;
  availableDoseError: string;
  administer: string;
  totalVolume: string;
  timeHours: string;
  dropFactor: string;
  timeError: string;
  rate: string;
  mlHr: string;
  dropsMin: string;
  weightKg: string;
  heightCm: string;
  heightError: string;
  underweight: string;
  normalWeight: string;
  overweight: string;
  obese: string;
  bmiLabel: string;
  ageYears: string;
  serumCreatinine: string;
  sexLabel: string;
  selectOption: string;
  male: string;
  female: string;
  serumCreatinineError: string;
  creatinineClearanceResult: string;
  calculatorNotFound: string;
  calculate: string;

  // AI Assistant
  aiNursingAssistant: string;
  educationalDisclaimer: string;
  aiDescription: string;
  exampleQuestionsLabel: string;
  askNursingQuestion: string;
  aiErrorTitle: string;
  aiErrorDescription: string;
  exampleQ1: string;
  exampleQ2: string;
  exampleQ3: string;
  exampleQ4: string;

  // Flashcards
  flashcardsTitle: string;
  flashcardsSubtitle: string;
  searchFlashcards: string;
  allTopics: string;
  tapToReveal: string;
  resetLabel: string;
  cards: string;
  noCardsMatch: string;

  // Not Found
  pageNotFound: string;
  returnToHome: string;

  // Settings
  settingsTitle: string;
  settingsDescription: string;
  languageLabel: string;
  themeLabel: string;
  lightTheme: string;
  darkTheme: string;
  close: string;

  // AppLayout
  goBack: string;
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    // Navigation
    navDashboard: "Dashboard",
    navProcedures: "Procedures",
    navLabs: "Labs",
    navAssess: "Assess",
    navCalculators: "Calculators",
    navAssistant: "AI Assistant",
    navFlashcards: "Flashcards",

    // Dashboard
    clinicalCommandCenter: "Clinical Command Center",
    digitalNurseCompanion: "Digital Nurse Companion",
    askAI: "Ask AI",
    quickActions: "Quick Actions",
    viewAllWorkflows: "View all workflows",
    startProcedure: "Start Procedure",
    browseChecklists: "Browse checklists and bedside guides",
    reviewLabs: "Review Labs",
    criticalValuesTrending: "Critical values & trending",
    assessmentScales: "Assessment Scales",
    neurologicalScreening: "Neurological & risk screening",
    proceduresLabel: "Procedures",
    bedsideWorkflows: "Bedside workflows",
    labCategories: "Lab Categories",
    withCriticalAlerts: "With critical alerts",
    assessmentTools: "Assessment Tools",
    evidenceBasedScales: "Evidence-based scales",
    activeProcedureList: "Active Procedure List",
    openBoard: "Open board",
    labsAndAssessments: "Labs & Assessments",
    labs: "Labs",
    criticalWatchlist: "Critical watchlist",
    labDomains: "lab domains",
    reviewPanels: "Review panels",
    bedsideScoring: "Bedside scoring",
    domains: "domains",
    launchAssessments: "Launch assessments",
    needHelpDocumenting: "Need help documenting?",
    summonAIAssistant: "Summon the AI assistant for handoff summaries",
    startConsult: "Start consult",

    // Procedures
    proceduresTitle: "Nursing Procedures",
    searchProcedures: "Search procedures...",
    allLabel: "All",
    noProcedures: "No procedures found",
    quickViewTitle: "Procedure overview",
    quickViewDescription: "Review the summary below or open the full checklist for step-by-step guidance.",
    viewFullProcedure: "Open full procedure",
    evidenceBasedWorkflows: "Evidence-based workflows",
    clinicalTools: "Clinical tools",
    preProcedure: "Pre-procedure",
    preProcedureDesc: "Verification, consent, and patient preparation",
    intraProcedure: "Intra-procedure",
    intraProcedureDesc: "Sterile technique, monitoring, escalation cues",
    postProcedure: "Post-procedure",
    postProcedureDesc: "Recovery, documentation, and patient teaching",

    // Procedure Detail
    indications: "Indications",
    contraindications: "Contraindications",
    equipment: "Equipment Needed",
    steps: "Procedure Steps",
    complications: "Potential Complications",
    documentation: "Documentation",
    backToProcedures: "Back to Procedures",
    procedureNotFound: "Procedure not found",

    // Labs
    labPanels: "Lab Panels",
    criticalValuesRanges: "Critical values & ranges",
    searchTestsOrCategories: "Search tests or categories",
    normalLabel: "Normal:",
    criticalLabel: "Critical:",
    noLabTestsFound: "No lab tests found.",

    // Assessments
    assessmentHub: "Assessment Hub",
    riskScoresBedsideTools: "Risk scores & bedside tools",
    searchAssessments: "Search assessments",
    interactive: "Interactive",
    noAssessmentsFound: "No assessments found.",

    // Scale Detail
    scaleNotFound: "Scale not found",
    totalScore: "Total Score:",
    reset: "Reset",
    point: "point",
    points: "points",

    // Calculators
    clinicalCalculators: "Clinical Calculators",
    smartDosingTools: "Smart dosing & drip tools",
    dosageCalculation: "Dosage Calculation",
    dosageCalcDesc: "Calculate medication dosage based on weight",
    ivDripRate: "IV Drip Rate",
    ivDripRateDesc: "Calculate mL/hour and drops/min",
    bmiCalculator: "BMI Calculator",
    bmiCalcDesc: "Calculate Body Mass Index",
    creatinineClearance: "Creatinine Clearance",
    creatinineClearanceDesc: "Calculate renal function",

    // Calculator Detail
    orderedDose: "Ordered Dose (mg)",
    availableDose: "Available Dose (mg)",
    volumeAvailable: "Volume Available (mL)",
    availableDoseError: "Available dose must be greater than 0",
    administer: "Administer:",
    totalVolume: "Total Volume (mL)",
    timeHours: "Time (hours)",
    dropFactor: "Drop Factor (gtts/mL)",
    timeError: "Time must be greater than 0",
    rate: "Rate:",
    mlHr: "mL/hr",
    dropsMin: "drops/min",
    weightKg: "Weight (kg)",
    heightCm: "Height (cm)",
    heightError: "Height must be greater than 0",
    underweight: "Underweight",
    normalWeight: "Normal weight",
    overweight: "Overweight",
    obese: "Obese",
    bmiLabel: "BMI:",
    ageYears: "Age (years)",
    serumCreatinine: "Serum Creatinine (mg/dL)",
    sexLabel: "Sex",
    selectOption: "Select...",
    male: "Male",
    female: "Female",
    serumCreatinineError: "Serum creatinine must be greater than 0",
    creatinineClearanceResult: "Creatinine Clearance:",
    calculatorNotFound: "Calculator not found",
    calculate: "Calculate",

    // AI Assistant
    aiNursingAssistant: "AI Nursing Assistant",
    educationalDisclaimer: "For educational purposes only. Always verify with qualified healthcare professionals.",
    aiDescription: "Ask me about nursing procedures, medications, clinical scenarios, or help with professional documentation.",
    exampleQuestionsLabel: "Example questions:",
    askNursingQuestion: "Ask a nursing question...",
    aiErrorTitle: "Error",
    aiErrorDescription: "Failed to connect to the AI assistant. Please try again.",
    exampleQ1: "What are the signs of IV infiltration?",
    exampleQ2: "Explain the mechanism of action for metformin",
    exampleQ3: "Help me write a progress note for a stable patient",
    exampleQ4: "What are normal vital signs for adults?",

    // Flashcards
    flashcardsTitle: "Nursing Flashcards",
    flashcardsSubtitle: "Rapid clinical refreshers",
    searchFlashcards: "Search questions, answers, or tags",
    allTopics: "All",
    tapToReveal: "Tap to reveal the answer",
    resetLabel: "Reset",
    cards: "cards",
    noCardsMatch: "No cards match the current filters.",

    // Not Found
    pageNotFound: "Oops! Page not found",
    returnToHome: "Return to Home",

    // Settings
    settingsTitle: "Preferences",
    settingsDescription: "Choose a language and color theme that matches your environment.",
    languageLabel: "Language",
    themeLabel: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    close: "Close",

    // AppLayout
    goBack: "Go back",
  },
  ar: {
    // Navigation
    navDashboard: "الرئيسية",
    navProcedures: "الإجراءات",
    navLabs: "المختبرات",
    navAssess: "التقييم",
    navCalculators: "الحاسبات",
    navAssistant: "المساعد الذكي",
    navFlashcards: "البطاقات التعليمية",

    // Dashboard
    clinicalCommandCenter: "مركز القيادة السريرية",
    digitalNurseCompanion: "مساعد التمريض الرقمي",
    askAI: "اسأل الذكاء الاصطناعي",
    quickActions: "إجراءات سريعة",
    viewAllWorkflows: "عرض جميع سير العمل",
    startProcedure: "ابدأ إجراء",
    browseChecklists: "تصفح قوائم التحقق والأدلة السريرية",
    reviewLabs: "مراجعة المختبرات",
    criticalValuesTrending: "القيم الحرجة والاتجاهات",
    assessmentScales: "مقاييس التقييم",
    neurologicalScreening: "الفحص العصبي وتقييم المخاطر",
    proceduresLabel: "الإجراءات",
    bedsideWorkflows: "سير العمل السريري",
    labCategories: "فئات المختبر",
    withCriticalAlerts: "مع تنبيهات حرجة",
    assessmentTools: "أدوات التقييم",
    evidenceBasedScales: "مقاييس مبنية على الأدلة",
    activeProcedureList: "قائمة الإجراءات النشطة",
    openBoard: "فتح اللوحة",
    labsAndAssessments: "المختبرات والتقييمات",
    labs: "المختبرات",
    criticalWatchlist: "قائمة المراقبة الحرجة",
    labDomains: "مجالات مخبرية",
    reviewPanels: "مراجعة اللوحات",
    bedsideScoring: "تقييم سريري",
    domains: "مجالات",
    launchAssessments: "بدء التقييمات",
    needHelpDocumenting: "هل تحتاج مساعدة في التوثيق؟",
    summonAIAssistant: "استدعِ المساعد الذكي لملخصات تسليم المرضى",
    startConsult: "ابدأ استشارة",

    // Procedures
    proceduresTitle: "إجراءات التمريض",
    searchProcedures: "ابحث عن الإجراءات...",
    allLabel: "الكل",
    noProcedures: "لا توجد إجراءات",
    quickViewTitle: "نظرة عامة على الإجراء",
    quickViewDescription: "اطلع على الملخص أدناه أو افتح الدليل الكامل للخطوات التفصيلية.",
    viewFullProcedure: "عرض الإجراء الكامل",
    evidenceBasedWorkflows: "سير عمل مبني على الأدلة",
    clinicalTools: "أدوات سريرية",
    preProcedure: "قبل الإجراء",
    preProcedureDesc: "التحقق والموافقة وتحضير المريض",
    intraProcedure: "أثناء الإجراء",
    intraProcedureDesc: "التقنية المعقمة والمراقبة وإشارات التصعيد",
    postProcedure: "بعد الإجراء",
    postProcedureDesc: "التعافي والتوثيق وتثقيف المريض",

    // Procedure Detail
    indications: "الدواعي",
    contraindications: "موانع الاستخدام",
    equipment: "الأدوات اللازمة",
    steps: "خطوات الإجراء",
    complications: "المضاعفات المحتملة",
    documentation: "التوثيق",
    backToProcedures: "العودة للإجراءات",
    procedureNotFound: "الإجراء غير موجود",

    // Labs
    labPanels: "لوحات المختبر",
    criticalValuesRanges: "القيم الحرجة والنطاقات",
    searchTestsOrCategories: "ابحث في الفحوصات أو الفئات",
    normalLabel: "طبيعي:",
    criticalLabel: "حرج:",
    noLabTestsFound: "لم يتم العثور على فحوصات مخبرية.",

    // Assessments
    assessmentHub: "مركز التقييم",
    riskScoresBedsideTools: "درجات المخاطر وأدوات السرير",
    searchAssessments: "ابحث في التقييمات",
    interactive: "تفاعلي",
    noAssessmentsFound: "لم يتم العثور على تقييمات.",

    // Scale Detail
    scaleNotFound: "المقياس غير موجود",
    totalScore: "المجموع الكلي:",
    reset: "إعادة تعيين",
    point: "نقطة",
    points: "نقاط",

    // Calculators
    clinicalCalculators: "الحاسبات السريرية",
    smartDosingTools: "أدوات الجرعات والتنقيط الذكية",
    dosageCalculation: "حساب الجرعة",
    dosageCalcDesc: "حساب جرعة الدواء بناءً على الوزن",
    ivDripRate: "معدل التنقيط الوريدي",
    ivDripRateDesc: "حساب مل/ساعة وقطرات/دقيقة",
    bmiCalculator: "حاسبة مؤشر كتلة الجسم",
    bmiCalcDesc: "حساب مؤشر كتلة الجسم",
    creatinineClearance: "تصفية الكرياتينين",
    creatinineClearanceDesc: "حساب وظائف الكلى",

    // Calculator Detail
    orderedDose: "الجرعة الموصوفة (ملغ)",
    availableDose: "الجرعة المتاحة (ملغ)",
    volumeAvailable: "الحجم المتاح (مل)",
    availableDoseError: "يجب أن تكون الجرعة المتاحة أكبر من صفر",
    administer: "الجرعة المعطاة:",
    totalVolume: "الحجم الكلي (مل)",
    timeHours: "الوقت (ساعات)",
    dropFactor: "عامل التنقيط (قطرة/مل)",
    timeError: "يجب أن يكون الوقت أكبر من صفر",
    rate: "المعدل:",
    mlHr: "مل/ساعة",
    dropsMin: "قطرة/دقيقة",
    weightKg: "الوزن (كغ)",
    heightCm: "الطول (سم)",
    heightError: "يجب أن يكون الطول أكبر من صفر",
    underweight: "نقص الوزن",
    normalWeight: "وزن طبيعي",
    overweight: "زيادة الوزن",
    obese: "سمنة",
    bmiLabel: "مؤشر كتلة الجسم:",
    ageYears: "العمر (سنوات)",
    serumCreatinine: "كرياتينين المصل (ملغ/دل)",
    sexLabel: "الجنس",
    selectOption: "اختر...",
    male: "ذكر",
    female: "أنثى",
    serumCreatinineError: "يجب أن يكون كرياتينين المصل أكبر من صفر",
    creatinineClearanceResult: "تصفية الكرياتينين:",
    calculatorNotFound: "الحاسبة غير موجودة",
    calculate: "احسب",

    // AI Assistant
    aiNursingAssistant: "مساعد التمريض الذكي",
    educationalDisclaimer: "للأغراض التعليمية فقط. تحقق دائمًا مع المتخصصين المؤهلين في الرعاية الصحية.",
    aiDescription: "اسألني عن إجراءات التمريض أو الأدوية أو السيناريوهات السريرية أو المساعدة في التوثيق المهني.",
    exampleQuestionsLabel: "أسئلة مقترحة:",
    askNursingQuestion: "اسأل سؤالاً تمريضياً...",
    aiErrorTitle: "خطأ",
    aiErrorDescription: "فشل الاتصال بمساعد الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.",
    exampleQ1: "ما هي علامات تسرب المحلول الوريدي؟",
    exampleQ2: "اشرح آلية عمل دواء الميتفورمين",
    exampleQ3: "ساعدني في كتابة ملاحظة تقدم لمريض مستقر",
    exampleQ4: "ما هي العلامات الحيوية الطبيعية للبالغين؟",

    // Flashcards
    flashcardsTitle: "بطاقات تمريضية",
    flashcardsSubtitle: "مراجعات سريرية سريعة",
    searchFlashcards: "ابحث في الأسئلة أو الإجابات",
    allTopics: "الكل",
    tapToReveal: "اضغط لإظهار الإجابة",
    resetLabel: "إعادة تعيين",
    cards: "بطاقات",
    noCardsMatch: "لا توجد بطاقات تطابق الفلاتر الحالية.",

    // Not Found
    pageNotFound: "عفواً! الصفحة غير موجودة",
    returnToHome: "العودة للرئيسية",

    // Settings
    settingsTitle: "التفضيلات",
    settingsDescription: "اختر اللغة والوضع اللوني المناسب لبيئة عملك.",
    languageLabel: "اللغة",
    themeLabel: "الوضع",
    lightTheme: "فاتح",
    darkTheme: "داكن",
    close: "إغلاق",

    // AppLayout
    goBack: "رجوع",
  },
};

export const languages: { value: SupportedLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];
