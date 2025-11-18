import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Procedures from "./pages/Procedures";
import ProcedureDetail from "./pages/ProcedureDetail";
import Calculators from "./pages/Calculators";
import CalculatorDetail from "./pages/CalculatorDetail";
import AIAssistant from "./pages/AIAssistant";
import Flashcards from "./pages/Flashcards";
import ScaleDetail from "./pages/ScaleDetail";
import NotFound from "./pages/NotFound";
import PreferencesDrawer from "./components/PreferencesDrawer";
import { PreferencesProvider } from "./contexts/PreferencesContext";
import PrimaryNav from "./components/navigation/PrimaryNav";
import Labs from "./pages/Labs";
import Assessments from "./pages/Assessments";
import MindMaps from "./pages/MindMaps";

const AppShell = () => (
  <>
    <Outlet />
    <PrimaryNav />
  </>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PreferencesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/procedures" replace />} />
              <Route path="/procedures" element={<Procedures />} />
              <Route path="/procedure/:id" element={<ProcedureDetail />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/calculator/:id" element={<CalculatorDetail />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/mind-maps" element={<MindMaps />} />
              <Route path="/scale/:id" element={<ScaleDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <PreferencesDrawer />
      </PreferencesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
