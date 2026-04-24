import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MoleculeAnalysis } from '../types';
import { analyzeMolecule, explainTotalScore } from './gemini';
import { getMolecularDescriptors, computeTrajectoryScores, calculateTotalScore } from './chemistry';
import drugsData from '../data/drugs.json';

interface AnalysisContextType {
  analyses: MoleculeAnalysis[];
  selectedId: string | null;
  isProcessing: boolean;
  setSelectedId: (id: string | null) => void;
  handleAnalyze: (query?: string) => Promise<void>;
  clearAnalyses: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analyses, setAnalyses] = useState<MoleculeAnalysis[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processMolecule = async (id: string, smiles: string, name: string, deepScan = false) => {
    setAnalyses(current => current.map(a => a.id === id ? { ...a, status: 'processing' } : a));
    let rdkitFeatures = { mw: 0, logp: 0, tpsa: 0, h_donors: 0, h_acceptors: 0, rotatable_bonds: 0 };
    
    try {
      rdkitFeatures = await getMolecularDescriptors(smiles);
      const initialScores = computeTrajectoryScores(rdkitFeatures, { functional_groups: [], adme: { absorption: '', permeability: '', metabolism: '' }, toxicity: [], drug_likeness: 'Inconclusive', personalized_plan: { use_case: 'Pending scan...', lifestyle: [], monitoring: [] } });
      const initialTotalScore = calculateTotalScore(initialScores);

      const libraryMatch = drugsData.drugs.find(d => d.name === name || d.smiles === smiles);
      const plan = libraryMatch?.personalized_plan;

      setAnalyses(current => current.map(a => a.id === id ? {
        ...a,
        rdkit: rdkitFeatures,
        scores: initialScores,
        totalScore: initialTotalScore,
        status: deepScan ? 'processing' : 'completed',
        plan: plan ? {
          use_case: plan.use_case,
          lifestyle: plan.lifestyle,
          monitoring: plan.monitoring
        } : undefined
      } : a));

      if (deepScan) {
        await enrichMolecule(id, smiles, name, rdkitFeatures);
      }
      
      setSelectedId(prev => prev || id);
      return rdkitFeatures;
    } catch (rdkitError) {
      console.error(`Local computation failed for ${smiles}:`, rdkitError);
      setAnalyses(current => current.map(a => a.id === id ? {
        ...a, status: 'error', error: rdkitError instanceof Error ? rdkitError.message : 'Molecular physics resolution failed'
      } : a));
      return null;
    }
  };

  const enrichMolecule = async (id: string, smiles: string, name: string, rdkit: any) => {
    // Prevent multiple concurrent enrichment attempts for the same molecule
    setAnalyses(current => current.map(a => a.id === id ? { ...a, explanation: '*Prioritizing deep intelligence stream...*' } : a));

    try {
      const geminiAnalysis = await analyzeMolecule(smiles);
      const finalScores = computeTrajectoryScores(rdkit, geminiAnalysis);
      const finalTotalScore = calculateTotalScore(finalScores);
      const explanation = await explainTotalScore(smiles, finalTotalScore, geminiAnalysis);

      const libraryMatch = drugsData.drugs.find(d => d.name === name || d.smiles === smiles);
      const plan = libraryMatch?.personalized_plan || geminiAnalysis.personalized_plan;

      setAnalyses(current => current.map(a => a.id === id ? {
        ...a,
        gemini: geminiAnalysis,
        scores: finalScores,
        totalScore: finalTotalScore,
        explanation,
        status: 'completed',
        plan: plan ? {
          use_case: plan.use_case,
          lifestyle: plan.lifestyle,
          monitoring: plan.monitoring
        } : undefined
      } : a));
    } catch (err) {
      console.warn(`Gemini enrichment failed for ${name}:`, err);
      
      let errorMessage = 'Deep Analysis Offline';
      const errorStr = String(err);
      const errorMsg = err instanceof Error ? err.message : '';
      
      if (errorStr.includes('429') || errorMsg.includes('429') || errorStr.includes('quota') || errorMsg.includes('quota')) {
        errorMessage = 'Deep Analysis Quota Exceeded. Priority score reflects Physics profile.';
      } else {
        errorMessage = `Deep Analysis Offline: ${errorMsg || 'Unknown connection error'}`;
      }

      setAnalyses(current => current.map(a => a.id === id ? {
        ...a,
        status: 'completed',
        explanation: errorMessage
      } : a));
    }
  };

  const handleAnalyze = async (query?: string) => {
    if (!query?.trim()) return;

    const lines = query.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    
    const existingNames = new Set(analyses.map(a => a.name.toLowerCase()));
    const existingSmiles = new Set(analyses.map(a => a.smiles.toLowerCase()));

    const uniqueLines = lines.filter(line => {
      const match = drugsData.drugs.find(d => d.name.toLowerCase() === line.toLowerCase());
      const smiles = match ? match.smiles.toLowerCase() : line.toLowerCase();
      const name = match ? match.name.toLowerCase() : line.toLowerCase();
      return !existingNames.has(name) && !existingSmiles.has(smiles);
    });

    if (uniqueLines.length === 0) return;

    setIsProcessing(true);

    const resolvedAnalyses = uniqueLines.map(line => {
      const match = drugsData.drugs.find(d => d.name.toLowerCase() === line.toLowerCase());
      const smiles = match ? match.smiles : line;
      const name = match ? match.name : `Compound ID: ${smiles.substring(0, 8)}...`;

      return {
        id: Math.random().toString(36).substring(7),
        smiles,
        name,
        status: 'pending' as const,
        rdkit: { mw: 0, logp: 0, tpsa: 0, h_donors: 0, h_acceptors: 0, rotatable_bonds: 0 },
        gemini: { functional_groups: [], adme: { absorption: '', permeability: '', metabolism: '' }, toxicity: [], drug_likeness: 'Inconclusive', personalized_plan: { use_case: 'Pending scan...', lifestyle: [], monitoring: [] } },
        scores: { absorption_score: 0, permeability_score: 0, toxicity_penalty: 0, drug_score: 0 },
        totalScore: 0,
      };
    });

    setAnalyses(prev => [...resolvedAnalyses, ...prev]);

    // Step 1: Immediate RDKit processing
    const featuresList = await Promise.all(resolvedAnalyses.map(analysis => 
      processMolecule(analysis.id, analysis.smiles, analysis.name, false)
    ));

    // Automatically select the first high-scoring candidate to populate the Care Plan
    if (!selectedId && resolvedAnalyses.length > 0) {
      setSelectedId(resolvedAnalyses[0].id);
    }

    // Step 2: Background enrichment
    for (let i = 0; i < Math.min(resolvedAnalyses.length, 3); i++) {
        const analysis = resolvedAnalyses[i];
        const features = featuresList[i];
        if (features) {
            // Non-blocking enrichment
            enrichMolecule(analysis.id, analysis.smiles, analysis.name, features);
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    setIsProcessing(false);
  };

  const clearAnalyses = () => {
    setAnalyses([]);
    setSelectedId(null);
  };

  const preloadStarted = React.useRef(false);

  // Preload core and critical hazardous drugs on initial mount
  React.useEffect(() => {
    if (analyses.length === 0 && !isProcessing && !preloadStarted.current) {
      preloadStarted.current = true;
      handleAnalyze('Aspirin\nParacetamol\nIbuprofen\nFentanyl\nHeroin\nMethamphetamine\nAlcohol\nGHB');
    }
  }, []);

  // Trigger enrichment when a molecule is selected if it hasn't been enriched yet
  React.useEffect(() => {
    if (selectedId) {
      const molecule = analyses.find(a => a.id === selectedId);
      if (molecule && !molecule.explanation && molecule.status === 'completed' && molecule.rdkit.mw !== 0) {
        enrichMolecule(molecule.id, molecule.smiles, molecule.name, molecule.rdkit);
      }
    }
  }, [selectedId, analyses]);

  return (
    <AnalysisContext.Provider value={{ 
      analyses, 
      selectedId, 
      isProcessing, 
      setSelectedId, 
      handleAnalyze, 
      clearAnalyses 
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
