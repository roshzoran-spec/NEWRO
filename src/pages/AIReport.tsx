import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

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
  risk: string;
  riskLabel: string;
  domainScores: Record<string, DomainScore>;
  recommendations: string[];
  completedAt: string;
}

const REPORT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clinical-report`;

const AIReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(null);
  const [report, setReport] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const generateReport = async () => {
    if (!results) return;
    setReport("");
    setError(null);
    setIsStreaming(true);

    // Also pull patient intake data if available
    const patients = JSON.parse(localStorage.getItem("newro_patients") || "[]");
    const latestPatient = patients.length > 0 ? patients[patients.length - 1] : null;

    const assessmentData = {
      assessment: {
        type: results.assessmentTitle,
        totalScore: results.totalScore,
        maxScore: results.maxScore,
        percentage: results.percentage,
        riskLevel: results.riskLabel,
        completedAt: results.completedAt,
      },
      domainScores: results.domainScores,
      childProfile: latestPatient?.profile || { note: "No patient profile on file" },
      developmentalHistory: latestPatient?.developmental || null,
      medicalHistory: latestPatient?.medical || null,
      chiefComplaint: latestPatient?.chiefComplaint || null,
    };

    try {
      const resp = await fetch(REPORT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ assessmentData }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${resp.status})`);
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullReport = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullReport += content;
              setReport(fullReport);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullReport += content;
              setReport(fullReport);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("Report generation error:", e);
      setError(e instanceof Error ? e.message : "Failed to generate report");
    } finally {
      setIsStreaming(false);
    }
  };

  // Auto-generate on mount
  useEffect(() => {
    if (results && !report && !isStreaming) {
      generateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  if (!results) return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/assessment/${id}/results`}><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h1 className="font-display font-bold text-lg text-foreground">AI Clinical Report</h1>
          </div>
          {!isStreaming && report && (
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={generateReport}>
                <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-1" /> Print
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Report header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-cta p-6 text-primary-foreground mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6" />
            <h2 className="font-display text-xl font-bold">AI-Generated Clinical Interpretation</h2>
          </div>
          <p className="text-sm opacity-90">
            {results.assessmentTitle} • Risk Level: {results.riskLabel} • Score: {results.totalScore}/{results.maxScore} ({results.percentage}%)
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-6 mb-8 text-center">
            <p className="text-destructive font-medium mb-3">{error}</p>
            <Button variant="outline" onClick={generateReport}>
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        )}

        {/* Streaming indicator */}
        {isStreaming && !report && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Analyzing assessment data...</p>
            <p className="text-xs text-muted-foreground">The AI is generating your clinical report</p>
          </div>
        )}

        {/* Report content */}
        {report && (
          <motion.div
            ref={reportRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 relative"
          >
            {/* Clinical Document Container */}
            <div className="bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-200 min-h-[11in] px-12 py-16 mx-auto print:shadow-none print:border-none print:p-0 print:m-0" style={{ width: "100%", maxWidth: "8.5in" }}>
              
              {/* Report Header (Letterhead style) */}
              <div className="border-b-2 border-primary/20 pb-8 mb-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-8 h-8 text-primary" />
                    <span className="font-display font-bold text-2xl tracking-tight">NEWRO <span className="text-sm font-normal text-slate-500 font-sans tracking-normal ml-1">Neurodevelopmental AI</span></span>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Diagnostic Support Systems • v2.4.0</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 uppercase">Assessment Reference</p>
                  <p className="text-lg font-mono text-primary font-bold">#{id?.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              {isStreaming && (
                <div className="flex items-center gap-2 mb-6 text-primary text-sm font-medium animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI Clinical Specialist is compiling findings...
                </div>
              )}

              <div className="prose prose-slate max-w-none 
                prose-headings:font-display prose-headings:text-slate-900 
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-strong:text-slate-900 prose-strong:font-bold
                prose-h1:text-3xl prose-h1:border-b prose-h1:border-slate-100 prose-h1:pb-4 prose-h1:mb-8
                prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-primary
                prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2
                prose-li:text-slate-700
              ">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>

              {/* Signature Section */}
              <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-end opacity-60">
                <div>
                  <div className="w-40 h-px bg-slate-400 mb-2" />
                  <p className="text-xs font-bold uppercase">Digital Verification Path</p>
                  <p className="text-[10px] font-mono">HASH: {id}</p>
                </div>
                <div className="text-right">
                  <div className="w-40 h-px bg-slate-400 mb-2 ml-auto" />
                  <p className="text-xs font-bold uppercase">Clinical AI Specialist</p>
                  <p className="text-xs">Certified Newro Intelligence Model</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="rounded-xl bg-muted/50 border border-border p-4 mb-8">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Important Disclaimer:</strong> This AI-generated report is intended as a clinical decision support tool and does not constitute a medical diagnosis. All findings should be reviewed by a qualified healthcare professional. The AI interpretation is based on screening data only and should be used alongside comprehensive clinical evaluation.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to={`/assessment/${id}/results`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
            </Link>
          </Button>
          <Button className="shadow-glow" asChild>
            <Link to="/assessments">Take Another Assessment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIReport;
