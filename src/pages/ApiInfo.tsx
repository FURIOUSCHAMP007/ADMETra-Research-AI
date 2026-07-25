import React from 'react';
import { Terminal, Globe, Server, Hash, Shield, Zap, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export const ApiInfo = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-12">
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">v2.4.1 Stable</span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">Production</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">API Reference</h1>
          <p className="text-xl text-slate-500 font-bold max-w-2xl leading-relaxed">
            Technical specifications for high-throughput ADMETra Research Interface integration and molecular compute clusters.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-[24px] shadow-2xl border border-slate-800">
              <Globe className="w-5 h-5 text-blue-400" />
              <code className="text-sm font-mono font-bold tracking-tight">api.admetra.research/v2</code>
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Regional URL (Global)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar / Quick Links */}
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Concepts</h4>
            <nav className="space-y-1">
              {['Authentication', 'Rate Limiting', 'Data Formats', 'Molecular Engines'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    const el = document.getElementById(item.toLowerCase().replace(' ', '-'));
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Endpoints</h4>
             <nav className="space-y-1">
               <button 
                onClick={() => document.getElementById('post-compute')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-900 bg-blue-50 border border-blue-100 mb-1"
               >
                 <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-black">POST</span>
                 /compute
               </button>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-400 opacity-60 cursor-not-allowed">
                 <span className="text-[10px] bg-slate-400 text-white px-1.5 py-0.5 rounded-md font-black">GET</span>
                 /compounds
               </div>
             </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-20">
          
          {/* Authentication */}
          <section id="authentication" className="scroll-mt-20 space-y-6 text-slate-400">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Authentication</h2>
            </div>
            <p className="text-slate-600 font-bold leading-relaxed">
              All API requests must be authenticated using Bearer tokens included in the `Authorization` header. Development keys can be provisioned in the Research Control Panel.
            </p>
            <div className="relative group">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => copyToClipboard('Authorization: Bearer <YOUR_RESEARCH_TOKEN>', 'auth')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors border border-slate-700"
                >
                  {copied === 'auth' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="bg-slate-900 p-8 rounded-[32px] text-blue-400 font-mono text-sm overflow-x-auto shadow-xl border border-slate-800">
                <span className="text-slate-500">// Example Request Header</span>
                <br />
                <span className="text-emerald-400">Authorization</span>: Bearer <span className="text-blue-300">rt_098234x_admetra_v2</span>
              </pre>
            </div>
          </section>

          {/* Compute Endpoint */}
          <section id="post-compute" className="scroll-mt-20 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Analysis Compute</h2>
                  <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black">POST</span>
                      <code className="text-sm font-bold text-slate-500">/analysis/compute</code>
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                Rate Limit: 250 req/min
              </div>
            </div>

            <p className="text-slate-600 font-bold leading-relaxed">
              Submits a molecular structure in SMILES format for deep-neural analysis of ADME characteristics, toxicity profiling, and clinical monitoring protocol generation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Request Payload
                 </h4>
                 <div className="relative group">
                    <pre className="bg-slate-50 p-6 rounded-[28px] text-[12px] font-mono text-slate-600 border border-slate-200 leading-relaxed overflow-x-auto h-full">
{`{
  "smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "engine": "gemini-3-flash",
  "priority": "real-time",
  "features": [
    "pharmacokinetics",
    "clinical_protocol"
  ],
  "options": {
     "precision": 0.98,
     "verbose_saftey": true
  }
}`}
                    </pre>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Server className="w-3 h-3" /> Expected Response
                 </h4>
                 <pre className="bg-slate-900 p-6 rounded-[28px] text-[12px] font-mono text-blue-400 border border-slate-800 leading-relaxed overflow-x-auto shadow-2xl h-full">
{`{
  "id": "ana_7bw4pi_2026",
  "status": "completed",
  "data": {
    "scores": {
      "physical": 8.4,
      "safety": 9.2,
      "adme_composite": 0.89
    },
    "alerts": [],
    "protocol_id": "prot_x092"
  },
  "compute_time": "142ms"
}`}
                 </pre>
              </div>
            </div>
          </section>

          {/* System Specs */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-slate-50 rounded-[40px] border border-slate-200">
             <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                   <Hash className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                   <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">ECC Integrity</h5>
                   <p className="text-xs text-slate-500 font-bold leading-relaxed mt-1">Full checksum verification on SMILES string transit to prevent molecular injection attacks.</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                   <Globe className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                   <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">Edge Gravity</h5>
                   <p className="text-xs text-slate-500 font-bold leading-relaxed mt-1">Distributed inference running on global Cloud Run clusters for &lt;200ms latency.</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                   <Terminal className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                   <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">WASM Hybrid</h5>
                   <p className="text-xs text-slate-500 font-bold leading-relaxed mt-1">Optimized molecular rendering and pre-flight validation using custom RDKit WASM core.</p>
                </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
};
