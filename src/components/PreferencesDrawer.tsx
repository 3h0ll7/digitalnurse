import { useState } from "react";
import { Settings, Moon, Sun } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { languages, type SupportedLanguage } from "@/lib/i18n";

const PreferencesDrawer = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, theme, setTheme, t } = usePreferences();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          aria-label={t.settingsTitle}
          className="fixed bottom-24 right-4 z-50 rounded-full bg-primary text-primary-foreground p-3 shadow-card hover:shadow-card-hover transition"
        >
          <Settings size={20} />
        </button>
      </DrawerTrigger>
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

          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>
              <p className="text-sm font-medium text-card-foreground">{t.themeLabel}</p>
              <p className="text-xs text-muted-foreground">
                {theme === "light" ? t.lightTheme : t.darkTheme}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun size={18} className={theme === "light" ? "text-primary" : "text-muted-foreground"} />
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              <Moon size={18} className={theme === "dark" ? "text-primary" : "text-muted-foreground"} />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.close}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PreferencesDrawer;
