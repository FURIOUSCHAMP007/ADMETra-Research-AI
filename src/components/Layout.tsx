import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Beaker, 
  BarChart3, 
  GitCompare, 
  Map, 
  Info, 
  Home,
  ShieldCheck,
  Code
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout = () => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Database, label: 'Dataset Explorer', path: '/explorer' },
    { icon: Beaker, label: 'Analysis Lab', path: '/analysis' },
    { icon: BarChart3, label: 'Ranking Engine', path: '/ranking' },
    { icon: Map, label: 'Pareto Map', path: '/visualization' },
    { icon: GitCompare, label: 'Comparison', path: '/comparison' },
    { icon: ShieldCheck, label: 'Care Plan', path: '/care-plan' },
    { icon: Info, label: 'Methodology', path: '/methodology' },
    { icon: Code, label: 'API Reference', path: '/api' },
  ];

  const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">🧬</span>
          </div>
          <div>
            <div className="font-black text-white text-lg leading-none tracking-tight">ADMETra</div>
            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">Research AI</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Engine Status</div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-200">Gemini-1.5 Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 font-sans">
        {/* Header (Minimal) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-black flex items-center gap-2" id="page-title">
            <currentItem.icon className="w-4 h-4 text-blue-600" />
            {currentItem.label} Console
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded">
              <div className="w-1 h-1 rounded-full bg-blue-600" />
              v2.4.1 Production
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-black font-bold text-xs border border-slate-300">
              JS
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-auto p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
};
