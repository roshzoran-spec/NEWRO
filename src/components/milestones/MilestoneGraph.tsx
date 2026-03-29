import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Dot
} from "recharts";
import { GRAPH_MOCK_DATA } from "@/utils/milestoneData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 border-white/40 shadow-xl rounded-2xl text-xs">
        <p className="font-bold text-foreground mb-2">Age: {label} Months</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-bold text-foreground">{entry.value}%</span>
          </div>
        ))}
        {label === 30 && (
          <div className="mt-2 pt-2 border-t border-rose-500/20 text-rose-500 font-bold flex items-start gap-1">
            <span className="text-sm">🚨</span>
            <span>Not speaking 2-word phrases at 30 months</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const MilestoneGraph = () => {
  return (
    <div className="w-full h-[400px] mt-8 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={GRAPH_MOCK_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="age" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            label={{ value: "Age (Months)", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            label={{ value: "Development %", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Delay Zones */}
          <ReferenceArea x1={24} x2={48} y1={0} y2={40} fill="rgba(244, 63, 94, 0.05)" stroke="none" />
          <ReferenceArea x1={30} x2={48} y1={40} y2={65} fill="rgba(245, 158, 11, 0.05)" stroke="none" />

          {/* Expected Curve */}
          <Line
            name="Expected"
            type="monotone"
            dataKey="expected"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
          />

          {/* Predicted Curve */}
          <Line
            name="AI Predicted"
            type="monotone"
            dataKey="predicted"
            stroke="#a78bfa"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
          />

          {/* Child Progress */}
          <Line
            name="Child Progress"
            type="monotone"
            dataKey="actual"
            stroke="#0ea5e9"
            strokeWidth={4}
            dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 8, style: { filter: "url(#glow)" } }}
            connectNulls
          />
          
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="w-3 h-0.5 border-t-2 border-dashed border-[#94a3b8]" /> Expected
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
          <div className="w-3 h-1 bg-primary rounded-full shadow-glow" /> Your Child
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-ai-purple uppercase tracking-wider">
          <div className="w-3 h-0.5 border-t-2 border-dashed border-ai-purple" /> AI Predicted
        </div>
      </div>
    </div>
  );
};

export default MilestoneGraph;
