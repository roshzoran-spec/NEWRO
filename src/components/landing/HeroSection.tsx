import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-background">
      {/* Advanced CSS Neural Network Glowing Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-medical-aqua/30 mix-blend-multiply filter blur-[100px] animate-float-slow opacity-60 dark:mix-blend-screen" />
        <div className="absolute top-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-medical-lavender/30 mix-blend-multiply filter blur-[120px] animate-float opacity-60 dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[40%] w-[700px] h-[700px] rounded-full bg-medical-sky/40 mix-blend-multiply filter blur-[130px] animate-breathing-glow opacity-60 dark:mix-blend-screen" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-glow-cyan/10 mix-blend-multiply filter blur-[80px] animate-pulse-glow opacity-50 dark:mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 shadow-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold tracking-wide text-foreground uppercase">
                AI-Powered Neurodevelopment Intelligence
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.1] mb-8 tracking-tight text-foreground">
              Early Minds. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-glow-cyan to-glow-purple animate-gradient-shift">
                Smarter Futures.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              The world's most advanced pediatric AI platform. 
              Intelligent screening, smart therapy, and milestone tracking 
              designed for the future of child brain healthcare.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            <Button size="lg" asChild className="h-16 px-10 rounded-full text-lg shadow-glow bg-gradient-to-r from-primary to-glow-cyan hover:scale-105 transition-transform duration-300 border-0">
              <Link to="/assessments">
                <BrainCircuit className="w-6 h-6 mr-3" />
                Start AI Screening
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-16 px-10 rounded-full text-lg bg-white/40 dark:bg-black/40 backdrop-blur-xl border-white/50 hover:bg-white/60 hover:scale-105 transition-transform duration-300 shadow-sm text-foreground">
              <Link to="/signup">
                Explore Platform
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
