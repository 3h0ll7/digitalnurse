import { Moon, Sun, SunMoon } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { languages, type SupportedLanguage } from "@/lib/i18n";
import type { ThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";

const PreferencesDrawer = () => {
  const { language, setLanguage, themeMode, setThemeMode, preferencesOpen, setPreferencesOpen, t } = usePreferences();

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: "auto", label: t.autoTheme, icon: SunMoon },
    { mode: "light", label: t.lightTheme, icon: Sun },
    { mode: "dark", label: t.darkTheme, icon: Moon },
  ];

  return (
    <Drawer open={preferencesOpen} onOpenChange={setPreferencesOpen}>
      <DrawerContent className="p-0">
        <DrawerHeader className="text-start">
          <DrawerTitle>{t.settingsTitle}</DrawerTitle>
          <DrawerDescription>{t.settingsDescription}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-card-foreground">{t.languageLabel}</p>
            <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-card-foreground">{t.themeLabel}</p>
            <div role="group" aria-label={t.themeLabel} className="grid grid-cols-3 gap-1 rounded-2xl border bg-muted/40 p-1">
              {themeOptions.map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={themeMode === mode}
                  onClick={() => setThemeMode(mode)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    themeMode === mode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="outline" onClick={() => setPreferencesOpen(false)}>
            {t.close}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PreferencesDrawer;
