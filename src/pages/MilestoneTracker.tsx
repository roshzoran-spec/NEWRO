import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Baby, Brain, ChevronRight, AlertTriangle, TrendingUp,
  Lightbulb, Activity, Check, Minus, CircleDot, Star, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, Legend, BarChart, Bar, Cell,
} from "recharts";
import {
  milestones, getMilestonesForAge, calculateAchievement,
  getTrafficLight, generateInsights, getActivityRecommendations,
  scoreLabels, type MilestoneScore, type MilestoneSession, detectRegression,
  getProgressData,
} from "@/data/milestones";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ageOptions = [3, 6, 9, 12, 18, 24, 36, 48, 60, 72];

const trafficColors = {
  green: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", dot: "bg-emerald-500" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", dot: "bg-yellow-500" },
  red: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", dot: "bg-red-500" },
};

const scoreIcons: Record<number, React.ReactNode> = {
  0: <Minus className="w-4 h-4" />,
  1: <CircleDot className="w-4 h-4" />,
  2: <Check className="w-4 h-4" />,
  3: <Star className="w-4 h-4" />,
};

const MilestoneTracker = () => {
  const { toast } = useToast();
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<number>(24);
  const [scores, setScores] = useState<MilestoneScore[]>([]);
  const [activeTab, setActiveTab] = useState("score");
  const [sessions, setSessions] = useState<MilestoneSession[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("newro_milestone_sessions") || "[]");
    } catch { return []; }
  });

  const speechMilestones = useMemo(() => getMilestonesForAge(childAge, "speech"), [childAge]);
  const motorMilestones = useMemo(() => getMilestonesForAge(childAge, "motor"), [childAge]);

  const speechPct = useMemo(() => calculateAchievement(scores, "speech", childAge), [scores, childAge]);
  const motorPct = useMemo(() => calculateAchievement(scores, "motor", childAge), [scores, childAge]);

  const speechTraffic = useMemo(() => getTrafficLight(childAge, scores, "speech"), [childAge, scores]);
  const motorTraffic = useMemo(() => getTrafficLight(childAge, scores, "motor"), [childAge, scores]);

  const insights = useMemo(() => generateInsights(scores, childAge), [scores, childAge]);
  const speechActivities = useMemo(() => getActivityRecommendations(scores, childAge, "speech"), [scores, childAge]);
  const motorActivities = useMemo(() => getActivityRecommendations(scores, childAge, "motor"), [scores, childAge]);

  const speechRegression = useMemo(() => detectRegression(sessions, "speech"), [sessions]);
  const motorRegression = useMemo(() => detectRegression(sessions, "motor"), [sessions]);

  const progressData = useMemo(() => getProgressData(sessions), [sessions]);

  // Combined chart data
  const chartData = useMemo(() => {
    const ages = new Set<number>();
    progressData.speech.forEach(d => ages.add(d.age));
    progressData.motor.forEach(d => ages.add(d.age));
    return Array.from(ages).sort((a, b) => a - b).map(age => ({
      age: `${age}m`,
      ageNum: age,
      speech: progressData.speech.find(d => d.age === age)?.percentage ?? null,
      motor: progressData.motor.find(d => d.age === age)?.percentage ?? null,
    }));
  }, [progressData]);

  // Bar chart data for current session domains
  const domainBarData = useMemo(() => {
    if (scores.length === 0) return [];
    const categories = new Set<string>();
    [...speechMilestones, ...motorMilestones].forEach(m => categories.add(m.category));
    return Array.from(categories).map(cat => {
      const catMilestones = [...speechMilestones, ...motorMilestones].filter(m => m.category === cat);
      const maxScore = catMilestones.length * 3;
      const totalScore = catMilestones.reduce((sum, m) => {
        const s = scores.find(sc => sc.milestoneId === m.id);
        return sum + (s ? s.score : 0);
      }, 0);
      return { category: cat, percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0 };
    });
  }, [scores, speechMilestones, motorMilestones]);

  const setScore = (milestoneId: string, score: 0 | 1 | 2 | 3) => {
    setScores(prev => {
      const existing = prev.findIndex(s => s.milestoneId === milestoneId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { milestoneId, score };
        return next;
      }
      return [...prev, { milestoneId, score }];
    });
  };

  const saveSession = () => {
    if (!childName.trim()) {
      toast({ title: "Enter child's name", variant: "destructive" });
      return;
    }
    if (scores.length === 0) {
      toast({ title: "Score at least one milestone", variant: "destructive" });
      return;
    }
    const session: MilestoneSession = {
      id: crypto.randomUUID(),
      childName: childName.trim(),
      childAgeMonths: childAge,
      scores: [...scores],
      createdAt: new Date().toISOString(),
    };
    const updated = [...sessions, session];
    setSessions(updated);
    localStorage.setItem("newro_milestone_sessions", JSON.stringify(updated));
    toast({ title: "Session saved", description: `Milestone data recorded for ${childName}` });
    setActiveTab("dashboard");
  };

  const renderMilestoneList = (list: typeof speechMilestones, domain: string) => {
    const grouped: Record<number, typeof list> = {};
    list.forEach(m => {
      if (!grouped[m.ageMonth]) grouped[m.ageMonth] = [];
      grouped[m.ageMonth].push(m);
    });

    return Object.entries(grouped).map(([age, ms]) => (
      <div key={`${domain}-${age}`} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-primary bg-secondary px-2.5 py-1 rounded-full">
            {Number(age) < 12 ? `${age}m` : `${Math.floor(Number(age) / 12)}y ${Number(age) % 12 ? `${Number(age) % 12}m` : ""}`}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="space-y-2">
          {ms.map(m => {
            const currentScore = scores.find(s => s.milestoneId === m.id)?.score;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{m.description}</p>
                  <p className="text-xs text-muted-foreground">{m.category}</p>
                </div>
                <div className="flex gap-1">
                  {([0, 1, 2, 3] as const).map(val => (
                    <button
                      key={val}
                      onClick={() => setScore(m.id, val)}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all border",
                        currentScore === val
                          ? scoreLabels[val].color + " border-current font-bold scale-110"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                      title={scoreLabels[val].label}
                    >
                      {scoreIcons[val]}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    ));
  };

  const TrafficLightCard = ({ domain, traffic, pct }: {
    domain: string;
    traffic: ReturnType<typeof getTrafficLight>;
    pct: number;
  }) => {
    const c = trafficColors[traffic.status];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("rounded-2xl border-2 p-5", c.bg, c.border)}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-4 h-4 rounded-full animate-pulse-soft", c.dot)} />
          <h4 className={cn("font-display font-bold", c.text)}>{domain}</h4>
          <span className={cn("ml-auto text-2xl font-display font-bold", c.text)}>{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/60 overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full", c.dot)}
          />
        </div>
        <p className={cn("text-xs", c.text)}>{traffic.label} — {traffic.description}</p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <Baby className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-lg text-foreground">Milestone Tracker</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Child info bar */}
        <Card className="mb-8 border-2">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[180px] space-y-2">
                <Label>Child's Name</Label>
                <Input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Enter name" className="bg-background" />
              </div>
              <div className="w-40 space-y-2">
                <Label>Age</Label>
                <Select value={String(childAge)} onValueChange={v => { setChildAge(Number(v)); setScores([]); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ageOptions.map(a => (
                      <SelectItem key={a} value={String(a)}>
                        {a < 12 ? `${a} months` : `${Math.floor(a / 12)}y ${a % 12 ? `${a % 12}m` : ""}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {speechMilestones.length + motorMilestones.length} milestones to track
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-8">
            <TabsTrigger value="score">Score Milestones</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* === SCORING TAB === */}
          <TabsContent value="score">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Speech */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-lg text-foreground">Speech & Language</h3>
                  <span className="ml-auto text-sm text-muted-foreground">{speechMilestones.length} items</span>
                </div>
                {renderMilestoneList(speechMilestones, "speech")}
              </div>
              {/* Motor */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-bold text-lg text-foreground">Motor</h3>
                  <span className="ml-auto text-sm text-muted-foreground">{motorMilestones.length} items</span>
                </div>
                {renderMilestoneList(motorMilestones, "motor")}
              </div>
            </div>

            {/* Save button */}
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="shadow-glow px-8" onClick={saveSession}>
                Save Session & View Dashboard <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Score legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
              {([0, 1, 2, 3] as const).map(v => (
                <div key={v} className="flex items-center gap-1.5">
                  <span className={cn("w-6 h-6 rounded flex items-center justify-center", scoreLabels[v].color)}>
                    {scoreIcons[v]}
                  </span>
                  {scoreLabels[v].label}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* === DASHBOARD TAB === */}
          <TabsContent value="dashboard">
            <AnimatePresence>
              {scores.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <Baby className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Score milestones first to see the dashboard</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  {/* Traffic lights */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TrafficLightCard domain="Speech & Language" traffic={speechTraffic} pct={speechPct} />
                    <TrafficLightCard domain="Motor Development" traffic={motorTraffic} pct={motorPct} />
                  </div>

                  {/* Regression alerts */}
                  {(speechRegression.hasRegression || motorRegression.hasRegression) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-destructive/10 border-2 border-destructive/30 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <h4 className="font-display font-bold text-destructive">Regression Alert</h4>
                      </div>
                      {speechRegression.hasRegression && <p className="text-sm text-destructive mb-1">⚠️ {speechRegression.details}</p>}
                      {motorRegression.hasRegression && <p className="text-sm text-destructive">⚠️ {motorRegression.details}</p>}
                    </motion.div>
                  )}

                  {/* Domain bar chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Domain Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={domainBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v: number) => [`${v}%`, "Achievement"]} />
                          <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                            {domainBarData.map((d, i) => (
                              <Cell
                                key={i}
                                fill={d.percentage >= 80 ? "hsl(var(--primary))" : d.percentage >= 50 ? "hsl(45, 80%, 55%)" : "hsl(var(--destructive))"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Progress over time */}
                  {chartData.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Progress Over Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="speechGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="motorGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="speech" name="Speech" stroke="hsl(var(--primary))" fill="url(#speechGrad)" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(var(--primary))" }} connectNulls />
                            <Area type="monotone" dataKey="motor" name="Motor" stroke="hsl(var(--accent))" fill="url(#motorGrad)" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(var(--accent))" }} connectNulls />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* AI Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="w-5 h-5 text-primary" /> AI Insights
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

                  {/* Activity Recommendations */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { title: "Speech Activities", activities: speechActivities, icon: <MessageSquare className="w-4 h-4 text-primary" /> },
                      { title: "Motor Activities", activities: motorActivities, icon: <Activity className="w-4 h-4 text-accent" /> },
                    ].map(section => (
                      <Card key={section.title}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            {section.icon} {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {section.activities.map((a, i) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                              <p className="text-sm font-medium text-foreground">{a.activity}</p>
                              <p className="text-xs text-muted-foreground mt-1">Target: {a.target}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Milestones achieved/pending */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader><CardTitle className="text-base text-primary">✔ Milestones Achieved</CardTitle></CardHeader>
                      <CardContent>
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                          {[...speechMilestones, ...motorMilestones]
                            .filter(m => { const s = scores.find(sc => sc.milestoneId === m.id); return s && s.score >= 2; })
                            .map(m => (
                              <li key={m.id} className="flex items-center gap-2 text-sm text-foreground">
                                <Check className="w-4 h-4 text-primary shrink-0" />
                                {m.description}
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="text-base text-muted-foreground">○ Milestones Pending</CardTitle></CardHeader>
                      <CardContent>
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                          {[...speechMilestones, ...motorMilestones]
                            .filter(m => { const s = scores.find(sc => sc.milestoneId === m.id); return !s || s.score < 2; })
                            .map(m => (
                              <li key={m.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CircleDot className="w-4 h-4 shrink-0" />
                                {m.description}
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* === HISTORY TAB === */}
          <TabsContent value="history">
            {sessions.length === 0 ? (
              <div className="text-center py-20">
                <TrendingUp className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No sessions recorded yet. Score milestones and save to track progress over time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...sessions].reverse().map(s => (
                  <Card key={s.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <Baby className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-card-foreground">{s.childName}</h4>
                        <p className="text-xs text-muted-foreground">
                          Age: {s.childAgeMonths}m • {s.scores.length} milestones scored •{" "}
                          {new Date(s.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">
                          S: {calculateAchievement(s.scores, "speech", s.childAgeMonths)}%
                        </p>
                        <p className="text-sm font-bold text-accent">
                          M: {calculateAchievement(s.scores, "motor", s.childAgeMonths)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Historical trend chart */}
                {chartData.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Development Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="speech" name="Speech" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 5 }} connectNulls />
                          <Line type="monotone" dataKey="motor" name="Motor" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 5 }} connectNulls />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MilestoneTracker;
