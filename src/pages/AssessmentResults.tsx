import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, RotateCcw, AlertTriangle, CheckCircle2, AlertCircle, XCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DomainScore {
  score: number;
  max: number;
  percentage: number;
}

interface Results {
  assessmentId: string;
  assessmentTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  risk: "normal" | "mild" | "moderate" | "high";
  riskLabel: string;
  domainScores: Record<string, DomainScore>;
  recommendations: string[];
  completedAt: string;
}

const riskConfig = {
  normal: { icon: CheckCircle2, color: "text-primary", bg: "bg-secondary", border: "border-primary/30", label: "Low Risk" },
  mild: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-300", label: "Mild Concern" },
  moderate: { icon: AlertTriangle, color: "text-accent", bg: "bg-coral-light", border: "border-coral/30", label: "Moderate Concern" },
  high: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "High Risk" },
};

const AssessmentResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("newro_results");
    if (stored) {
      const parsed = JSON.parse(stored) as Results;
      if (parsed.assessmentId === id) {
        setResults(parsed);
        return;
      }
    }
    navigate("/assessments");
  }, [id, navigate]);

  if (!results) return null;

  const config = riskConfig[results.risk];
  const RiskIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/assessments"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="font-display font-bold text-lg text-foreground">Assessment Results</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Risk Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border-2 ${config.border} ${config.bg} p-8 text-center mb-8`}
        >
          <RiskIcon className={`w-16 h-16 mx-auto mb-4 ${config.color}`} />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">{results.riskLabel}</h2>
          <p className="text-muted-foreground mb-6">{results.assessmentTitle}</p>
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="text-3xl font-display font-bold text-foreground">{results.totalScore}</p>
              <p className="text-xs text-muted-foreground">of {results.maxScore} points</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className={`text-3xl font-display font-bold ${config.color}`}>{results.percentage}%</p>
              <p className="text-xs text-muted-foreground">concern level</p>
            </div>
          </div>
        </motion.div>

        {/* Domain Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-card border border-border p-6 mb-8"
        >
          <h3 className="font-display font-bold text-lg text-card-foreground mb-6">Domain Breakdown</h3>
          <div className="space-y-5">
            {Object.entries(results.domainScores).map(([domain, data]) => {
              let barColor = "bg-primary";
              if (data.percentage > 60) barColor = "bg-destructive";
              else if (data.percentage > 35) barColor = "bg-accent";
              else if (data.percentage > 15) barColor = "bg-yellow-500";

              return (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-card-foreground">{domain}</span>
                    <span className="text-sm text-muted-foreground">
                      {data.score}/{data.max} ({Math.round(data.percentage)}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full ${barColor}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-card border border-border p-6 mb-8"
        >
          <h3 className="font-display font-bold text-lg text-card-foreground mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {results.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-card-foreground">
                <span className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Disclaimer */}
        <div className="rounded-xl bg-muted/50 border border-border p-4 mb-8">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> This screening result is for informational purposes only and does not constitute a medical diagnosis. Please consult with a qualified healthcare professional for a comprehensive evaluation and diagnosis.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Download className="w-4 h-4" /> Download Report
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link to={`/assessment/${id}`}>
              <RotateCcw className="w-4 h-4" /> Retake Assessment
            </Link>
          </Button>
          <Button className="shadow-glow" asChild>
            <Link to="/signup">Create Account to Save</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
