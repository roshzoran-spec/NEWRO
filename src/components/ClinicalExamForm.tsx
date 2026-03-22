import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Loader2, RefreshCw, Sparkles, ClipboardCheck,
  CheckCircle2, AlertTriangle, XCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type ExamParameter, type ExamFinding, type Finding,
  findingLabels, getExamSummary,
} from "@/data/clinical-exams";
import { useToast } from "@/hooks/use-toast";

const NARRATIVE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clinical-narrative`;

const findingOptions: Finding[] = ["normal", "inconsistent", "reduced", "absent"];
const findingIcons: Record<Finding, React.ReactNode> = {
  normal: <CheckCircle2 className="w-3.5 h-3.5" />,
  inconsistent: <AlertCircle className="w-3.5 h-3.5" />,
  reduced: <AlertTriangle className="w-3.5 h-3.5" />,
  absent: <XCircle className="w-3.5 h-3.5" />,
};

interface ClinicalExamFormProps {
  title: string;
  icon: React.ReactNode;
  examType: string;
  parameters: ExamParameter[];
  backPath: string;
}

const ClinicalExamForm = ({ title, icon, examType, parameters, backPath }: ClinicalExamFormProps) => {
  const { toast } = useToast();
  const [findings, setFindings] = useState<ExamFinding[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [narrative, setNarrative] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => getExamSummary(findings, parameters), [findings, parameters]);

  const setFinding = (parameterId: string, finding: Finding) => {
    setFindings(prev => {
      const idx = prev.findIndex(f => f.parameterId === parameterId);
      const entry: ExamFinding = { parameterId, finding, notes: notes[parameterId] };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [...prev, entry];
    });
  };

  const setNote = (parameterId: string, note: string) => {
    setNotes(prev => ({ ...prev, [parameterId]: note }));
    // Update finding entry if it exists
    setFindings(prev => prev.map(f => f.parameterId === parameterId ? { ...f, notes: note } : f));
  };

  const generateNarrative = async () => {
    if (findings.length === 0) {
      toast({ title: "Select at least one finding", variant: "destructive" });
      return;
    }
    setNarrative("");
    setError(null);
    setIsStreaming(true);

    try {
      const resp = await fetch(NARRATIVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ examType, findings, parameters }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${resp.status})`);
      }
      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, idx);
          textBuffer = textBuffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { fullText += content; setNarrative(fullText); }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate narrative");
    } finally {
      setIsStreaming(false);
    }
  };

  // Group parameters by category
  const grouped = useMemo(() => {
    const map: Record<string, ExamParameter[]> = {};
    parameters.forEach(p => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [parameters]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={backPath}><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          {icon}
          <h1 className="font-display font-bold text-lg text-foreground">{title}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Summary bar */}
        {findings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-3 mb-8"
          >
            {(["normal", "inconsistent", "reduced", "absent"] as const).map(f => (
              <div key={f} className={cn("rounded-xl border p-3 text-center", findingLabels[f].color)}>
                <p className="text-2xl font-display font-bold">{summary[f]}</p>
                <p className="text-xs font-medium">{findingLabels[f].label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Parameter groups */}
        <div className="space-y-8 mb-10">
          {Object.entries(grouped).map(([category, params]) => (
            <Card key={category} className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {params.map(p => {
                  const current = findings.find(f => f.parameterId === p.id)?.finding;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-xl bg-muted/30 border border-border p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{p.label}</p>
                          <p className="text-xs text-muted-foreground">{p.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {findingOptions.map(f => (
                          <button
                            key={f}
                            onClick={() => setFinding(p.id, f)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                              current === f
                                ? findingLabels[f].color + " ring-2 ring-offset-1 ring-current scale-105"
                                : "bg-card text-muted-foreground border-border hover:border-primary/30"
                            )}
                          >
                            {findingIcons[f]}
                            {findingLabels[f].label}
                          </button>
                        ))}
                      </div>
                      {current && current !== "normal" && (
                        <Textarea
                          value={notes[p.id] || ""}
                          onChange={e => setNote(p.id, e.target.value)}
                          placeholder="Add clinical notes..."
                          className="h-16 text-xs bg-background mt-1"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate AI Narrative */}
        <div className="text-center mb-8">
          <Button
            size="lg"
            className="shadow-glow px-8"
            onClick={generateNarrative}
            disabled={isStreaming || findings.length === 0}
          >
            {isStreaming ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Generate AI Clinical Narrative</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {findings.length} of {parameters.length} parameters scored
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-4 mb-6 text-center">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={generateNarrative} className="mt-2">
              <RefreshCw className="w-4 h-4 mr-1" /> Retry
            </Button>
          </div>
        )}

        {/* Narrative output */}
        {narrative && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-primary/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  AI Clinical Narrative
                  {isStreaming && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {narrative}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(narrative).then(() => toast({ title: "Copied to clipboard" }))}>
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={generateNarrative} disabled={isStreaming}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>Print</Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl bg-muted/50 border border-border p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This AI-generated narrative is a clinical decision support tool. All findings should be reviewed and edited by the examining therapist before inclusion in official reports.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClinicalExamForm;
