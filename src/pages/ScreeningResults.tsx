import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Download, ArrowRight, Brain, 
  MessageCircle, Video, ShieldCheck, AlertCircle, Info, CheckCircle, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const ScreeningResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState({ score: 0, percentage: 0, type: "autism" });

  useEffect(() => {
    const total = sessionStorage.getItem("screening_total_score");
    const pct = sessionStorage.getItem("screening_percentage");
    const type = sessionStorage.getItem("screening_type") || "autism";
    
    if (total && pct) {
      setScoreData({ score: parseInt(total), percentage: parseInt(pct), type });
      setTimeout(() => {
        navigate("/screening/result");
      }, 300); // Instant AI analysis transition
    } else {
      // navigate("/screening");
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 200); // Superfast AI result display
    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-cta flex items-center justify-center shadow-glow mb-6 animate-pulse text-white">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2 text-foreground">AI Analysis in Progress</h2>
          <p className="text-muted-foreground">Your detailed neuro-profile is being generated...</p>
        </motion.div>
      </div>
    );
  }

  const getRiskInfo = (pct: number) => {
    if (pct < 30) return { label: "Low Concern", color: "text-emerald-500", bg: "bg-emerald-500", icon: CheckCircle, message: "showing minimal indicators" };
    if (pct < 60) return { label: "Moderate Concern", color: "text-amber-500", bg: "bg-amber-500", icon: Info, message: "showing moderate indicators" };
    return { label: "High Concern", color: "text-rose-500", bg: "bg-rose-500", icon: AlertCircle, message: "showing high indicators" };
  };

  const risk = getRiskInfo(scoreData.percentage);
  const RiskIcon = risk.icon;

  const typeLabel = scoreData.type.replace("_", " ").toUpperCase();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-1 pt-32 pb-20 px-4 bg-gradient-newro relative overflow-hidden">
          <div className="absolute top-40 left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-20 right-[-5%] w-[600px] h-[600px] bg-ai-purple/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="container mx-auto max-w-4xl relative z-10">
            
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm font-bold text-primary mb-6 shadow-sm"
              >
                <Brain className="w-4 h-4" /> AI SCREENING RESULT
              </motion.div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Assessment Complete</h1>
            </div>

            {/* Visual Gauge Meter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel border-white/40 p-10 rounded-[2.5rem] mb-12 text-center shadow-lg relative overflow-hidden"
            >
              <div className="relative w-64 h-64 mx-auto mb-8">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="transparent"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 110}
                    initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - scoreData.percentage / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={risk.color}
                    style={{ strokeLinecap: "round" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-display font-bold ${risk.color}`}>{scoreData.percentage}%</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Concern Level</span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full ${risk.bg} bg-opacity-10 ${risk.color} border border-current font-bold text-sm mb-6`}>
                <RiskIcon className="w-4 h-4" />
                {risk.label.toUpperCase()}
              </div>

              <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
                Your child shows <span className={risk.color}>{risk.label}</span> of {typeLabel} traits.
              </h2>
              <p className="text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
                Our AI model has analyzed responses across multiple developmental sub-domains. This percentage indicates the frequency and intensity of behavioral markers associated with {typeLabel.toLowerCase()} compared to pediatric benchmarks.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel border-white/40 p-8 rounded-[2rem] shadow-sm"
              >
                <h3 className="font-display font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Clinical Explanation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  These results suggest that your child {risk.message} that warrant further professional observation. The scores reflect patterns in social communication and behavioral flexibility that are characteristic of the {typeLabel.toLowerCase()} profile.
                </p>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <p className="text-xs text-primary font-medium flex items-start gap-2 italic">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    IMPORTANT: This is a screening tool, not a clinical diagnosis. A comprehensive medical evaluation is recommended.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel border-white/40 p-8 rounded-[2rem] shadow-sm"
              >
                <h3 className="font-display font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-ai-purple" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {[
                    "Schedule a full clinical developmental assessment.",
                    "Begin early intervention strategies specifically for social delay.",
                    "Try our guided AI-driven therapy plan for daily progress tracking.",
                    "Monitor behavioral patterns using the Newro Dashboard."
                  ].map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary font-bold text-[10px] mt-0.5">
                        {i + 1}
                      </div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button size="lg" className="rounded-full shadow-glow h-14 px-8 text-lg font-medium group" asChild>
                <Link to="/therapy">
                  <Video className="w-5 h-5 mr-2" />
                  View Therapy Plan
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full glass-panel h-14 px-8 text-lg font-medium border-primary/20" asChild>
                <Link to="/consultation">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book Consultation
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full h-14 px-8 text-lg font-medium" asChild>
                <Link to="/reports">
                  <Download className="w-5 h-5 mr-2" />
                  Download Report
                </Link>
              </Button>
            </motion.div>

          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ScreeningResults;
