import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";

const PreferencesDrawer = () => {
  const navigate = useNavigate();
  const { language } = usePreferences();

  return (
    <button
      aria-label={language === "ar" ? "الإعدادات" : "Settings"}
      onClick={() => navigate("/settings")}
      className="fixed bottom-24 right-4 z-50 rounded-full bg-primary text-primary-foreground p-3 shadow-card hover:shadow-card-hover transition"
    >
      <Settings size={20} />
    </button>
  );
};

export default PreferencesDrawer;
