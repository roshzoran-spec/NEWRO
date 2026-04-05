import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Brain, Activity, MessageCircle, Users } from "lucide-react";
import { useState } from "react";

const domainData: Record<string, { name: string; score: number; zone: string }[]> = {
  language: [
    { name: "0", score: 12, zone: "green" },
    { name: "1", score: 28, zone: "green" },
    { name: "2", score: 42, zone: "green" },
    { name: "3", score: 48, zone: "yellow" },
    { name: "4", score: 68, zone: "green" },
    { name: "5", score: 82, zone: "green" },
    { name: "6", score: 91, zone: "green" },
  ],
  motor: [
    { name: "0", score: 15, zone: "green" },
    { name: "1", score: 38, zone: "green" },
    { name: "2", score: 62, zone: "green" },
    { name: "3", score: 75, zone: "green" },
    { name: "4", score: 86, zone: "green" },
    { name: "5", score: 93, zone: "green" },
    { name: "6", score: 97, zone: "green" },
  ],
  social: [
    { name: "0", score: 10, zone: "green" },
    { name: "1", score: 24, zone: "green" },
    { name: "2", score: 40, zone: "green" },
    { name: "3", score: 58, zone: "green" },
    { name: "4", score: 70, zone: "green" },
    { name: "5", score: 80, zone: "green" },
    { name: "6", score: 88, zone: "green" },
  ],
};

const domains = [
  {
    key: "language",
    label: "Language",
    icon: MessageCircle,
    color: "#3B82F6",
    gradientFrom: "#3B82F6",
    pill: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    ring: "ring-blue-500",
    delay: "3",
    insight: "Slight delay in expressive language at 36 months. Early stimulation recommended.",
    status: "Monitor",
    statusColor: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    key: "motor",
    label: "Motor",
    icon: Activity,
    color: "#10B981",
    gradientFrom: "#10B981",
    pill: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    ring: "ring-emerald-500",
    delay: null,
    insight: "Motor development is on track across all age ranges. Keep up the active play!",
    status: "On Track",
    statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    key: "social",
    label: "Social",
    icon: Users,
    color: "#8B5CF6",
    gradientFrom: "#8B5CF6",
    pill: "bg-violet-500",
    light: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    ring: "ring-violet-500",
    delay: null,
    insight: "Social engagement is progressing well. Peer play activities are showing results.",
    status: "On Track",
    statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
];

const MilestoneTrackerPreview = () => {
  const [activeDomain, setActiveDomain] = useState(0);
  const domain = domains[activeDomain];
  const data = domainData[domain.key];

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f0fffe 0%, #eef2ff 50%, #fdf4ff 100%)" }}>
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-black tracking-widest text-slate-500 uppercase mb-4 shadow-sm">
              Live AI Analysis
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2">
              Track Development —{" "}
              <span className="text-gradient-newro">Instantly</span>
            </h2>
            <p className="text-sm font-medium text-muted-foreground/70">
              Click a domain to explore your child's developmental trajectory
            </p>
          </motion.div>
        </div>

        {/* Domain Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {domains.map((d, i) => {
            const Icon = d.icon;
            const isActive = activeDomain === i;
            return (
              <motion.button
                key={d.key}
                onClick={() => setActiveDomain(i)}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                  isActive
                    ? `text-white shadow-md ${d.pill} border-transparent`
                    : `bg-white ${d.text} ${d.border} hover:shadow-sm`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {d.label}
              </motion.button>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="max-w-4xl mx-auto">
          {/* Chart Card */}
          <motion.div
            key={activeDomain}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl p-6 md:p-8 bg-white border border-slate-100 shadow-lg"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-foreground">{domain.label} Development</h3>
                <p className="text-xs text-muted-foreground font-medium">Predictive AI · Age 0–6 years</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${domain.statusColor}`}>
                {domain.status}
              </span>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 28 }}>
                  <defs>
                    <linearGradient id={`grad-${domain.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={domain.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={domain.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const isWarning = payload[0].payload.zone === "yellow";
                        return (
                          <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100">
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Age {payload[0].payload.name} yrs</p>
                            <p className="text-base font-black" style={{ color: domain.color }}>
                              {payload[0].value}%
                            </p>
                            {isWarning && <p className="text-[10px] font-bold text-amber-600 mt-1">⚠ Below expected range</p>}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontWeight: 600, fontSize: 11 }}
                    label={{ value: "Age (Years)", position: "insideBottom", offset: -8, fill: "#94A3B8", fontWeight: 700, fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={domain.color}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#grad-${domain.key})`}
                    animationDuration={600}
                  />
                  {domain.delay && (
                    <ReferenceLine x={domain.delay} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={2} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insight */}
            <div className={`mt-4 p-4 rounded-2xl border ${domain.light} ${domain.border} flex items-start gap-3`}>
              <div className="p-1.5 rounded-lg bg-white shadow-sm shrink-0">
                <Brain className="w-4 h-4" style={{ color: domain.color }} />
              </div>
              <p className="text-xs font-medium text-foreground/80 leading-relaxed">{domain.insight}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MilestoneTrackerPreview;
