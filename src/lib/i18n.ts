export type SupportedLanguage = "en" | "ar";

interface Translation {
  // Navigation
  navHome: string;
  navProcedures: string;
  navAssessments: string;
  navCalculators: string;
  navLabs: string;
  navEcg: string;
  navFlashcards: string;
  navMindMaps: string;
  navAssistant: string;

  // Common
  allLabel: string;
  allTopics: string;
  close: string;
  reset: string;
  calculate: string;
  select: string;
  open: string;
  enter: string;
  goBack: string;
  notFound: string;
  point: string;
  points: string;
  cards: string;
  topics: string;
  results: string;
  modules: string;
  workflows: string;
  interactive: string;
  ready: string;

  // Settings / Preferences
  settingsTitle: string;
  settingsDescription: string;
  languageLabel: string;
  themeLabel: string;
  lightTheme: string;
  darkTheme: string;

  // Home page
  homeTitle: string;
  homeSubtitle: string;
  engageAI: string;
  futuristicCareOS: string;
  homeHeroHeading: string;
  homeHeroDescription: string;
  exploreProcedures: string;
  viewLabIntelligence: string;
  enterWorkspace: string;
  // Quick actions
  proceduralPlaybooks: string;
  proceduralPlaybooksDesc: string;
  browse: string;
  assessmentCoPilot: string;
  assessmentCoPilotDesc: string;
  launch: string;
  labIntelligence: string;
  labIntelligenceDesc: string;
  review: string;
  // Workflow tiles
  vascularAccess: string;
  priority: string;
  sterileKit: string;
  neuroChecks: string;
  protocol: string;
  gcsNihss: string;
  medicationMath: string;
  tools: string;
  titrateDrip: string;
  // Insights
  aiBedBrief: string;
  aiBedBriefDesc: string;
  mindMapsInsight: string;
  mindMapsInsightDesc: string;
  flashcardsInsight: string;
  flashcardsInsightDesc: string;
  // Vitals
  vitalsStreaming: string;
  fasterInterventions: string;
  vitalsDescription: string;
  neuro: string;
  stable: string;
  hemodynamics: string;
  responsive: string;
  respiratory: string;
  escalate: string;
  // Bottom section
  labsPreview: string;
  assessmentsPreview: string;
  seamlessIntelligence: string;
  seamlessIntelligenceDesc: string;

  // AppLayout
  appBadge: string;
  appSubBadge: string;

  // Procedures page
  proceduresTitle: string;
  searchProcedures: string;
  noProcedures: string;
  quickViewTitle: string;
  quickViewDescription: string;
  viewFullProcedure: string;
  evidenceBasedWorkflows: string;
  clinicalTools: string;
  sourceOnDevice: string;
  preProcedure: string;
  preProcedureDesc: string;
  intraProcedure: string;
  intraProcedureDesc: string;
  postProcedure: string;
  postProcedureDesc: string;

  // Procedure detail
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
  procedureNotFound: string;

  // Assessments
  assessmentHubTitle: string;
  assessmentHubSubtitle: string;
  searchAssessments: string;
  noAssessments: string;
  sourceAssessmentCatalog: string;

  // Calculators
  calculatorsTitle: string;
  calculatorsSubtitle: string;
  precisionDosing: string;
  calculatorsHeroHeading: string;
  calculatorsHeroDesc: string;
  calculatorNotFound: string;
  // Calculator names
  dosageCalculation: string;
  dosageCalculationDesc: string;
  ivDripRate: string;
  ivDripRateDesc: string;
  bmiCalculator: string;
  bmiCalculatorDesc: string;
  creatinineClearance: string;
  creatinineClearanceDesc: string;
  // Calculator fields
  orderedDose: string;
  availableDose: string;
  volumeAvailable: string;
  totalVolume: string;
  timeHours: string;
  dropFactor: string;
  weightKg: string;
  heightCm: string;
  ageYears: string;
  serumCreatinine: string;
  sex: string;
  male: string;
  female: string;
  // Calculator results
  availableDoseError: string;
  administer: string;
  timeError: string;
  rateResult: string;
  heightError: string;
  underweight: string;
  normalWeight: string;
  overweight: string;
  obese: string;
  creatinineError: string;
  creatinineClearanceResult: string;

  // Labs
  labsTitle: string;
  labsSubtitle: string;
  searchLabs: string;
  noLabs: string;
  sourceLabRef: string;
  normal: string;
  critical: string;

  // ECG
  ecgTitle: string;
  ecgSubtitle: string;
  searchEcg: string;
  noEcgTerms: string;
  sourceEcgRef: string;
  clinicalPearl: string;

  // Flashcards
  flashcardsTitle: string;
  flashcardsSubtitle: string;
  searchFlashcards: string;
  tapToReveal: string;
  noFlashcards: string;

  // Mind Maps
  mindMapsTitle: string;
  mindMapsSubtitle: string;
  searchMindMaps: string;
  noMindMaps: string;

  // Scale Detail
  scaleNotFound: string;
  totalScore: string;

  // AI Assistant
  aiTitle: string;
  aiConnectionStatus: string;
  aiDisclaimer: string;
  aiWelcomeTitle: string;
  aiWelcomeDesc: string;
  aiExampleQuestionsTitle: string;
  aiPlaceholder: string;
  aiDailyRemaining: string;
  aiWarningRemaining: string;
  aiExampleQ1: string;
  aiExampleQ2: string;
  aiExampleQ3: string;
  aiExampleQ4: string;

  // Not Found page
  notFoundTitle: string;
  notFoundDesc: string;
  returnHome: string;
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    // Navigation
    navHome: "Home",
    navProcedures: "Procedures",
    navAssessments: "Assess",
    navCalculators: "Calculators",
    navLabs: "Labs",
    navEcg: "ECG",
    navFlashcards: "Flashcards",
    navMindMaps: "Mind Maps",
    navAssistant: "AI Assistant",

    // Common
    allLabel: "All",
    allTopics: "All",
    close: "Close",
    reset: "Reset",
    calculate: "Calculate",
    select: "Select...",
    open: "Open →",
    enter: "Enter →",
    goBack: "Go back",
    notFound: "Not found",
    point: "point",
    points: "points",
    cards: "cards",
    topics: "topics",
    results: "results",
    modules: "modules",
    workflows: "workflows",
    interactive: "Interactive",
    ready: "Ready",

    // Settings
    settingsTitle: "Preferences",
    settingsDescription: "Choose a language and color theme that matches your environment.",
    languageLabel: "Language",
    themeLabel: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",

    // Home
    homeTitle: "Digital Nurse Command",
    homeSubtitle: "Neo-brutalist clinical cockpit",
    engageAI: "Engage AI nurse",
    futuristicCareOS: "Futuristic care OS",
    homeHeroHeading: "Premium workflows engineered for the modern bedside.",
    homeHeroDescription: "Glide through assessments, procedures, and decision support with a cohesive medical-tech identity.",
    exploreProcedures: "Explore procedures",
    viewLabIntelligence: "View lab intelligence",
    enterWorkspace: "Enter workspace →",
    proceduralPlaybooks: "Procedural Playbooks",
    proceduralPlaybooksDesc: "Neo-brutalist checklists with escalation cues",
    browse: "Browse",
    assessmentCoPilot: "Assessment Co-pilot",
    assessmentCoPilotDesc: "Risk scoring + validated bedside scales",
    launch: "Launch",
    labIntelligence: "Lab Intelligence",
    labIntelligenceDesc: "Critical deltas & trending ranges",
    review: "Review",
    vascularAccess: "Vascular access",
    priority: "Priority",
    sterileKit: "Sterile kit",
    neuroChecks: "Neuro checks",
    protocol: "Protocol",
    gcsNihss: "GCS+NIHSS",
    medicationMath: "Medication math",
    tools: "Tools",
    titrateDrip: "Titrate & drip",
    aiBedBrief: "AI bedside brief",
    aiBedBriefDesc: "Summaries & escalation language auto-generated for complex patients.",
    mindMapsInsight: "Mind maps",
    mindMapsInsightDesc: "Pathways that translate chaos into visual order for rapid huddles.",
    flashcardsInsight: "Flashcards",
    flashcardsInsightDesc: "Micro-learning decks tuned for evidence refreshers.",
    vitalsStreaming: "Vitals streaming",
    fasterInterventions: "+12% faster interventions",
    vitalsDescription: "Streamlined documentation, automated safe-check reminders, and curated education microbursts keep the entire team synchronized.",
    neuro: "Neuro",
    stable: "Stable",
    hemodynamics: "Hemodynamics",
    responsive: "Responsive",
    respiratory: "Respiratory",
    escalate: "Escalate",
    labsPreview: "Labs",
    assessmentsPreview: "Assessments",
    seamlessIntelligence: "Seamless intelligence",
    seamlessIntelligenceDesc: "Tap into curated datasets and live guidelines mapped to the Digital Nurse aesthetic.",

    // AppLayout
    appBadge: "Digital Nurse Buddy",
    appSubBadge: "Public clinical reference · No login required",

    // Procedures
    proceduresTitle: "Nursing Procedures – Top 50 Global Standards",
    searchProcedures: "Search procedures...",
    noProcedures: "No procedures found",
    quickViewTitle: "Procedure overview",
    quickViewDescription: "Review the summary below or open the full checklist for step-by-step guidance.",
    viewFullProcedure: "Open full procedure",
    evidenceBasedWorkflows: "Evidence-based workflows",
    clinicalTools: "Clinical tools",
    sourceOnDevice: "Source: On-device clinical reference",
    preProcedure: "Pre-procedure",
    preProcedureDesc: "Verification, consent, prep, and targeted checklists",
    intraProcedure: "Intra-procedure",
    intraProcedureDesc: "Live sterile guidance + escalation cues",
    postProcedure: "Post-procedure",
    postProcedureDesc: "Recovery dashboards, teaching, and documentation",

    // Procedure detail
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
    procedureNotFound: "Procedure not found",

    // Assessments
    assessmentHubTitle: "Assessment Hub",
    assessmentHubSubtitle: "Risk scores & bedside tools",
    searchAssessments: "Search assessments",
    noAssessments: "No assessments found.",
    sourceAssessmentCatalog: "Source: On-device assessment catalog",

    // Calculators
    calculatorsTitle: "Clinical Calculators",
    calculatorsSubtitle: "Smart dosing & drip tools",
    precisionDosing: "Precision dosing",
    calculatorsHeroHeading: "Frictionless tools engineered for bedside titrations.",
    calculatorsHeroDesc: "Every calculator mirrors the Digital Nurse identity with clean inputs, contrast, and escalation prompts.",
    calculatorNotFound: "Calculator not found",
    dosageCalculation: "Dosage Calculation",
    dosageCalculationDesc: "Calculate medication dosage based on weight",
    ivDripRate: "IV Drip Rate",
    ivDripRateDesc: "Calculate mL/hour and drops/min",
    bmiCalculator: "BMI Calculator",
    bmiCalculatorDesc: "Calculate Body Mass Index",
    creatinineClearance: "Creatinine Clearance",
    creatinineClearanceDesc: "Calculate renal function",
    orderedDose: "Ordered Dose (mg)",
    availableDose: "Available Dose (mg)",
    volumeAvailable: "Volume Available (mL)",
    totalVolume: "Total Volume (mL)",
    timeHours: "Time (hours)",
    dropFactor: "Drop Factor (gtts/mL)",
    weightKg: "Weight (kg)",
    heightCm: "Height (cm)",
    ageYears: "Age (years)",
    serumCreatinine: "Serum Creatinine (mg/dL)",
    sex: "Sex",
    male: "Male",
    female: "Female",
    availableDoseError: "Available dose must be greater than 0",
    administer: "Administer",
    timeError: "Time must be greater than 0",
    rateResult: "Rate",
    heightError: "Height must be greater than 0",
    underweight: "Underweight",
    normalWeight: "Normal weight",
    overweight: "Overweight",
    obese: "Obese",
    creatinineError: "Serum creatinine must be greater than 0",
    creatinineClearanceResult: "Creatinine Clearance",

    // Labs
    labsTitle: "Lab Intelligence",
    labsSubtitle: "Critical ranges & trending deltas",
    searchLabs: "Search tests or categories",
    noLabs: "No lab tests found.",
    sourceLabRef: "Source: On-device lab reference",
    normal: "Normal",
    critical: "Critical",

    // ECG
    ecgTitle: "ECG Interpretation",
    ecgSubtitle: "Cardiac rhythms & waveforms",
    searchEcg: "Search ECG terms, definitions, or clinical pearls",
    noEcgTerms: "No ECG terms matched your filters.",
    sourceEcgRef: "Source: ECG static reference",
    clinicalPearl: "Clinical Pearl",

    // Flashcards
    flashcardsTitle: "Nursing Flashcards",
    flashcardsSubtitle: "Rapid clinical refreshers",
    searchFlashcards: "Search questions, answers, or tags",
    tapToReveal: "Tap to reveal the answer",
    noFlashcards: "No cards match the current filters.",

    // Mind Maps
    mindMapsTitle: "Mind Map Library",
    mindMapsSubtitle: "50 priority nursing topics organized for rapid review",
    searchMindMaps: "Search by condition, focus, or branch detail",
    noMindMaps: "No mind maps match that search. Try a different keyword or reset the filters.",

    // Scale Detail
    scaleNotFound: "Scale not found",
    totalScore: "Total Score",

    // AI Assistant
    aiTitle: "AI Nursing Assistant",
    aiConnectionStatus: "Gemini AI",
    aiDisclaimer: "For educational purposes only. Always verify with qualified healthcare professionals.",
    aiWelcomeTitle: "AI Nursing Assistant",
    aiWelcomeDesc: "Powered by Google Gemini. Ask about procedures, medications, clinical scenarios, or documentation help.",
    aiExampleQuestionsTitle: "Example questions:",
    aiPlaceholder: "Ask a nursing question... (10 messages/day)",
    aiDailyRemaining: "daily messages remaining",
    aiWarningRemaining: "remaining today",
    aiExampleQ1: "What are the signs of IV infiltration?",
    aiExampleQ2: "Explain the mechanism of action for metformin",
    aiExampleQ3: "Help me write a progress note for a stable patient",
    aiExampleQ4: "What are normal vital signs for adults?",

    // Not Found
    notFoundTitle: "Page not found",
    notFoundDesc: "The page you are looking for does not exist.",
    returnHome: "Return to Home",
  },

  ar: {
    // Navigation
    navHome: "الرئيسية",
    navProcedures: "الإجراءات",
    navAssessments: "التقييمات",
    navCalculators: "الحاسبات",
    navLabs: "المختبرات",
    navEcg: "ECG",
    navFlashcards: "البطاقات التعليمية",
    navMindMaps: "الخرائط الذهنية",
    navAssistant: "المساعد الذكي",

    // Common
    allLabel: "الكل",
    allTopics: "الكل",
    close: "إغلاق",
    reset: "إعادة تعيين",
    calculate: "احسب",
    select: "اختر...",
    open: "← فتح",
    enter: "← دخول",
    goBack: "رجوع",
    notFound: "غير موجود",
    point: "نقطة",
    points: "نقاط",
    cards: "بطاقات",
    topics: "مواضيع",
    results: "نتائج",
    modules: "وحدات",
    workflows: "سير عمل",
    interactive: "تفاعلي",
    ready: "جاهز",

    // Settings
    settingsTitle: "التفضيلات",
    settingsDescription: "اختر اللغة والوضع اللوني المناسب لبيئة عملك.",
    languageLabel: "اللغة",
    themeLabel: "الوضع",
    lightTheme: "فاتح",
    darkTheme: "داكن",

    // Home
    homeTitle: "مركز قيادة الممرض الرقمي",
    homeSubtitle: "لوحة القيادة السريرية",
    engageAI: "تشغيل المساعد الذكي",
    futuristicCareOS: "نظام رعاية مستقبلي",
    homeHeroHeading: "سير عمل متقدم مصمم للعناية الحديثة بجانب السرير.",
    homeHeroDescription: "تنقل بسلاسة بين التقييمات والإجراءات ودعم اتخاذ القرار بهوية طبية تقنية متكاملة.",
    exploreProcedures: "استعراض الإجراءات",
    viewLabIntelligence: "عرض تحليلات المختبر",
    enterWorkspace: "← دخول مساحة العمل",
    proceduralPlaybooks: "أدلة الإجراءات",
    proceduralPlaybooksDesc: "قوائم مراجعة مع تنبيهات التصعيد",
    browse: "تصفح",
    assessmentCoPilot: "مساعد التقييم",
    assessmentCoPilotDesc: "تسجيل المخاطر + مقاييس تقييم معتمدة",
    launch: "بدء",
    labIntelligence: "تحليلات المختبر",
    labIntelligenceDesc: "الفروقات الحرجة والنطاقات المتغيرة",
    review: "مراجعة",
    vascularAccess: "الوصول الوعائي",
    priority: "أولوية",
    sterileKit: "أدوات معقمة",
    neuroChecks: "فحوصات عصبية",
    protocol: "بروتوكول",
    gcsNihss: "GCS+NIHSS",
    medicationMath: "حسابات الأدوية",
    tools: "أدوات",
    titrateDrip: "معايرة وتنقيط",
    aiBedBrief: "ملخص ذكي بجانب السرير",
    aiBedBriefDesc: "ملخصات ولغة تصعيد تُنشأ تلقائيًا للمرضى المعقدين.",
    mindMapsInsight: "الخرائط الذهنية",
    mindMapsInsightDesc: "مسارات تحوّل الفوضى إلى تنظيم بصري للاجتماعات السريعة.",
    flashcardsInsight: "البطاقات التعليمية",
    flashcardsInsightDesc: "مجموعات تعلم مصغّرة مصممة للمراجعة القائمة على الأدلة.",
    vitalsStreaming: "بث العلامات الحيوية",
    fasterInterventions: "تدخلات أسرع بنسبة 12%+",
    vitalsDescription: "توثيق مبسّط، تذكيرات تلقائية لفحوصات السلامة، ودفعات تعليمية مختصرة تحافظ على تزامن الفريق بأكمله.",
    neuro: "عصبي",
    stable: "مستقر",
    hemodynamics: "ديناميكا الدم",
    responsive: "متجاوب",
    respiratory: "تنفسي",
    escalate: "تصعيد",
    labsPreview: "المختبرات",
    assessmentsPreview: "التقييمات",
    seamlessIntelligence: "ذكاء سلس",
    seamlessIntelligenceDesc: "استفد من مجموعات البيانات المنسّقة والإرشادات الحية المربوطة بجمالية الممرض الرقمي.",

    // AppLayout
    appBadge: "مساعد الممرض الرقمي",
    appSubBadge: "مرجع سريري عام · لا يتطلب تسجيل دخول",

    // Procedures
    proceduresTitle: "إجراءات التمريض – أفضل 50 معيارًا عالميًا",
    searchProcedures: "ابحث عن الإجراءات...",
    noProcedures: "لا توجد إجراءات",
    quickViewTitle: "نظرة عامة على الإجراء",
    quickViewDescription: "اطلع على الملخص أدناه أو افتح الدليل الكامل للخطوات التفصيلية.",
    viewFullProcedure: "عرض الإجراء الكامل",
    evidenceBasedWorkflows: "سير عمل قائم على الأدلة",
    clinicalTools: "أدوات سريرية",
    sourceOnDevice: "المصدر: مرجع سريري محلي",
    preProcedure: "قبل الإجراء",
    preProcedureDesc: "التحقق، الموافقة، التحضير، وقوائم المراجعة المستهدفة",
    intraProcedure: "أثناء الإجراء",
    intraProcedureDesc: "إرشادات تعقيم مباشرة + تنبيهات التصعيد",
    postProcedure: "بعد الإجراء",
    postProcedureDesc: "لوحات التعافي، التثقيف، والتوثيق",

    // Procedure detail
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
    procedureNotFound: "الإجراء غير موجود",

    // Assessments
    assessmentHubTitle: "مركز التقييمات",
    assessmentHubSubtitle: "درجات المخاطر وأدوات التقييم بجانب السرير",
    searchAssessments: "البحث في التقييمات",
    noAssessments: "لم يتم العثور على تقييمات.",
    sourceAssessmentCatalog: "المصدر: كتالوج التقييمات المحلي",

    // Calculators
    calculatorsTitle: "الحاسبات السريرية",
    calculatorsSubtitle: "أدوات الجرعات والتنقيط الذكية",
    precisionDosing: "جرعات دقيقة",
    calculatorsHeroHeading: "أدوات سلسة مصممة للمعايرة بجانب السرير.",
    calculatorsHeroDesc: "كل حاسبة تعكس هوية الممرض الرقمي بمدخلات واضحة وتباين عالٍ وتنبيهات تصعيد.",
    calculatorNotFound: "الحاسبة غير موجودة",
    dosageCalculation: "حساب الجرعة",
    dosageCalculationDesc: "حساب جرعة الدواء بناءً على الوزن",
    ivDripRate: "معدل التنقيط الوريدي",
    ivDripRateDesc: "حساب مل/ساعة ونقاط/دقيقة",
    bmiCalculator: "حاسبة مؤشر كتلة الجسم",
    bmiCalculatorDesc: "حساب مؤشر كتلة الجسم",
    creatinineClearance: "تصفية الكرياتينين",
    creatinineClearanceDesc: "حساب وظائف الكلى",
    orderedDose: "الجرعة الموصوفة (ملغ)",
    availableDose: "الجرعة المتاحة (ملغ)",
    volumeAvailable: "الحجم المتاح (مل)",
    totalVolume: "الحجم الكلي (مل)",
    timeHours: "الوقت (ساعات)",
    dropFactor: "عامل التنقيط (نقطة/مل)",
    weightKg: "الوزن (كغ)",
    heightCm: "الطول (سم)",
    ageYears: "العمر (سنوات)",
    serumCreatinine: "كرياتينين المصل (ملغ/دل)",
    sex: "الجنس",
    male: "ذكر",
    female: "أنثى",
    availableDoseError: "يجب أن تكون الجرعة المتاحة أكبر من صفر",
    administer: "أعطِ",
    timeError: "يجب أن يكون الوقت أكبر من صفر",
    rateResult: "المعدل",
    heightError: "يجب أن يكون الطول أكبر من صفر",
    underweight: "نقص الوزن",
    normalWeight: "وزن طبيعي",
    overweight: "زيادة الوزن",
    obese: "سمنة",
    creatinineError: "يجب أن يكون كرياتينين المصل أكبر من صفر",
    creatinineClearanceResult: "تصفية الكرياتينين",

    // Labs
    labsTitle: "تحليلات المختبر",
    labsSubtitle: "النطاقات الحرجة والفروقات المتغيرة",
    searchLabs: "البحث في الفحوصات أو الفئات",
    noLabs: "لم يتم العثور على فحوصات مخبرية.",
    sourceLabRef: "المصدر: مرجع مخبري محلي",
    normal: "الطبيعي",
    critical: "حرج",

    // ECG
    ecgTitle: "تفسير تخطيط القلب",
    ecgSubtitle: "الإيقاعات القلبية وموجات التخطيط",
    searchEcg: "ابحث في مصطلحات تخطيط القلب أو التعاريف أو الملاحظات السريرية",
    noEcgTerms: "لم يتم العثور على مصطلحات تخطيط قلب مطابقة للمرشحات.",
    sourceEcgRef: "المصدر: مرجع ثابت لتخطيط القلب",
    clinicalPearl: "ملاحظة سريرية",

    // Flashcards
    flashcardsTitle: "بطاقات تمريضية",
    flashcardsSubtitle: "مراجعات سريرية سريعة",
    searchFlashcards: "ابحث في الأسئلة أو الإجابات",
    tapToReveal: "اضغط لإظهار الإجابة",
    noFlashcards: "لا توجد بطاقات تطابق المرشحات الحالية.",

    // Mind Maps
    mindMapsTitle: "مكتبة الخرائط الذهنية",
    mindMapsSubtitle: "50 موضوعًا تمريضيًا ذا أولوية منظمة للمراجعة السريعة",
    searchMindMaps: "البحث بالحالة أو التركيز أو تفاصيل الفرع",
    noMindMaps: "لا توجد خرائط ذهنية تطابق البحث. جرّب كلمة مفتاحية مختلفة أو أعد تعيين المرشحات.",

    // Scale Detail
    scaleNotFound: "المقياس غير موجود",
    totalScore: "الدرجة الكلية",

    // AI Assistant
    aiTitle: "مساعد التمريض الذكي",
    aiConnectionStatus: "Gemini AI",
    aiDisclaimer: "للأغراض التعليمية فقط. يُرجى التحقق دائمًا مع متخصصي الرعاية الصحية المؤهلين.",
    aiWelcomeTitle: "مساعد التمريض الذكي",
    aiWelcomeDesc: "مدعوم بـ Google Gemini. اسأل عن الإجراءات والأدوية والسيناريوهات السريرية أو المساعدة في التوثيق.",
    aiExampleQuestionsTitle: "أسئلة مقترحة:",
    aiPlaceholder: "اطرح سؤالاً تمريضيًا... (10 رسائل/يوم)",
    aiDailyRemaining: "رسالة يومية متبقية",
    aiWarningRemaining: "متبقية اليوم",
    aiExampleQ1: "ما هي علامات تسرب السوائل الوريدية؟",
    aiExampleQ2: "اشرح آلية عمل دواء الميتفورمين",
    aiExampleQ3: "ساعدني في كتابة ملاحظة تقدم لمريض مستقر",
    aiExampleQ4: "ما هي العلامات الحيوية الطبيعية للبالغين؟",

    // Not Found
    notFoundTitle: "الصفحة غير موجودة",
    notFoundDesc: "الصفحة التي تبحث عنها غير موجودة.",
    returnHome: "العودة إلى الرئيسية",
  },
};

export const languages: { value: SupportedLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];
