import React from 'react';
import { useAnalysis } from '../services/AnalysisContext';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { Map as MapIcon, Zap, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export const Visualization = () => {
  const { analyses } = useAnalysis();

  const data = Array.from(
    new Map(
        analyses
            .filter(a => a.status === 'completed')
            .map(a => {
                const s = a.scores;
                const eff = s.physical_override !== undefined 
                    ? s.physical_override * 10 
                    : Math.min(((s.absorption_score + s.permeability_score) / 4) * 100, 100);
                
                const tox = s.safety_override !== undefined
                    ? (10 - s.safety_override) * 10
                    : (s.toxicity_penalty / 5) * 100;

                return [a.name, {
                    name: a.name,
                    bioavailability: eff,
                    toxicity: tox,
                    score: a.totalScore,
                    id: a.id
                }];
            })
    ).values()
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl min-w-[200px]">
          <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2 mb-2">{d.name}</p>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase flex justify-between gap-4">
                Efficiency Index: <span className="text-blue-600">{d.bioavailability.toFixed(0)}%</span>
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase flex justify-between gap-4">
                Toxicity Load: <span className={cn("font-black", d.toxicity > 30 ? "text-rose-600" : "text-emerald-600")}>{d.toxicity.toFixed(0)}%</span>
            </p>
            <p className="text-[10px] font-black text-slate-900 uppercase flex justify-between gap-4 pt-1 mt-1 border-t border-slate-50">
                Composite Score: <span>{d.score.toFixed(1)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-4xl font-black text-black tracking-tight">Pareto Multi-Objective Map</h2>
          <p className="text-slate-600 font-bold mt-1 text-lg">Comparing molecular efficiency against prioritized safety hazards.</p>
        </div>
        <div className="flex items-center gap-6 bg-slate-50/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.3)]" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Critical</span>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-[40px] p-6 shadow-sm relative overflow-hidden">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 60, right: 80, bottom: 60, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              
              {/* High Risk Zone (Toxicity > 60%) */}
              <ReferenceArea 
                y1={60} 
                y2={100} 
                fill="#fff1f2" 
                fillOpacity={0.5} 
              />
              <ReferenceLine y={60} stroke="#fda4af" strokeDasharray="5 5" strokeWidth={2} label={{ 
                value: 'HIGH TOXICITY THRESHOLD', 
                position: 'insideTopLeft', 
                fill: '#e11d48', 
                fontSize: 10, 
                fontWeight: 900,
                letterSpacing: '0.15em',
                offset: 20
              }} />

              {/* Safe Zone (Toxicity < 30%) */}
              <ReferenceArea 
                y1={0} 
                y2={30} 
                fill="#f0fdf4" 
                fillOpacity={0.4} 
              />
              <ReferenceLine y={30} stroke="#86efac" strokeDasharray="8 4" label={{ 
                value: 'OPTIMAL SAFETY ZONE', 
                position: 'insideBottomLeft', 
                fill: '#059669', 
                fontSize: 10, 
                fontWeight: 900,
                letterSpacing: '0.15em',
                offset: 15
              }} />

              {/* Optimal Horizon Markers */}
              <ReferenceLine x={90} stroke="#cbd5e1" strokeDasharray="3 3" label={{ 
                value: 'PARETO OPTIMAL', 
                position: 'insideBottomRight', 
                fill: '#2563eb', 
                fontSize: 10, 
                fontWeight: 900,
                letterSpacing: '0.1em',
                offset: 20
              }} />

              <XAxis 
                type="number" 
                dataKey="bioavailability" 
                name="Efficiency" 
                unit="%" 
                domain={[0, 100]} 
                label={{ 
                    value: "BIOAVAILABILITY EFFICIENCY (%)", 
                    position: 'insideBottom', 
                    offset: -25, 
                    fontSize: 11, 
                    fontWeight: 900, 
                    fill: '#475569',
                    letterSpacing: '0.15em'
                }}
                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <YAxis 
                type="number" 
                dataKey="toxicity" 
                name="Toxicity Load" 
                unit="%"
                domain={[0, 100]}
                label={{ 
                    value: "TOXICITY LOAD (%)", 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -30,
                    fontSize: 11, 
                    fontWeight: 900, 
                    fill: '#475569',
                    letterSpacing: '0.15em'
                }}
                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <ZAxis type="number" dataKey="score" range={[100, 800]} name="Score" />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} 
              />
              <Scatter name="Compounds" data={data}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.toxicity > 60 ? '#e11d48' : entry.toxicity > 30 ? '#f59e0b' : '#10b981'} 
                    fillOpacity={0.85}
                    stroke="white"
                    strokeWidth={1.5}
                    className="cursor-pointer hover:fill-opacity-100 transition-all duration-300 drop-shadow-lg"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
             <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <MapIcon className="w-10 h-10 text-slate-300" />
             </div>
             <div>
                <p className="text-black font-black text-sm uppercase tracking-widest">Cartographic Data Missing</p>
                <p className="text-xs text-slate-800 font-bold mt-2 max-w-xs leading-relaxed">Initialize molecular analyses to map the prioritization frontier.</p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8 shrink-0">
         <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
            <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">X-Axis Mapping</h4>
            <p className="text-xs text-slate-900 font-bold leading-relaxed">Composite value of gut absorption and membrane permeability.</p>
         </div>
         <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl">
            <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">Y-Axis Mapping</h4>
            <p className="text-xs text-slate-900 font-bold leading-relaxed">Direct toxicity load modeling structural hazards and safety liabilities as a percentage.</p>
         </div>
         <div className="p-6 bg-black border border-slate-800 rounded-3xl">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Bubble Diameter</h4>
            <p className="text-xs text-white font-bold leading-relaxed">Aggregated ADMETra priority score for compound selection.</p>
         </div>
      </div>
    </div>
  );
};
