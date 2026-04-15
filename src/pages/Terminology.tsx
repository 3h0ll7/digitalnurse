import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/contexts/PreferencesContext";
import termsData from "@/data/medical-terms.json";

type Category = {
  key: string;
  name_en: string;
  name_ar: string;
  color: string;
};

type MedicalTerm = {
  id: string;
  term_en: string;
  term_ar: string;
  pronunciation: string;
  roots: string;
  roots_ar: string;
  definition_en: string;
  definition_ar: string;
  example_en: string;
  example_ar: string;
  category: string;
  related: string[];
  clinical_context_en: string;
  clinical_context_ar: string;
  memory_tip_en: string;
  memory_tip_ar: string;
};

const categories = termsData.categories as Category[];
const terms = termsData.terms as MedicalTerm[];
const FAVORITES_KEY = "dn-terminology-favorites";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const colorMap: Record<string, string> = {
  red: "border-red-400/40 bg-red-500/15 text-red-100",
  blue: "border-blue-400/40 bg-blue-500/15 text-blue-100",
  gold: "border-amber-300/40 bg-amber-500/15 text-amber-100",
  green: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
  yellow: "border-yellow-300/40 bg-yellow-500/15 text-yellow-100",
  orange: "border-orange-400/40 bg-orange-500/15 text-orange-100",
  purple: "border-purple-400/40 bg-purple-500/15 text-purple-100",
  pink: "border-pink-400/40 bg-pink-500/15 text-pink-100",
  teal: "border-teal-400/40 bg-teal-500/15 text-teal-100",
  slate: "border-slate-400/40 bg-slate-500/15 text-slate-100",
};

const seededIndex = (length: number) => {
  const now = new Date();
  const seed = Number(`${now.getUTCFullYear()}${now.getUTCMonth() + 1}${now.getUTCDate()}`);
  return seed % length;
};

const Terminology = () => {
  const { language } = usePreferences();
  const isArabic = language === "ar";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [tab, setTab] = useState<"all" | "favorites">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(FAVORITES_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setFavorites(parsed);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const activeTerms = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const baseList = tab === "favorites" ? terms.filter((term) => favorites.includes(term.id)) : terms;

    return baseList.filter((term) => {
      const matchesCategory = category === "ALL" || term.category === category;
      const matchesSearch =
        !needle ||
        term.term_en.toLowerCase().includes(needle) ||
        term.term_ar.toLowerCase().includes(needle) ||
        term.definition_en.toLowerCase().includes(needle) ||
        term.definition_ar.toLowerCase().includes(needle) ||
        term.category.toLowerCase().includes(needle);
      return matchesCategory && matchesSearch;
    });
  }, [query, category, tab, favorites]);

  const termOfDay = terms[seededIndex(terms.length)];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const jumpToLetter = (letter: string) => {
    const hit = activeTerms.find((term) => term.term_en.toUpperCase().startsWith(letter));
    if (!hit) return;
    const element = document.getElementById(`term-${hit.id}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppLayout
      title={isArabic ? "المصطلحات الطبية" : "Medical Terminology"}
      subtitle={isArabic ? "500 مصطلح سريري في 10 تخصصات" : "500 CLINICAL TERMS ACROSS 10 SPECIALTIES"}
    >
      <section className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{isArabic ? "مصطلح اليوم" : "Term of the Day"}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{termOfDay.term_en}</h2>
          <p className="text-sm text-cyan-100">{termOfDay.term_ar}</p>
          <p className="mt-2 text-sm text-slate-200">{isArabic ? termOfDay.definition_ar : termOfDay.definition_en}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary rtl:left-auto rtl:right-4" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                isArabic
                  ? "ابحث بالإنجليزية أو العربية أو التعريف أو الفئة..."
                  : "Search by EN/AR term, definition, or category..."
              }
              className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 rtl:pl-4 rtl:pr-12"
            />
          </div>
          <Button variant={tab === "all" ? "default" : "outline"} onClick={() => setTab("all")} className="rounded-full">
            {isArabic ? "كل المصطلحات" : "All Terms"}
          </Button>
          <Button variant={tab === "favorites" ? "default" : "outline"} onClick={() => setTab("favorites")} className="rounded-full">
            {isArabic ? "مصطلحاتي" : "My Terms"}
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{isArabic ? `${activeTerms.length} من 500 مصطلح` : `${activeTerms.length} of 500 terms`}</span>
          <span>{isArabic ? `${favorites.length} مفضلة` : `${favorites.length} favorites`}</span>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <Button
            size="sm"
            variant={category === "ALL" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setCategory("ALL")}
          >
            {isArabic ? "الكل" : "ALL"}
          </Button>
          {categories.map((item) => (
            <Button
              key={item.key}
              size="sm"
              variant={category === item.key ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => setCategory(item.key)}
            >
              {isArabic ? item.name_ar : item.name_en}
            </Button>
          ))}
        </div>
      </section>

      <section className="relative">
        <div className="fixed right-1 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-white/10 bg-card/70 p-2 backdrop-blur md:flex">
          {LETTERS.map((letter) => (
            <button
              key={letter}
              className="h-5 w-5 rounded text-[10px] text-muted-foreground hover:bg-white/10 hover:text-white"
              onClick={() => jumpToLetter(letter)}
              aria-label={`Jump to ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {activeTerms.map((term) => {
            const categoryInfo = categories.find((item) => item.key === term.category);
            const isOpen = expanded === term.id;
            const isFavorite = favorites.includes(term.id);

            return (
              <Card
                key={term.id}
                id={`term-${term.id}`}
                className="rounded-3xl border border-white/10 bg-card/70 p-4 transition-all hover:border-primary/40"
              >
                <button className="w-full text-start" onClick={() => setExpanded(isOpen ? null : term.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{term.term_en}</h3>
                      <p className="text-sm text-cyan-100">{term.term_ar}</p>
                      <p className="text-xs text-muted-foreground">/{term.pronunciation}/</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`border ${colorMap[categoryInfo?.color ?? "slate"]}`}>
                        {isArabic ? categoryInfo?.name_ar : categoryInfo?.name_en}
                      </Badge>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(term.id);
                        }}
                        className="rounded-xl border border-white/15 bg-white/5 p-2 text-muted-foreground hover:text-white"
                        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                      >
                        {isFavorite ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-100">{isArabic ? term.definition_ar : term.definition_en}</p>
                  <p className="mt-2 text-sm text-slate-300">{isArabic ? term.example_ar : term.example_en}</p>
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100">
                    <p><span className="text-cyan-100">{isArabic ? "الجذور" : "Etymology / Roots"}:</span> {isArabic ? term.roots_ar : term.roots}</p>
                    <p><span className="text-cyan-100">{isArabic ? "السياق السريري" : "Clinical Context"}:</span> {isArabic ? term.clinical_context_ar : term.clinical_context_en}</p>
                    <p><span className="text-cyan-100">{isArabic ? "مرادفات/مصطلحات ذات صلة" : "Related Terms"}:</span> {term.related.join(", ")}</p>
                    <p><span className="text-cyan-100">{isArabic ? "تلميح للتذكر" : "Memory Tip"}:</span> {isArabic ? term.memory_tip_ar : term.memory_tip_en}</p>
                  </div>
                )}
              </Card>
            );
          })}

          {activeTerms.length === 0 && (
            <Card className="rounded-2xl border border-dashed border-white/20 bg-card/50 p-8 text-center text-muted-foreground">
              {isArabic ? "لا توجد نتائج مطابقة" : "No matching terms"}
            </Card>
          )}
        </div>
      </section>
    </AppLayout>
  );
};

export default Terminology;
