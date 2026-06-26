import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  MessageCircle,
  Users,
  Lightbulb,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Baby,
  Clock,
  Plus,
  Bell,
  Zap,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Star,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  notes: string;
}

interface AssessmentItem {
  id: string;
  title: string;
  assessment_type: string;
  created_at: string;
}

interface DashboardOverviewProps {
  child: Child;
  parentName?: string;
  assessments?: AssessmentItem[];
}

const generateHistoricalData = (ageInMonths: number) => {
  const points = [];
  for (let i = 0; i <= Math.max(ageInMonths + 6, 24); i += 2) {
    const progress = (i / 48) * 100;
    points.push({
      age: i,
      motor: Math.min(100, Math.max(0, progress + (Math.sin(i / 5) * 5) + 5)),
      language: Math.min(100, Math.max(0, progress + (Math.cos(i / 4) * 8) - 5)),
      social: Math.min(100, Math.max(0, progress + (Math.sin(i / 3) * 6) + 2)),
      cognitive: Math.min(100, Math.max(0, progress + (Math.cos(i / 6) * 4) + 10)),
    });
  }
  return points;
};

const getZoneInfo = (val: number) => {
  if (val < 25) return { label: "Needs Help", emoji: "🚨", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" };
  if (val < 45) return { label: "Watch Zone", emoji: "⚠️", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" };
  if (val < 75) return { label: "On Track",   emoji: "✅", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" };
  return           { label: "Advanced",    emoji: "🌟", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/96 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl p-4 min-w-[210px]">
      <p className="font-extrabold text-slate-500 mb-3 tracking-widest uppercase text-[9px] border-b border-slate-100 pb-2">
        🕐 Age: {label} months
      </p>
      <div className="space-y-2.5">
        {payload.map((entry: any, i: number) => {
          const zone = getZoneInfo(entry.value);
          return (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                <span className="text-slate-600 font-bold text-[11px]">{entry.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-[12px]">{Math.round(entry.value)}%</span>
                <span
                  className="text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ color: zone.color, background: zone.bg, border: `1px solid ${zone.border}` }}
                >
                  {zone.emoji} {zone.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatusCard = ({ domain, status, color, icon: Icon, delay = 0, score }: any) => {
  const cfg: Record<string, { ring: string; text: string; bg: string; bar: string }> = {
    green:  { ring: "border-emerald-300", text: "text-emerald-700",  bg: "bg-emerald-50",  bar: "bg-emerald-500" },
    yellow: { ring: "border-amber-300",   text: "text-amber-700",    bg: "bg-amber-50",    bar: "bg-amber-500"   },
    blue:   { ring: "border-blue-300",    text: "text-blue-700",     bg: "bg-blue-50",     bar: "bg-blue-500"    },
    red:    { ring: "border-rose-300",    text: "text-rose-700",     bg: "bg-rose-50",     bar: "bg-rose-500"    },
  };
  const c = cfg[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-3xl border ${c.ring} ${c.bg} shadow-sm hover:shadow-md transition-all cursor-default`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-2xl bg-white shadow-sm flex items-center justify-center ${c.text}`}>
          <Icon size={18} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-white/80 ${c.text}`}>{status}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{domain}</p>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-xl font-black tracking-tighter text-slate-900">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/80 rounded-full overflow-hidden">
        <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </motion.div>
  );
};

const DashboardOverview = ({ child, parentName, assessments = [] }: DashboardOverviewProps) => {
  const dob = new Date(child.date_of_birth);
  const now = new Date();
  const diffMonths =
    (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());

  const graphData = useMemo(() => generateHistoricalData(diffMonths), [diffMonths]);

  const yAxisTick = ({ x, y, payload }: any) => {
    const map: Record<number, { label: string; color: string }> = {
      0:   { label: "0%",          color: "#cbd5e1" },
      25:  { label: "🚨 Concern",  color: "#ef4444" },
      45:  { label: "✅ Normal",    color: "#10b981" },
      75:  { label: "🌟 Advanced", color: "#3b82f6" },
      100: { label: "100%",        color: "#cbd5e1" },
    };
    const entry = map[payload.value];
    if (!entry) return <g />;
    return (
      <text x={x} y={y} fill={entry.color} fontSize={9} fontWeight={900} textAnchor="end" dy={4}>
        {entry.label}
      </text>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tighter text-foreground mb-1"
          >
            Welcome back, {parentName?.split(" ")[0] || "Parent"} 👋
          </motion.h1>
          <p className="text-muted-foreground font-bold tracking-tight">
            Here is <span className="text-primary">{child.name}'s</span> development intelligence overview for today.
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-white/50 backdrop-blur-sm border-white/60 h-8 rounded-full px-4 font-black text-[10px] uppercase tracking-widest self-start md:self-auto"
        >
          Last Updated: Just Now
        </Badge>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Profile + Status + Insight */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile */}
          <Card className="glass-panel border-white/60 rounded-[2.5rem] overflow-hidden shadow-xl border-none">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-ai-purple/20 flex items-center justify-center text-primary shadow-inner">
                  <Baby size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">{child.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {diffMonths} Months Old
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest">
                      LOW RISK
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatusCard domain="Motor"    score={88} status="On Track" color="green"  icon={Activity}       delay={0.1} />
            <StatusCard domain="Language" score={62} status="Monitor"  color="yellow" icon={MessageCircle}  delay={0.2} />
            <StatusCard domain="Social"   score={94} status="Advanced" color="blue"   icon={Users}          delay={0.3} />
            <StatusCard domain="Cognitive"score={78} status="On Track" color="green"  icon={Lightbulb}      delay={0.4} />
          </div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-ai-purple/5 to-transparent border border-primary/20 shadow-glow-soft group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:rotate-12 transition-transform">
                <Sparkles size={18} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">AI Development Insight</h4>
            </div>
            <p className="text-sm font-bold leading-relaxed text-foreground/80 mb-5">
              "Language development is slightly below expected range. Early stimulation activities and increased verbal interaction are recommended this week."
            </p>
            <Button variant="link" className="p-0 h-auto text-xs font-black uppercase text-primary tracking-widest hover:gap-2 transition-all">
              See Therapy Plan <ArrowRight size={14} />
            </Button>
          </motion.div>
        </div>

        {/* Right: Zone Chart */}
        <div className="lg:col-span-2">
          <Card className="glass-panel border-white/60 rounded-[3rem] shadow-2xl relative overflow-hidden border-none h-full">
            <CardContent className="p-8 flex flex-col h-full">

              {/* Chart Header */}
              <div className="mb-5">
                <h3 className="text-xl font-black tracking-tight mb-1">Development Intelligence</h3>
                <p className="text-[11px] font-bold text-slate-500">
                  Colored zones show how your child compares to children their age — instantly.
                </p>
              </div>

              {/* Zone Key */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                  { emoji: "🚨", label: "Needs Help", sub: "Under 25%",  color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
                  { emoji: "⚠️", label: "Watch Zone", sub: "25 – 45%",  color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
                  { emoji: "✅", label: "On Track",   sub: "45 – 75%",  color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
                  { emoji: "🌟", label: "Advanced",   sub: "Above 75%", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
                ].map((z) => (
                  <div
                    key={z.label}
                    className="flex flex-col gap-1 px-3 py-2.5 rounded-xl border text-center"
                    style={{ background: z.bg, borderColor: z.border }}
                  >
                    <span className="text-base leading-none">{z.emoji}</span>
                    <span className="text-[10px] font-black" style={{ color: z.color }}>{z.label}</span>
                    <span className="text-[8px] font-bold text-slate-400">{z.sub}</span>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="flex-1 min-h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData} margin={{ top: 8, right: 12, left: 10, bottom: 20 }}>
                    <defs>
                      {/* Background zone gradients */}
                      <linearGradient id="bgDanger"   x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fca5a5" stopOpacity={0.30} />
                        <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.10} />
                      </linearGradient>
                      <linearGradient id="bgWatch"    x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fcd34d" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#fcd34d" stopOpacity={0.08} />
                      </linearGradient>
                      <linearGradient id="bgNormal"   x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#86efac" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#86efac" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="bgAdvanced" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.05} />
                      </linearGradient>
                      {/* Line fills */}
                      <linearGradient id="fillMotor"    x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="fillLang"     x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="fillSocial"   x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="fillCog"      x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>

                    {/* Zone background bands */}
                    <ReferenceArea y1={0}  y2={25}  fill="url(#bgDanger)"   fillOpacity={1} stroke="none" />
                    <ReferenceArea y1={25} y2={45}  fill="url(#bgWatch)"    fillOpacity={1} stroke="none" />
                    <ReferenceArea y1={45} y2={75}  fill="url(#bgNormal)"   fillOpacity={1} stroke="none" />
                    <ReferenceArea y1={75} y2={100} fill="url(#bgAdvanced)" fillOpacity={1} stroke="none" />

                    {/* Zone boundary lines */}
                    <ReferenceLine y={25} stroke="#fca5a5" strokeDasharray="4 3" strokeWidth={1} />
                    <ReferenceLine y={45} stroke="#86efac" strokeDasharray="4 3" strokeWidth={1} />
                    <ReferenceLine y={75} stroke="#93c5fd" strokeDasharray="4 3" strokeWidth={1} />

                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.04)" />

                    <XAxis
                      dataKey="age"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
                      label={{ value: "Child's Age (months)", position: "insideBottom", offset: -12, fontSize: 10, fill: "#94a3b8", fontWeight: 900 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      ticks={[0, 25, 45, 75, 100]}
                      tick={yAxisTick}
                      width={76}
                    />

                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ stroke: "#6FE7DD", strokeWidth: 1.5, strokeDasharray: "4 4" }}
                    />

                    <Area animationDuration={2000} type="monotone" dataKey="motor"     stroke="#10b981" strokeWidth={3} fill="url(#fillMotor)"  name="Motor"     dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: "#10b981" }} />
                    <Area animationDuration={2500} type="monotone" dataKey="language"  stroke="#3b82f6" strokeWidth={3} fill="url(#fillLang)"   name="Language"  dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: "#3b82f6" }} />
                    <Area animationDuration={3000} type="monotone" dataKey="social"    stroke="#8b5cf6" strokeWidth={3} fill="url(#fillSocial)" name="Social"    dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: "#8b5cf6" }} />
                    <Area animationDuration={3500} type="monotone" dataKey="cognitive" stroke="#f59e0b" strokeWidth={3} fill="url(#fillCog)"    name="Cognitive" dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: "#f59e0b" }} />

                    {/* "Today" marker */}
                    {diffMonths > 0 && (
                      <ReferenceLine
                        x={diffMonths % 2 === 0 ? diffMonths : diffMonths - 1}
                        stroke="#6FE7DD"
                        strokeWidth={2}
                        strokeDasharray="5 3"
                        label={{ value: "Today", position: "insideTopRight", fontSize: 10, fontWeight: 900, fill: "#0891b2" }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Domain pill legend */}
              <div className="mt-5 flex flex-wrap gap-2 mb-4">
                {[
                  { name: "Motor",    color: "#10b981", score: 88, zone: getZoneInfo(88) },
                  { name: "Language", color: "#3b82f6", score: 62, zone: getZoneInfo(62) },
                  { name: "Social",   color: "#8b5cf6", score: 94, zone: getZoneInfo(94) },
                  { name: "Cognitive",color: "#f59e0b", score: 78, zone: getZoneInfo(78) },
                ].map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-2 bg-white/70 backdrop-blur border border-white/80 rounded-xl px-3 py-2 shadow-sm"
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-[11px] font-black text-foreground">{d.name}</span>
                    <span className="text-[11px] font-black text-slate-500">{d.score}%</span>
                    <span
                      className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ color: d.zone.color, background: d.zone.bg }}
                    >
                      {d.zone.emoji}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Momentum Bar */}
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-[2rem] border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <TrendingUp size={16} />
                  </div>
                  <p className="text-[11px] font-bold text-foreground/70 tracking-tight">
                    Overall developmental momentum is{" "}
                    <span className="text-emerald-600 font-black">+14%</span> above baseline.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/20 text-xs font-black uppercase tracking-widest h-8 px-4 hover:bg-primary/5"
                >
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Milestone Mastery + Reminders row */}
      <div className="grid lg:grid-cols-4 gap-8 mt-12">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tighter">Milestone Mastery</h3>
            <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-primary">
              View timeline
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Speech & Language", progress: 62, icon: MessageCircle, color: "blue" },
              { label: "Motor Skills",      progress: 88, icon: Activity,       color: "emerald" },
              { label: "Social Interaction",progress: 94, icon: Users,          color: "purple" },
              { label: "Cognitive Processing",progress:78, icon: Lightbulb,     color: "amber" },
            ].map((m, i) => (
              <Card key={i} className="glass-panel border-white/60 bg-white/40 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-2xl bg-${m.color}-500/10 flex items-center justify-center text-${m.color}-600`}>
                      <m.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-black text-foreground uppercase tracking-tight">{m.label}</p>
                        <span className="text-xs font-black text-primary">{m.progress}%</span>
                      </div>
                      <Progress value={m.progress} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <Bell size={14} className="text-primary" /> Reminders & Alerts
            </h3>
            <div className="space-y-3">
              {[
                { title: "Milestone Check", date: "Tomorrow",    type: "assessment", highlight: true },
                { title: "Therapy Session", date: "Apr 2, 2024", type: "session" },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  className={`p-4 rounded-[1.5rem] glass-panel border border-white/60 shadow-sm relative overflow-hidden ${r.highlight ? "bg-primary/5" : "bg-white/40"}`}
                >
                  {r.highlight && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary m-4 animate-ping" />}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {r.type === "assessment" ? (
                        <Activity size={14} className="text-primary" />
                      ) : (
                        <Clock size={14} className="text-muted-foreground" />
                      )}
                      <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{r.title}</p>
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{r.date}</p>
                  </div>
                </motion.div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase text-primary tracking-widest mt-1">
                View all reminders
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <ClipboardList size={14} className="text-primary" /> Recent Activity
            </h3>
            {assessments.length === 0 ? (
              <div className="p-4 rounded-[1.5rem] border border-white/60 bg-white/40 shadow-sm">
                <p className="text-[11px] font-black text-foreground uppercase tracking-tight">No assessments yet</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  Start a screening to build history
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-4 rounded-[1.5rem] border border-white/60 bg-white/40 shadow-sm">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{a.title}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{a.assessment_type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-[2rem] bg-foreground text-background shadow-2xl space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2 mb-2">
              <Zap size={14} /> Quick Actions
            </p>
            <div className="space-y-2">
              <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white rounded-[1rem] h-11 font-black uppercase text-[10px] tracking-widest border-none">
                Start Screening <Plus size={14} />
              </Button>
              <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white rounded-[1rem] h-11 font-black uppercase text-[10px] tracking-widest border-none">
                Add Milestone <Activity size={14} />
              </Button>
              <Button className="w-full justify-between bg-primary/20 hover:bg-primary/30 text-primary rounded-[1rem] h-11 font-black uppercase text-[10px] tracking-widest border-none mt-2">
                View Full Report <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
