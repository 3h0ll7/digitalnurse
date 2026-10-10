import { RotateCcw } from "lucide-react";

const TEXT = {
  en: { title: "Something went wrong", body: "The page hit an unexpected error. Reloading usually fixes it.", reload: "Reload" },
  ar: { title: "صار خطأ غير متوقع", body: "الصفحة واجهت خطأ. إعادة التحميل عادة تحل المشكلة.", reload: "إعادة التحميل" },
} as const;

/** Rendered outside PreferencesProvider, so it reads the saved language itself. */
const savedLanguage = (): keyof typeof TEXT => {
  try {
    return window.localStorage.getItem("language") === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
};

const ErrorFallback = ({ message, language = typeof window === "undefined" ? "en" : savedLanguage() }: { message?: string; language?: keyof typeof TEXT }) => {
  const tx = TEXT[language];
  return (
    <main dir={language === "ar" ? "rtl" : "ltr"} lang={language} className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div role="alert" className="w-full max-w-md space-y-3 rounded-3xl border bg-card p-6 text-center shadow-card">
        <h1 className="text-xl font-semibold">{tx.title}</h1>
        <p className="text-sm text-muted-foreground">{tx.body}</p>
        {message && (
          <p dir="ltr" className="break-words rounded-xl bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground">
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw size={16} aria-hidden="true" />
          {tx.reload}
        </button>
      </div>
    </main>
  );
};

export default ErrorFallback;
