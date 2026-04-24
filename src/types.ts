/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RDkitFeatures {
  mw: number;
  logp: number;
  tpsa: number;
  h_donors: number;
  h_acceptors: number;
  rotatable_bonds: number;
  smiles?: string;
}

export interface GeminiADME {
  absorption: string;
  permeability: string;
  metabolism: string;
}

export interface GeminiAnalysis {
  functional_groups: string[];
  adme: GeminiADME;
  toxicity: string[];
  drug_likeness: string;
}

export interface TrajectoryScores {
  absorption_score: number;
  permeability_score: number;
  toxicity_penalty: number;
  drug_score: number;
}

export interface PersonalizedPlan {
  use_case: string;
  lifestyle: string[];
  monitoring: string[];
}

export interface MoleculeAnalysis {
  id: string;
  smiles: string;
  name: string;
  rdkit: RDkitFeatures;
  gemini: GeminiAnalysis;
  scores: TrajectoryScores;
  totalScore: number;
  explanation?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  plan?: PersonalizedPlan;
}
