import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, FileQuestion, ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assessmentTypes } from "@/data/assessments";

const Assessments = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="font-display font-bold text-lg text-foreground">Developmental Assessments</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Choose an <span className="text-gradient-primary">Assessment</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a standardized screening tool to evaluate your child's development. Each assessment is based on internationally recognized clinical frameworks.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {assessmentTypes.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/assessment/${a.id}`}
                className={`block rounded-2xl bg-card border-2 ${a.color} p-6 transition-all duration-300 hover:shadow-lg group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${a.iconBg} flex items-center justify-center text-2xl shrink-0`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-card-foreground mb-1">{a.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {a.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileQuestion className="w-3.5 h-3.5" /> {a.questionCount} questions
                      </span>
                      <span className="text-primary font-medium">{a.ageRange}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            These screenings are for informational purposes and do not replace professional clinical evaluation. Consult a specialist for diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assessments;
