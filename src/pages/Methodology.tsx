import React from 'react';
import { Settings, Zap, Beaker, ShieldCheck, Microscope, Database, BarChart3, Binary } from 'lucide-react';

export const Methodology = () => {
  const steps = [
    {
      icon: Microscope,
      title: 'Structural Resolution',
      desc: 'SMILES strings are parsed into molecular graphs using RDKit for topological feature extraction.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
        icon: Binary,
        title: 'Feature Vectorization',
        desc: 'LogP, TPSA, Molecular Weight, and H-bond capacities are calculated via physics-based descriptors.',
        color: 'bg-indigo-50 text-indigo-600'
    },
    {
      icon: Zap,
      title: 'Neural Inference',
      desc: 'Gemini 1.5 analyzes functional groups and predicts metabolic pathways through LLM-based chemical reasoning.',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: BarChart3,
      title: 'Multi-Objective Ranking',
      desc: 'Compounds are scored against a 9-point ADME criteria vs Toxicity penalties to find Pareto optimal lead candidates.',
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Computational Methodology</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">The ADMETra pipeline fuses molecular physics with state-of-the-art neural inference.</p>
      </div>

      <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-3xl ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                </div>
            ))}
          </div>
      </div>

      <div className="grid grid-cols-2 gap-8 pt-12">
        <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                <Database className="w-4 h-4" />
                Data Invariants
            </div>
            <p className="text-xs text-slate-600 font-medium leading-[1.8]">
                ADMETra utilizes 12 specific data invariants including Relational Sync (Master Gate pattern) for all sub-collections, preventing update-gaps in the molecular state machine. Every document ID is hardened via regex and size validation to prevent resource poisoning.
            </p>
        </div>

        <div className="p-8 rounded-[40px] bg-slate-900 text-slate-300 space-y-4 shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Settings className="w-4 h-4" />
                Ranking Algorithm
            </div>
            <code className="text-[10px] font-mono leading-relaxed block text-slate-500 bg-slate-800/50 p-4 rounded-2xl">
                RANK = ( absorption + permeability ) * 2.0 <br/>
                - ( toxicity_penalty * 2.5 ) <br/>
                + ( lipinski_compliance * 1.5 )
            </code>
            <p className="text-[10px] italic opacity-60">
                The scoring weights toxicity liabilities 25% higher than metabolic efficiency to prioritize human safety.
            </p>
        </div>
      </div>
    </div>
  );
};
