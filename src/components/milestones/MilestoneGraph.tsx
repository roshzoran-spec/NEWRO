import React, { useMemo } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from "recharts";
import { GRAPH_MOCK_DATA } from "@/utils/milestoneData";
import { Info } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isActualAvailable = data.actual !== null;
    let status = "On Track";
    let statusColor = "text-emerald-500";
    
    if (isActualAvailable) {
      if (data.actual < data.normalMin) {
        status = "Needs Attention";
        statusColor = "text-rose-500";
      } else if (data.actual > data.normalMax) {
        status = "Advanced";
        statusColor = "text-purple-500";
      }
    } else {
      status = "Predicted";
      statusColor = "text-ai-purple";
    }

    return (
      <div className="glass-panel p-4 border-white/40 shadow-xl rounded-2xl text-[10px] min-w-[200px]">
        <div className="flex justify-between items-center mb-3">
          <p className="font-black text-foreground uppercase tracking-widest">Age: {label} Months</p>
          <div className={`px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-white/50 border ${statusColor} border-current/20`}>
            {status}
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Normal Range Info */}
          <div className="flex justify-between items-center pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <span className="font-bold text-muted-foreground uppercase tracking-widest">Normal Range</span>
            </div>
            <span className="font-bold text-slate-500">
              {Math.max(0, data.normalMin)}% - {Math.min(100, data.normalMax)}%
            </span>
          </div>

          {/* Child Progress or Prediction */}
          {isActualAvailable ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
                <span className="font-bold text-primary uppercase tracking-widest text-xs">Your Child</span>
              </div>
              <span className="font-black text-primary text-sm">{data.actual}%</span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 border-t-2 border-dashed border-ai-purple" />
                <span className="font-bold text-ai-purple uppercase tracking-widest">AI Prediction</span>
              </div>
              <span className="font-black text-ai-purple">{data.predicted}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const MilestoneGraph = () => {
  // Pre-process data to include normalMin and normalMax bounds for a "Green Zone" Look
  const graphData = useMemo(() => {
    return GRAPH_MOCK_DATA.map(point => {
      // Create a sensible band that widens slightly as age progresses (accounting for natural variations)
      const variance = 8 + (point.age / 12) * 2; 
      return {
        ...point,
        normalMin: Math.max(0, point.expected - variance),
        normalMax: Math.min(100, point.expected + variance),
        normalBand: [Math.max(0, point.expected - Math.floor(variance)), Math.min(100, point.expected + Math.ceil(variance))]
      };
    });
  }, []);

  return (
    <div className="w-full flex flex-col h-full bg-white/30 rounded-[2rem] border border-white/40 p-6 relative">
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-white/60">
           <Info size={14} className="text-primary"/> The gray band represents the normal expected developmental range.
         </div>
      </div>

      <div className="w-full h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={graphData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
            <defs>
              <filter id="glowGraph" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="age" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            
            {/* The Normal Range Area */}
            <Area 
              type="monotone" 
              dataKey="normalBand" 
              stroke="none" 
              fill="#f1f5f9" // light slate color for normal band
              name="Normal Range" 
            />

            {/* Expected Median Curve */}
            <Line
              name="Expected Median"
              type="monotone"
              dataKey="expected"
              stroke="#cbd5e1"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
            />

            {/* AI Predicted Curve */}
            <Line
              name="AI Predicted"
              type="monotone"
              dataKey="predicted"
              stroke="#8b5cf6" // ai-purple
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />

            {/* Actual Child Progress */}
            <Line
              name="Your Child"
              type="monotone"
              dataKey="actual"
              stroke="#0ea5e9" // primary
              strokeWidth={4}
              dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, style: { filter: "url(#glowGraph)" } }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Clear Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 p-4 rounded-2xl bg-white/40 border border-white/60">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="w-4 h-4 rounded bg-[#f1f5f9] border border-slate-200" /> Normal Range
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="w-4 h-0.5 border-t-2 border-dashed border-slate-300" /> Expected Median
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
          <div className="w-3 h-3 bg-primary rounded-full shadow-glow" /> Your Child
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-ai-purple uppercase tracking-widest">
          <div className="w-4 h-0.5 border-t-2 border-dashed border-[#8b5cf6]" /> AI Future Prediction
        </div>
      </div>
    </div>
  );
};

export default MilestoneGraph;
