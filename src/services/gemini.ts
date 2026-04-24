/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMolecule(smiles: string): Promise<GeminiAnalysis> {
  const prompt = `
    You are a drug discovery expert.
    Analyze the molecule with SMILES: ${smiles}
    1. Identify key functional groups.
    2. Predict ADME behavior:
       - absorption
       - permeability
       - metabolism stability
    3. Identify toxicity risks.
    4. Evaluate drug-likeness.

    Return the analysis in JSON format matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            functional_groups: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key chemical functional groups identified"
            },
            adme: {
              type: Type.OBJECT,
              properties: {
                absorption: { type: Type.STRING },
                permeability: { type: Type.STRING },
                metabolism: { type: Type.STRING }
              },
              required: ["absorption", "permeability", "metabolism"]
            },
            toxicity: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Potential toxicity risks or structural alerts"
            },
            drug_likeness: {
              type: Type.STRING,
              description: "Overall assessment of drug-likeness (e.g., 'Good', 'Moderate', 'Poor')"
            },
            personalized_plan: {
              type: Type.OBJECT,
              properties: {
                use_case: { type: Type.STRING, description: "Primary medical use or targeted therapeutic application" },
                lifestyle: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Lifestyle adjustments, dietary restrictions, or interaction warnings"
                },
                monitoring: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Key physiological parameters or biomarkers to monitor"
                }
              },
              required: ["use_case", "lifestyle", "monitoring"]
            }
          },
          required: ["functional_groups", "adme", "toxicity", "drug_likeness", "personalized_plan"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as GeminiAnalysis;
  } catch (error) {
    const errorStr = JSON.stringify(error);
    if (errorStr.includes("429") || errorStr.includes("quota")) {
      console.warn("Gemini Analysis: Quota exceeded. Throttling deep scans.");
    } else {
      console.error("Gemini Analysis Error:", error);
    }
    throw error;
  }
}

export async function explainTotalScore(smiles: string, score: number, analysis: GeminiAnalysis): Promise<string> {
  const prompt = `
    Explain why this molecule (SMILES: ${smiles}) scored ${score.toFixed(1)} in our ADMETra AI system.
    Focus on ADME properties and toxicity risks found in the analysis: ${JSON.stringify(analysis)}.
    Provide a concise, professional summary for a medicinal chemist.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "No explanation provided.";
  } catch (error) {
    const errorStr = JSON.stringify(error);
    if (errorStr.includes("429") || errorStr.includes("quota")) {
      console.warn("Gemini Explanation: Quota exceeded.");
    } else {
      console.error("Gemini Explanation Error:", error);
    }
    return "Deep Analysis Quota Exceeded. Priority score reflects Physics profile.";
  }
}
