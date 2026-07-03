import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Brain, ChevronRight,
  CheckCircle2, AlertTriangle, XCircle,
  Loader2, ShieldAlert, Sparkles,
  Activity, MessageCircle, Users, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { getQuestionsForAge, Milestone } from "@/utils/milestoneData";
import { saveMilestoneAnswers } from "@/hooks/useMilestoneScores";

const DOMAIN_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  speech:    { label: "Speech & Language", icon: MessageCircle, color: "text-blue-500",    bg: "bg-blue-500"    },
  motor:     { label: "Motor Skills",      icon: Activity,      color: "text-emerald-500", bg: "bg-emerald-500" },
  social:    { label: "Social Skills",     icon: Users,         color: "text-purple-500",  bg: "bg-purple-500"  },
  cognitive: { label: "Cognitive Skills",  icon: Lightbulb,     color: "text-amber-500",   bg: "bg-amber-500"   },
};

const MilestoneQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Expect age in months passed via navigation state
  const ageMonths: number = (location.state as any)?.ageMonths ?? 24;
  const childName: string = (location.state as any)?.childName ?? "Your Child";
  const childId: string = (location.state as any)?.childId ?? "";

  const questions = getQuestionsForAge(ageMonths);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [analyzing, setAnalyzing] = useState(false);

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Domain breakdown for the progress sidebar
  const domains = ["speech", "motor", "social", "cognitive"] as const;
  const domainCounts = domains.map((d) => ({
    domain: d,
    total: questions.filter((q) => q.domain === d).length,
    answered: Object.keys(answers).filter((id) => questions.find((q) => q.id === id && q.domain === d)).length,
  }));

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setAnalyzing(true);
      // Persist answers to localStorage so Dashboard and Milestones page can read them
      if (childId) saveMilestoneAnswers(childId, newAnswers);
      setTimeout(() => {
        navigate("/milestones", { state: { answers: newAnswers, ageMonths, childName, childId } });
      }, 1800);
    }
  };

  if (analyzing) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-newro flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-white/60 backdrop-blur-xl p-12 rounded-[2rem] border border-white/40 shadow-glow text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center shadow-glow mb-8 text-white">
              <Brain className="w-10 h-10 animate-pulse" />
            </div>
            <h2 className="font-display font-black text-3xl mb-3 text-foreground tracking-tight">AI is calculating...</h2>
            <p className="text-muted-foreground font-bold text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Building {childName}'s developmental profile
            </p>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  if (!question) return null;

  const meta = DOMAIN_META[question.domain];
  const DomainIcon = meta.icon;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-newro flex flex-col font-sans relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-ai-purple/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Sticky Header */}
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-white/40 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={() => navigate("/milestones")}
              className="text-muted-foreground hover:text-foreground flex items-center text-xs font-black uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Exit
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-black text-foreground uppercase tracking-tighter text-sm">
                Newro Milestone AI
              </span>
            </div>
            <div className="text-xs font-black text-primary/60 text-right">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-ai-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 flex gap-8 relative z-10">
          {/* Left: Domain Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 w-52 pt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Domain Progress</p>
            {domainCounts.map((d) => {
              const m = DOMAIN_META[d.domain];
              const Icon = m.icon;
              const pct = d.total > 0 ? Math.round((d.answered / d.total) * 100) : 0;
              const isActive = question.domain === d.domain;
              return (
                <div
                  key={d.domain}
                  className={`p-4 rounded-2xl border transition-all ${isActive ? "border-primary/30 bg-primary/5 shadow-glow-soft" : "border-white/60 bg-white/30"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={m.color} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{m.label.split(" ")[0]}</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${m.bg}`}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground mt-1">{d.answered}/{d.total} done</p>
                </div>
              );
            })}
          </aside>

          {/* Center: Question area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-10"
                >
                  {/* Domain badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border ${meta.color} bg-white/50 border-white/60`}>
                    <DomainIcon size={12} />
                    {meta.label}
                  </div>

                  {/* Emoji */}
                  {question.emoji && (
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="text-6xl mb-6"
                    >
                      {question.emoji}
                    </motion.div>
                  )}

                  {/* Question text */}
                  <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-black mb-4 text-foreground leading-snug tracking-tight">
                    {question.question}
                  </h1>

                  {/* Age context */}
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Expected around {question.minAge}–{question.maxAge} months old
                  </p>

                  {/* Critical badge */}
                  {question.isCritical && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest border border-rose-500/20">
                      <ShieldAlert className="w-3 h-3" /> Key Developmental Milestone
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Answer Buttons */}
              <div className="grid grid-cols-1 gap-4 w-full">
                <Button
                  onClick={() => handleAnswer(1)}
                  variant="outline"
                  className="h-20 rounded-2xl border-2 border-border bg-white/50 hover:border-emerald-500 hover:bg-emerald-50 text-lg font-black flex justify-between px-8 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span>Yes, consistently</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-emerald-500" />
                </Button>

                <Button
                  onClick={() => handleAnswer(0.5)}
                  variant="outline"
                  className="h-20 rounded-2xl border-2 border-border bg-white/50 hover:border-amber-500 hover:bg-amber-50 text-lg font-black flex justify-between px-8 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <span>Sometimes / Emerging</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-amber-500" />
                </Button>

                <Button
                  onClick={() => handleAnswer(0)}
                  variant="outline"
                  className="h-20 rounded-2xl border-2 border-border bg-white/50 hover:border-rose-500 hover:bg-rose-50 text-lg font-black flex justify-between px-8 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <span>Not yet</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-rose-500" />
                </Button>
              </div>

              <p className="text-center mt-8 text-xs text-muted-foreground font-bold px-8 uppercase tracking-widest">
                Answer based on {childName}'s current behavior. You can update this anytime.
              </p>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default MilestoneQuestions;
