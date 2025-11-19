import { Outlet } from "react-router-dom";
import PrimaryNav from "@/components/navigation/PrimaryNav";

const SecureShell = () => (
  <div className="relative min-h-screen bg-[#04070f] text-white">
    <div className="pt-8 pb-[120px]">
      <Outlet />
    </div>
    <PrimaryNav />
  </div>
);

export default SecureShell;
