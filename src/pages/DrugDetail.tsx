import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import drugsCatalog from "@/data/drugs-catalog.json";

const categoryLabels: Record<string, string> = {
  ALL: "الكل",
  VASOPRESSORS: "رافعات الضغط",
  INOTROPES: "مقويات القلب",
  "SEDATION & ANALGESIA": "التهدئة والتسكين",
  ANTIARRHYTHMICS: "مضادات اضطراب النظم",
  ANTICOAGULANTS: "مضادات التخثر",
  "RSI & AIRWAY": "أدوية التنبيب",
  "CODE DRUGS": "أدوية الكود",
  "ELECTROLYTE REPLACEMENT": "تعويض الشوارد",
  ANTIHYPERTENSIVES: "خافضات الضغط",
  "ANTIDOTES & REVERSAL AGENTS": "المضادات والترياق",
  ANTIBIOTICS: "المضادات الحيوية",
  "OTHER ICU ESSENTIALS": "أساسيات العناية المركزة",
};

const DrugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const drug = useMemo(() => drugsCatalog.drugs.find((item) => item.id === id), [id]);

  if (!drug) {
    return (
      <AppLayout title="الدواء غير موجود" subtitle="خطأ في المرجع" onBack={() => navigate("/drugs")}>
        <Card className="rounded-3xl border border-white/10 bg-card/70 p-6 text-right" dir="rtl">تعذر العثور على الدواء المحدد.</Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={drug.genericName} subtitle={`النطق: ${drug.pronunciation}`} onBack={() => navigate("/drugs")}>
      <Card className="rounded-3xl border border-white/10 bg-card/80 p-5 text-right" dir="rtl">
        <div className="flex flex-wrap justify-end gap-2">
          <Badge className="border border-white/20 bg-white/5 text-white">{categoryLabels[drug.category] ?? drug.category}</Badge>
          {drug.highAlert && <Badge className="border-red-400/50 bg-red-500/20 text-red-100">عالي الخطورة</Badge>}
          {drug.emergency && <Badge className="border-orange-400/50 bg-orange-500/20 text-orange-100">طوارئ</Badge>}
          {drug.weightBased && <Badge className="border-cyan-400/50 bg-cyan-500/20 text-cyan-100">حاسبة الجرعات حسب الوزن</Badge>}
          {drug.sedationReference && <Badge className="border-purple-400/50 bg-purple-500/20 text-purple-100">مرجع RASS</Badge>}
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4" dir="rtl">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-card/60 p-2 md:grid-cols-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="dosing">الجرعات</TabsTrigger>
          <TabsTrigger value="administration">طريقة الإعطاء</TabsTrigger>
          <TabsTrigger value="nursing">التمريض</TabsTrigger>
          <TabsTrigger value="interactions">التداخلات</TabsTrigger>
          <TabsTrigger value="effects">الآثار الجانبية</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="space-y-3 rounded-3xl border border-white/10 bg-card/70 p-5 text-right">
            <p><span className="font-semibold">التصنيف:</span> {drug.overview.class}</p>
            <p><span className="font-semibold">آلية العمل:</span> {drug.overview.mechanism}</p>
            <p className="font-semibold">دواعي الاستعمال</p>
            <ul className="list-disc pr-6 text-sm text-slate-200">{drug.overview.indications.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">موانع الاستعمال</p>
            <ul className="list-disc pr-6 text-sm text-slate-200">{drug.overview.contraindications.map((item) => <li key={item}>{item}</li>)}</ul>
          </Card>
        </TabsContent>

        <TabsContent value="dosing">
          <Card className="space-y-2 rounded-3xl border border-white/10 bg-card/70 p-5 text-right text-sm">
            <p><span className="font-semibold">جرعة البالغين:</span> {drug.dosing.adultDose}</p>
            <p><span className="font-semibold">جرعة الأطفال:</span> {drug.dosing.weightBased}</p>
            <p><span className="font-semibold">جرعة دفعية:</span> {drug.dosing.bolusVsInfusion}</p>
            <p><span className="font-semibold">المعايرة:</span> {drug.dosing.titration}</p>
            {drug.dosing.titrationRange && <p><span className="font-semibold">المعايرة:</span> {drug.dosing.titrationRange}</p>}
            {drug.dosing.mapTarget && <p><span className="font-semibold">MAP Target:</span> {drug.dosing.mapTarget}</p>}
            {drug.dosing.hrTarget && <p><span className="font-semibold">HR Target:</span> {drug.dosing.hrTarget}</p>}
            <p><span className="font-semibold">تسريب مستمر:</span> {drug.dosing.target}</p>
            <p><span className="font-semibold">الجرعة القصوى:</span> {drug.dosing.maxDose}</p>
          </Card>
        </TabsContent>

        <TabsContent value="administration">
          <Card className="space-y-2 rounded-3xl border border-white/10 bg-card/70 p-5 text-right text-sm">
            <p><span className="font-semibold">سرعة التسريب:</span> {drug.administration.ivRate}</p>
            <p><span className="font-semibold">التركيز:</span> {drug.administration.concentration}</p>
            <p><span className="font-semibold">التخفيف:</span> {drug.administration.dilution}</p>
            <p><span className="font-semibold">التوافق:</span> {drug.administration.compatibility}</p>
            <p><span className="font-semibold">الثبات:</span> {drug.administration.stability}</p>
            <p><span className="font-semibold">خط مركزي/خط طرفي:</span> {drug.administration.line}</p>
          </Card>
        </TabsContent>

        <TabsContent value="nursing">
          <Card className="space-y-3 rounded-3xl border border-white/10 bg-card/70 p-5 text-right text-sm">
            <p className="font-semibold">التقييم</p>
            <ul className="list-disc pr-6">{drug.nursing.before.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">التقييم</p>
            <ul className="list-disc pr-6">{drug.nursing.during.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">التقييم</p>
            <ul className="list-disc pr-6">{drug.nursing.after.map((item) => <li key={item}>{item}</li>)}</ul>
            <p><span className="font-semibold">معايير المراقبة:</span> {drug.nursing.monitoring.join(", ")}</p>
            <p><span className="font-semibold">متى توقف الدواء / متى تبلغ الطبيب:</span> {drug.nursing.holdNotify}</p>
            <p><span className="font-semibold">تثقيف المريض:</span> {drug.nursing.titrationTriggers}</p>
            {drug.sedationReference && <p><span className="font-semibold">RASS / GCS:</span> {drug.sedationReference}</p>}
          </Card>
        </TabsContent>

        <TabsContent value="interactions">
          <Card className="space-y-3 rounded-3xl border border-white/10 bg-card/70 p-5 text-right text-sm">
            <p className="font-semibold">تداخلات دوائية</p>
            <ul className="list-disc pr-6">{drug.interactions.drugDrug.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">التوافق</p>
            <ul className="list-disc pr-6">{drug.interactions.ivIncompatibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">تداخلات غذائية</p>
            <ul className="list-disc pr-6">{drug.interactions.food.map((item) => <li key={item}>{item}</li>)}</ul>
          </Card>
        </TabsContent>

        <TabsContent value="effects">
          <Card className="space-y-3 rounded-3xl border border-white/10 bg-card/70 p-5 text-right text-sm">
            <p className="font-semibold">شائعة</p>
            <ul className="list-disc pr-6">{drug.sideEffects.common.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">خطيرة</p>
            <ul className="list-disc pr-6">{drug.sideEffects.serious.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">مهددة للحياة</p>
            <ul className="list-disc pr-6">{drug.sideEffects.lifeThreatening.map((item) => <li key={item}>{item}</li>)}</ul>
            <p><span className="font-semibold">تحذير الصندوق الأسود:</span> {drug.sideEffects.blackBox}</p>
            <p><span className="font-semibold">الترياق:</span> {drug.sideEffects.antidote}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default DrugDetail;
