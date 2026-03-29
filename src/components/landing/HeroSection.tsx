import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, ChevronRight, Activity, MessageCircle, Users, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const aaravData = [
  { age: 1.0, motor: 20, language: 15, social: 18 },
  { age: 1.5, motor: 45, language: 35, social: 40 },
  { age: 2.0, motor: 65, language: 45, social: 60 },
  { age: 2.4, motor: 75, language: 48, social: 72 },
  { age: 3.0, motor: 90, language: 75, social: 88 },
];

const generateMockData = (baseSeed: number) => {
  return [
    { age: 1.0, motor: 15 + baseSeed, language: 10 + baseSeed, social: 12 + baseSeed },
    { age: 1.5, motor: 35 + baseSeed, language: 30 + baseSeed, social: 35 + baseSeed },
    { age: 2.0, motor: 55 + baseSeed, language: 40 + baseSeed, social: 55 + baseSeed },
    { age: 2.4, motor: 65 + baseSeed, language: 45 + baseSeed, social: 65 + baseSeed },
    { age: 3.0, motor: 85 + baseSeed, language: 70 + baseSeed, social: 85 + baseSeed },
  ];
};

const ChildCard = ({ name, age, data, delay = 0 }: { name: string; age: string; data: any[]; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
    className="relative w-full max-w-xl group"
  >
    <div className="absolute inset-0 bg-primary/5 blur-[60px] rounded-full scale-75 group-hover:scale-90 transition-transform duration-1000" />
    
    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/60 shadow-2xl animate-float relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-lg">
            👶
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black text-foreground">{name}</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{age} years</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-[9px] font-black tracking-widest text-primary uppercase border border-primary/20">
            Real-time Status
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full mb-8 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`colorMotor-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`colorLang-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`colorSocial-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card p-3 rounded-xl border-none shadow-2xl backdrop-blur-2xl">
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Age {payload[0].payload.age}</p>
                      {payload.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between gap-3 mb-0.5">
                          <span className="text-[8px] font-bold text-muted-foreground uppercase">{entry.name}</span>
                          <span className="text-[10px] font-black" style={{ color: entry.color }}>{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area animationDuration={2000} type="monotone" dataKey="motor" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill={`url(#colorMotor-${name})`} name="Motor" />
            <Area animationDuration={2500} type="monotone" dataKey="language" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill={`url(#colorLang-${name})`} name="Language" />
            <Area animationDuration={3000} type="monotone" dataKey="social" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill={`url(#colorSocial-${name})`} name="Social" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatusItem icon={<Activity size={16} />} label="Motor" status="On Track" color="emerald" />
        <StatusItem icon={<MessageCircle size={16} />} label="Language" status="Monitor" color="amber" />
        <StatusItem icon={<Users size={16} />} label="Social" status="On Track" color="purple" />
      </div>

      <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-white/40 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-xs font-bold text-foreground/80 text-left leading-tight">
          "{name} shows consistent progress in motor skills. Early language stimulation suggested."
        </p>
      </div>
    </div>
  </motion.div>
);

const StatusItem = ({ icon, label, status, color }: { icon: any; label: string; status: string; color: string }) => {
  const colorMap: any = {
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
    purple: "bg-purple-500/10 text-purple-600",
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{label}</p>
        <p className={`text-[10px] font-black ${colorMap[color].split(' ')[1]}`}>{status}</p>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id);
      
      if (!error && data) {
        setChildren(data);
      }
      setLoading(false);
    };

    fetchChildren();
  }, [user]);

  const calculateAge = (dob: string) => {
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age.toFixed(1);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden bg-gradient-newro selection:bg-primary/30">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-primary/5 via-accent/5 to-transparent blur-[120px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full glass-card border-none shadow-glow-soft">
            <div className="p-1 rounded-full bg-primary/20">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-black tracking-[0.2em] text-foreground/70 uppercase">
              AI-Powered Neurodevelopment
            </span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="mb-8 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-normal leading-[1.1] text-foreground">
            Early Minds.
          </h1>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.1em] leading-[1.1] text-gradient-newro uppercase">
            SMARTER FUTURES.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl font-medium text-muted-foreground mb-6 max-w-2xl px-4"
        >
          Every milestone tells a story. The right insight changes everything.
        </motion.p>

        <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.5 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="text-base md:text-lg text-muted-foreground max-w-3xl mb-16 font-medium leading-relaxed px-4"
        >
          Combine intelligent milestone tracking, clinical insights, and personalized therapy guidance into the world’s most advanced platform.
        </motion.p>

        <div className="w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            {user && children.length > 0 ? (
              <motion.div 
                key="children-grid"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
              >
                {children.map((child, idx) => (
                  <ChildCard 
                    key={child.id}
                    name={child.name} 
                    age={calculateAge(child.date_of_birth)} 
                    data={generateMockData(idx * 5)}
                    delay={0.6 + (idx * 0.2)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div key="demo-card" className="w-full flex justify-center">
                <ChildCard 
                  name="Aarav" 
                  age="2.4" 
                  data={aaravData} 
                  delay={0.6}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-20"
        >
          <Button asChild className="btn-pill h-14 px-10 text-lg bg-gradient-to-r from-[#6FE7DD] to-[#7AA7FF] text-foreground font-black shadow-glow-soft hover:scale-105 transition-all border-none">
            <Link to={user ? "/dashboard" : "/signup"}>
              {user ? "View Dashboard" : "Check Your Child’s Development"}
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="btn-pill h-14 px-10 text-lg border-white/60 bg-white/40 text-foreground font-black hover:bg-white/60">
            <Link to="/milestones">Track Milestones</Link>
          </Button>
        </motion.div>
        
        {/* Persistent Login/Signup accessibility hint */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Already a member? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

export default HeroSection;

