import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Beaker, Zap, ShieldCheck, Microscope } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 animate-in fade-in slide-in-from-top-2 duration-700">
          < Microscope className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Accelerating Drug Discovery</span>
        </div>
        
        <h1 className="text-7xl font-black text-black tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Prioritize Life-Saving <span className="text-blue-700 block">Candidates.</span>
        </h1>
        
        <p className="text-xl text-slate-800 max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-300 font-bold">
          Multi-objective drug discovery platform utilizing AI and molecular physics to predict toxicity, bioavailability, and clinical viability in seconds.
        </p>

        <div className="flex items-center justify-center gap-4 pt-6 animate-in fade-in zoom-in duration-700 delay-500">
          <button 
            onClick={() => navigate('/analysis')}
            className="px-10 py-5 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-700/30 flex items-center gap-3 active:scale-95"
          >
            Start Analysis
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/explorer')}
            className="px-10 py-5 bg-black hover:bg-slate-900 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-black/20 active:scale-95"
          >
            Explore Dataset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
        <div className="p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <Beaker className="w-8 h-8 text-blue-700" />
          </div>
          <h3 className="text-2xl font-black text-black mb-4 tracking-tight">ADME Prediction</h3>
          <p className="text-slate-700 font-bold leading-relaxed">
            Physics-based RDKit analysis for logP, TPSA, and Lipinski compliance verification across 50+ validated candidates.
          </p>
        </div>

        <div className="p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <Zap className="w-8 h-8 text-emerald-700" />
          </div>
          <h3 className="text-2xl font-black text-black mb-4 tracking-tight">Pareto Ranking</h3>
          <p className="text-slate-700 font-bold leading-relaxed">
            Multi-objective optimization algorithm to identify compounds with max safety and metabolic efficiency.
          </p>
        </div>

        <div className="p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <ShieldCheck className="w-8 h-8 text-rose-700" />
          </div>
          <h3 className="text-2xl font-black text-black mb-4 tracking-tight">Toxicity Guard</h3>
          <p className="text-slate-700 font-bold leading-relaxed">
            Gemini-powered toxicity screening identifies metabolic risks, structural alerts, and reactive metabolites.
          </p>
        </div>
      </div>

      <section className="mb-24 space-y-12 animate-in fade-in duration-1000 delay-1000">
        <div className="text-center">
            <h2 className="text-4xl font-black text-black tracking-tight">Project Tech Stack</h2>
            <p className="text-slate-700 font-bold mt-2">The engineering foundation of ADMETra Research Engine.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[ 
                { name: 'Gemini 1.5 Flash', role: 'Chemical Intelligence', icon: '🧠' },
                { name: 'RDKit WASM', role: 'Molecular Physics', icon: '⚛️' },
                { name: 'TypeScript', role: 'Architecture', icon: '🛡️' },
                { name: 'React 18+', role: 'Interface', icon: '⚛️' },
                { name: 'Tailwind CSS', role: 'Design System', icon: '🎨' },
                { name: 'Recharts', role: 'Data Viz', icon: '📈' },
                { name: 'Lucide', role: 'Visual Language', icon: '✨' },
                { name: 'Vite', role: 'Build Engine', icon: '⚡' }
            ].map(tech => (
                <div key={tech.name} className="p-6 bg-white border border-slate-200 rounded-3xl text-center hover:bg-slate-50 hover:border-blue-200 hover:shadow-lg transition-all group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tech.icon}</div>
                    <div className="font-black text-black text-sm">{tech.name}</div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{tech.role}</div>
                </div>
            ))}
        </div>
      </section>

      <section className="bg-slate-900 rounded-[50px] p-12 text-center space-y-8 shadow-2xl shadow-slate-900/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight relative z-10">Ready to accelerate your research?</h2>
        <p className="text-slate-200 font-bold max-w-xl mx-auto relative z-10 leading-relaxed">
            Join the frontier of AI-driven drug discovery. ADMETra provides the decision intelligence needed to prioritize high-potential candidates and mitigate clinical risk early.
        </p>
        <button 
           onClick={() => navigate('/analysis')}
           className="px-12 py-5 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-700/30 inline-flex items-center gap-3 active:scale-95 relative z-10"
        >
            Launch Research Console
            <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
