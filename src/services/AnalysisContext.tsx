import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MoleculeAnalysis } from '../types';
import { analyzeMolecule, explainTotalScore } from './gemini';
import { getMolecularDescriptors, computeTrajectoryScores, calculateTotalScore } from './chemistry';
import drugsData from '../data/drugs.json';

const COMMON_DRUG_MAP: Record<string, { name: string; smiles: string }> = {
  paracetamol: { name: "Paracetamol (Acetaminophen)", smiles: "CC(=O)NC1=CC=C(O)C=C1" },
  acetaminophen: { name: "Paracetamol (Acetaminophen)", smiles: "CC(=O)NC1=CC=C(O)C=C1" },
  aspirin: { name: "Aspirin (Acetylsalicylic acid)", smiles: "CC(=O)Oc1ccccc1C(=O)O" },
  acetylsalicylic: { name: "Aspirin (Acetylsalicylic acid)", smiles: "CC(=O)Oc1ccccc1C(=O)O" },
  ibuprofen: { name: "Ibuprofen", smiles: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O" },
  amoxicillin: { name: "Amoxicillin", smiles: "CC1(C(N2C(S1)C(C2=O)NC(=O)C(N)CC3=CC=CC=C3)C(=O)O)C" },
  diazepam: { name: "Benzodiazepines (Diazepam)", smiles: "CN1C(=O)CN=C(C2=CC=CC=C2Cl)C3=CC=CC=C3N1" },
  valium: { name: "Benzodiazepines (Diazepam)", smiles: "CN1C(=O)CN=C(C2=CC=CC=C2Cl)C3=CC=CC=C3N1" },
  fluoxetine: { name: "Antidepressants (Fluoxetine)", smiles: "CNCCC(Oc1ccc(cc1)C(F)(F)F)c2ccccc2" },
  prozac: { name: "Antidepressants (Fluoxetine)", smiles: "CNCCC(Oc1ccc(cc1)C(F)(F)F)c2ccccc2" },
  warfarin: { name: "Anticoagulants (Warfarin)", smiles: "CC(=O)CC(C1=CC=CC=C1)C(=O)C2=CC=CC=C2O" },
  amlodipine: { name: "Antihypertensives (Amlodipine)", smiles: "CCOC(=O)C1=C(NC(=C(C1)C)C(=O)OCC)C2=CC=CC=C2Cl" },
  oxycodone: { name: "Semisynthetic Opioids (Oxycodone)", smiles: "CN1CCC23C4=CC=CC=C4O[C@H]2C=C[C@H]3[C@H]1C" },
  heroin: { name: "Heroin", smiles: "CC(=O)Oc1ccc2c(c1)CCN(C2)CC3=CC=CC=C3OC(=O)C" },
  cocaine: { name: "Cocaine", smiles: "CN1C2CCC1C(C2)OC(=O)C3=CC=CC=C3" },
  ethanol: { name: "Alcohol (Ethanol)", smiles: "CCO" },
  alcohol: { name: "Alcohol (Ethanol)", smiles: "CCO" },
  fentanyl: { name: "Fentanyl", smiles: "CCC(=O)N(c1ccccc1)C2CCN(CC2)CCc3ccccc3" },
  caffeine: { name: "Caffeine", smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C" },
  metformin: { name: "Metformin", smiles: "CN(C)C(=N)NC(=N)N" },
  morphine: { name: "Morphine", smiles: "CN1CCC23C4=C5C(=C(C=C4)O)OC2C(C=CC31)O" },
  naloxone: { name: "Naloxone", smiles: "C=CCN1CCC23C4=C5C(=C(C=C4)O)OC2C(=O)CCC3(C15)O" },
  nicotine: { name: "Nicotine", smiles: "CN1CCCC1C2=CN=CC=C2" },
  metronidazole: { name: "Metronidazole", smiles: "CCN(CC)C1=NC(=O)N(C)N1" },
  dextromethorphan: { name: "Cough Medicines (Dextromethorphan)", smiles: "CN1CCC23C4=CC=CC=C4O[C@H]2C=C[C@H]3[C@H]1C" }
};

export function resolveDrug(query: string): { name: string; smiles: string } | undefined {
  const q = query.trim();
  if (!q) return undefined;
  const qLower = q.toLowerCase();

  // 1. Direct match in COMMON_DRUG_MAP
  if (COMMON_DRUG_MAP[qLower]) {
    return COMMON_DRUG_MAP[qLower];
  }

  // 2. Check drugs.json by exact name or SMILES
  const exactDrug = drugsData.drugs.find(
    d => d.name.toLowerCase() === qLower || d.smiles.toLowerCase() === qLower
  );
  if (exactDrug) {
    return { name: exactDrug.name, smiles: exactDrug.smiles };
  }

  // 3. Check drugs.json by substring inclusion (e.g. "Paracetamol" in "Paracetamol (Acetaminophen)")
  const substringDrug = drugsData.drugs.find(d => {
    const nameLower = d.name.toLowerCase();
    return nameLower.includes(qLower) || qLower.includes(nameLower);
  });
  if (substringDrug) {
    return { name: substringDrug.name, smiles: substringDrug.smiles };
  }

  // 4. Check if query contains any word key from COMMON_DRUG_MAP
  for (const [key, value] of Object.entries(COMMON_DRUG_MAP)) {
    if (qLower.includes(key)) {
      return value;
    }
  }

  return undefined;
}

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
    
    // Attempt automatic resolution if smiles is not a raw SMILES string
    let activeSmiles = smiles;
    let activeName = name;
    const resolved = resolveDrug(smiles) || resolveDrug(name);
    if (resolved) {
      activeSmiles = resolved.smiles;
      if (!activeName || activeName.startsWith("Compound ID:") || activeName === smiles) {
        activeName = resolved.name;
      }
    }

    try {
      rdkitFeatures = await getMolecularDescriptors(activeSmiles);
      const libraryMatch = drugsData.drugs.find(d => d.name === activeName || d.smiles === activeSmiles);
      const initialScores = computeTrajectoryScores(rdkitFeatures, { functional_groups: [], adme: { absorption: '', permeability: '', metabolism: '' }, toxicity: [], structural_alerts: [], drug_likeness: 'Inconclusive', personalized_plan: { use_case: 'Pending scan...', lifestyle: [], monitoring: [], treatment: [] } }, libraryMatch);
      const initialTotalScore = calculateTotalScore(initialScores);
      const plan = libraryMatch?.personalized_plan;

      setAnalyses(current => current.map(a => a.id === id ? {
        ...a,
        smiles: activeSmiles,
        name: activeName,
        rdkit: rdkitFeatures,
        scores: initialScores,
        totalScore: initialTotalScore,
        status: deepScan ? 'processing' : 'completed',
        plan: plan ? {
          use_case: plan.use_case,
          lifestyle: plan.lifestyle,
          monitoring: plan.monitoring,
          treatment: plan.treatment || []
        } : undefined
      } : a));

      if (deepScan) {
        await enrichMolecule(id, activeSmiles, activeName, rdkitFeatures);
      }
      
      setSelectedId(prev => prev || id);
      return rdkitFeatures;
    } catch (rdkitError) {
      console.warn(`Molecular physics calculation notice for ${activeName || smiles}:`, rdkitError);
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
      const libraryMatch = drugsData.drugs.find(d => d.name === name || d.smiles === smiles);
      const finalScores = computeTrajectoryScores(rdkit, geminiAnalysis, libraryMatch);
      const finalTotalScore = calculateTotalScore(finalScores);
      const explanation = await explainTotalScore(smiles, finalTotalScore, geminiAnalysis);

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
          monitoring: plan.monitoring,
          treatment: plan.treatment || []
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
      const match = resolveDrug(line);
      const smiles = match ? match.smiles.toLowerCase() : line.toLowerCase();
      const name = match ? match.name.toLowerCase() : line.toLowerCase();
      return !existingNames.has(name) && !existingSmiles.has(smiles);
    });

    if (uniqueLines.length === 0) return;

    setIsProcessing(true);

    const resolvedAnalyses = uniqueLines.map(line => {
      const match = resolveDrug(line);
      const smiles = match ? match.smiles : line;
      const name = match ? match.name : (line.length > 25 ? `${line.substring(0, 20)}...` : line);

      return {
        id: Math.random().toString(36).substring(7),
        smiles,
        name,
        status: 'pending' as const,
        rdkit: { mw: 0, logp: 0, tpsa: 0, h_donors: 0, h_acceptors: 0, rotatable_bonds: 0 },
        gemini: { functional_groups: [], adme: { absorption: '', permeability: '', metabolism: '' }, toxicity: [], structural_alerts: [], drug_likeness: 'Inconclusive', personalized_plan: { use_case: 'Pending scan...', lifestyle: [], monitoring: [], treatment: [] } },
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
      handleAnalyze('Paracetamol (Acetaminophen)\nIbuprofen\nAspirin (Acetylsalicylic acid)\nAmoxicillin\nMetronidazole\nIvermectin\nMebendazole\nFluconazole\nAciclovir\nSumatriptan\nPropranolol\nBenzodiazepines (Diazepam)\nLevetiracetam\nLoratadine\nPrednisolone\nActivated Charcoal\nAcetylcysteine\nAlcohol (Ethanol)\nAnticoagulants (Warfarin)\nAntidepressants (Fluoxetine)\nAntihypertensives (Amlodipine)\nBromocriptine\nClarithromycin\nClozapine\nCocaine\nColchicine\nCough Medicines (Dextromethorphan)\nDigoxin\nHeroin\nSemisynthetic Opioids (Oxycodone)');
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
