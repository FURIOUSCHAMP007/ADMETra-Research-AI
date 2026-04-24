import React from 'react';
import { useAnalysis } from '../services/AnalysisContext';
import { Trophy, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const Ranking = () => {
  const { analyses, setSelectedId } = useAnalysis();
  const navigate = useNavigate();

  // Use a map to deduplicate by name to prevent visual repeats
  const deduplicatedAnalyses = Array.from(
    new Map(analyses.map(a => [a.name, a])).values()
  );

  const sorted = [...deduplicatedAnalyses].sort((a, b) => b.totalScore - a.totalScore);
  const topCandidates = sorted.filter(a => a.totalScore >= 7);
  const riskyCompounds = [...deduplicatedAnalyses]
    .filter(a => a.scores.toxicity_penalty > 0)
    .sort((a, b) => b.scores.toxicity_penalty - a.scores.toxicity_penalty);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">Ranking Engine</h2>
          <p className="text-slate-800 font-bold mt-1">Prioritized prioritization of pharmacological agents based on multi-objective safety metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Safe Candidates */}
        <div className="bg-emerald-50/30 border border-emerald-100 rounded-[32px] p-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-800 tracking-tight">Optimal Candidates</h3>
           </div>
           <div className="space-y-4">
              {topCandidates.slice(0, 5).map((m, idx) => (
                <div key={m.id} className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between group hover:border-emerald-400 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="text-xl font-black text-emerald-100 italic">#{idx + 1}</div>
                      <div>
                         <div className="font-bold text-slate-800">{m.name}</div>
                         <div className="text-[10px] uppercase font-black text-emerald-500 tracking-widest leading-none">Efficiency: {m.totalScore.toFixed(1)}</div>
                      </div>
                   </div>
                   <button 
                    onClick={() => { setSelectedId(m.id); navigate('/analysis'); }}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all"
                   >
                      <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              ))}
              {topCandidates.length === 0 && (
                <div className="py-12 text-center text-emerald-400 font-medium italic text-sm">
                   Awaiting optimization results...
                </div>
              )}
           </div>
        </div>

        {/* Risky Candidates */}
        <div className="bg-rose-50/30 border border-rose-100 rounded-[32px] p-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-rose-800 tracking-tight">Highest Toxicity Hazards</h3>
           </div>
           <div className="space-y-4">
              {riskyCompounds.slice(0, 5).map((m) => (
                <div key={m.id} className="p-5 bg-white rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between group hover:border-rose-400 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        m.scores.toxicity_penalty > 3 ? "bg-rose-600 scale-150" : "bg-rose-400"
                      )} />
                      <div>
                         <div className="font-bold text-slate-800">{m.name}</div>
                         <div className="text-[10px] uppercase font-black text-rose-600 tracking-widest leading-none">Hazard Index: {m.scores.toxicity_penalty.toFixed(1)}/5.0</div>
                      </div>
                   </div>
                   <button 
                    onClick={() => { setSelectedId(m.id); navigate('/analysis'); }}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all"
                   >
                      <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              ))}
               {riskyCompounds.length === 0 && (
                <div className="py-12 text-center text-rose-400 font-medium italic text-sm">
                  System scanning for safety liabilities...
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black text-black uppercase tracking-widest">Full Prioritization Leaderboard</h3>
        </div>
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Rank</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Agent Architecture</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">ADME Profile</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Aggregated Score</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {sorted.map((m, idx) => (
                    <tr 
                        key={m.id} 
                        onClick={() => { setSelectedId(m.id); navigate('/analysis'); }}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                        <td className="px-8 py-5">
                            <span className={cn(
                                "text-sm font-black italic",
                                idx < 3 ? "text-amber-600" : "text-slate-400"
                            )}>#{idx + 1}</span>
                        </td>
                        <td className="px-8 py-5">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-black group-hover:text-blue-700 transition-colors">{m.name}</span>
                                <span className="text-[10px] font-mono text-slate-500 font-bold truncate max-w-xs">{m.smiles}</span>
                            </div>
                        </td>
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full", m.scores.absorption_score > 0 ? "bg-emerald-500" : "bg-slate-300")} />
                                <div className={cn("w-1.5 h-1.5 rounded-full", m.scores.permeability_score > 0 ? "bg-emerald-500" : "bg-slate-300")} />
                                <div className={cn("w-1.5 h-1.5 rounded-full", m.scores.toxicity_penalty === 0 ? "bg-emerald-500" : "bg-rose-500")} />
                            </div>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-black">
                            {m.totalScore.toFixed(2)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {sorted.length === 0 && (
            <div className="py-20 text-center text-slate-300 font-bold tracking-tight italic">
                Awaiting results... Run analysis to populate rankings.
            </div>
        )}
      </div>
    </div>
  );
};
