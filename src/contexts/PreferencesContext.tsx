import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, type SupportedLanguage } from "@/lib/i18n";

type Translation = (typeof translations)[SupportedLanguage];

type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

interface PreferencesContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  direction: Direction;
  isRTL: boolean;
  t: Translation;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return "en";
  }
  const stored = window.localStorage.getItem("language");
  if (stored === "ar" || stored === "en") {
    return stored;
  }
  return "en";
};

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [language, setLanguage] = useState<SupportedLanguage>(getInitialLanguage);
  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle("dark", theme === "dark");
    body.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    body.classList.toggle("light", theme === "light");
    root.dataset.theme = theme;
    body.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
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
    window.localStorage.setItem("language", language);
  }, [language, direction, isRTL]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
      language,
      setLanguage,
      direction,
      isRTL,
      t: translations[language],
    }),
    [theme, language, direction, isRTL],
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
