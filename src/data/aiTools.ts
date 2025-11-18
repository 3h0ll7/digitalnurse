export interface AIToolLink {
  label: string;
  url: string;
}

export interface AITool {
  name: string;
  description: string;
  links: AIToolLink[];
}

export interface AIToolCategory {
  name: string;
  tagline: string;
  tools: AITool[];
}

export const aiToolCategories: AIToolCategory[] = [
  {
    name: "Clinical Decision Support",
    tagline: "Differentials, escalation cues, and bedside synthesis.",
    tools: [
      {
        name: "ClinicalKey AI",
        description: "توصيات سريرية دقيقة",
        links: [{ label: "Open", url: "https://www.elsevier.com/clinicalkey" }],
      },
      {
        name: "UpToDate AI",
        description: "بحث علاجي لحظي",
        links: [{ label: "Open", url: "https://www.uptodate.com" }],
      },
      {
        name: "Glass AI",
        description: "تحليل حالة وتشخيص تفريقي",
        links: [{ label: "Open", url: "https://glass.health" }],
      },
    ],
  },
  {
    name: "Medication Safety",
    tagline: "Dose calculators, titration support, and therapeutic insight.",
    tools: [
      {
        name: "SafeDose AI",
        description: "حساب جرعات دقيقة",
        links: [{ label: "Open", url: "https://www.safedose.com" }],
      },
      {
        name: "MedPaLM",
        description: "ذكاء طبي من Google",
        links: [{ label: "Open", url: "https://health.google" }],
      },
    ],
  },
  {
    name: "Nursing Procedures",
    tagline: "Immersive guidance for complex skill execution.",
    tools: [
      {
        name: "Elsevier Skills AI",
        description: "خطوات بروسيجر محوسبة",
        links: [{ label: "Open", url: "https://www.elsevier.com/solutions/clinical-skills" }],
      },
      {
        name: "SimX VR",
        description: "محاكاة تمريض حرجة",
        links: [{ label: "Open", url: "https://www.simxar.com" }],
      },
    ],
  },
  {
    name: "Documentation & Notes",
    tagline: "Hands-free charting and nuanced narrative capture.",
    tools: [
      {
        name: "DAX Copilot",
        description: "ملخص ملاحظات تلقائي",
        links: [{ label: "Open", url: "https://www.nuance.com/dax" }],
      },
      {
        name: "Nabla Copilot",
        description: "كتابة تقييمات سريرية",
        links: [{ label: "Open", url: "https://www.nabla.com" }],
      },
    ],
  },
  {
    name: "Lab Interpretation",
    tagline: "AI-explained diagnostics, trending, and risk framing.",
    tools: [
      {
        name: "PathAI",
        description: "تحليل مخبري وpathology",
        links: [{ label: "Open", url: "https://www.pathai.com" }],
      },
      {
        name: "Corti AI",
        description: "تفسير العلامات الحيوية",
        links: [{ label: "Open", url: "https://www.corti.ai" }],
      },
    ],
  },
  {
    name: "Early Warning Systems",
    tagline: "Predictive surveillance for subtle deterioration.",
    tools: [
      {
        name: "CLEW Medical",
        description: "توقع التدهور",
        links: [{ label: "Open", url: "https://clewmed.com" }],
      },
      {
        name: "VitalsAI",
        description: "تحليل فوري للـ vitals",
        links: [{ label: "Open", url: "https://vitala.ai" }],
      },
    ],
  },
  {
    name: "Education & Training",
    tagline: "Adaptive instruction and immersive anatomy refreshers.",
    tools: [
      {
        name: "Lecturio AI Tutor",
        description: "تعليم ومحاكاة",
        links: [{ label: "Open", url: "https://www.lecturio.com" }],
      },
      {
        name: "Anatomy.app",
        description: "تشريح 3D وتقييم",
        links: [{ label: "Open", url: "https://anatomy.app" }],
      },
    ],
  },
  {
    name: "Workflow Optimization",
    tagline: "Automation, delegation, and shift intelligence.",
    tools: [
      {
        name: "Notable AI",
        description: "أتمتة مهام التمريض",
        links: [{ label: "Open", url: "https://www.notablehealth.com" }],
      },
      {
        name: "Slack/Teams AI",
        description: "تلخيص الشفتات",
        links: [
          { label: "Slack", url: "https://slack.com" },
          { label: "Teams", url: "https://teams.microsoft.com" },
        ],
      },
    ],
  },
];
