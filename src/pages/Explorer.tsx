import React, { useState } from 'react';
import drugsData from '../data/drugs.json';
import { Search, Filter, Beaker } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Explorer = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = drugsData.drugs.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">Dataset Explorer</h2>
          <p className="text-slate-800 font-bold mt-1">Curated repository of 50 pharmacological agents for validation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-black focus:ring-2 focus:ring-blue-100 outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-black transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-8 py-5 text-sm font-black text-slate-600 uppercase tracking-widest">Molecular Agent</th>
              <th className="px-8 py-5 text-base font-black text-slate-600 uppercase tracking-widest">SMILES Architecture</th>
              <th className="px-8 py-5 text-xs font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((drug) => (
              <tr key={drug.name} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-black">{drug.name}</span>
                    <span className="text-xs text-slate-700 font-bold mt-1 leading-relaxed">{drug.description}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <code className="text-base font-mono bg-slate-100 px-2 py-1 rounded-md text-blue-800 truncate block max-w-sm border border-slate-200">
                    {drug.smiles}
                  </code>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => {
                        navigate('/analysis', { state: { smiles: drug.smiles, name: drug.name } });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-xl font-black text-xs hover:bg-blue-700 hover:text-white transition-all active:scale-95 border border-blue-100"
                  >
                    <Beaker className="w-3.5 h-3.5" />
                    Load in Lab
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="text-slate-300">
              <Microscope className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-slate-800 font-black italic tracking-tight underline decoration-slate-300 underline-offset-8">
              No matching compounds found in repository.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Microscope = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M6 18h8" />
        <path d="M3 22h18" />
        <path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" />
        <path d="M9 12a2 2 0 1 1-2-2V6h6v4.13" />
        <path d="M12 6h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3" />
    </svg>
);
