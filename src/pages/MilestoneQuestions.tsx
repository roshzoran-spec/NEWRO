import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Brain, ChevronRight, 
  CheckCircle2, AlertTriangle, XCircle,
  Loader2, ShieldAlert, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { MILESTONE_QUESTIONS, Milestone } from "@/utils/milestoneData";

const MilestoneQuestions = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [regressionDetected, setRegressionDetected] = useState(false);

  const question = MILESTONE_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / MILESTONE_QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    
    // Simple Regression Check (Mock Logic)
    // If a critical milestone is "Not Yet" but user previously marked something else? 
    // For now, let's just simulate a regression alert if they answer "Not Yet" to a critical one that they are well over the age for.
    if (value === 0 && question.isCritical) {
      // In a real app, we'd compare with DB. Here we just flag it for the results.
    }

    if (currentIndex < MILESTONE_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAnalyzing(true);
      setTimeout(() => {
        // Calculate and redirect to dashboard with new data (simulated)
        navigate("/milestones");
      }, 800);
    }
  };

  if (analyzing) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-newro flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-white/60 backdrop-blur-xl p-12 rounded-[2rem] border border-white/40 shadow-glow"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-cta flex items-center justify-center shadow-glow mb-8 animate-pulse text-white">
              <Brain className="w-10 h-10" />
            </div>
            <h2 className="font-display font-bold text-3xl mb-4 text-foreground text-center tracking-tight">AI is recalculating...</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Updating developmental trajectory
            </p>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
        
        {/* Header */}
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => navigate("/milestones")} className="text-muted-foreground hover:text-foreground flex items-center text-xs font-bold transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> EXIT
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-black text-foreground uppercase tracking-tighter">Newro Milestone AI</span>
            </div>
            <div className="w-12 text-xs font-black text-primary/40 text-right">{currentIndex + 1}/{MILESTONE_QUESTIONS.length}</div>
          </div>
          <div className="w-full h-1.5 bg-muted">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-ai-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </header>

        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-ai-purple/5 rounded-full blur-[120px] pointer-events-none" />

        <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center relative z-10">
          <div className="w-full max-w-2xl">
            
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">
                Domain: {question.domain.replace("-", " ")}
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-foreground leading-tight">
                {question.question}
              </h1>
              {question.isCritical && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest border border-rose-500/20">
                  <ShieldAlert className="w-3 h-3" /> Critical Milestone
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 gap-4 w-full">
              <Button 
                onClick={() => handleAnswer(1)}
                variant="outline"
                className="h-20 rounded-2xl border-2 border-border bg-white/50 hover:border-emerald-500 hover:bg-emerald-50 text-xl font-bold flex justify-between px-8 group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span>Yes</span>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-emerald-500" />
              </Button>

              <Button 
                onClick={() => handleAnswer(0.5)}
                variant="outline"
                className="h-20 rounded-2xl border-2 border-border bg-white/50 hover:border-amber-500 hover:bg-amber-50 text-xl font-bold flex justify-between px-8 group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <span>Sometimes</span>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-amber-500" />
              </Button>

              <Button 
                onClick={() => handleAnswer(0)}
                variant="outline"
                className="h-20 rounded-2xl border-2 border-border bg-white/50 hover:border-rose-500 hover:bg-rose-50 text-xl font-bold flex justify-between px-8 group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <span>Not Yet</span>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-rose-500" />
              </Button>
            </div>

            <p className="text-center mt-12 text-xs text-muted-foreground font-light px-8">
              Answer based on your child's current behavior. If unsure, you can update this later in the dashboard.
            </p>

          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default MilestoneQuestions;
