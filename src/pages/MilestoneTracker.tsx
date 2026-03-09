import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Baby, Brain, ChevronRight, AlertTriangle, TrendingUp,
  Lightbulb, Activity, Check, Clock, MessageSquare, Users,
  Calendar, CheckCircle2, Circle, AlertCircle, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useMilestones, type ResponseValue } from "@/hooks/useMilestones";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ageOptions = [3, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 72];

const domainConfig = {
  speech: { label: "Speech & Language", icon: MessageSquare, color: "hsl(var(--primary))" },
  cognition: { label: "Cognition", icon: Brain, color: "hsl(260, 50%, 60%)" },
  motor: { label: "Motor", icon: Activity, color: "hsl(var(--accent))" },
  social: { label: "Social Communication", icon: Users, color: "hsl(200, 60%, 50%)" },
};

const responseConfig: Record<ResponseValue, { label: string; icon: React.ReactNode; className: string }> = {
  yes: { label: "Yes", icon: <CheckCircle2 className="w-4 h-4" />, className: "bg-primary/15 text-primary border-primary/40 hover:bg-primary/25" },
  emerging: { label: "Emerging", icon: <AlertCircle className="w-4 h-4" />, className: "bg-yellow-100 text-yellow-700 border-yellow-400 hover:bg-yellow-200" },
  not_yet: { label: "Not Yet", icon: <Circle className="w-4 h-4" />, className: "bg-muted text-muted-foreground border-border hover:bg-muted/80" },
};

const trafficStyles = {
  green: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", dot: "bg-emerald-500", bar: "hsl(150, 60%, 45%)" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", dot: "bg-yellow-500", bar: "hsl(45, 80%, 55%)" },
  red: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", dot: "bg-red-500", bar: "hsl(0, 70%, 55%)" },
};

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
}

function formatAge(ageMonths: number) {
  if (ageMonths < 12) return `${ageMonths} months`;
  const y = Math.floor(ageMonths / 12);
  const m = ageMonths % 12;
  return m ? `${y}y ${m}m` : `${y}y`;
}

function calcAgeMonths(dob: string) {
  const birth = new Date(dob);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

const MilestoneTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("checklist");
  const [activeDomain, setActiveDomain] = useState("speech");

  const selectedChild = children.find(c => c.id === selectedChildId);
  const childAgeMonths = selectedChild ? calcAgeMonths(selectedChild.date_of_birth) : 24;
  // Snap to nearest age window
  const effectiveAge = useMemo(() => {
    const sorted = [...ageOptions].sort((a, b) => a - b);
    for (const a of sorted) {
      if (childAgeMonths <= a) return a;
    }
    return 72;
  }, [childAgeMonths]);

  const {
    milestones, loading, saving,
    saveResponse, getDomainStats, getDelayStatus,
    getMilestonesByAge, getResponse,
    getNextUpdateDate, isUpdateDue,
  } = useMilestones(selectedChildId, effectiveAge);

  // Fetch children
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from("children").select("id, name, date_of_birth").eq("parent_id", user.id);
      if (data && data.length > 0) {
        setChildren(data);
        if (!selectedChildId) setSelectedChildId(data[0].id);
      }
    };
    fetch();
  }, [user]);

  // Domain overview data for bar chart
  const domainChartData = useMemo(() => {
    return (Object.keys(domainConfig) as Array<keyof typeof domainConfig>).map(domain => {
      const stats = getDomainStats(domain);
      const delay = getDelayStatus(domain);
      return { domain: domainConfig[domain].label, percentage: stats.percentage, status: delay.status, ...stats };
    });
  }, [getDomainStats, getDelayStatus]);

  // Insights
  const insights = useMemo(() => {
    const results: string[] = [];
    const domains = Object.keys(domainConfig) as Array<keyof typeof domainConfig>;
    const stats = domains.map(d => ({ domain: d, ...getDomainStats(d), delay: getDelayStatus(d) }));

    const allGood = stats.every(s => s.delay.status === "green");
    if (allGood) results.push("All developmental domains are progressing well for your child's age. Keep up the great work!");

    stats.forEach(s => {
      if (s.delay.status === "red") {
        results.push(`${domainConfig[s.domain].label} shows significant delay. Professional evaluation is recommended.`);
      } else if (s.delay.status === "yellow") {
        results.push(`${domainConfig[s.domain].label} milestones are emerging but below age expectations. Continue monitoring and stimulation activities.`);
      }
    });

    // Cross-domain comparison
    const pcts = stats.map(s => s.percentage);
    const maxPct = Math.max(...pcts);
    const minPct = Math.min(...pcts);
    if (maxPct - minPct > 30) {
      const weak = stats.find(s => s.percentage === minPct)!;
      results.push(`${domainConfig[weak.domain].label} is lagging behind other domains. Focused stimulation in this area may help.`);
    }

    if (results.length === 0) results.push("Development is within expected range. Continue monitoring at regular intervals.");
    return results;
  }, [getDomainStats, getDelayStatus]);

  // Activities
  const getActivities = (domain: string) => {
    const pct = getDomainStats(domain).percentage;
    if (domain === "speech") {
      if (pct < 40) return [
        { activity: "Sound imitation games — repeat vowels and syllables", target: "Vocalization" },
        { activity: "Name objects during daily routines", target: "Vocabulary" },
        { activity: "Read picture books and point to objects", target: "Receptive language" },
      ];
      if (pct < 70) return [
        { activity: "Expand child's utterances (child: 'car' → 'big red car')", target: "Sentence building" },
        { activity: "Ask choice questions: 'milk or juice?'", target: "Communication" },
        { activity: "Sing action songs with gestures", target: "Expressive language" },
      ];
      return [{ activity: "Story retelling and sequencing activities", target: "Narrative skills" }];
    }
    if (domain === "cognition") {
      if (pct < 40) return [
        { activity: "Peek-a-boo and object permanence games", target: "Object permanence" },
        { activity: "Cause-and-effect toys (press button → sound)", target: "Problem solving" },
      ];
      if (pct < 70) return [
        { activity: "Simple puzzles and shape sorters", target: "Problem solving" },
        { activity: "Pretend play with dolls and toy kitchen", target: "Imaginative thinking" },
      ];
      return [{ activity: "Counting games and pattern recognition", target: "Pre-academics" }];
    }
    if (domain === "motor") {
      if (pct < 40) return [
        { activity: "Supervised tummy time with toys", target: "Core strength" },
        { activity: "Reaching and grasping games", target: "Fine motor" },
      ];
      if (pct < 70) return [
        { activity: "Obstacle course with pillows and tunnels", target: "Gross motor" },
        { activity: "Stacking and building with blocks", target: "Fine motor precision" },
      ];
      return [{ activity: "Balance beam and hopping games", target: "Coordination" }];
    }
    // social
    if (pct < 40) return [
      { activity: "Face-to-face interactive games", target: "Social engagement" },
      { activity: "Mirror play and emotion naming", target: "Emotional awareness" },
    ];
    if (pct < 70) return [
      { activity: "Turn-taking games with peers", target: "Social rules" },
      { activity: "Role-play scenarios with dolls", target: "Empathy" },
    ];
    return [{ activity: "Group play and cooperative games", target: "Social skills" }];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <Baby className="w-16 h-16 text-primary mx-auto" />
            <h2 className="font-display font-bold text-xl text-foreground">Sign in to Track Milestones</h2>
            <p className="text-muted-foreground text-sm">Create an account and add your child's profile to start tracking developmental milestones.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" asChild><Link to="/login">Sign In</Link></Button>
              <Button asChild><Link to="/signup">Sign Up</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (children.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <Baby className="w-16 h-16 text-primary mx-auto" />
            <h2 className="font-display font-bold text-xl text-foreground">Add a Child Profile First</h2>
            <p className="text-muted-foreground text-sm">Go to your dashboard to add your child's profile, then come back to track milestones.</p>
            <Button asChild><Link to="/dashboard">Go to Dashboard</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <Baby className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-lg text-foreground">Milestone Tracker</h1>
          {saving && <span className="ml-auto text-xs text-muted-foreground animate-pulse">Saving...</span>}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        {/* Child selector + Age info */}
        <Card className="border-2">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Select Child</label>
                <Select value={selectedChildId || ""} onValueChange={setSelectedChildId}>
                  <SelectTrigger><SelectValue placeholder="Choose child" /></SelectTrigger>
                  <SelectContent>
                    {children.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedChild && (
                <>
                  <div className="text-center px-4">
                    <p className="text-2xl font-display font-bold text-primary">{formatAge(childAgeMonths)}</p>
                    <p className="text-xs text-muted-foreground">Current Age</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-lg font-display font-bold text-foreground">{milestones.length}</p>
                    <p className="text-xs text-muted-foreground">Milestones to Track</p>
                  </div>
                  {isUpdateDue() && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Update Due
                    </Badge>
                  )}
                  {!isUpdateDue() && getNextUpdateDate() && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Calendar className="w-3 h-3" /> Next: {getNextUpdateDate()!.toLocaleDateString()}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedChild && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            {/* === CHECKLIST TAB === */}
            <TabsContent value="checklist">
              {/* Domain tabs */}
              <div className="flex gap-2 flex-wrap mb-6">
                {(Object.keys(domainConfig) as Array<keyof typeof domainConfig>).map(domain => {
                  const cfg = domainConfig[domain];
                  const stats = getDomainStats(domain);
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={domain}
                      onClick={() => setActiveDomain(domain)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                        activeDomain === domain
                          ? "bg-primary text-primary-foreground border-primary shadow-glow"
                          : "bg-card text-muted-foreground border-border hover:border-primary/40"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {cfg.label}
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        activeDomain === domain ? "bg-primary-foreground/20" : "bg-muted"
                      )}>
                        {stats.achieved}/{stats.total}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Milestone questions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDomain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {Object.entries(getMilestonesByAge(activeDomain))
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([age, ms]) => (
                      <div key={`${activeDomain}-${age}`} className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full">
                            {formatAge(Number(age))}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                        <div className="space-y-3">
                          {ms.map((m, idx) => {
                            const currentResponse = getResponse(m.id);
                            return (
                              <motion.div
                                key={m.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all"
                              >
                                <p className="text-sm font-medium text-card-foreground mb-3">{m.question}</p>
                                <div className="flex gap-2 flex-wrap">
                                  {(["yes", "emerging", "not_yet"] as const).map(val => {
                                    const cfg = responseConfig[val];
                                    return (
                                      <button
                                        key={val}
                                        onClick={() => saveResponse(m.id, val)}
                                        className={cn(
                                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                          currentResponse === val
                                            ? cfg.className + " ring-2 ring-offset-1 ring-current scale-105"
                                            : "border-border text-muted-foreground hover:border-primary/30 bg-background"
                                        )}
                                      >
                                        {cfg.icon} {cfg.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* === DASHBOARD TAB === */}
            <TabsContent value="dashboard">
              <div className="space-y-6">
                {/* Traffic light cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(Object.keys(domainConfig) as Array<keyof typeof domainConfig>).map(domain => {
                    const stats = getDomainStats(domain);
                    const delay = getDelayStatus(domain);
                    const style = trafficStyles[delay.status];
                    const Icon = domainConfig[domain].icon;
                    return (
                      <motion.div
                        key={domain}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn("rounded-2xl border-2 p-4", style.bg, style.border)}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={cn("w-3 h-3 rounded-full animate-pulse", style.dot)} />
                          <Icon className={cn("w-4 h-4", style.text)} />
                          <span className={cn("text-sm font-bold", style.text)}>{domainConfig[domain].label}</span>
                        </div>
                        <div className="text-3xl font-display font-bold mb-1" style={{ color: style.bar }}>{stats.percentage}%</div>
                        <div className="h-2 rounded-full bg-white/60 overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.percentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={cn("h-full rounded-full", style.dot)}
                          />
                        </div>
                        <p className={cn("text-xs", style.text)}>
                          {stats.achieved} achieved · {stats.emerging} emerging · {stats.notYet} pending
                        </p>
                        <p className={cn("text-xs mt-1 font-medium", style.text)}>{delay.label}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Domain comparison chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5 text-primary" /> Domain Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={domainChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => [`${v}%`, "Achievement"]} />
                        <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                          {domainChartData.map((d, i) => (
                            <Cell key={i} fill={trafficStyles[d.status].bar} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Milestone summary */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base text-primary flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Achieved</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5 max-h-60 overflow-y-auto">
                        {milestones.filter(m => getResponse(m.id) === "yes").map(m => (
                          <li key={m.id} className="flex items-start gap-2 text-xs text-foreground">
                            <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{m.description}</span>
                          </li>
                        ))}
                        {milestones.filter(m => getResponse(m.id) === "yes").length === 0 && (
                          <p className="text-xs text-muted-foreground">No milestones achieved yet</p>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-base text-yellow-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Emerging</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5 max-h-60 overflow-y-auto">
                        {milestones.filter(m => getResponse(m.id) === "emerging").map(m => (
                          <li key={m.id} className="flex items-start gap-2 text-xs text-foreground">
                            <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                            <span>{m.description}</span>
                          </li>
                        ))}
                        {milestones.filter(m => getResponse(m.id) === "emerging").length === 0 && (
                          <p className="text-xs text-muted-foreground">None emerging yet</p>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* === INSIGHTS TAB === */}
            <TabsContent value="insights">
              <div className="space-y-6">
                {/* AI Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="w-5 h-5 text-primary" /> Development Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border"
                      >
                        <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground">{insight}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Activities per domain */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {(Object.keys(domainConfig) as Array<keyof typeof domainConfig>).map(domain => {
                    const cfg = domainConfig[domain];
                    const Icon = cfg.icon;
                    const activities = getActivities(domain);
                    return (
                      <Card key={domain}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                            {cfg.label} Activities
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {activities.map((a, i) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                              <p className="text-sm font-medium text-foreground">{a.activity}</p>
                              <p className="text-xs text-muted-foreground mt-1">Target: {a.target}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* 15-day update reminder */}
                <Card className="border-2 border-primary/30">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-foreground">15-Day Update Cycle</h4>
                      <p className="text-sm text-muted-foreground">
                        {isUpdateDue()
                          ? "It's time to update your child's milestone progress! Review the checklist and update any changes."
                          : `Next update due: ${getNextUpdateDate()?.toLocaleDateString() || "Start tracking to begin the cycle"}`
                        }
                      </p>
                    </div>
                    {isUpdateDue() && (
                      <Button onClick={() => setActiveTab("checklist")} className="shadow-glow">
                        Update Now <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MilestoneTracker;
