import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const Reports = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 bg-gradient-newro relative overflow-hidden">
          <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-ai-purple/5 rounded-full blur-[120px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel border-white/40 p-12 rounded-[3rem] text-center max-w-2xl relative z-10 shadow-glow"
          >
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center mb-8 mx-auto shadow-glow text-white animate-pulse">
              <Download className="w-10 h-10" />
            </div>
            <h1 className="font-display text-4xl font-black mb-6 text-foreground tracking-tight">
              Clinical <span className="text-gradient-primary">AI Reports</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-8">
              Generate comprehensive, doctor-ready clinical reports with one click. Our AI documents development with medical-grade accuracy.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              Coming Soon • Early Access
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Reports;
