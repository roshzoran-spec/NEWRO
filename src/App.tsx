import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Assessments from "./pages/Assessments";
import AssessmentFlow from "./pages/AssessmentFlow";
import AssessmentResults from "./pages/AssessmentResults";
import PatientIntake from "./pages/PatientIntake";
import AIReport from "./pages/AIReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/assessment/:id" element={<AssessmentFlow />} />
          <Route path="/assessment/:id/results" element={<AssessmentResults />} />
          <Route path="/intake" element={<PatientIntake />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
