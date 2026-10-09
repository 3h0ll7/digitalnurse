import { Outlet } from "react-router-dom";
import PrimaryNav from "@/components/navigation/PrimaryNav";
import OfflineBanner from "@/components/OfflineBanner";

const SecureShell = () => (
  <div className="relative min-h-screen bg-background text-foreground">
    <OfflineBanner />
    <div className="pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <Outlet />
    </div>
    <PrimaryNav />
  </div>
);

export default SecureShell;
