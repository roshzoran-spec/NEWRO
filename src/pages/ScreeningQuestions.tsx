import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";

const QUESTION_DATA: Record<string, { id: number, text: string }[]> = {
  autism: [
    { id: 1, text: "Does your child avoid eye contact during conversations or play?" },
    { id: 2, text: "Does your child respond when you call their name?" },
    { id: 3, text: "Does your child engage in repetitive behaviors (e.g., hand-flapping, spinning)?" },
    { id: 4, text: "Does your child show interest in other children?" },
    { id: 5, text: "Does your child use gestures to communicate (e.g., pointing, waving)?" },
    { id: 6, text: "Does your child seem overly sensitive to noises or textures?" },
    { id: 7, text: "Does your child engage in make-believe or pretend play?" },
    { id: 8, text: "Does your child repeat words or phrases inappropriately?" },
    { id: 9, text: "Does your child have unusual intense interests in specific objects?" },
    { id: 10, text: "Does your child prefer to play alone rather than with others?" },
    { id: 11, text: "Does your child struggle with changes in routine?" },
    { id: 12, text: "Does your child share enjoyment with you by pointing to things?" }
  ],
  adhd: [
    { id: 1, text: "Does your child have difficulty sitting still for short periods?" },
    { id: 2, text: "Is your child easily distracted by external stimuli?" },
    { id: 3, text: "Does your child frequently interrupt others when they are talking?" },
    { id: 4, text: "Does your child struggle to follow through on instructions?" },
    { id: 5, text: "Does your child often lose things necessary for tasks or activities?" },
    { id: 6, text: "Does your child seem to be 'on the go' as if driven by a motor?" },
    { id: 7, text: "Does your child have trouble waiting for their turn?" },
    { id: 8, text: "Does your child often daydream or seem not to listen when spoken to?" },
    { id: 9, text: "Does your child leave their seat in situations where staying seated is expected?" },
    { id: 10, text: "Does your child talk excessively?" }
  ],
  speech: [
    { id: 1, text: "Does your child use fewer words than expected for their age?" },
    { id: 2, text: "Does your child have difficulty combining two or more words?" },
    { id: 3, text: "Is your child's speech difficult for strangers to understand?" },
    { id: 4, text: "Does your child struggle to follow simple verbal commands?" },
    { id: 5, text: "Does your child seem to have a limited vocabulary?" },
    { id: 6, text: "Does your child repeat what you say instead of answering (Echolalia)?" },
    { id: 7, text: "Does your child use non-verbal methods to get what they want primarily?" },
    { id: 8, text: "Does your child struggle to name common objects?" },
    { id: 9, text: "Does your child have difficulty with the flow or rhythm of speech?" },
    { id: 10, text: "Does your child seem frustrated when trying to communicate?" }
  ],
  developmental: [
    { id: 1, text: "Was there a delay in your child reaching milestones like walking or crawling?" },
    { id: 2, text: "Does your child struggle with fine motor tasks (e.g., holding a spoon)?" },
    { id: 3, text: "Does your child show poor social interaction with peers?" },
    { id: 4, text: "Does your child have difficulty learning new skills?" },
    { id: 5, text: "Does your child seem to have lower muscle tone or coordination issues?" },
    { id: 6, text: "Does your child struggle to solve age-appropriate problems?" },
    { id: 7, text: "Does your child have difficulty understanding social cues?" },
    { id: 8, text: "Does your child seem significantly behind in multiple areas of growth?" }
  ],
  social: [
    { id: 1, text: "Does your child struggle to adjust their behavior to different social contexts?" },
    { id: 2, text: "Does your child have difficulty taking turns in a conversation?" },
    { id: 3, text: "Does your child struggle to understand what is not explicitly stated (nicknames, idioms)?" },
    { id: 4, text: "Does your child find it hard to make and keep friends?" },
    { id: 5, text: "Does your child struggle to use greetings and share information?" },
    { id: 6, text: "Does your child often talk about one topic regardless of listener interest?" },
    { id: 7, text: "Does your child have difficulty using appropriate eye contact or body language?" }
  ]
};

const OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Always", value: 3 }
];

const ScreeningQuestions = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<string>("autism");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const storedType = sessionStorage.getItem("selected_screening_type");
    if (storedType && QUESTION_DATA[storedType]) {
      setType(storedType);
    } else {
      navigate("/screening");
    }
  }, [navigate]);

  const questions = QUESTION_DATA[type] || [];
  const question = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleNext = () => {
    const newAnswers = { ...answers, [currentIndex]: selectedOption! };
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(newAnswers[currentIndex + 1] ?? null);
    } else {
      setAnalyzing(true);
      // Calculate final score
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const maxScore = questions.length * 3;
      const percentage = (totalScore / maxScore) * 100;

      sessionStorage.setItem("screening_total_score", totalScore.toString());
      sessionStorage.setItem("screening_percentage", percentage.toFixed(0));
      sessionStorage.setItem("screening_type", type);
      
      setTimeout(() => {
        navigate("/screening/result");
      }, 800);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedOption(answers[prevIndex] ?? null);
    } else {
      navigate("/screening");
    }
  };

  if (analyzing) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-newro flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-white/60 backdrop-blur-xl p-12 rounded-[2rem] border border-white/40 shadow-glow"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-cta flex items-center justify-center shadow-glow mb-8 animate-pulse">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display font-bold text-3xl mb-4 text-foreground text-center">AI is analyzing results...</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Calculating behavioral risk profile
            </p>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  if (!question) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
        
        {/* Top Navbar / Progress Bar Area */}
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button 
              onClick={handleBack} 
              className="text-muted-foreground hover:text-foreground flex items-center text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <div className="flex items-center gap-2 opacity-80">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-display font-semibold text-primary uppercase tracking-tight">Newro AI Assessment</span>
            </div>
            <div className="w-16">
              {/* Spacer for centering */}
            </div>
          </div>
          {/* Progress Bar Container */}
          <div className="w-full h-1 bg-muted">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-ai-purple"
              initial={{ width: `${progress}%` }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </header>

        {/* Ambient Backgrounds */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-ai-purple/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center z-10">
          <div className="w-full max-w-3xl">
            
            <span className="text-xs font-bold text-primary/60 uppercase tracking-[0.2em] mb-6 block text-center">
              Question {currentIndex + 1} of {questions.length} • {type.replace("_", " ").toUpperCase()}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-foreground text-center leading-tight">
                  {question.text}
                </h1>

                <div className="grid grid-cols-1 gap-4">
                  {OPTIONS.map((opt, idx) => {
                    const isSelected = selectedOption === opt.value;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.9)" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedOption(opt.value)}
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                          isSelected 
                            ? "border-primary bg-white/95 shadow-md ring-1 ring-primary/20" 
                            : "border-border bg-white/50 hover:border-primary/40"
                        }`}
                      >
                        <span className={`text-lg md:text-xl font-medium ${isSelected ? "text-primary" : "text-foreground/80"}`}>
                          {opt.label}
                        </span>
                        
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "border-primary bg-primary/10" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div 
              className="mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                size="lg"
                disabled={selectedOption === null}
                onClick={handleNext}
                className={`h-14 px-12 rounded-full text-lg shadow-glow font-medium relative group ${
                  selectedOption === null ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition-all duration-300"
                }`}
              >
                {selectedOption !== null && (
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-75 -z-10" />
                )}
                {currentIndex === questions.length - 1 ? "Calculate Result" : "Next Question"}
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default ScreeningQuestions;
