import { motion } from "framer-motion";
import { Activity, MessageCircle, Users, Lightbulb, Brain, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

/**
 * MilestoneTrackerPreview
 * A completely static, parent-friendly snapshot of a child's developmental report.
 * No auto-cycling, no re-animation — just clean, readable data at a glance.
 */

const DEMO_CHILD = {
  name: "Aarav",
  age: "2 Years 4 Months",
  domains: [
    {
      key: "motor",
      label: "Motor Skills",
      icon: Activity,
      score: 88,
      status: "On Track",
      statusColor: "text-emerald-600",
      statusBg: "bg-emerald-50 border-emerald-200",
      barColor: "bg-emerald-500",
      emoji: "🏃",
      insight: "Walking, climbing, and hand coordination are great!"
    },
    {
      key: "language",
      label: "Speech & Language",
      icon: MessageCircle,
      score: 62,
      status: "Needs Attention",
      statusColor: "text-amber-600",
      statusBg: "bg-amber-50 border-amber-200",
      barColor: "bg-amber-500",
      emoji: "💬",
      insight: "Fewer words than expected. Early support recommended."
    },
    {
      key: "social",
      label: "Social Skills",
      icon: Users,
      score: 91,
      status: "Advanced",
      statusColor: "text-blue-600",
      statusBg: "bg-blue-50 border-blue-200",
      barColor: "bg-blue-500",
      emoji: "👫",
      insight: "Loves playing with others and sharing toys!"
    },
    {
      key: "cognitive",
      label: "Cognitive Skills",
      icon: Lightbulb,
      score: 79,
      status: "On Track",
      statusColor: "text-purple-600",
      statusBg: "bg-purple-50 border-purple-200",
      barColor: "bg-purple-500",
      emoji: "🧠",
      insight: "Problem-solving and memory are developing well."
    },
  ]
};

const MilestoneTrackerPreview = () => {
  const overallScore = Math.round(
    DEMO_CHILD.domains.reduce((s, d) => s + d.score, 0) / DEMO_CHILD.domains.length
  );

  return (
    <div className="w-full relative z-10 select-none">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Live Demo · Sample Report</p>
          <h3 className="text-2xl font-black text-foreground tracking-tight">
            {DEMO_CHILD.name}'s <span className="text-primary">Development Report</span>
          </h3>
          <p className="text-sm font-bold text-slate-500 mt-0.5">{DEMO_CHILD.age}</p>
        </div>

        {/* Overall Score Ring */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <motion.circle
                cx="40" cy="40" r="32"
                stroke="#6FE7DD" strokeWidth="8" fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 32}
                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - overallScore / 100) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-foreground leading-none">{overallScore}%</span>
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">overall</span>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Developing Well</span>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="space-y-4">
        {DEMO_CHILD.domains.map((domain, i) => {
          const Icon = domain.icon;
          return (
            <motion.div
              key={domain.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-white/60 shadow-sm"
            >
              {/* Emoji + Icon */}
              <div className="text-2xl w-10 text-center shrink-0">{domain.emoji}</div>

              {/* Label + Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-black text-foreground">{domain.label}</p>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${domain.statusBg} ${domain.statusColor}`}>
                    {domain.status}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${domain.barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${domain.score}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-bold mt-1.5 leading-snug">{domain.insight}</p>
              </div>

              {/* Score */}
              <div className={`text-xl font-black shrink-0 ${domain.statusColor}`}>
                {domain.score}%
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insight Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-primary/8 via-ai-purple/5 to-transparent border border-primary/15 flex items-start gap-4"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Newro AI Insight</p>
          <p className="text-sm font-bold text-foreground/80 leading-relaxed">
            Aarav is progressing well overall. <span className="text-amber-600">Speech & Language</span> shows a mild delay at this age — early interactive reading and naming games for 15 min/day can make a big difference.
          </p>
        </div>
      </motion.div>

    </div>
  );
};

export default MilestoneTrackerPreview;
