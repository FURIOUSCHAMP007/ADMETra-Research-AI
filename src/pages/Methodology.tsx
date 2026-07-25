import React from 'react';
import { Settings, Zap, Beaker, ShieldCheck, Microscope, Database, BarChart3, Binary, ArrowRight, Code2, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export const Methodology = () => {
  const steps = [
    {
      icon: Microscope,
      title: 'Structural Resolution',
      desc: 'SMILES strings are parsed into molecular graphs using RDKit for topological feature extraction and validation.',
      color: 'bg-blue-50 text-blue-600',
      tag: 'Step 01'
    },
    {
        icon: Binary,
        title: 'Feature Vectorization',
        desc: 'LogP, TPSA, Molecular Weight, and H-bond capacities are calculated via high-precision physics-based descriptors.',
        color: 'bg-indigo-50 text-indigo-600',
        tag: 'Step 02'
    },
    {
      icon: Zap,
      title: 'Neural Inference',
      desc: 'Gemini 1.5 Pro analyzes functional groups and predicts metabolic pathways through LLM-based chemical reasoning.',
      color: 'bg-amber-50 text-amber-600',
      tag: 'Step 03'
    },
    {
      icon: BarChart3,
      title: 'Multi-Objective Ranking',
      desc: 'Compounds are scored against 9-point ADME criteria vs Toxicity penalties to find Pareto optimal lead candidates.',
      color: 'bg-emerald-50 text-emerald-600',
      tag: 'Step 04'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in duration-700 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
           <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compute Protocol v2.4</span>
        </div>
        <h2 className="text-6xl font-black text-slate-950 tracking-tighter leading-none">Computational Methodology</h2>
        <p className="text-xl text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
          The ADMETra pipeline fuses molecular physics with state-of-the-art neural inference to predict clinical outcomes.
        </p>
      </div>

      {/* Pipeline Steps */}
      <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-32 left-0 right-0 h-1 bg-slate-100 hidden lg:block -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, idx) => (
                <div key={idx} className="group relative flex flex-col items-center text-center space-y-6">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover:text-blue-500 transition-colors duration-500">
                      {step.tag}
                    </span>
                    <div className={cn(
                      "w-24 h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 relative",
                      step.color,
                      "shadow-xl shadow-transparent group-hover:shadow-current/10 group-hover:-translate-y-2 group-hover:scale-110"
                    )}>
                        <step.icon className="w-10 h-10" />
                        <div className="absolute -inset-4 bg-current/5 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    </div>
                    <div className="space-y-3 px-4">
                        <h4 className="text-lg font-black text-slate-950 tracking-tight">{step.title}</h4>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">{step.desc}</p>
                    </div>
                </div>
            ))}
          </div>
      </div>

      {/* Deep Dive Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="group p-10 rounded-[48px] bg-slate-50 border border-slate-100 space-y-8 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-700">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/10">
                    <Database className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Data Invariants</h3>
                   <p className="text-xs font-black text-blue-500 uppercase tracking-widest mt-0.5">Integrity & Validation</p>
                </div>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-slate-700 font-bold leading-relaxed">
                  ADMETra utilizes 12 specific data invariants including <span className="text-slate-950 px-1 bg-blue-100 rounded">Relational Sync (Master Gate pattern)</span> for all sub-collections, preventing update-gaps in the molecular state machine.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Regex Hardened IDs', 'Size Validation', 'Schema Locking', 'CORS Restricted'].map(f => (
                   <div key={f} className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-slate-100 text-xs font-black text-slate-700 shadow-sm transition-all hover:border-blue-200 group/item">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 group-hover/item:scale-110 transition-transform" />
                      {f}
                   </div>
                ))}
              </div>
            </div>
        </div>

        <div className="group p-10 rounded-[48px] bg-slate-900 text-white space-y-8 shadow-2xl shadow-slate-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 -translate-y-12 rotate-12 scale-150">
               <Binary className="w-64 h-64" />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <Code2 className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white tracking-tight">Ranking Algorithm</h3>
                   <p className="text-xs font-black text-blue-400 uppercase tracking-widest mt-0.5">Weighted Scoring Engine</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="relative group/code">
                <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-20 group-hover/code:opacity-40 transition-opacity" />
                <pre className="relative bg-black/40 backdrop-blur-md p-8 rounded-3xl text-sm font-mono leading-relaxed text-blue-100 overflow-x-auto border border-white/5">
                  <span className="text-slate-500"># Scoring Weights Logic</span><br/>
                  <span className="text-blue-400">RANK</span> = ( absorption + permeability ) * <span className="text-amber-400">2.0</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ( toxicity_penalty * <span className="text-rose-400">2.5</span> )<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ ( lipinski_compliance * <span className="text-emerald-400">1.5</span> )
                </pre>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-300 leading-relaxed italic">
                  The scoring weights toxicity liabilities 25% higher than metabolic efficiency to prioritize human safety protocol generation.
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

