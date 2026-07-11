import { motion } from "framer-motion";
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  ReferenceDot,
  Label,
  CartesianGrid
} from "recharts";
import { Brain, Activity, MessageCircle, Users, Lightbulb } from "lucide-react";
import { useState } from "react";

// Generate curved reference bands approximating neurotypical progression
const generateBands = (age: number) => {
  // Expected median line across ages 0-6 years
  const expected = age === 0 ? 25 : age === 1 ? 40 : age === 2 ? 60 : age === 3 ? 75 : age === 4 ? 85 : age === 5 ? 95 : 100;
  return {
    // Green (Normal range: 25th-75th percentile)
    rangeGreen: [Math.max(0, expected - 15), 100],
    // Yellow (Watch zone: 10th-25th percentile)
    rangeYellow: [Math.max(0, expected - 30), Math.max(0, expected - 15)],
    // Red (Delay zone: <10th percentile)
    rangeRed: [0, Math.max(0, expected - 30)]
  };
};

const domainData: Record<string, any[]> = {
  language: [
    { name: "0", age: 0, score: 20, ...generateBands(0) },
    { name: "1", age: 1, score: 38, ...generateBands(1) },
    { name: "2", age: 2, score: 55, ...generateBands(2) },
    { 
      name: "3", age: 3, score: 48, ...generateBands(3), 
      isWarning: true, 
      annotation: "⚠️ Mild expressive delay detected at 36 months",
      annoColor: "text-amber-800", annoBg: "bg-amber-100 border-amber-300"
    },
    { name: "4", age: 4, score: 62, ...generateBands(4) },
    { name: "5", age: 5, score: 85, ...generateBands(5) },
    { name: "6", age: 6, score: 95, ...generateBands(6) },
  ],
  motor: [
    { name: "0", age: 0, score: 24, ...generateBands(0) },
    { name: "1", age: 1, score: 42, ...generateBands(1) },
    { name: "2", age: 2, score: 63, ...generateBands(2) },
    { name: "3", age: 3, score: 76, ...generateBands(3) },
    { name: "4", age: 4, score: 88, ...generateBands(4) },
    { name: "5", age: 5, score: 98, ...generateBands(5) },
    { name: "6", age: 6, score: 100, ...generateBands(6) },
  ],
  social: [
    { name: "0", age: 0, score: 18, ...generateBands(0) },
    { name: "1", age: 1, score: 35, ...generateBands(1) },
    { name: "2", age: 2, score: 45, ...generateBands(2) },
    { name: "3", age: 3, score: 50, ...generateBands(3) },
    { 
      name: "4", age: 4, score: 35, ...generateBands(4), 
      isAlert: true,
      annotation: "🚨 Significant delay – clinical attention recommended",
      annoColor: "text-red-700", annoBg: "bg-red-50 border-red-300"
    },
    { name: "5", age: 5, score: 48, ...generateBands(5) },
    { name: "6", age: 6, score: 65, ...generateBands(6) },
  ],
  cognitive: [
    { name: "0", age: 0, score: 26, ...generateBands(0) },
    { name: "1", age: 1, score: 45, ...generateBands(1) },
    { name: "2", age: 2, score: 65, ...generateBands(2) },
    { name: "3", age: 3, score: 78, ...generateBands(3) },
    { name: "4", age: 4, score: 92, ...generateBands(4) },
    { name: "5", age: 5, score: 98, ...generateBands(5) },
    { name: "6", age: 6, score: 100, ...generateBands(6) },
  ],
};

const domains = [
  {
    key: "language",
    label: "Language",
    icon: MessageCircle,
    color: "#3B82F6", // bright blue line for the child curve
    pill: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    insight: "Expressive language shows a slight dip against the median trend line.",
    status: "Watch Zone",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    key: "motor",
    label: "Motor",
    icon: Activity,
    color: "#3B82F6",
    pill: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    insight: "Motor development is firmly in the green zone across all age ranges.",
    status: "On Track",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    key: "social",
    label: "Social",
    icon: Users,
    color: "#3B82F6",
    pill: "bg-violet-500",
    light: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    insight: "Social engagement has dropped into the critical red zone needing intervention.",
    status: "Needs Attention",
    statusColor: "text-red-700 bg-red-50 border-red-200",
  },
  {
    key: "cognitive",
    label: "Cognitive",
    icon: Lightbulb,
    color: "#3B82F6",
    pill: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    insight: "Cognitive skills tracking well into the advanced percentiles for problem-solving.",
    status: "Advanced",
    statusColor: "text-purple-700 bg-purple-50 border-purple-200",
  },
];

const CustomLineDot = (props: any) => {
  const { cx, cy, payload, stroke } = props;
  
  // Entering Red Zone
  if (payload.isAlert) {
    return (
      <g transform={`translate(${cx},${cy})`}>
        <circle r="14" fill="#EF4444" className="animate-ping opacity-60" />
        <circle r="8" fill="#EF4444" stroke="#fff" strokeWidth={2.5} className="shadow-lg" />
      </g>
    );
  }
  
  // Entering Yellow Zone
  if (payload.isWarning) {
    return (
      <g transform={`translate(${cx},${cy})`}>
        <circle r="8" fill="#F59E0B" stroke="#fff" strokeWidth={2.5} className="shadow-md" />
      </g>
    );
  }

  // Normal progression
  return (
    <circle cx={cx} cy={cy} r={5} fill={stroke} stroke="#fff" strokeWidth={2.5} className="shadow-sm drop-shadow-md" />
  );
};

const AnnotationBubble = (props: any) => {
  const { viewBox, payload } = props;
  if (!viewBox) return null;
  
  // Determine if it should render above or below based on space
  const yOffset = payload.isAlert ? 25 : -85;
  
  return (
    <svg x={viewBox.x - 120} y={viewBox.y + yOffset} className="overflow-visible">
      <foreignObject width="240" height="70">
        <div className={`p-2.5 rounded-xl border-2 shadow-xl flex items-center justify-center text-xs font-bold leading-tight text-center ${payload.annoBg} ${payload.annoColor} animate-in fade-in zoom-in slide-in-from-bottom-2 duration-500`}>
          {payload.annotation}
        </div>
      </foreignObject>
    </svg>
  );
};

const MilestoneTrackerPreview = () => {
  const [activeDomain, setActiveDomain] = useState(0);
  const domain = domains[activeDomain];
  const data = domainData[domain.key];

  return (
    <div className="w-full relative z-10 perspective-1000">

        {/* Domain Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
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
                    : `bg-white text-slate-600 border-slate-200 hover:shadow-sm hover:border-slate-300 hover:text-slate-900`
                }`}
              >
                <Icon className="w-4 h-4" />
                {d.label}
              </motion.button>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="max-w-5xl mx-auto">
          {/* Chart Card */}
          <motion.div
            key={activeDomain}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[2.5rem] p-6 md:p-10 bg-white border border-slate-100 shadow-xl relative overflow-visible"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                  <domain.icon className={`w-6 h-6 ${domain.text}`} />
                  {domain.label} Trajectory
                </h3>
                <p className="text-sm text-slate-500 font-semibold mt-1">Percentile bands based on standardized pediatric milestones.</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-black border ${domain.statusColor} shadow-sm shrink-0 whitespace-nowrap`}>
                Status: {domain.status}
              </span>
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <filter id="glow-line" x="-10%" y="-10%" width="120%" height="120%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" />
                  
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 700 }}
                    itemStyle={{ color: '#0F172A' }}
                    formatter={(value: number, name: string) => {
                      if (name === "Child's Curve") return [`${value} Score`, name];
                      return [null, null];
                    }}
                    labelFormatter={(label) => `Age ${label} years`}
                  />

                  {/* Y-Axis with Sub-labels identifying the Zones contextually */}
                  <YAxis 
                    domain={[0, 100]} 
                    axisLine={false} 
                    tickLine={false} 
                    ticks={[10, 50, 90]} 
                    width={100}
                    tick={({ x, y, payload }: any) => {
                      const texts: Record<number, string> = { 10: "Delayed (<10th)", 50: "Typical (25th-75th)", 90: "Advanced" };
                      const colors: Record<number, string> = { 10: "#EF4444", 50: "#10B981", 90: "#3B82F6" };
                      return (
                        <text x={x} y={y} fill={colors[payload.value] || "#94A3B8"} fontSize={11} fontWeight={800} textAnchor="end" dy={4}>
                          {texts[payload.value]}
                        </text>
                      );
                    }}
                  />
                  
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#CBD5E1", strokeWidth: 2 }}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontWeight: 700, fontSize: 12 }}
                    dy={12}
                    label={{ value: "Child's Age (Years)", position: "bottom", offset: -5, fill: "#475569", fontWeight: 800, fontSize: 13 }}
                  />

                  {/* Reference Band 1: Red Zone (Delay) */}
                  <Area
                    type="monotone"
                    dataKey="rangeRed"
                    stroke="none"
                    fill="#FEE2E2"
                    fillOpacity={0.6}
                    isAnimationActive={false}
                    name="Delay Zone"
                    activeDot={false}
                  />

                  {/* Reference Band 2: Yellow Zone (Borderline/Watch) */}
                  <Area
                    type="monotone"
                    dataKey="rangeYellow"
                    stroke="none"
                    fill="#FEF3C7"
                    fillOpacity={0.6}
                    isAnimationActive={false}
                    name="Watch Zone"
                    activeDot={false}
                  />

                  {/* Reference Band 3: Green Zone (Normal Range) */}
                  <Area
                    type="monotone"
                    dataKey="rangeGreen"
                    stroke="none"
                    fill="#D1FAE5"
                    fillOpacity={0.5}
                    isAnimationActive={false}
                    name="Normal Range"
                    activeDot={false}
                  />

                  {/* Child's Development Curve */}
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Child's Curve"
                    stroke={domain.color}
                    strokeWidth={4.5}
                    dot={<CustomLineDot />}
                    activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
                    style={{ filter: "url(#glow-line)" }}
                    animationDuration={1500}
                  />

                  {/* Conditional Elements mapping for Smart Markers */}
                  {data.map((d) => {
                    if (d.isAlert || d.isWarning) {
                      return (
                        <ReferenceLine 
                          key={`ref-line-${d.name}`} 
                          x={d.name} 
                          stroke={d.isAlert ? "#EF4444" : "#F59E0B"} 
                          strokeDasharray="4 4" 
                          strokeWidth={2} 
                        />
                      );
                    }
                    return null;
                  })}
                  
                  {data.map((d) => {
                    if (d.isAlert || d.isWarning) {
                      return (
                        <ReferenceDot 
                          key={`ref-dot-${d.name}`} 
                          x={d.name} 
                          y={d.score} 
                          r={0} 
                          isFront 
                          label={<AnnotationBubble payload={d} />} 
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Current Age Marker */}
                  <ReferenceLine x="3" stroke="#64748B" strokeDasharray="3 3" strokeWidth={2}>
                    <Label 
                      position="insideTopLeft" 
                      fill="#334155" 
                      fontSize={12} 
                      fontWeight={800}
                      offset={10}
                      className="bg-white/80 px-2 py-1 rounded"
                    >
                      Current Age: 3 years
                    </Label>
                  </ReferenceLine>

                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insight */}
            <div className={`mt-8 p-5 rounded-2xl border ${domain.light} ${domain.border} flex items-start gap-4 shadow-sm`}>
              <div className="p-2 rounded-xl bg-white shadow-sm shrink-0">
                <Brain className="w-5 h-5 flex-shrink-0" style={{ color: domain.color }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1">Clinical Insight</span>
                <p className="text-sm font-bold text-foreground/80 leading-relaxed">{domain.insight}</p>
              </div>
            </div>
            
          </motion.div>
        </div>
    </div>
  );
};

export default MilestoneTrackerPreview;
