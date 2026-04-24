import React from 'react';
import { useAnalysis } from '../services/AnalysisContext';
import { ShieldCheck, Activity, Coffee, Microscope, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export const CarePlan = () => {
  const { analyses, selectedId } = useAnalysis();
  const selectedMolecule = analyses.find(a => a.id === selectedId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Care Protocol</h2>
          <p className="text-slate-500 font-medium">Personalized patient-centric guidance for safe ADME monitoring.</p>
        </div>
        {selectedMolecule && (
          <div className="px-6 py-3 bg-slate-100 rounded-2xl border border-slate-200">
             <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 leading-none">Selected Agent</div>
             <div className="text-lg font-black text-slate-800 leading-none">{selectedMolecule.name}</div>
          </div>
        )}
      </div>

      {selectedMolecule?.status === 'processing' ? (
        <div className="py-32 text-center space-y-6 bg-white border border-slate-100 rounded-[40px] shadow-sm">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                <Microscope className="w-10 h-10 text-blue-600" />
            </div>
            <div>
               <p className="text-slate-900 font-black text-xl tracking-tight uppercase">Decrypting Drug Blueprint</p>
               <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto font-medium italic">Gemini-1.5 AI is currently mapping ADME pathways and safety monitoring protocols...</p>
            </div>
        </div>
      ) : selectedMolecule?.plan ? (
        <div className="space-y-8">
            <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm flex items-center gap-10">
                <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-blue-600/30">
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <div>
                   <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Target Application</h3>
                   <div className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                        {selectedMolecule.plan.use_case}
                   </div>
                   <div className="text-xs text-slate-400 font-medium mt-2">Verified for Compound ID: <span className="font-mono text-blue-400">{selectedMolecule.id}</span></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Lifestyle */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-[40px] p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <Coffee className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-black text-amber-900 tracking-tight">Life-style Modulation</h4>
                    </div>
                    <ul className="space-y-4">
                        {selectedMolecule.plan.lifestyle.map((item, i) => (
                           <li key={i} className="flex gap-4 p-4 bg-white/50 border border-amber-100 rounded-2xl text-slate-700 text-sm font-medium leading-relaxed">
                                <span className="text-amber-500 font-black">•</span>
                                {item}
                           </li>
                        ))}
                    </ul>
                </div>

                {/* Monitoring */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-[40px] p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-black text-blue-900 tracking-tight">Clinical Surveillance</h4>
                    </div>
                    <ul className="space-y-4">
                        {selectedMolecule.plan.monitoring.map((item, i) => (
                           <li key={i} className="flex gap-4 p-4 bg-white/50 border border-blue-100 rounded-2xl text-slate-700 text-sm font-medium leading-relaxed">
                                <span className="text-blue-500 font-black">•</span>
                                {item}
                           </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="p-8 rounded-[32px] bg-slate-900 text-slate-300 flex items-center gap-6">
                <Info className="w-8 h-8 text-blue-400 shrink-0" />
                <p className="text-xs font-medium leading-relaxed italic opacity-80 decoration-blue-500/30 underline underline-offset-4">
                   This AI-generated guidance is supplementary and must be validated against clinical pharmacopeia before application in research environments. ADMETra AI assumes no liability for off-label interpretations.
                </p>
            </div>
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white border border-slate-100 rounded-[40px] shadow-sm">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto grayscale opacity-40">
                <Microscope className="w-10 h-10 text-slate-200" />
            </div>
            <div>
               <p className="text-slate-400 font-bold text-lg tracking-tight">No Active Health Blueprint</p>
               <p className="text-sm text-slate-300 mt-1 max-w-sm mx-auto">Select a molecule with a personalized plan (indicated by the indigo dot in the explorer) to view clinical care guidance.</p>
            </div>
        </div>
      )}
    </div>
  );
};
