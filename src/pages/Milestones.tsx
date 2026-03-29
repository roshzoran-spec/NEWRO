import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  TrendingUp, Award, AlertCircle, Brain, 
  MessageSquare, Activity, Users, Lightbulb, 
  ChevronRight, Calendar, ArrowUpRight
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import MilestoneGraph from "@/components/milestones/MilestoneGraph";
import { CHILD_MOCK } from "@/utils/milestoneData";
import { Button } from "@/components/ui/button";

const domains = [
  { id: "speech", name: "Speech & Language", icon: MessageSquare, score: 65, status: "Monitor", color: "text-blue-500", bg: "bg-blue-500" },
  { id: "motor", name: "Motor Skills", icon: Activity, score: 88, status: "On Track", color: "text-emerald-500", bg: "bg-emerald-500" },
  { id: "social", name: "Social Skills", icon: Users, score: 72, status: "On Track", color: "text-purple-500", bg: "bg-purple-500" },
  { id: "cognitive", name: "Cognitive Skills", icon: Brain, score: 80, status: "On Track", color: "text-amber-500", bg: "bg-amber-500" },
  { id: "feeding", name: "Feeding & Oral", icon: TrendingUp, score: 95, status: "On Track", color: "text-rose-500", bg: "bg-rose-500" },
];

const Milestones = () => {
  const [child] = useState(CHILD_MOCK);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-1 pt-32 pb-20 px-4 bg-gradient-newro relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-40 left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-20 right-[-5%] w-[600px] h-[600px] bg-ai-purple/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="container mx-auto max-w-6xl relative z-10">
            
            {/* Header / Child Profile Quick Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm font-bold text-primary mb-4 shadow-sm"
                >
                  <TrendingUp className="w-4 h-4" /> DEVELOPMENTAL INTELLIGENCE
                </motion.div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  {child.name}'s <span className="text-gradient-primary">Milestone Tracker</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Update</p>
                  <p className="text-sm font-medium text-foreground">12 Days Ago</p>
                </div>
                <Button size="lg" className="rounded-full shadow-glow font-bold group" asChild>
                  <Link to="/milestones/questions">
                    Update Milestones
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Section A: Development Summary */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 glass-panel border-white/40 p-8 rounded-[2.5rem] shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Award className="w-32 h-32 text-primary" />
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/10" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - child.score / 100)} className="text-primary" style={{ strokeLinecap: "round" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-2xl">
                      {child.score}%
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Age: {(child.ageMonths / 12).toFixed(1)} Years ({child.ageMonths}m)</span>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        child.status === "On Track" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                        child.status === "Monitor" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                        "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}>
                        {child.status}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Developmental Summary</h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {child.insight}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel border-white/40 p-8 rounded-[2.5rem] shadow-lg bg-gradient-to-br from-primary/5 to-ai-purple/5"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg">AI Recommendation</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Based on current speech patterns, focus on interactive naming games and repetitive sound imitation for 15 minutes daily.
                </p>
                <Button variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                  View Exercises
                </Button>
              </motion.div>
            </div>

            {/* Section B: Futuristic Development Graph */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel border-white/40 p-8 md:p-12 rounded-[3rem] shadow-xl mb-12 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-display font-bold text-2xl text-foreground mb-1">Development Trajectory</h3>
                  <p className="text-sm text-muted-foreground font-light">Growth tracking and predictive AI modeling (0–72 months)</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-xs font-bold">
                  <AlertCircle className="w-4 h-4" /> 1 Red Flag Detected
                </div>
              </div>
              
              <MilestoneGraph />
            </motion.div>

            {/* Section C: Domain Breakdown */}
            <h3 className="font-display font-bold text-2xl text-foreground mb-8 px-2">Domain Performance</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {domains.map((domain, idx) => {
                const Icon = domain.icon;
                return (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                    className="group glass-panel border-white/40 p-6 rounded-[2rem] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${domain.bg} bg-opacity-10 flex items-center justify-center ${domain.color} mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-foreground leading-tight">{domain.name}</h4>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <span className={`text-2xl font-display font-black ${domain.color}`}>{domain.score}%</span>
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Section G: Auto Update System Notification (Mock) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-glow animate-pulse">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">15-Day Progress Sync</h4>
                  <p className="text-sm text-muted-foreground">Time to update {child.name}'s newest milestones for accurate AI tracking.</p>
                </div>
              </div>
              <Button className="rounded-full px-8 h-12 font-bold whitespace-nowrap">
                Start Update
              </Button>
            </motion.div>

          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Milestones;
