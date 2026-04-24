import React, { useState } from 'react';
import { useAnalysis } from '../services/AnalysisContext';
import { GitCompare, Plus, Trash2, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export const Comparison = () => {
  const { analyses } = useAnalysis();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedAnalyses = analyses.filter(a => selectedIds.includes(a.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">Differential Comparison</h2>
          <p className="text-slate-800 font-bold mt-1">Side-by-side molecular profiling for lead optimization selection (Max 3).</p>
        </div>
        <div className="badge py-2 px-4 rounded-full border border-slate-300 font-black text-slate-800 text-[10px] tracking-widest bg-white">
            {selectedIds.length} / 3 SELECTED
        </div>
      </div>

      {/* Selection Tray */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex gap-3 overflow-x-auto scrollbar-none">
        {analyses.filter(a => a.status === 'completed').map(a => (
            <button 
                key={a.id}
                onClick={() => toggleSelect(a.id)}
                className={cn(
                    "shrink-0 px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                    selectedIds.includes(a.id)
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                )}
            >
                {a.name}
            </button>
        ))}
        {analyses.length === 0 && (
            <div className="text-slate-300 text-xs italic">Analyze compounds to enable differential comparison.</div>
        )}
      </div>

      <div className={cn(
        "grid gap-6 transition-all duration-500",
        selectedIds.length === 1 ? "grid-cols-1 max-w-lg mx-auto" : 
        selectedIds.length === 2 ? "grid-cols-2" : "grid-cols-3"
      )}>
        {selectedAnalyses.map((m) => (
            <div key={m.id} className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm flex flex-col gap-6 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-black">{m.name}</h3>
                        <div className="text-[10px] font-mono text-slate-600 font-bold truncate max-w-[150px] mt-1">{m.smiles}</div>
                    </div>
                    <button 
                        onClick={() => toggleSelect(m.id)}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 shadow-inner">
                    <span className="text-3xl font-black text-black leading-none">{m.totalScore.toFixed(1)}</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mt-1">Global Rank</span>
                </div>

                <div className="space-y-4">
                    <MetricRow label="Bioavailability" value={(m.scores.absorption_score + m.scores.permeability_score) / 2} max={2} />
                    <MetricRow label="Physics Score" value={m.scores.drug_score} max={2} />
                    <MetricRow label="Safety Index" value={5 - m.scores.toxicity_penalty} max={5} />
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Key Structural Alerts</h4>
                    <div className="flex flex-wrap gap-2">
                        {m.gemini.toxicity.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-black border border-rose-200">
                                {t.substring(0, 15)}...
                            </span>
                        ))}
                        {m.gemini.toxicity.length === 0 && <span className="text-[10px] text-emerald-600 font-black italic tracking-tight">No Alerts Detected</span>}
                    </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <StatusIcon active={m.scores.absorption_score > 0} color="bg-emerald-500" />
                        <StatusIcon active={m.scores.permeability_score > 0} color="bg-emerald-500" />
                        <StatusIcon active={m.scores.toxicity_penalty === 0} color="bg-emerald-500" dangerColor="bg-rose-500" />
                    </div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Profile Validated</div>
                </div>
            </div>
        ))}
        {selectedIds.length === 0 && (
            <div className="col-span-full py-40 border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center text-center gap-4 text-slate-200">
                <GitCompare className="w-16 h-16" />
                <p className="text-slate-400 font-bold max-w-xs">Select compounds from the selection tray to generate comparison matrix.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const MetricRow = ({ label, value, max }: { label: string, value: number, max: number }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">{label}</span>
            <span className="text-[10px] font-black text-black leading-none">{((value/max) * 100).toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(value/max) * 100}%` }} />
        </div>
    </div>
);

const StatusIcon = ({ active, color, dangerColor }: { active: boolean, color: string, dangerColor?: string }) => (
    <div className={cn(
        "w-2 h-2 rounded-full",
        active ? color : (dangerColor || "bg-slate-200")
    )} />
);
