import React, { useState, useMemo, useRef } from 'react';
import { useAnalysis } from '../services/AnalysisContext';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { Map as MapIcon, Activity, Layers, Check, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { MoleculeAnalysis } from '../types';

const COLOR_PALETTE = [
  { stroke: '#2563eb', fill: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
  { stroke: '#059669', fill: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200' },
  { stroke: '#7c3aed', fill: '#8b5cf6', bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
  { stroke: '#d97706', fill: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
  { stroke: '#e11d48', fill: '#f43f5e', bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200' },
  { stroke: '#0891b2', fill: '#06b6d4', bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200' },
];

const calculateADMERadarMetrics = (mol: MoleculeAnalysis) => {
  const { rdkit, scores } = mol;
  
  let absorption = Math.min(100, Math.max(10,
    (scores.absorption_score / 2.5) * 80 + (rdkit.mw > 0 && rdkit.mw <= 500 ? 20 : 0)
  ));
  if (scores.physical_override !== undefined) {
    absorption = Math.min(100, scores.physical_override * 10);
  }

  const logpOpt = rdkit.logp >= 0 && rdkit.logp <= 5 ? 30 : 10;
  const tpsaOpt = rdkit.tpsa >= 20 && rdkit.tpsa <= 140 ? 30 : 10;
  const permOpt = (scores.permeability_score / 2.0) * 40;
  const distribution = Math.min(100, Math.max(15, logpOpt + tpsaOpt + permOpt));

  const rotbScore = Math.max(0, 40 - (rdkit.rotatable_bonds * 4));
  const drugScore = (scores.drug_score / 2.0) * 40;
  const hbaHbdOpt = (rdkit.h_acceptors <= 10 && rdkit.h_donors <= 5) ? 20 : 5;
  const metabolism = Math.min(100, Math.max(15, rotbScore + drugScore + hbaHbdOpt));

  const mwClearance = rdkit.mw > 0 && rdkit.mw <= 450 ? 40 : 20;
  const tpsaClearance = rdkit.tpsa > 40 && rdkit.tpsa < 150 ? 40 : 20;
  const lowToxBonus = Math.max(0, 20 - scores.toxicity_penalty * 4);
  const excretion = Math.min(100, Math.max(15, mwClearance + tpsaClearance + lowToxBonus));

  let safety = Math.max(0, Math.min(100, 100 - (scores.toxicity_penalty / 5.0) * 100));
  if (scores.safety_override !== undefined) {
    safety = Math.min(100, scores.safety_override * 10);
  }

  return {
    Absorption: Math.round(absorption),
    Distribution: Math.round(distribution),
    Metabolism: Math.round(metabolism),
    Excretion: Math.round(excretion),
    Safety: Math.round(safety)
  };
};

export const Visualization = () => {
  const { analyses } = useAnalysis();
  const [activeTab, setActiveTab] = useState<'scatter' | 'radar' | 'split'>('split');
  const scatterRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);

  const downloadChartAsPNG = (containerElement: HTMLElement | null, filename: string) => {
    if (!containerElement) return;
    const svgElement = containerElement.querySelector('svg');
    if (!svgElement) return;

    try {
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Ensure solid white background canvas
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', '#ffffff');
      clonedSvg.insertBefore(rect, clonedSvg.firstChild);

      const bbox = svgElement.getBoundingClientRect();
      const width = Math.max(bbox.width || 800, 600);
      const height = Math.max(bbox.height || 500, 400);

      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());

      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(clonedSvg);

      if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2; // Hi-DPI resolution
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = url;
    } catch (err) {
      console.error('Failed to export chart as PNG:', err);
    }
  };

  const completedAnalyses = useMemo(() => {
    return Array.from(
      new Map(
        analyses
          .filter(a => a.status === 'completed')
          .map(a => [a.name, a])
      ).values()
    );
  }, [analyses]);

  // Selected drugs for Radar comparison (default to top 3)
  const [selectedRadarIds, setSelectedRadarIds] = useState<string[]>(() => {
    return completedAnalyses.slice(0, 3).map(a => a.id);
  });

  // Sync selectedRadarIds if completedAnalyses load after initial mount
  React.useEffect(() => {
    if (selectedRadarIds.length === 0 && completedAnalyses.length > 0) {
      setSelectedRadarIds(completedAnalyses.slice(0, 3).map(a => a.id));
    }
  }, [completedAnalyses]);

  const toggleRadarSelection = (id: string) => {
    setSelectedRadarIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 6) return prev; // max 6 for clean visual
        return [...prev, id];
      }
    });
  };

  const selectedDrugs = useMemo(() => {
    return completedAnalyses.filter(a => selectedRadarIds.includes(a.id));
  }, [completedAnalyses, selectedRadarIds]);

  const scatterData = useMemo(() => {
    return completedAnalyses.map(a => {
      const s = a.scores;
      const eff = s.physical_override !== undefined 
          ? s.physical_override * 10 
          : Math.min(((s.absorption_score + s.permeability_score) / 4) * 100, 100);
      
      const tox = s.safety_override !== undefined
          ? (10 - s.safety_override) * 10
          : (s.toxicity_penalty / 5) * 100;

      return {
          name: a.name,
          bioavailability: eff,
          toxicity: tox,
          score: a.totalScore,
          id: a.id
      };
    });
  }, [completedAnalyses]);

  const radarData = useMemo(() => {
    const subjects = ['Absorption', 'Distribution', 'Metabolism', 'Excretion', 'Safety'];
    return subjects.map(subject => {
      const row: Record<string, any> = { subject };
      selectedDrugs.forEach(drug => {
        const metrics = calculateADMERadarMetrics(drug);
        row[drug.name] = metrics[subject as keyof typeof metrics];
      });
      return row;
    });
  }, [selectedDrugs]);

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl min-w-[200px]">
          <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2 mb-2">{d.name}</p>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase flex justify-between gap-4">
                Efficiency Index: <span className="text-blue-600">{d.bioavailability.toFixed(0)}%</span>
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase flex justify-between gap-4">
                Toxicity Load: <span className={cn("font-black", d.toxicity > 30 ? "text-rose-600" : "text-emerald-600")}>{d.toxicity.toFixed(0)}%</span>
            </p>
            <p className="text-[10px] font-black text-slate-900 uppercase flex justify-between gap-4 pt-1 mt-1 border-t border-slate-50">
                Composite Score: <span>{d.score.toFixed(1)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomRadarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl min-w-[180px]">
          <p className="text-xs font-black text-slate-900 border-b border-slate-100 pb-1.5 mb-2 uppercase tracking-wider">{label} Index</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 text-[11px] font-bold">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-black text-slate-900">{entry.value}/100</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-black tracking-tight">Molecular Analytics & Radar Map</h2>
          <p className="text-slate-600 font-bold mt-1 text-lg">Compare ADME properties side-by-side and map Pareto efficiency frontiers.</p>
        </div>
        
        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('split')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
              activeTab === 'split' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Layers className="w-3.5 h-3.5" /> Dual View
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
              activeTab === 'radar' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Activity className="w-3.5 h-3.5" /> ADME Radar
          </button>
          <button
            onClick={() => setActiveTab('scatter')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
              activeTab === 'scatter' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <MapIcon className="w-3.5 h-3.5" /> Pareto Frontier
          </button>
        </div>
      </div>

      {/* ADME Radar Multi-Selector Controls */}
      {(activeTab === 'radar' || activeTab === 'split') && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                ADME Side-by-Side Radar Selector
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Select up to 6 candidate drugs to compare Absorption, Distribution, Metabolism, Excretion, and Safety profiles.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedRadarIds(completedAnalyses.slice(0, 3).map(a => a.id))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Reset Top 3
              </button>
              <button
                onClick={() => setSelectedRadarIds(completedAnalyses.filter(a => a.scores.toxicity_penalty < 2).slice(0, 5).map(a => a.id))}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Select Safe Leads
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {completedAnalyses.map((m) => {
              const isSelected = selectedRadarIds.includes(m.id);
              const selectedIndex = selectedRadarIds.indexOf(m.id);
              const palette = isSelected ? COLOR_PALETTE[selectedIndex % COLOR_PALETTE.length] : null;

              return (
                <button
                  key={m.id}
                  onClick={() => toggleRadarSelection(m.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border",
                    isSelected && palette
                      ? `${palette.border} bg-white text-slate-900 shadow-sm ring-2 ring-offset-1 ring-${palette.fill}`
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span
                    className={cn(
                      "w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0",
                      isSelected && palette ? palette.bg : "bg-slate-300"
                    )}
                  >
                    {isSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : null}
                  </span>
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Grid based on active tab */}
      <div className={cn(
        "grid gap-8",
        activeTab === 'split' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      )}>

        {/* RADAR CHART CONTAINER */}
        {(activeTab === 'radar' || activeTab === 'split') && (
          <div className="bg-white border border-slate-200 rounded-[40px] p-6 shadow-sm flex flex-col min-h-[460px]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">ADME Side-by-Side Radar</h3>
                <p className="text-xs font-bold text-slate-500">Multi-axis comparison across 5 pharmacological parameters (0-100 scale)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {selectedDrugs.length} Compounds
                </span>
                <button
                  onClick={() => downloadChartAsPNG(radarRef.current, 'admetra-adme-radar-chart.png')}
                  className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
                  title="Download Radar Chart as PNG"
                >
                  <Download className="w-3.5 h-3.5" /> Save PNG
                </button>
              </div>
            </div>

            <div ref={radarRef} className="flex-1 w-full min-h-[360px] relative">
              {selectedDrugs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 900 }} 
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      stroke="#cbd5e1"
                    />
                    <Tooltip content={<CustomRadarTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: '800' }}
                    />

                    {selectedDrugs.map((drug, index) => {
                      const palette = COLOR_PALETTE[index % COLOR_PALETTE.length];
                      return (
                        <Radar
                          key={drug.id}
                          name={drug.name}
                          dataKey={drug.name}
                          stroke={palette.stroke}
                          fill={palette.fill}
                          fillOpacity={0.25}
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: palette.stroke }}
                        />
                      );
                    })}
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Activity className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-slate-800 font-black text-sm uppercase">No Compounds Selected</p>
                  <p className="text-slate-500 text-xs font-bold mt-1">Select candidates above to display the ADME radar chart.</p>
                </div>
              )}
            </div>

            {/* Radar Dimension Legend */}
            <div className="grid grid-cols-5 gap-2 pt-4 border-t border-slate-100 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
              <div><span className="text-blue-600 block font-black">Absorption</span>Gut & Bioavailability</div>
              <div><span className="text-emerald-600 block font-black">Distribution</span>Tissue & Vd Index</div>
              <div><span className="text-purple-600 block font-black">Metabolism</span>Metabolic Half-Life</div>
              <div><span className="text-amber-600 block font-black">Excretion</span>Renal Clearance</div>
              <div><span className="text-rose-600 block font-black">Safety</span>Non-Tox Compliance</div>
            </div>
          </div>
        )}

        {/* PARETO SCATTER CHART CONTAINER */}
        {(activeTab === 'scatter' || activeTab === 'split') && (
          <div className="bg-white border border-slate-200 rounded-[40px] p-6 shadow-sm flex flex-col min-h-[460px]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Pareto Multi-Objective Frontier</h3>
                <p className="text-xs font-bold text-slate-500">Efficiency Index vs Toxicity Hazard Load</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 uppercase"><span className="w-2 h-2 rounded-full bg-rose-600" /> High Hazard</span>
                <button
                  onClick={() => downloadChartAsPNG(scatterRef.current, 'admetra-pareto-frontier-map.png')}
                  className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 ml-1"
                  title="Download Pareto Map as PNG"
                >
                  <Download className="w-3.5 h-3.5" /> Save PNG
                </button>
              </div>
            </div>

            <div ref={scatterRef} className="flex-1 w-full min-h-[360px] relative">
              {scatterData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                    
                    <ReferenceArea y1={60} y2={100} fill="#fff1f2" fillOpacity={0.5} />
                    <ReferenceLine y={60} stroke="#fda4af" strokeDasharray="5 5" label={{ 
                      value: 'HIGH TOXICITY', position: 'insideTopLeft', fill: '#e11d48', fontSize: 9, fontWeight: 900
                    }} />

                    <ReferenceArea y1={0} y2={30} fill="#f0fdf4" fillOpacity={0.4} />
                    <ReferenceLine y={30} stroke="#86efac" strokeDasharray="8 4" label={{ 
                      value: 'SAFETY ZONE', position: 'insideBottomLeft', fill: '#059669', fontSize: 9, fontWeight: 900
                    }} />

                    <XAxis 
                      type="number" 
                      dataKey="bioavailability" 
                      name="Efficiency" 
                      unit="%" 
                      domain={[0, 100]} 
                      label={{ 
                          value: "EFFICIENCY (%)", position: 'insideBottom', offset: -20, fontSize: 10, fontWeight: 900, fill: '#475569'
                      }}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      type="number" 
                      dataKey="toxicity" 
                      name="Toxicity Load" 
                      unit="%"
                      domain={[0, 100]}
                      label={{ 
                          value: "TOXICITY (%)", angle: -90, position: 'insideLeft', offset: -15, fontSize: 10, fontWeight: 900, fill: '#475569'
                      }}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                      stroke="#cbd5e1"
                    />
                    <ZAxis type="number" dataKey="score" range={[80, 500]} name="Score" />
                    <Tooltip content={<CustomScatterTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Scatter name="Compounds" data={scatterData}>
                      {scatterData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.toxicity > 60 ? '#e11d48' : entry.toxicity > 30 ? '#f59e0b' : '#10b981'} 
                          fillOpacity={0.85}
                          stroke="white"
                          strokeWidth={1.5}
                          className="cursor-pointer hover:fill-opacity-100 transition-all duration-300 drop-shadow-md"
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <MapIcon className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-slate-800 font-black text-sm uppercase">Cartographic Data Missing</p>
                  <p className="text-slate-500 text-xs font-bold mt-1">Initialize molecular analyses to map prioritization frontier.</p>
                </div>
              )}
            </div>

            {/* Scatter Explanatory Footer */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
              <div><span className="text-blue-600 block font-black">X-Axis</span>Efficiency Index</div>
              <div><span className="text-rose-600 block font-black">Y-Axis</span>Toxicity Hazard</div>
              <div><span className="text-slate-900 block font-black">Diameter</span>Composite Score</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

