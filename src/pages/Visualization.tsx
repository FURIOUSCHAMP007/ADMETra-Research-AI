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
  CartesianGrid
} from 'recharts';
import { Map as MapIcon, Zap, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export const Visualization = () => {
  const { analyses } = useAnalysis();

  const data = Array.from(
    new Map(
        analyses
            .filter(a => a.status === 'completed')
            .map(a => [a.name, {
                name: a.name,
                bioavailability: (a.scores.absorption_score + a.scores.permeability_score) / 2,
                toxicity: a.scores.toxicity_penalty,
                score: a.totalScore,
                id: a.id
            }])
    ).values()
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl">
          <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2 mb-2">{d.name}</p>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase flex justify-between gap-4">
                Efficiency Index: <span className="text-blue-600">{Math.min(d.bioavailability * 50, 100).toFixed(0)}/100</span>
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase flex justify-between gap-4">
                Toxicity Risk: <span className={cn("font-black", d.toxicity > 1 ? "text-rose-600" : "text-emerald-600")}>{d.toxicity.toFixed(1)}/5.0</span>
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
    <div className="h-[calc(100vh-160px)] flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">Pareto Multi-Objective Map</h2>
          <p className="text-slate-800 font-bold mt-1">Comparing molecular efficiency against prioritized safety hazards.</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Optimized Target</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Safety Liability</span>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="bioavailability" 
                name="Bioavailability" 
                unit="" 
                domain={[0, 1.2]} 
                label={{ 
                    value: "BIOAVAILABILITY (EFFICIENCY)", 
                    position: 'insideBottom', 
                    offset: -10, 
                    fontSize: 10, 
                    fontWeight: 900, 
                    fill: '#475569',
                    letterSpacing: '0.1em'
                }}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
              />
              <YAxis 
                type="number" 
                dataKey="toxicity" 
                name="Toxicity" 
                domain={[0, 5]}
                label={{ 
                    value: "TOXICITY (HIGHER IS MORE HAZARDOUS)", 
                    angle: -90, 
                    position: 'insideLeft',
                    fontSize: 10, 
                    fontWeight: 900, 
                    fill: '#475569',
                    letterSpacing: '0.1em'
                }}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
              />
              <ZAxis type="number" dataKey="score" range={[100, 1000]} name="Score" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Compounds" data={data}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.toxicity > 1.5 ? '#e11d48' : '#2563eb'} 
                    fillOpacity={0.7}
                    stroke={entry.toxicity > 1.5 ? '#9f1239' : '#1e40af'}
                    strokeWidth={2}
                    className="cursor-pointer hover:fill-opacity-100 transition-all duration-300"
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

        {/* Pareto Label Layers */}
        {data.length > 0 && (
            <>
                <div className="absolute bottom-12 right-12 text-blue-700 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Optimal Pareto Horizon</span>
                </div>
                <div className="absolute top-12 left-24 text-rose-600 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Critical Toxicity Zone</span>
                </div>
            </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8 shrink-0">
         <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
            <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">X-Axis Mapping</h4>
            <p className="text-xs text-slate-900 font-bold leading-relaxed">Composite value of gut absorption and membrane permeability.</p>
         </div>
         <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl">
            <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">Y-Axis Mapping</h4>
            <p className="text-xs text-slate-900 font-bold leading-relaxed">Direct toxicity penalty modeling structural hazards and metabolic risk.</p>
         </div>
         <div className="p-6 bg-black border border-slate-800 rounded-3xl">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Bubble Diameter</h4>
            <p className="text-xs text-white font-bold leading-relaxed">Aggregated ADMETra priority score for compound selection.</p>
         </div>
      </div>
    </div>
  );
};
