import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
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
import Labs from "./pages/Labs";
import Assessments from "./pages/Assessments";
import MindMaps from "./pages/MindMaps";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import SecureShell from "./components/layout/SecureShell";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PreferencesProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<SecureShell />}>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
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
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <PreferencesDrawer />
        </AuthProvider>
      </PreferencesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
