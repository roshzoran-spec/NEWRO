import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Brain, MessageSquare, Activity, Baby, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const screeningOptions = [
  {
    id: "autism",
    title: "Autism Spectrum Screening",
    description: "Assessment for social communication challenges and repetitive behaviors.",
    icon: Brain,
    color: "from-primary to-teal-400",
    shadow: "shadow-glow"
  },
  {
    id: "adhd",
    title: "ADHD Screening",
    description: "Screening for attention, hyperactivity, and impulsivity indicators.",
    icon: Activity,
    color: "from-orange-400 to-red-400",
    shadow: "shadow-glow-ai"
  },
  {
    id: "speech",
    title: "Speech & Language Delay",
    description: "Assessment for expressive and receptive language milestones.",
    icon: MessageSquare,
    color: "from-blue-400 to-indigo-400",
    shadow: "shadow-glow"
  },
  {
    id: "developmental",
    title: "Developmental Delay",
    description: "Broader assessment for motor, cognitive, and social milestones.",
    icon: Baby,
    color: "from-green-400 to-emerald-400",
    shadow: "shadow-glow-ai"
  },
  {
    id: "social",
    title: "Social Communication Disorder",
    description: "Focus on pragmatic language and social interaction nuances.",
    icon: Users,
    color: "from-purple-400 to-pink-400",
    shadow: "shadow-glow"
  }
];

const Screening = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleStart = () => {
    if (selectedId) {
      sessionStorage.setItem("selected_screening_type", selectedId);
      navigate("/screening/questions");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-1 flex flex-col items-center justify-start pt-32 pb-20 px-4 bg-gradient-newro relative overflow-hidden">
          
          <div className="absolute top-40 left-10 w-[400px] h-[400px] bg-ai-purple/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16 relative z-10 mt-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-sm font-medium mb-6 text-primary border border-primary/20 shadow-sm">
              <Brain className="w-4 h-4" /> AI-Powered Assessment
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground tracking-tight">
              Select <span className="text-gradient-primary">Screening Type</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Choose the area you want to assess to begin your guided AI developmental journey.
            </p>
          </motion.div>

          {/* Condition Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl relative z-10 mb-16">
            {screeningOptions.map((option, idx) => {
              const Icon = option.icon;
              const isSelected = selectedId === option.id;
              
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedId(option.id)}
                  className={`group cursor-pointer p-6 rounded-[2rem] glass-panel border transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${
                    isSelected 
                      ? "border-primary bg-white/90 shadow-glow-ai ring-2 ring-primary/20" 
                      : "border-white/60 hover:border-primary/40 hover:bg-white/80 hover:shadow-glow"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-5 text-white shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2 text-foreground">{option.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed mb-4">
                    {option.description}
                  </p>
                  
                  <div className={`mt-auto flex items-center text-sm font-bold transition-colors ${isSelected ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary/60"}`}>
                    SELECT {isSelected && <ChevronRight className="w-4 h-4 ml-1" />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky CTA Footer for selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] shadow-sm relative z-10 flex flex-col items-center"
          >
            <Button 
              size="lg" 
              onClick={handleStart}
              disabled={!selectedId}
              className={`w-full h-14 rounded-full text-lg shadow-glow font-medium relative group ${
                !selectedId ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition-all duration-300"
              }`}
            >
              {selectedId && (
                <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-75 -z-10" />
              )}
              Start Screening
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!selectedId && (
              <p className="text-xs text-muted-foreground mt-3 uppercase tracking-widest font-bold">
                Please select a category above
              </p>
            )}
          </motion.div>

        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Screening;
