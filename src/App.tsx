import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Procedures from "./pages/Procedures";
import ProcedureDetail from "./pages/ProcedureDetail";
import Calculators from "./pages/Calculators";
import CalculatorDetail from "./pages/CalculatorDetail";
import AIAssistant from "./pages/AIAssistant";
import Reference from "./pages/Reference";
import ScaleDetail from "./pages/ScaleDetail";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/procedures" replace />} />
          <Route path="/procedures" element={<><Procedures /><BottomNav /></>} />
          <Route path="/procedure/:id" element={<><ProcedureDetail /><BottomNav /></>} />
          <Route path="/calculators" element={<><Calculators /><BottomNav /></>} />
          <Route path="/calculator/:id" element={<><CalculatorDetail /><BottomNav /></>} />
          <Route path="/ai-assistant" element={<><AIAssistant /><BottomNav /></>} />
          <Route path="/reference" element={<><Reference /><BottomNav /></>} />
          <Route path="/scale/:id" element={<><ScaleDetail /><BottomNav /></>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
