import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalysis } from '../services/AnalysisContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Beaker, 
  Search, 
  Plus, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2,
  Zap,
  Microscope,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import drugsData from '../data/drugs.json';

export const Analysis = () => {
  const location = useLocation();
  const { analyses, selectedId, isProcessing, setSelectedId, handleAnalyze, clearAnalyses } = useAnalysis();
  const [input, setInput] = useState('');
  const [librarySearch, setLibrarySearch] = useState('');

  useEffect(() => {
    if (location.state?.smiles) {
      handleAnalyze(location.state.name || location.state.smiles);
    }
  }, [location.state]);

  const selectedMolecule = analyses.find(a => a.id === selectedId);

  const filteredLibrary = drugsData.drugs.filter(d => 
    d.name.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-[3fr_2fr] gap-8 h-[calc(100vh-160px)] animate-in fade-in duration-500">
      
      {/* Left: Input & Lab */}
      <div className="flex flex-col gap-6 min-h-0">
        <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm shrink-0">
            <h3 className="text-xl font-black text-black mb-6 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-blue-700" />
                Analysis Terminal
            </h3>
            <div className="flex gap-4">
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter SMILES or Compound Name (e.g. Paracetamol)..."
                    className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-4 focus:ring-blue-100 placeholder:text-slate-500 outline-none h-24 ring-inset transition-all font-bold text-black"
                />
                <button 
                    onClick={() => { handleAnalyze(input); setInput(''); }}
                    disabled={isProcessing || !input.trim()}
                    className="w-48 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-2xl font-black flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 text-blue-300" />}
                    <span className="text-[10px] uppercase tracking-widest leading-none">Execute Analysis</span>
                </button>
            </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                   <Database className="w-4 h-4 text-blue-700" />
                   Result Stream
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-600 tracking-tight">{analyses.length} PROCESSED</span>
                  <button onClick={clearAnalyses} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-100">
                {analyses.map((m) => (
                    <button 
                        key={m.id}
                        onClick={() => setSelectedId(m.id)}
                        className={cn(
                            "w-full p-4 rounded-2xl border text-left transition-all duration-300 group",
                            selectedId === m.id 
                                ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20 text-white" 
                                : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-slate-800"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="font-black text-sm truncate">{m.name}</div>
                                <div className={cn(
                                    "text-[10px] font-mono mt-0.5 truncate",
                                    selectedId === m.id ? "text-blue-100 opacity-80" : "text-slate-500"
                                )}>{m.smiles}</div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {m.status === 'completed' && (
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter",
                                        selectedId === m.id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
                                    )}>
                                        {m.totalScore.toFixed(1)} RANK
                                    </div>
                                )}
                                {m.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                {m.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                                {m.status === 'error' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                            </div>
                        </div>
                    </button>
                ))}
                {analyses.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-4 py-20 grayscale-0">
                        <Beaker className="w-12 h-12 text-slate-300" />
                        <p className="text-slate-800 font-black text-sm">No analysis stream active.</p>
                    </div>
                )}
            </div>
        </section>
      </div>

      {/* Right: Insight Panel */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col min-h-0">
        {selectedMolecule ? (
          <div className="flex flex-col h-full">
            {selectedMolecule.status === 'error' ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
                    <h2 className="text-xl font-black text-black uppercase tracking-tight">Resolution Failure</h2>
                    <p className="text-slate-600 mt-4 text-sm leading-relaxed max-w-xs">{selectedMolecule.error || 'The molecular architecture could not be resolved by the current engine.'}</p>
                    <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-mono text-slate-400 break-all">
                        RAW: {selectedMolecule.smiles}
                    </div>
                </div>
            ) : (
                <>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                   <h2 className="text-2xl font-black text-black tracking-tight leading-none">{selectedMolecule.name}</h2>
                   <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-2">Chemical Intelligence Profile</div>
                </div>
                <div className={cn(
                    "w-16 h-16 rounded-[20px] flex flex-col items-center justify-center font-black shadow-sm",
                    selectedMolecule.totalScore > 5 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-blue-50 text-blue-800 border border-blue-200"
                )}>
                    <span className="text-xl leading-none">{selectedMolecule.totalScore.toFixed(1)}</span>
                    <span className="text-[8px] uppercase tracking-tighter opacity-80">Score</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-100 space-y-10">
                {/* Quick Stats Grid */}
                {selectedMolecule.status === 'completed' && (
                  <div className="grid-stats">
                    <div className="grid-stat-item">
                      <span className="grid-stat-label">Bioavailability</span>
                      <span className="grid-stat-value">{( (selectedMolecule.scores.absorption_score + selectedMolecule.scores.permeability_score) / 4 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="grid-stat-item">
                      <span className="grid-stat-label">Drug Score</span>
                      <span className="grid-stat-value">{(selectedMolecule.scores.drug_score / 2 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="grid-stat-item">
                      <span className="grid-stat-label">Lipinski</span>
                      <span className="grid-stat-value text-blue-700">{selectedMolecule.rdkit.mw <= 500 ? 'PASS' : 'FAIL'}</span>
                    </div>
                    <div className="grid-stat-item">
                      <span className="grid-stat-label">Tox Alerts</span>
                      <span className={cn(
                        "grid-stat-value",
                        selectedMolecule.scores.toxicity_penalty > 0 ? "text-rose-700" : "text-emerald-800"
                      )}>{selectedMolecule.gemini.toxicity.length}</span>
                    </div>
                  </div>
                )}

                {/* ADME Progress */}
                <div className="bg-slate-100/50 p-6 rounded-[24px] border border-slate-200">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-6 text-center">In Silico Trajectory</h4>
                  <div className="flex items-center justify-between px-2">
                    <StatusDot label="ADME" status={selectedMolecule.status === 'completed' ? 'pass' : 'active'} />
                    <div className="h-px bg-slate-300 flex-1 mx-2 mt-[-18px] opacity-100" />
                    <StatusDot label="Tox" status={selectedMolecule.scores.toxicity_penalty > 0 ? 'fail' : (selectedMolecule.status === 'completed' ? 'pass' : 'idle')} />
                    <div className="h-px bg-slate-300 flex-1 mx-2 mt-[-18px] opacity-100" />
                    <StatusDot label="Rank" status={selectedMolecule.totalScore > 0 ? 'active' : 'idle'} />
                    <div className="h-px bg-slate-300 flex-1 mx-2 mt-[-18px] opacity-100" />
                    <StatusDot label="Plan" status={selectedMolecule.plan ? 'pass' : 'idle'} />
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="prose-research prose-sm border-t border-slate-50 pt-8">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedMolecule.explanation || '*Inference engine generating analysis report...*'}
                   </ReactMarkdown>
                </div>
             </div>
           </>
          )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20 grayscale-0">
             <div className="w-20 h-20 rounded-[28px] bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-300" />
             </div>
             <div>
                <p className="text-black font-black text-sm uppercase tracking-widest">Target Isolation Required</p>
                <p className="text-slate-700 font-bold text-xs mt-2 leading-relaxed">Select an agent from the stream to view deep insights.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusDot = ({ label, status }: { label: string, status: 'idle' | 'active' | 'pass' | 'fail' }) => {
    const colors = {
        idle: 'bg-slate-200 ring-slate-100 text-slate-600',
        active: 'bg-blue-600 ring-blue-100 text-blue-800 animate-pulse',
        pass: 'bg-emerald-600 ring-emerald-100 text-emerald-800',
        fail: 'bg-rose-600 ring-rose-100 text-rose-800'
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full ring-4 transition-all duration-500", colors[status])} />
            <span className={cn("text-[9px] font-black tracking-tight", colors[status].split(' ')[2])}>{label}</span>
        </div>
    );
};
