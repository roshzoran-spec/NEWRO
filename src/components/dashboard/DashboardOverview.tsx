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
  ReferenceArea
} from "recharts";
import { 
  Activity, 
  MessageCircle, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Bell,
  Zap,
  ClipboardList
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

interface DashboardOverviewProps {
  child: Child;
  parentName?: string;
}

const generateHistoricalData = (ageInMonths: number) => {
  const points = [];
  for (let i = 0; i <= ageInMonths + 6; i += 2) {
    const progress = (i / 48) * 100; // Simulated 4-year span
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 border-white/40 shadow-2xl rounded-2xl text-[10px] min-w-[150px]">
        <p className="font-extrabold text-foreground mb-3 tracking-widest uppercase text-[8px]">Age: {label} Months</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground font-bold tracking-tight">{entry.name}</span>
              </div>
              <span className="font-black text-foreground">{Math.round(entry.value)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const StatusCard = ({ domain, status, color, icon: Icon, delay = 0 }: any) => {
  const colorMap: any = {
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    yellow: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    red: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-3xl border glass-panel transition-all hover:scale-[1.02] cursor-default flex items-center justify-between group h-full`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl ${colorMap[color].split(' ')[0]} flex items-center justify-center transition-transform group-hover:rotate-12`}>
          <Icon size={20} className={colorMap[color].split(' ')[1]} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{domain}</p>
          <p className={`text-xs font-black ${colorMap[color].split(' ')[1]} uppercase tracking-tighter`}>{status}</p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${colorMap[color].split(' ')[0]} animate-pulse opacity-50`} />
    </motion.div>
  );
};

const DashboardOverview = ({ child, parentName }: DashboardOverviewProps) => {
  const dob = new Date(child.date_of_birth);
  const now = new Date();
  const diffMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  
  const graphData = useMemo(() => generateHistoricalData(diffMonths), [diffMonths]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tighter text-foreground mb-1"
          >
            Welcome back, {parentName?.split(' ')[0] || "Parent"} 👋
          </motion.h1>
          <p className="text-muted-foreground font-bold tracking-tight">
            Here is <span className="text-primary">{child.name}'s</span> development intelligence overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-white/60 h-8 rounded-full px-4 font-black text-[10px] uppercase tracking-widest">
            Last Updated: Just Now
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Insights */}
        <div className="lg:col-span-1 space-y-8">
          {/* Child Profile Mini-Card */}
          <Card className="glass-panel border-white/60 rounded-[2.5rem] overflow-hidden shadow-xl border-none">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-ai-purple/20 flex items-center justify-center text-primary shadow-inner">
                  <Baby size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">{child.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{diffMonths} Months Old</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest">LOW RISK</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatusCard domain="Motor" status="On Track" color="green" icon={Activity} delay={0.1} />
            <StatusCard domain="Language" status="Monitor" color="yellow" icon={MessageCircle} delay={0.2} />
            <StatusCard domain="Social" status="Advanced" color="green" icon={Users} delay={0.3} />
            <StatusCard domain="Cognitive" status="On Track" color="green" icon={Lightbulb} delay={0.4} />
          </div>

          {/* AI Insight Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-ai-purple/5 to-transparent border border-primary/20 shadow-glow-soft group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:rotate-12 transition-transform">
                <Sparkles size={18} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">AI Development Insight</h4>
            </div>
            <p className="text-sm font-bold leading-relaxed text-foreground/80 mb-6">
              "Language development is slightly below expected range. Early stimulation activities and increased verbal interaction are recommended this week."
            </p>
            <Button variant="link" className="p-0 h-auto text-xs font-black uppercase text-primary tracking-widest hover:gap-2 transition-all">
              See Therapy Plan <ArrowRight size={14} />
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Key Centerpiece Graph */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-panel border-white/60 rounded-[3rem] shadow-2xl relative overflow-hidden border-none h-full">
            <CardContent className="p-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-black tracking-tight mb-1">Development Intelligence</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">4D Trajectory across all domains</p>
                </div>
                <div className="flex items-center gap-4 bg-black/5 rounded-2xl p-2 px-4">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-[9px] font-black uppercase text-muted-foreground">Motor</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                     <span className="text-[9px] font-black uppercase text-muted-foreground">Lang</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-purple-500" />
                     <span className="text-[9px] font-black uppercase text-muted-foreground">Soc</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-orange-500" />
                     <span className="text-[9px] font-black uppercase text-muted-foreground">Cog</span>
                   </div>
                </div>
              </div>

              <div className="flex-1 min-h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMotor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLang" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCog" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(0,0,0,0.03)" />
                    <XAxis 
                      dataKey="age" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Area animationDuration={2000} type="monotone" dataKey="motor" stroke="#10b981" strokeWidth={4} fill="url(#colorMotor)" name="Motor" />
                    <Area animationDuration={2500} type="monotone" dataKey="language" stroke="#3b82f6" strokeWidth={4} fill="url(#colorLang)" name="Language" />
                    <Area animationDuration={3000} type="monotone" dataKey="social" stroke="#8b5cf6" strokeWidth={4} fill="url(#colorSocial)" name="Social" />
                    <Area animationDuration={3500} type="monotone" dataKey="cognitive" stroke="#f59e0b" strokeWidth={4} fill="url(#colorCog)" name="Cognitive" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 flex items-center justify-between p-4 bg-primary/5 rounded-[2rem] border border-primary/10">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <TrendingUp size={16} />
                   </div>
                   <p className="text-[11px] font-bold text-foreground/70 tracking-tight">Overall developmental momentum is <span className="text-emerald-600 font-black">+14%</span> above baseline.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-xs font-black uppercase tracking-widest h-8 px-4 hover:bg-primary/5">
                  Export intelligence report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Detailed Milestone Tracking & Reminders */}
      <div className="grid lg:grid-cols-4 gap-8 mt-12">
        {/* Milestone Domain Feed */}
        <div className="lg:col-span-3 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tighter">Milestone Mastery</h3>
              <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-primary">View timeline</Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Speech & Language", progress: 72, icon: MessageCircle, color: "blue" },
                { label: "Motor Skills", progress: 88, icon: Activity, color: "emerald" },
                { label: "Social Interaction", progress: 64, icon: Users, color: "purple" },
                { label: "Cognitive Processing", progress: 91, icon: Lightbulb, color: "amber" },
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

        {/* Reminders, Recent & Actions */}
        <div className="lg:col-span-1 space-y-8">
           {/* Reminders & Alerts */}
           <div className="space-y-4">
              <h3 className="text-sm font-black tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                 <Bell size={14} className="text-primary" /> Reminders & Alerts
              </h3>
              <div className="space-y-3">
                 {[
                   { title: "Milestone Check", date: "Tomorrow", type: "assessment", highlight: true },
                   { title: "Therapy Session", date: "Apr 2, 2024", type: "session" },
                 ].map((r, i) => (
                   <motion.div
                    key={i}
                    whileHover={{ x: 5 }}
                    className={`p-4 rounded-[1.5rem] glass-panel border border-white/60 shadow-sm relative overflow-hidden ${r.highlight ? 'bg-primary/5' : 'bg-white/40'}`}
                   >
                     {r.highlight && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary m-4 animate-ping" />}
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           {r.type === 'assessment' ? <Activity size={14} className="text-primary" /> : <Clock size={14} className="text-muted-foreground" />}
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

           {/* Recent Activity */}
           <div className="space-y-4">
              <h3 className="text-sm font-black tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                 <ClipboardList size={14} className="text-primary" /> Recent Activity
              </h3>
              <div className="space-y-3">
                 <div className="p-4 rounded-[1.5rem] border border-white/60 bg-white/40 shadow-sm">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Mar 28, 2024</p>
                    <p className="text-[11px] font-black text-foreground uppercase tracking-tight">General Screening Completed</p>
                 </div>
                 <div className="p-4 rounded-[1.5rem] border border-white/60 bg-white/40 shadow-sm">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Mar 25, 2024</p>
                    <p className="text-[11px] font-black text-foreground uppercase tracking-tight">AI Clinical Report Generated</p>
                 </div>
              </div>
           </div>

           {/* Quick Actions Panel */}
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
