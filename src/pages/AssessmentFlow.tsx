import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { assessmentTypes, assessmentQuestions, calculateResults } from "@/data/assessments";

const AssessmentFlow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const assessment = assessmentTypes.find((a) => a.id === id);
  const questions = id ? assessmentQuestions[id] ?? [] : [];
  const currentQuestion = questions[currentIndex];
  const progress = questions.length ? ((Object.keys(answers).length) / questions.length) * 100 : 0;
  const allAnswered = Object.keys(answers).length === questions.length;

  const currentDomain = currentQuestion?.domain;
  const domainQuestions = useMemo(
    () => questions.filter((q) => q.domain === currentDomain),
    [questions, currentDomain]
  );
  const domainIndex = domainQuestions.findIndex((q) => q.id === currentQuestion?.id);

  if (!assessment || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Assessment not found.</p>
          <Button asChild><Link to="/assessments">Back to Assessments</Link></Button>
        </div>
      </div>
    );
  }

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = () => {
    const results = calculateResults(id!, answers);
    if (results) {
      // Store results in sessionStorage for the results page
      sessionStorage.setItem("newro_results", JSON.stringify(results));
      navigate(`/assessment/${id}/results`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/assessments")} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Exit
            </Button>
            <span className="text-sm font-medium text-foreground">{assessment.shortTitle} Screening</span>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Domain indicator */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${assessment.iconBg}`}>
            {currentDomain}
          </span>
          <span className="text-xs text-muted-foreground">
            Question {domainIndex + 1} of {domainQuestions.length} in this domain
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(currentQuestion.id, opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-secondary text-foreground shadow-glow"
                        : "border-border bg-card text-card-foreground hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                      </div>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 mt-auto">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="shadow-glow gap-1"
            >
              View Results <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined}
              className="gap-1"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Quick nav dots */}
        <div className="flex justify-center gap-1 pt-6 flex-wrap">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-primary scale-125"
                  : answers[q.id] !== undefined
                  ? "bg-primary/40"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentFlow;
