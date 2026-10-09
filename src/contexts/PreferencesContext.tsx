import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type SupportedLanguage } from "@/lib/i18n";
import { THEME_COLOR, parseStoredTheme, resolveTheme, type ResolvedTheme, type ThemeMode } from "@/lib/theme";

type Translation = (typeof translations)[SupportedLanguage];

type Direction = "ltr" | "rtl";

interface PreferencesContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: ResolvedTheme;
  toggleTheme: () => void;
  preferencesOpen: boolean;
  setPreferencesOpen: (open: boolean) => void;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  direction: Direction;
  isRTL: boolean;
  t: Translation;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const AUTO_THEME_TICK_MS = 60_000;

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "auto";
  }
  try {
    return parseStoredTheme(window.localStorage.getItem("theme"));
  } catch {
    return "auto";
  }
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

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [now, setNow] = useState(() => new Date());
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const theme = resolveTheme(themeMode, now);
  const [language, setLanguage] = useState<SupportedLanguage>(getInitialLanguage);
  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  useEffect(() => {
    if (themeMode !== "auto" || typeof window === "undefined") return;
    const tick = () => setNow(new Date());
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    tick();
    const interval = window.setInterval(tick, AUTO_THEME_TICK_MS);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [themeMode]);

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
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem("theme", themeMode);
    } catch {
      // Storage can be unavailable (private mode); the in-memory choice still applies.
    }
  }, [themeMode]);

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
      themeMode,
      setThemeMode,
      theme,
      toggleTheme: () => setThemeMode(theme === "light" ? "dark" : "light"),
      preferencesOpen,
      setPreferencesOpen,
      language,
      setLanguage,
      direction,
      isRTL,
      t: translations[language],
    }),
    [themeMode, theme, preferencesOpen, language, direction, isRTL],
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
