import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  TrendingUp, Award, AlertCircle, Brain,
  MessageSquare, Activity, Users, Lightbulb,
  ChevronRight, Calendar, ArrowUpRight, Baby,
  Loader2, Sparkles, BarChart2, Zap
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getQuestionsForAge } from "@/utils/milestoneData";
import { PageTransition } from "@/components/PageTransition";
import MilestoneGraph from "@/components/milestones/MilestoneGraph";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { differenceInMonths } from "date-fns";

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
}

type DomainScore = { domain: string; score: number; status: "On Track" | "Monitor" | "Needs Attention" };

const DOMAIN_CONFIG = [
  { id: "speech",    name: "Speech & Language", icon: MessageSquare, color: "text-blue-500",    bg: "bg-blue-500",    glow: "shadow-blue-500/20"    },
  { id: "motor",     name: "Motor Skills",      icon: Activity,      color: "text-emerald-500", bg: "bg-emerald-500", glow: "shadow-emerald-500/20" },
  { id: "social",    name: "Social Skills",     icon: Users,         color: "text-purple-500",  bg: "bg-purple-500",  glow: "shadow-purple-500/20"  },
  { id: "cognitive", name: "Cognitive Skills",  icon: Lightbulb,     color: "text-amber-500",   bg: "bg-amber-500",   glow: "shadow-amber-500/20"   },
];

/**
 * Derive domain scores from milestone question answers
 * answers: { [questionId]: 0 | 0.5 | 1 }
 * questions: list of all questions used
 */
const computeDomainScores = (
  answers: Record<string, number>,
  questions: Array<{ id: string; domain: string }>
): DomainScore[] => {
  return DOMAIN_CONFIG.map(({ id }) => {
    const dqs = questions.filter((q) => q.domain === id);
    if (dqs.length === 0) return { domain: id, score: 75, status: "On Track" };
    const total = dqs.reduce((sum, q) => sum + (answers[q.id] ?? 0.75), 0);
    const pct = Math.round((total / dqs.length) * 100);
    const status: "On Track" | "Monitor" | "Needs Attention" =
      pct >= 75 ? "On Track" : pct >= 50 ? "Monitor" : "Needs Attention";
    return { domain: id, score: pct, status };
  });
};

const statusBadgeClass = (s: string) =>
  s === "On Track"
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    : s === "Monitor"
    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
    : "bg-rose-500/10 text-rose-600 border-rose-500/20";

const Milestones = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  // Accept answers passed back from MilestoneQuestions
  const incomingAnswers: Record<string, number> | undefined = (location.state as any)?.answers;
  const [answers] = useState<Record<string, number>>(incomingAnswers ?? {});

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("children")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setChildren(data as Child[]);
        setSelectedChild((data as Child[])[0]);
      }
      setLoading(false);
    };
    const timer = setTimeout(() => setLoading(false), 5000);
    fetchChildren();
    return () => clearTimeout(timer);
  }, [user]);

  const ageMonths = selectedChild
    ? differenceInMonths(new Date(), new Date(selectedChild.date_of_birth))
    : 0;

  const ageLabel = (() => {
    if (ageMonths < 1) return "Newborn";
    if (ageMonths < 12) return `${ageMonths} months`;
    const yrs = Math.floor(ageMonths / 12);
    const mo = ageMonths % 12;
    return mo > 0 ? `${yrs} yr ${mo} mo` : `${yrs} years`;
  })();

  // Use placeholder domain scores (or from answers if available)
  const ageAppropriateMilestones = useMemo(() => getQuestionsForAge(ageMonths), [ageMonths]);

  const domainScores = useMemo(() => {
    const hasAnswers = Object.keys(answers).length > 0;
    if (!hasAnswers) {
      return [
        { domain: "speech",    score: 68, status: "Monitor"  as const },
        { domain: "motor",     score: 85, status: "On Track" as const },
        { domain: "social",    score: 78, status: "On Track" as const },
        { domain: "cognitive", score: 82, status: "On Track" as const },
      ];
    }
    return computeDomainScores(answers, ageAppropriateMilestones);
  }, [answers, ageAppropriateMilestones]);

  const overallScore = Math.round(domainScores.reduce((s, d) => s + d.score, 0) / domainScores.length);
  const overallStatus = domainScores.some(d => d.status === "Needs Attention")
    ? "Needs Attention"
    : domainScores.some(d => d.status === "Monitor")
    ? "Monitor"
    : "On Track";

  const needsAttention = domainScores.filter(d => d.status !== "On Track");
  const milestonesByDomain = useMemo(() => {
    return DOMAIN_CONFIG.map((domain) => ({
      ...domain,
      milestones: ageAppropriateMilestones.filter((milestone) => milestone.domain === domain.id),
    }));
  }, [ageAppropriateMilestones]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-newro flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 pt-32 pb-20 px-4 bg-gradient-newro relative overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-40 left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-20 right-[-5%] w-[600px] h-[600px] bg-ai-purple/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="container mx-auto max-w-6xl relative z-10">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm font-black text-primary mb-4 shadow-sm uppercase tracking-widest"
                >
                  <BarChart2 className="w-4 h-4" /> Developmental Intelligence
                </motion.div>

                {selectedChild ? (
                  <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    {selectedChild.name}'s{" "}
                    <span className="text-gradient-primary">Milestone Tracker</span>
                  </h1>
                ) : (
                  <div>
                    <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight mb-2">
                      Milestone Tracker
                    </h1>
                    <p className="text-muted-foreground font-bold">
                      No child profile found.{" "}
                      <Link to="/dashboard" className="text-primary underline">Add one in your dashboard →</Link>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Child switcher */}
                {children.length > 1 && (
                  <div className="flex items-center gap-2">
                    {children.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedChild(c)}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                          selectedChild?.id === c.id
                            ? "bg-primary text-white shadow-glow"
                            : "bg-white/50 border border-white/60 text-foreground hover:bg-white/80"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}

                {selectedChild && (
                  <Button
                    size="lg"
                    className="rounded-full shadow-glow font-black group uppercase tracking-widest text-sm"
                    onClick={() => navigate("/milestones/questions", {
                      state: { ageMonths, childName: selectedChild.name }
                    })}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Update Milestones
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </div>

            {selectedChild && (
              <>
                {/* ── Section A: Summary Cards ── */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                  {/* Overall score panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-panel border-white/40 p-8 rounded-[2.5rem] shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Award className="w-32 h-32 text-primary" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      {/* Radial score */}
                      <div className="relative w-32 h-32 shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/10" />
                          <motion.circle
                            cx="64" cy="64" r="58"
                            stroke="currentColor" strokeWidth="8" fill="transparent"
                            strokeDasharray={2 * Math.PI * 58}
                            initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - overallScore / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-primary"
                            style={{ strokeLinecap: "round" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-display font-black text-2xl text-foreground">{overallScore}%</span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">overall</span>
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-widest">
                            <Baby className="w-4 h-4 text-primary" />
                            {ageLabel} old
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadgeClass(overallStatus)}`}>
                            {overallStatus}
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">Developmental Summary</h3>
                        <p className="text-muted-foreground font-bold leading-relaxed text-sm">
                          {overallStatus === "On Track"
                            ? `${selectedChild.name} is meeting developmental milestones at a strong pace across all domains.`
                            : `Some developmental domains are showing areas that need attention. Early support can make a significant difference.`}
                        </p>
                        {needsAttention.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {needsAttention.map(d => (
                              <div key={d.domain} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadgeClass(d.status)}`}>
                                {d.domain} · {d.status}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* AI Recommendation panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel border-white/40 p-8 rounded-[2.5rem] shadow-lg bg-gradient-to-br from-primary/5 to-ai-purple/5"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-base uppercase tracking-widest">AI Insight</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-bold leading-relaxed mb-6">
                      {domainScores.find(d => d.domain === "speech")?.status !== "On Track"
                        ? "Focus on interactive naming games and repetitive sound imitation for 15 minutes daily to boost language development."
                        : "Great progress! Keep engaging with age-appropriate play and social activities to maintain strong developmental momentum."}
                    </p>
                    <Button variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-primary text-xs font-black uppercase tracking-widest">
                      View Exercises
                    </Button>
                  </motion.div>
                </div>

                {/* ── Section B: Development Trajectory Graph ── */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass-panel border-white/40 p-8 md:p-12 rounded-[3rem] shadow-xl mb-12 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-black text-2xl text-foreground mb-1 tracking-tight">Development Trajectory</h3>
                      <p className="text-sm text-muted-foreground font-bold">AI-powered growth curve from 0–72 months</p>
                    </div>
                    {needsAttention.length > 0 && (
                      <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-xs font-black">
                        <AlertCircle className="w-4 h-4" /> {needsAttention.length} area{needsAttention.length > 1 ? "s" : ""} to monitor
                      </div>
                    )}
                  </div>
                  <MilestoneGraph />
                </motion.div>

                {/* ── Section C: Domain Breakdown ── */}
                <h3 className="font-black text-2xl text-foreground mb-8 px-2 tracking-tight">Domain Performance</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {DOMAIN_CONFIG.map((cfg, idx) => {
                    const score = domainScores.find(d => d.domain === cfg.id);
                    const Icon = cfg.icon;
                    return (
                      <motion.div
                        key={cfg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className={`group glass-panel border-white/40 p-6 rounded-[2rem] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer shadow-lg hover:shadow-xl ${cfg.glow}`}
                      >
                        {/* Domain icon */}
                        <div className={`w-12 h-12 rounded-2xl ${cfg.bg} bg-opacity-10 flex items-center justify-center ${cfg.color} mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-sm text-foreground leading-tight mb-3 uppercase tracking-tight">{cfg.name}</h4>

                        {/* Animated score bar */}
                        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden mb-3">
                          <motion.div
                            className={`h-full ${cfg.bg} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${score?.score ?? 0}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.4 + idx * 0.1 }}
                          />
                        </div>

                        <div className="flex items-end justify-between">
                          <span className={`text-2xl font-display font-black ${cfg.color}`}>{score?.score ?? 0}%</span>
                          <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusBadgeClass(score?.status ?? "On Track")}`}>
                            {score?.status ?? "On Track"}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ── Section D: Age-Appropriate Milestones ── */}
                <div className="mb-12">
                  <h3 className="font-black text-2xl text-foreground mb-6 px-2 tracking-tight">
                    Age-Appropriate Milestones
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {milestonesByDomain.map((domainBlock) => {
                      const Icon = domainBlock.icon;
                      return (
                        <div
                          key={domainBlock.id}
                          className="glass-panel border-white/40 p-6 rounded-[2rem] shadow-lg"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl ${domainBlock.bg} bg-opacity-10 flex items-center justify-center ${domainBlock.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-sm text-foreground uppercase tracking-widest">{domainBlock.name}</p>
                              <p className="text-xs text-muted-foreground font-bold">
                                {domainBlock.milestones.length} milestones in scope
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 max-h-64 overflow-auto pr-1">
                            {domainBlock.milestones.map((milestone) => {
                              const isAnswered = answers[milestone.id] !== undefined;
                              return (
                                <div key={milestone.id} className="rounded-xl border border-white/50 bg-white/40 p-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-bold text-foreground leading-snug">{milestone.question}</p>
                                    <Badge
                                      className={
                                        isAnswered
                                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                      }
                                      variant="outline"
                                    >
                                      {isAnswered ? "Tracked" : "Pending"}
                                    </Badge>
                                  </div>
                                  <p className="mt-2 text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                                    Expected: {milestone.minAge}-{milestone.maxAge} months
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Section E: Update CTA ── */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-primary/10 via-ai-purple/10 to-primary/5 border border-primary/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center text-white shadow-glow">
                      <Zap className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-foreground text-lg tracking-tight">Ready to update milestones?</h4>
                      <p className="text-sm text-muted-foreground font-bold">
                        Answer {ageAppropriateMilestones.length} age-specific milestones across all 4 domains. Takes ~5 minutes.
                      </p>
                    </div>
                  </div>
                  <Button
                    className="rounded-full px-8 h-12 font-black whitespace-nowrap shadow-glow uppercase tracking-widest text-sm"
                    onClick={() => navigate("/milestones/questions", {
                      state: { ageMonths, childName: selectedChild.name }
                    })}
                  >
                    Start Update
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Milestones;
