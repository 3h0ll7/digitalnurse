import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type SupportedLanguage } from "@/lib/i18n";

type Translation = (typeof translations)[SupportedLanguage];

export type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";
type Direction = "ltr" | "rtl";

interface PreferencesContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  direction: Direction;
  isRTL: boolean;
  t: Translation;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (typeof window === "undefined") return "dark";
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }
  const stored = window.localStorage.getItem("dn-theme") || window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }
  return "dark";
};

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return "en";
  }
  const stored = window.localStorage.getItem("dn-language") || window.localStorage.getItem("language");
  if (stored === "ar" || stored === "en") {
    return stored;
  }
  return "en";
};

const applyFontBase = () => {
  if (typeof document === "undefined") return;
  const raw = window.localStorage.getItem("dn-font-size");
  const allowed = new Set(["14", "16", "18"]);
  const px = raw && allowed.has(raw) ? raw : "16";
  document.documentElement.style.setProperty("--font-base", `${px}px`);
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(getInitialTheme()));
  const [language, setLanguage] = useState<SupportedLanguage>(getInitialLanguage);
  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  useEffect(() => {
    applyFontBase();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyTheme = () => {
      const nextResolved = resolveTheme(theme);
      setResolvedTheme(nextResolved);
      const root = document.documentElement;
      const body = document.body;
      root.classList.toggle("dark", nextResolved === "dark");
      body.classList.toggle("dark", nextResolved === "dark");
      root.classList.toggle("light", nextResolved === "light");
      body.classList.toggle("light", nextResolved === "light");
      root.dataset.theme = nextResolved;
      body.dataset.theme = nextResolved;
      root.style.colorScheme = nextResolved;
    };

    applyTheme();
    window.localStorage.setItem("dn-theme", theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onThemeChange = () => {
      if (theme === "auto") applyTheme();
    };
    media.addEventListener("change", onThemeChange);

    return () => media.removeEventListener("change", onThemeChange);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;
    root.lang = language;
    root.dir = direction;
    body.lang = language;
    body.dir = direction;
    root.classList.toggle("rtl", isRTL);
    body.classList.toggle("rtl", isRTL);
    window.localStorage.setItem("dn-language", language);
  }, [language, direction, isRTL]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      language,
      setLanguage,
      direction,
      isRTL,
      t: translations[language],
    }),
    [theme, resolvedTheme, language, direction, isRTL],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
