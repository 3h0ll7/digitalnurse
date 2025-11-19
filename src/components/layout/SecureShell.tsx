import { Outlet } from "react-router-dom";
import SystemStatusBar from "@/components/layout/SystemStatusBar";
import PrimaryNav from "@/components/navigation/PrimaryNav";

const SecureShell = () => (
  <div className="relative min-h-screen bg-[#04070f] text-white">
    <SystemStatusBar />
    <div className="pt-28 pb-[120px]">
      <Outlet />
    </div>
    <PrimaryNav />
  </div>
);

export default SecureShell;
