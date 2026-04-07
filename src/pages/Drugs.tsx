import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Siren, GitMerge } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import drugsCatalog from "@/data/drugs-catalog.json";

const categoryStyles: Record<string, string> = {
  red: "bg-red-500/20 text-red-200 border-red-400/40",
  pink: "bg-pink-500/20 text-pink-200 border-pink-400/40",
  purple: "bg-purple-500/20 text-purple-200 border-purple-400/40",
  amber: "bg-amber-500/20 text-amber-200 border-amber-400/40",
  orange: "bg-orange-500/20 text-orange-200 border-orange-400/40",
  rose: "bg-rose-500/20 text-rose-200 border-rose-400/40",
  "red-bright": "bg-red-600/25 text-red-100 border-red-300/60",
  teal: "bg-teal-500/20 text-teal-100 border-teal-300/50",
  blue: "bg-blue-500/20 text-blue-200 border-blue-400/40",
  green: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  yellow: "bg-yellow-500/20 text-yellow-100 border-yellow-300/50",
  slate: "bg-slate-500/20 text-slate-200 border-slate-400/40",
};

const routeBadgeStyles: Record<string, string> = {
  IV: "border-cyan-300/40 bg-cyan-400/10 text-cyan-100",
  PO: "border-indigo-300/40 bg-indigo-400/10 text-indigo-100",
  IM: "border-violet-300/40 bg-violet-400/10 text-violet-100",
  SubQ: "border-fuchsia-300/40 bg-fuchsia-400/10 text-fuchsia-100",
  ET: "border-orange-300/40 bg-orange-400/10 text-orange-100",
  IO: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
};

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

const Drugs = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");

  const emergencyDrugs = useMemo(() => drugsCatalog.drugs.filter((drug) => drug.emergency), []);

  const filteredDrugs = useMemo(
    () =>
      drugsCatalog.drugs.filter((drug) => {
        const matchesCategory = selectedCategory === "ALL" || drug.category === selectedCategory;
        const needle = query.toLowerCase();
        const matchesQuery =
          drug.genericName.toLowerCase().includes(needle) ||
          drug.brandName.toLowerCase().includes(needle) ||
          drug.category.toLowerCase().includes(needle);

        return matchesCategory && matchesQuery;
      }),
    [query, selectedCategory]
  );

  const compatibilityResult = useMemo(() => {
    if (!drugA || !drugB) return null;
    if (drugA === drugB) return { type: "unknown", message: "اختر دواءين مختلفين لفحص التوافق عبر Y-site." };
    const match = drugsCatalog.ivCompatibilityMatrix.find(
      (item) =>
        (item.drugA === drugA && item.drugB === drugB) ||
        (item.drugA === drugB && item.drugB === drugA)
    );

    if (!match) {
      return { type: "unknown", message: "لا يوجد زوج مباشر في المصفوفة السريعة. يُرجى التحقق عبر قاعدة بيانات الصيدلية." };
    }

    return match.compatible
      ? { type: "compatible", message: "متوافق ✅" }
      : { type: "incompatible", message: "غير متوافق ❌" };
  }, [drugA, drugB]);

  return (
    <AppLayout title="مرجع الأدوية" subtitle="أدوية العناية المركزة والطوارئ">
      <section dir="rtl" className="rounded-3xl border border-white/10 bg-card/80 p-5 text-right shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-3 md:flex-row-reverse md:items-center md:justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-2xl bg-red-500/20 text-red-100 hover:bg-red-500/30 border border-red-400/40">
                <Siren className="ml-2" size={16} /> المرجع السريع لعربة الطوارئ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl border-white/10 bg-slate-950 text-white">
              <DialogHeader>
                <DialogTitle className="text-right">المرجع السريع لعربة الطوارئ</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {emergencyDrugs.map((drug) => (
                  <Card key={drug.id} className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-right">
                    <p className="font-semibold">{drug.genericName}</p>
                    <p className="text-xs text-muted-foreground">الطريق: {drug.routes.join(" / ")}</p>
                    <p className="text-xs text-red-100">الجرعة: {drug.emergencyDose ?? "جرعة حسب بروتوكول الطوارئ"}</p>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            دواء {filteredDrugs.length}
          </div>
        </div>

        <div className="relative mt-4">
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="...ابحث عن أدوية العناية المركزة"
            className="h-12 rounded-2xl border-white/10 bg-white/5 pr-12 text-right text-white placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {drugsCatalog.categories.map((cat) => (
            <Button
              key={cat.value}
              size="sm"
              variant="outline"
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-widest ${
                selectedCategory === cat.value
                  ? "border-primary/50 bg-primary/30 text-white"
                  : "border-white/20 text-muted-foreground"
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {categoryLabels[cat.value] ?? cat.label}
            </Button>
          ))}
        </div>
      </section>

      <section dir="rtl" className="rounded-3xl border border-white/10 bg-card/70 p-4 text-right shadow-[0_15px_50px_rgba(0,0,0,0.4)]">
        <div className="mb-3 flex items-center justify-end gap-2 text-sm text-cyan-100">
          <GitMerge size={16} /> فحص توافق الأدوية الوريدية
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Select value={drugA} onValueChange={setDrugA}>
            <SelectTrigger className="border-white/15 bg-white/5 text-right"><SelectValue placeholder="اختر الدواء الأول" /></SelectTrigger>
            <SelectContent>{drugsCatalog.drugs.map((d) => <SelectItem key={d.id} value={d.genericName}>{d.genericName}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={drugB} onValueChange={setDrugB}>
            <SelectTrigger className="border-white/15 bg-white/5 text-right"><SelectValue placeholder="اختر الدواء الثاني" /></SelectTrigger>
            <SelectContent>{drugsCatalog.drugs.map((d) => <SelectItem key={`${d.id}-b`} value={d.genericName}>{d.genericName}</SelectItem>)}</SelectContent>
          </Select>
          <div className={`rounded-2xl border p-3 text-sm ${compatibilityResult?.type === "compatible" ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100" : compatibilityResult?.type === "incompatible" ? "border-red-400/40 bg-red-500/10 text-red-100" : "border-white/10 bg-white/5 text-muted-foreground"}`}>
            {compatibilityResult?.message ?? "اختر دوائين لفحص التوافق عبر Y-site"}
          </div>
        </div>
      </section>

      <section dir="rtl" className="grid gap-4">
        {filteredDrugs.map((drug) => (
          <Card
            key={drug.id}
            className="cursor-pointer rounded-3xl border border-white/10 bg-card/70 p-5 text-white transition-all hover:-translate-y-1 hover:border-primary/40"
            onClick={() => navigate(`/drugs/${drug.id}`)}
          >
            <div className="flex flex-col gap-3 md:flex-row-reverse md:items-start md:justify-between">
              <div>
                <p className="text-xl font-semibold">{drug.genericName} <span className="text-sm font-normal text-muted-foreground">{drug.brandName ? `(${drug.brandName})` : ""}</span></p>
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <Badge className={`border ${categoryStyles[drug.categoryColor]}`}>{categoryLabels[drug.category] ?? drug.category}</Badge>
                  {drug.highAlert && <Badge className="border-red-400/50 bg-red-500/20 text-red-100">عالي الخطورة</Badge>}
                  {drug.emergency && <Badge className="border-orange-400/50 bg-orange-500/20 text-orange-100">طوارئ</Badge>}
                  {drug.hasTitrationGuide && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge className="border-cyan-400/50 bg-cyan-500/20 text-cyan-100">دليل المعايرة</Badge>
                      </DialogTrigger>
                      <DialogContent className="border-white/10 bg-slate-950 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-right">{drug.genericName} دليل المعايرة</DialogTitle>
                        </DialogHeader>
                        <ol className="list-decimal space-y-2 pr-5 text-right text-sm text-slate-100">
                          <li>تحقق من أهداف MAP/HR وخط الأساس لمؤشرات التروية.</li>
                          <li>ابدأ بالجرعة الابتدائية حسب البروتوكول عبر المضخة الذكية.</li>
                          <li>قم بالمعايرة كل 2-3 دقائق وفق الاستجابة.</li>
                          <li>أعد تقييم اللاكتات وإدرار البول والحالة الذهنية وتخطيط ECG.</li>
                          <li>وثّق المعدل النهائي وخطة التصعيد أو الخطة الاحتياطية.</li>
                        </ol>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {drug.routes.map((route) => (
                  <Badge key={route} className={`border ${routeBadgeStyles[route]}`}>{route}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </section>
    </AppLayout>
  );
};

export default Drugs;
