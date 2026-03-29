import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Brain, Info, AlertCircle, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const data = [
  { name: "0", score: 10, zone: "green" },
  { name: "1", score: 25, zone: "green" },
  { name: "2", score: 45, zone: "green" },
  { name: "3", score: 55, zone: "yellow" },
  { name: "4", score: 75, zone: "green" },
  { name: "5", score: 85, zone: "green" },
  { name: "6", score: 95, zone: "green" },
];

const insights = [
  "Speech delay detected at 2.5 yrs → improved in 3 months",
  "Motor skills lag identified early → corrected with therapy",
  "Cognitive leap observed after task-based play",
  "Social engagement score increased by 40% in 8 weeks",
];

const MilestoneTrackerPreview = () => {
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insights.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-foreground mb-4"
          >
            Track Your Child’s Development — <span className="text-gradient-newro">Instantly</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 0.6 }}
             viewport={{ once: true }}
             className="text-lg font-bold uppercase tracking-widest text-muted-foreground"
          >
            Advanced AI Milestone Analytics
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Chart Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-card rounded-[3rem] p-8 md:p-12 relative"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-foreground">Developmental Index</h3>
                <p className="text-muted-foreground font-medium">Predictive AI Analysis</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> On Track
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Monitor
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6FE7DD" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6FE7DD" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const isWarning = payload[0].payload.zone === "yellow";
                        return (
                          <div className="glass-card p-4 rounded-2xl border-none shadow-xl border-white/60">
                            <p className="text-xs font-black text-muted-foreground uppercase mb-1">Age {payload[0].payload.name} Years</p>
                            <p className={`text-lg font-black ${isWarning ? 'text-amber-500' : 'text-primary'}`}>
                              Score: {payload[0].value}%
                            </p>
                            {isWarning && (
                              <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-amber-600">
                                <AlertCircle className="w-3 h-3" /> Speech Delay Risk Elevated
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontWeight: 600, fontSize: 12 }}
                    label={{ value: 'Age (Years)', position: 'insideBottom', offset: -10, fill: '#64748B', fontWeight: 800, fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6FE7DD" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={2500}
                  />
                  <ReferenceLine x="3" stroke="#F59E0B" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insight Bubble */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl border border-white/40 flex items-start gap-4"
            >
              <div className="p-2 rounded-2xl bg-white shadow-sm">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground mb-1">AI Clinical Perspective</p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-amber-600 font-bold">Slight delay in expressive language</span> at 36 months detected. Early stimulation and auditory play recommended.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar Insights */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-[2.5rem] p-8"
            >
              <h4 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Community Insights
              </h4>
              <div className="h-20 relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={insightIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-foreground font-bold leading-relaxed absolute inset-0 text-lg italic"
                  >
                    "{insights[insightIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4">
                What parents like you are seeing right now
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-[#6FE7DD]/10 to-[#7AA7FF]/10"
            >
              <h4 className="text-xl font-black text-foreground mb-4">Ready to see <br />the full picture?</h4>
              <p className="text-sm text-muted-foreground mb-6 font-medium">Answer 5 quick questions about your child's behavior for an instant AI-generated roadmap.</p>
              <Button asChild className="w-full btn-pill bg-foreground text-white hover:bg-foreground/90 shadow-xl border-none">
                <Link to="/milestones">
                  Track Milestones Now
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-[10px] text-center mt-3 font-bold text-muted-foreground uppercase">No Login Required Initially</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestoneTrackerPreview;
