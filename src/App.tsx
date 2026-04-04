import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import ParentDashboard from "./pages/ParentDashboard";
import Assessments from "./pages/Assessments";
import AssessmentFlow from "./pages/AssessmentFlow";
import AssessmentResults from "./pages/AssessmentResults";
import PatientIntake from "./pages/PatientIntake";
import AIReport from "./pages/AIReport";
import BehavioralObservation from "./pages/BehavioralObservation";
import OroMotorExam from "./pages/OroMotorExam";
import AIChatbot from "./pages/AIChatbot";
import VideoScreening from "./pages/VideoScreening";
import NotFound from "./pages/NotFound";
import Screening from "./pages/Screening";
import ScreeningQuestions from "./pages/ScreeningQuestions";
import Milestones from "./pages/Milestones";
import MilestoneQuestions from "./pages/MilestoneQuestions";
import ScreeningResults from "./pages/ScreeningResults";
import Therapy from "./pages/Therapy";
import Reports from "./pages/Reports";
import Consultation from "./pages/Consultation";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/assessment/:id" element={<AssessmentFlow />} />
        <Route path="/assessment/:id/results" element={<AssessmentResults />} />
        <Route path="/intake" element={<PatientIntake />} />
        <Route path="/assessment/:id/ai-report" element={<AIReport />} />
        <Route path="/exam/behavioral" element={<BehavioralObservation />} />
        <Route path="/exam/oro-motor" element={<OroMotorExam />} />
        <Route path="/chat" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
        <Route path="/video-screening" element={<ProtectedRoute><VideoScreening /></ProtectedRoute>} />
        
        <Route path="/screening" element={<Screening />} />
        <Route path="/screening/questions" element={<ScreeningQuestions />} />
        <Route path="/screening/result" element={<ScreeningResults />} />
        <Route path="/screening/results" element={<ScreeningResults />} />
        <Route path="/milestones" element={<ProtectedRoute><Milestones /></ProtectedRoute>} />
        <Route path="/milestones/questions" element={<ProtectedRoute><MilestoneQuestions /></ProtectedRoute>} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/consultation" element={<Consultation />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
