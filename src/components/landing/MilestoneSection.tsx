import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Baby, MessageSquare, Activity, ArrowRight, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleSpeechData = [
  { age: "3m", pct: 95 },
  { age: "6m", pct: 90 },
  { age: "9m", pct: 85 },
  { age: "12m", pct: 78 },
  { age: "18m", pct: 72 },
  { age: "24m", pct: 68 },
];

const sampleMotorData = [
  { age: "3m", pct: 98 },
  { age: "6m", pct: 95 },
  { age: "9m", pct: 93 },
  { age: "12m", pct: 90 },
  { age: "18m", pct: 88 },
  { age: "24m", pct: 92 },
];

const features = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Animated Progress Graphs",
    description: "Dual-domain timeline graphs for speech and motor milestones with real-time updates",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Regression Detection",
    description: "AI automatically alerts when a child loses previously acquired developmental skills",
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Smart AI Insights",
    description: "Contextual analysis comparing speech vs motor progress with therapy activity suggestions",
  },
];

const MilestoneSection = () => {
  return (
    <section id="milestones" className="py-24 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border" />
      <div className="absolute -top-40 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 rounded-full bg-coral/5 blur-3xl" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            <Baby className="w-4 h-4" />
            Developmental Tracking
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            AI-Powered <span className="text-gradient-primary">Milestone Tracker</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track 80+ clinical milestones across Speech & Language and Motor domains from birth to 6 years with animated graphs, traffic light indicators, and regression detection.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          {/* Preview Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-card border-2 border-border p-6 shadow-lg"
          >
            {/* Traffic lights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-yellow-50 border-2 border-yellow-300 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse-soft" />
                  <span className="font-display font-bold text-yellow-700 text-sm">Speech</span>
                  <span className="ml-auto text-xl font-display font-bold text-yellow-700">68%</span>
                </div>
                <div className="h-2 rounded-full bg-yellow-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-yellow-500"
                  />
                </div>
                <p className="text-[10px] text-yellow-600 mt-1">Borderline — ~4 month delay</p>
              </div>
              <div className="rounded-xl bg-emerald-50 border-2 border-emerald-300 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse-soft" />
                  <span className="font-display font-bold text-emerald-700 text-sm">Motor</span>
                  <span className="ml-auto text-xl font-display font-bold text-emerald-700">92%</span>
                </div>
                <div className="h-2 rounded-full bg-emerald-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-emerald-600 mt-1">On Track — progressing normally</p>
              </div>
            </div>

            {/* Mini graph bars */}
            <div className="mb-6">
              <h4 className="font-display font-semibold text-sm text-card-foreground mb-3">Progress Timeline</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-card-foreground">Speech & Language</span>
                  </div>
                  <div className="space-y-1.5">
                    {sampleSpeechData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-6">{d.age}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${d.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.08 }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-card-foreground w-7">{d.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Activity className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-medium text-card-foreground">Motor</span>
                  </div>
                  <div className="space-y-1.5">
                    {sampleMotorData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-6">{d.age}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${d.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.08 }}
                            className="h-full rounded-full bg-accent"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-card-foreground w-7">{d.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight preview */}
            <div className="rounded-xl bg-secondary/50 border border-border p-3 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                <strong>AI Insight:</strong> Speech development is slightly delayed compared to motor development. Focused speech-language intervention is recommended.
              </p>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-card-foreground mb-1">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            ))}

            <div className="flex flex-wrap gap-4 pt-2 pl-14">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">82+</p>
                <p className="text-xs text-muted-foreground">Milestones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-accent">0–6y</p>
                <p className="text-xs text-muted-foreground">Age Range</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">Domains</p>
              </div>
            </div>

            <div className="pl-14">
              <Button size="lg" asChild className="shadow-glow">
                <Link to="/milestones">
                  Start Tracking <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MilestoneSection;
