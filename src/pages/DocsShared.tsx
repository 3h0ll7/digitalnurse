import { useEffect, useMemo, useState } from "react";
import docsI18n from "@/data/docs-i18n.json";
import { usePreferences } from "@/contexts/PreferencesContext";

export type DocsDictionary = (typeof docsI18n)["en"];

export const useDocsI18n = () => {
  const { language, direction } = usePreferences();
  const copy = useMemo(() => docsI18n[language], [language]);
  return { copy, language, direction };
};

export const useAutosaveDoc = <T,>(key: string, initial: T) => {
  const storageKey = `docs-hub:${key}`;
  const [data, setData] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : initial;
  });
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(data));
      setLastSavedAt(new Date().toLocaleTimeString());
    }, 30000);
    return () => window.clearInterval(id);
  }, [data, storageKey]);

  const saveNow = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
    setLastSavedAt(new Date().toLocaleTimeString());
  };

  const clear = () => {
    window.localStorage.removeItem(storageKey);
    setData(initial);
    setLastSavedAt(null);
  };

  return { data, setData, lastSavedAt, saveNow, clear };
};

export const exportTextFile = (name: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};
