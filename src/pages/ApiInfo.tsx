import React from 'react';
import { Code, Terminal, Globe, Server, Hash } from 'lucide-react';

export const ApiInfo = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">API Reference</h2>
          <p className="text-slate-500 font-medium tracking-tight">Technical specifications for ADMETra Research Interface integration.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-blue-400 rounded-xl text-xs font-mono">
            <Globe className="w-4 h-4" />
            api.admetra.research/v2
        </div>
      </div>

      <div className="space-y-8">
        {/* Endpoint 1 */}
        <section className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-black">POST</span>
                    <code className="text-sm font-black text-slate-800">/analysis/compute</code>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Limit: 50 req/min</div>
            </div>
            <div className="p-8 grid grid-cols-2 gap-10">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload Definition</h4>
                    <pre className="text-[10px] font-mono bg-slate-50 p-6 rounded-3xl text-slate-500 leading-relaxed border border-slate-100">
{`{
  "smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "engine": "gemini-1.5-flash",
  "precision": "high",
  "include_care_plan": true
}`}
                    </pre>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Response Schema</h4>
                    <pre className="text-[10px] font-mono bg-slate-900 p-6 rounded-3xl text-blue-400 leading-relaxed overflow-x-auto shadow-xl">
{`{
  "status": "success",
  "data": {
    "molecular_rank": 8.4,
    "toxicity_alerts": 0,
    "pass_filters": true
  }
}`}
                    </pre>
                </div>
            </div>
        </section>

        {/* Endpoint 2 */}
        <section className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm opacity-50 grayscale pointer-events-none">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-400 text-white rounded-lg text-xs font-black">GET</span>
                    <code className="text-sm font-black text-slate-800">/dataset/compounds</code>
                </div>
                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Legacy - V1.x Only</div>
            </div>
        </section>
      </div>

      <div className="grid grid-cols-3 gap-8 pt-10">
         <div className="flex gap-4">
            <Server className="w-6 h-6 text-slate-300 shrink-0" />
            <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-800">Edge Logic</h5>
                <p className="text-[10px] text-slate-400 font-medium">Distributed inference running on Cloud Run clusters.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <Hash className="w-6 h-6 text-slate-300 shrink-0" />
            <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-800">ECC Integrity</h5>
                <p className="text-[10px] text-slate-400 font-medium">Full checksum verification on SMILES string transit.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <Terminal className="w-6 h-6 text-slate-300 shrink-0" />
            <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-800">WASM Runtime</h5>
                <p className="text-[10px] text-slate-400 font-medium">Pure-client execution core via RDKit architecture.</p>
            </div>
         </div>
      </div>
    </div>
  );
};
