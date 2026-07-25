import React from 'react';
import { useAnalysis } from '../services/AnalysisContext';
import { ShieldCheck, Activity, Coffee, Microscope, Info, ChevronRight, Stethoscope } from 'lucide-react';
import { cn } from '../lib/utils';

export const CarePlan = () => {
  const { analyses, selectedId, setSelectedId } = useAnalysis();
  const selectedMolecule = analyses.find(a => a.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto min-h-[80vh] animate-in fade-in duration-500">
      {/* Sidebar Selector */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">Care Plan Console</span>
            <span className="text-[10px] font-bold text-slate-500">v2.4.1 PRODUCTION</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight leading-tight mb-1">Protocol Registry</h2>
          <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Select a validated agent to view personalized safety protocols.</p>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {analyses.filter(a => a.status === 'completed').map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all duration-300 border flex items-center justify-between group",
                  selectedId === a.id 
                    ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20" 
                    : "bg-slate-800 border-slate-700 hover:bg-slate-750"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className={cn(
                    "text-xs font-black truncate max-w-[140px]",
                    selectedId === a.id ? "text-white" : "text-slate-200"
                  )}>
                    {a.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-slate-400 transition-colors">
                    {a.id.substring(0, 6)}
                  </span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  selectedId === a.id ? "text-white translate-x-1" : "text-slate-600"
                )} />
              </button>
            ))}
            {analyses.filter(a => a.status === 'completed').length === 0 && (
              <div className="py-10 text-center">
                 <p className="text-slate-500 text-xs font-bold italic">No protocols discovered yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-[28px] p-6">
           <div className="flex items-center gap-3 mb-3">
              <Microscope className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-black text-blue-900 uppercase">System Status</h4>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] font-bold">
                 <span className="text-slate-500">Core Engine</span>
                 <span className="text-emerald-600">ONLINE [JS]</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                 <span className="text-slate-500">Clinical Map</span>
                 <span className="text-emerald-600">STABLE [v2]</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Protocol View */}
      <div className="flex-1 space-y-8">
        <header className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Clinical Care Protocol</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg">Personalized patient-centric guidance for safe ADME monitoring.</p>
          </div>
          {selectedMolecule && (
            <div className="flex items-center gap-4">
               <div className="px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-1 leading-none">Status</div>
                  <div className="text-sm font-black text-blue-700 leading-none">VERIFIED COMPLIANT</div>
               </div>
            </div>
          )}
        </header>

        {selectedMolecule?.status === 'processing' ? (
          <div className="py-32 text-center space-y-6 bg-white border border-slate-100 rounded-[40px] shadow-sm">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-spin-slow">
                  <Activity className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                 <p className="text-slate-900 font-black text-xl tracking-tight uppercase">Decrypting Drug Blueprint</p>
                 <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto font-medium italic">Gemini AI is currently mapping ADME pathways and safety monitoring protocols...</p>
              </div>
          </div>
        ) : selectedMolecule?.plan ? (
          <div className="space-y-8">
              <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl flex items-center gap-10 border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <ShieldCheck className="w-32 h-32" />
                  </div>
                  <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-blue-600/30 z-10">
                      <ShieldCheck className="w-12 h-12" />
                  </div>
                  <div className="z-10">
                     <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Target Application</h3>
                     <div className="text-3xl font-black text-white leading-tight tracking-tight">
                          {selectedMolecule.plan.use_case}
                     </div>
                     <div className="flex items-center gap-4 mt-3">
                        <span className="text-[11px] text-slate-400 font-bold">COMPOUND ID: <span className="font-mono text-blue-400">{selectedMolecule.id}</span></span>
                        <span className="text-[11px] text-slate-400 font-bold">TYPE: <span className="text-slate-200">SMALL MOLECULE</span></span>
                     </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                             <li key={i} className="flex gap-4 p-5 bg-white/80 backdrop-blur-sm border border-amber-100 rounded-3xl text-slate-700 text-sm font-bold leading-relaxed shadow-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
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
                             <li key={i} className="flex gap-4 p-5 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-3xl text-slate-700 text-sm font-bold leading-relaxed shadow-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                  {item}
                             </li>
                          ))}
                      </ul>
                  </div>

                  {/* Treatment */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-[40px] p-10 space-y-6">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                              <Stethoscope className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-black text-emerald-900 tracking-tight">Therapeutic Strategy</h4>
                      </div>
                      <ul className="space-y-4">
                          {selectedMolecule.plan.treatment?.map((item, i) => (
                             <li key={i} className="flex gap-4 p-5 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl text-slate-700 text-sm font-bold leading-relaxed shadow-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                  {item}
                             </li>
                          ))}
                          {(!selectedMolecule.plan.treatment || selectedMolecule.plan.treatment.length === 0) && (
                              <li className="p-5 bg-white/40 border border-emerald-50 rounded-3xl text-slate-400 text-xs font-bold italic text-center">
                                 Awaiting AI-generated titration strategy...
                              </li>
                          )}
                      </ul>
                  </div>
              </div>

              <div className="p-8 rounded-[40px] bg-slate-100 border border-slate-200 flex items-start gap-6">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Info className="w-6 h-6 text-slate-400 shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Disclaimer</h5>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                       This AI-generated guidance is supplementary and must be validated against clinical pharmacopoeia before application in research environments. ADMETra AI assumes no liability for off-label interpretations.
                    </p>
                  </div>
              </div>
          </div>
        ) : (
          <div className="py-32 text-center space-y-6 bg-white border border-slate-100 rounded-[40px] shadow-sm">
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto transition-transform hover:scale-110 duration-500 shadow-inner">
                  <Microscope className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-2">
                 <p className="text-slate-900 font-black text-2xl tracking-tight">Protocol Selection Required</p>
                 <p className="text-base text-slate-500 mt-1 max-w-sm mx-auto font-medium">Select a pharmacological agent from the registry to view clinical monitoring guidance.</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
