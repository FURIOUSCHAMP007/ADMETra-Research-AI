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
  caffeine: { name: "Caffeine", smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)" },
  metformin: { name: "Metformin", smiles: "CN(C)C(=N)NC(=N)N" },
  morphine: { name: "Morphine", smiles: "CN1CCC23C4=C5C(=C(C=C4)O)OC2C(C=CC31)O" },
  naloxone: { name: "Naloxone", smiles: "C=CCN1CCC23C4=C5C(=C(C=C4)O)OC2C(=O)CCC3(C15)O" },
  nicotine: { name: "Nicotine", smiles: "CN1CCCC1C2=CN=CC=C2" },
  metronidazole: { name: "Metronidazole", smiles: "CCN(CC)C1=NC(=O)N(C)N1" },
  dextromethorphan: { name: "Cough Medicines (Dextromethorphan)", smiles: "CN1CCC23C4=CC=CC=C4O[C@H]2C=C[C@H]3[C@H]1C" }
};

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
}

export interface SmilesValidationResult {
  isValid: boolean;
  input: string;
  isDrugName: boolean;
  resolvedName?: string;
  resolvedSmiles?: string;
  issues: ValidationIssue[];
  structuralChecks: {
    balancedParentheses: boolean;
    balancedBrackets: boolean;
    ringClosureOk: boolean;
    validCharactersOk: boolean;
    hasAtoms: boolean;
    validBondsOk: boolean;
  };
}

export function resolveDrugInput(query: string): { name: string; smiles: string } | undefined {
  const q = query.trim();
  if (!q) return undefined;
  const qLower = q.toLowerCase();

  if (COMMON_DRUG_MAP[qLower]) {
    return COMMON_DRUG_MAP[qLower];
  }

  const exactDrug = drugsData.drugs.find(
    d => d.name.toLowerCase() === qLower || d.smiles.toLowerCase() === qLower
  );
  if (exactDrug) {
    return { name: exactDrug.name, smiles: exactDrug.smiles };
  }

  const substringDrug = drugsData.drugs.find(d => {
    const nameLower = d.name.toLowerCase();
    return nameLower.includes(qLower) || qLower.includes(nameLower);
  });
  if (substringDrug) {
    return { name: substringDrug.name, smiles: substringDrug.smiles };
  }

  for (const [key, value] of Object.entries(COMMON_DRUG_MAP)) {
    if (qLower.includes(key)) {
      return value;
    }
  }

  return undefined;
}

export function validateSmilesStructure(input: string): SmilesValidationResult {
  const trimmed = input.trim();
  const issues: ValidationIssue[] = [];

  if (!trimmed) {
    return {
      isValid: false,
      input,
      isDrugName: false,
      issues: [{ type: 'error', message: 'Input is empty.' }],
      structuralChecks: {
        balancedParentheses: false,
        balancedBrackets: false,
        ringClosureOk: false,
        validCharactersOk: false,
        hasAtoms: false,
        validBondsOk: false,
      }
    };
  }

  // 1. Check if input resolves as a recognized drug name or common drug
  const resolved = resolveDrugInput(trimmed);
  if (resolved) {
    return {
      isValid: true,
      input,
      isDrugName: true,
      resolvedName: resolved.name,
      resolvedSmiles: resolved.smiles,
      issues: [],
      structuralChecks: {
        balancedParentheses: true,
        balancedBrackets: true,
        ringClosureOk: true,
        validCharactersOk: true,
        hasAtoms: true,
        validBondsOk: true,
      }
    };
  }

  // Multi-line batch paste handling - check primary entry
  const lines = trimmed.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  const smilesToTest = lines[0] || trimmed;

  // 2. Check Parentheses Balance
  let parenDepth = 0;
  let balancedParentheses = true;
  for (let i = 0; i < smilesToTest.length; i++) {
    const char = smilesToTest[i];
    if (char === '(') parenDepth++;
    if (char === ')') parenDepth--;
    if (parenDepth < 0) {
      balancedParentheses = false;
      break;
    }
  }
  if (parenDepth !== 0) balancedParentheses = false;

  if (!balancedParentheses) {
    issues.push({
      type: 'error',
      message: parenDepth > 0
        ? `Unclosed branch parenthesis '(' detected in SMILES.`
        : `Unmatched closing parenthesis ')' detected in SMILES.`
    });
  }

  // 3. Check Square Brackets Balance
  let bracketDepth = 0;
  let balancedBrackets = true;
  for (let i = 0; i < smilesToTest.length; i++) {
    const char = smilesToTest[i];
    if (char === '[') bracketDepth++;
    if (char === ']') bracketDepth--;
    if (bracketDepth < 0 || bracketDepth > 1) {
      balancedBrackets = false;
      break;
    }
  }
  if (bracketDepth !== 0) balancedBrackets = false;

  if (!balancedBrackets) {
    issues.push({
      type: 'error',
      message: `Unclosed or mismatched atom brackets '[ ... ]'.`
    });
  }

  // 4. Ring closure index matching
  const ringCounts: Record<string, number> = {};
  let idx = 0;
  while (idx < smilesToTest.length) {
    const char = smilesToTest[idx];
    if (char === '[') {
      const closeIdx = smilesToTest.indexOf(']', idx);
      if (closeIdx !== -1) {
        idx = closeIdx + 1;
        continue;
      }
    }
    if (char === '%') {
      const ringNum = smilesToTest.substring(idx + 1, idx + 3);
      if (/^\d\d$/.test(ringNum)) {
        ringCounts[ringNum] = (ringCounts[ringNum] || 0) + 1;
        idx += 3;
        continue;
      }
    } else if (/^\d$/.test(char)) {
      ringCounts[char] = (ringCounts[char] || 0) + 1;
    }
    idx++;
  }

  const unclosedRings = Object.entries(ringCounts)
    .filter(([_, count]) => count % 2 !== 0)
    .map(([num]) => num);

  const ringClosureOk = unclosedRings.length === 0;
  if (!ringClosureOk) {
    issues.push({
      type: 'error',
      message: `Unclosed ring index: ring closure ID(s) ${unclosedRings.map(r => `'${r}'`).join(', ')} appear an odd number of times.`
    });
  }

  // 5. Valid SMILES character set
  const invalidCharsFound = Array.from(new Set(
    smilesToTest.split('').filter(c => !/[A-Za-z0-9()\[\]=#\-+:\\/@.%\*\~]/.test(c))
  ));
  const validCharactersOk = invalidCharsFound.length === 0;

  if (!validCharactersOk) {
    issues.push({
      type: 'error',
      message: `Non-SMILES character(s) detected: ${invalidCharsFound.map(c => `'${c}'`).join(', ')}.`
    });
  }

  // 6. Must contain recognized atom symbols
  const hasAtoms = /[CcNnOoSsPpFfI|Br|Cl|HhBb]/.test(smilesToTest);
  if (!hasAtoms) {
    issues.push({
      type: 'error',
      message: `No valid atom symbol detected in the input.`
    });
  }

  // 7. Check for consecutive illegal bond symbols or trailing bond
  let validBondsOk = true;
  if (/(=|=|#|#|-|-){2,}/.test(smilesToTest) || /[=#\-]$/.test(smilesToTest)) {
    validBondsOk = false;
    issues.push({
      type: 'error',
      message: `Consecutive or trailing bond operator (e.g., '==' or trailing '=').`
    });
  }

  if (smilesToTest.length < 2 && !hasAtoms) {
    issues.push({
      type: 'warning',
      message: `String is too short for a standard chemical compound.`
    });
  }

  const hasErrors = issues.some(issue => issue.type === 'error');

  return {
    isValid: !hasErrors,
    input,
    isDrugName: false,
    issues,
    structuralChecks: {
      balancedParentheses,
      balancedBrackets,
      ringClosureOk,
      validCharactersOk,
      hasAtoms,
      validBondsOk,
    }
  };
}
