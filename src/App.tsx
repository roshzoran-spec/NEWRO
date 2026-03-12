import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ParentDashboard from "./pages/ParentDashboard";
import Assessments from "./pages/Assessments";
import AssessmentFlow from "./pages/AssessmentFlow";
import AssessmentResults from "./pages/AssessmentResults";
import PatientIntake from "./pages/PatientIntake";
import AIReport from "./pages/AIReport";
import MilestoneTracker from "./pages/MilestoneTracker";
import BehavioralObservation from "./pages/BehavioralObservation";
import OroMotorExam from "./pages/OroMotorExam";
import AIChatbot from "./pages/AIChatbot";
import VideoScreening from "./pages/VideoScreening";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/assessment/:id" element={<AssessmentFlow />} />
            <Route path="/assessment/:id/results" element={<AssessmentResults />} />
            <Route path="/intake" element={<PatientIntake />} />
            <Route path="/assessment/:id/ai-report" element={<AIReport />} />
            <Route path="/milestones" element={<ProtectedRoute><MilestoneTracker /></ProtectedRoute>} />
            <Route path="/exam/behavioral" element={<BehavioralObservation />} />
            <Route path="/exam/oro-motor" element={<OroMotorExam />} />
            <Route path="/chat" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
            <Route path="/video-screening" element={<ProtectedRoute><VideoScreening /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
