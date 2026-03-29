import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Brain, Shield, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-32 pb-20 overflow-hidden bg-gradient-newro">
      {/* Animated Neural Network Background Placeholder */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full border border-primary/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full border border-ai-purple/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full border border-teal-glow/30 bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel text-sm font-medium mb-8 text-primary border-primary/20 shadow-glow">
              <Brain className="w-5 h-5" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-ai-purple">
                AI Clinical Interpretation
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5rem] font-bold leading-[1.1] mb-6 tracking-tight text-foreground">
              Early Minds. <br />
              <span className="text-gradient-primary">Smarter Futures.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              The world's most advanced AI neurodevelopment platform. 
              Intelligent milestone tracking, automated clinical reports, and smart therapy plans—designed for children, parents, and therapists.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                <Button size="lg" className="rounded-full shadow-glow h-14 px-8 text-lg font-medium group" asChild>
                  <Link to="/screening">
                    Start AI Screening
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full glass-panel h-14 px-8 text-lg font-medium border-primary/20 backdrop-blur-md" asChild>
                  <Link to="/therapy">View Therapy Plans</Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                <Button variant="ghost" className="rounded-full text-foreground hover:bg-primary/10 px-8 h-12 font-bold group" asChild>
                  <Link to="/login">
                    Login
                    <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="link" className="text-muted-foreground hover:text-primary transition-colors font-bold" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            
            <div className="mt-16 flex items-center justify-center gap-8 opacity-60">
                <div className="flex flex-col items-center gap-2">
                    <span className="font-display font-bold text-2xl text-foreground">98%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Accuracy</span>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div className="flex flex-col items-center gap-2">
                    <span className="font-display font-bold text-2xl text-foreground">50k+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Analyses</span>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div className="flex flex-col items-center gap-2">
                    <span className="font-display font-bold text-2xl text-foreground">24/7</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">AI Support</span>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
