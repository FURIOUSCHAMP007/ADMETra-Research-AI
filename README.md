# 🧬 ADMETra AI — Multi-Objective ADME–Toxicity Ranking & Drug Intelligence Platform

[![Version](https://img.shields.io/badge/Version-2.4.1_Production-0284c7.svg?style=for-the-badge)](https://github.com/admetra-ai/platform)
[![Engine](https://img.shields.io/badge/AI_Engine-Gemini_3_Flash-7c3aed.svg?style=for-the-badge)](https://ai.google.dev/)
[![Cheminformatics](https://img.shields.io/badge/Cheminformatics-RDKit_WASM-059669.svg?style=for-the-badge)](https://www.rdkit.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-10b981.svg?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

**ADMETra AI** is a next-generation decision intelligence platform engineered for **pharmacological lead optimization and multi-objective candidate prioritization**. By unifying **WebAssembly-based physical cheminformatics (RDKit)** with **deep neural reasoning (Google Gemini 3 Flash)**, ADMETra enables researchers, computational chemists, and toxicologists to rank molecules across complex **ADME (Absorption, Distribution, Metabolism, Excretion)** and **Toxicity Pareto frontiers**.

---

## 🎯 The Paradigm Shift

Traditional drug discovery approaches evaluate compounds in isolation, asking a binary question:

> ❌ **“Is this molecule good?”**  
> *(Focuses on localized potency while missing multi-variable pharmacokinetic trade-offs)*

ADMETra redefines candidate selection into a multi-objective prioritization framework:

> ✅ **“Which molecule provides maximum therapeutic efficacy with minimal structural toxicity liability?”**  
> *(Evaluates non-dominated Pareto frontiers balancing Bioavailability, Permeability, Drug-likeness, and Toxicophore Penalties)*

---

## 🚨 Problem Statement & Clinical Challenges

* **High Late-Stage Attrition**: Up to **90%** of candidate drugs fail in clinical trials due to unpredicted toxicity or poor ADME properties.
* **Structural Alert Blindspots**: Reactive functional groups (toxicophores) are often missed during preliminary high-throughput screens.
* **Single-Variable Bias**: Optimizing strictly for binding affinity frequently results in hydrophobic molecules with dismal oral bioavailability (high LogP, low solubility).
* **Unstructured Titration Protocols**: Transitioning lead compounds to preliminary translational research lacks structured biomarker monitoring and safety titration guidance.

---

## 💡 Key Architectural Pillars

1. **Deterministic Physics Engine**: RDKit WebAssembly extracts exact 2D molecular descriptors (MW, LogP, TPSA, H-Donors, H-Acceptors, Rotatable Bonds) synchronously in the browser environment.
2. **Neural Structural Inference**: Google Gemini 3 Flash identifies key functional groups, specific toxicophores (structural alerts), metabolic stability routes, and personalized therapeutic guidelines.
3. **Pareto Frontier Optimization**: Evaluates candidate dominance across efficiency vs. toxicity penalty trade-off curves.
4. **Relational Data Invariants**: Employs a Master Gate synchronization pattern across all molecular sub-collections to ensure zero state-gaps.

---

## 🧠 Comprehensive Feature Modules

### 🔬 1. Dataset Explorer
* **Curated Benchmark Library**: Browse 50 pre-validated pharmaceutical agents across various therapeutic classes (Analgesics, Antibiotics, Opioids, Anticonvulsants, Cardiovascular agents, Toxic Compounds).
* **Instant SMILES Inspection**: Review canonical SMILES strings, Lipinski rule status, oral bioavailability scores, and baseline safety indices.
* **Search & Filter Controls**: Real-time filtering by drug class, name, or chemical moiety.

### 🧪 2. Analysis Lab
* **Custom Molecule Input**: Enter any arbitrary SMILES string or compound name for instant analysis.
* **RDKit WASM Descriptor Calculation**:
  * Molecular Weight ($\text{MW} \le 500\text{ g/mol}$)
  * Octanol-Water Partition Coefficient ($\text{LogP} \in [-0.4, 5.6]$)
  * Topological Polar Surface Area ($\text{TPSA} < 140\ \AA^2$)
  * Hydrogen Bond Donors ($\text{HBD} \le 5$) & Acceptors ($\text{HBA} \le 10$)
  * Rotatable Bonds ($\text{RotB} \le 10$)
* **AI Neural Breakdown**: Gemini 3 Flash returns structured JSON detailing functional groups, absorption profiles, metabolic pathways, and specific toxicity alerts.

### 🏆 3. Ranking Engine
* **Multi-Objective Classification**: Automatically sorts compounds into:
  * 🟢 **Optimal Candidates**: High overall efficiency scores without severe toxicity liabilities.
  * 🔴 **Highest Toxicity Hazards**: High hazard index drugs flagged with toxicological warnings (e.g., Heroin, Cocaine, Fentanyl, Oxycodone, Fluoxetine, Alcohol).
* **Structural Alert Indicators**: Explicit counters indicating the number of reactive groups and toxicophores.

### 📈 4. Pareto Frontier Map
* **Interactive Scatter Plot**: Plots **Bioavailability / Efficiency Score** against **Hazard Index / Toxicity Penalty**.
* **Frontier Highlighting**: Visualizes non-dominated candidates sitting on the optimal Pareto front.
* **Candidate Detail Drawer**: Click any point on the plot to inspect detailed descriptors and navigate directly to the deep-dive analysis.

### 🔄 5. Comparison Console
* **Multi-Compound Side-by-Side Analysis**: Compare up to 4 molecules simultaneously.
* **Structural Alert Alignment**: Direct visual comparison of toxicophores and structural alerts.
* **Inference Insights**: Highlights key metabolic differences and safety profile variations.

### 🩺 6. Care Plan & Therapeutic Strategy
* **Personalized Clinical Guidance**:
  * **Primary Indication & Use Case**: Specific pharmacological indication.
  * **Lifestyle & Dietary Guidelines**: Dosing context (e.g., take with food, hydration requirements, contraindications).
  * **Biomarker Monitoring Schedule**: Key physiological parameters (e.g., ALT/AST liver enzymes, serum creatinine, QT interval ECG).
  * **Therapeutic Strategy & Titration Protocols**: Stepwise dosing regimens, maximum daily dose thresholds, and emergency intervention triggers (e.g., Naloxone standby, PPI co-administration).

### ⚙️ 7. Methodology Console
* **Technical Transparency**: Explains the 12 data invariants, WASM pipeline execution steps, and physics + neural fusion rules.
* **High-Contrast Display**: Optimized typography with strict legibility contrast for lab environment displays.

### 🔗 8. API Reference & Developer Console
* **Full OpenAPI Specs**: Complete technical guidelines for integration with existing LIMS (Laboratory Information Management Systems).

---

## 📐 Computational Scoring Algorithms & Mathematical Models

### 1. RDKit Physical Descriptors Extraction
Molecular descriptors are derived using the RDKit minimal WASM module compiled from C++:

$$
\text{Descriptors}(S) = \Big\{ \text{MW}(S), \text{LogP}(S), \text{TPSA}(S), \text{HBD}(S), \text{HBA}(S), \text{RotB}(S) \Big\}
$$

### 2. Physical Sub-Scores (ADME Compliance)

$$\text{Absorption Score} = \mathbb{I}(0 < \text{MW} \le 500) + \mathbb{I}(-0.4 \le \text{LogP} \le 5.6) + \text{EntropyAdjustment}$$

$$\text{Permeability Score} = \mathbb{I}(0 < \text{TPSA} < 140) + 0.5 \cdot \mathbb{I}(\text{HBD} \le 5) + 0.5 \cdot \mathbb{I}(\text{HBA} \le 10)$$

$$\text{Drug-Likeness Score} = \begin{cases} 2.0 & \text{if Gemini classification is "High/Good"} \\ 1.0 & \text{if Gemini classification is "Moderate/Fair"} \\ 0.0 & \text{otherwise} \end{cases}$$

### 3. Toxicity Penalty & Hazard Index Calculation
Toxicity penalty starts with Gemini-detected structural alerts and applies physics-based penalties for molecular extreme values:

$$\text{ToxPenalty}_{\text{raw}} = N_{\text{alerts}} + 1.5 \cdot \mathbb{I}(\text{LogP} > 5) + 1.0 \cdot \mathbb{I}(\text{MW} > 600) + 0.8 \cdot \mathbb{I}(\text{TPSA} > 180) + 0.7 \cdot \mathbb{I}(\text{RotB} > 12)$$

Known dangerous compounds undergo safety overrides:

$$\text{HazardIndex} = \min \left( 5.0, \, \max\left( \text{ToxPenalty}_{\text{raw}}, \, \text{HazardOverride}(S) \right) \right)$$

### 4. Total Composite Efficiency Score
Where explicit library overrides do not exist:

$$\text{Total Score} = \left( 2.5 \cdot \text{AbsorptionScore} \right) + \left( 2.0 \cdot \text{PermeabilityScore} \right) + \left( 1.5 \cdot \text{DrugLikenessScore} \right) - \left( 2.2 \cdot \text{HazardIndex} \right)$$

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   User Input / SMILES Query                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Analysis Context & Batch Engine             │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐  ┌───────────────────────────┐
│  RDKit WASM Module           │  │ Google Gemini 3 Flash API │
│  - Compute MW, LogP, TPSA    │  │ - Extract Functional Grps │
│  - Count HBD, HBA, RotB      │  │ - Identify Struct Alerts  │
│  - Validate SMILES syntax    │  │ - Predict ADME & Tox      │
└──────────────┬───────────────┘  │ - Synthesize Care Plan    │
               │                  └───────────┬───────────────┘
               │                              │
               └──────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Multi-Objective Scoring Calculation            │
│  - Absorption Score, Permeability Score, Drug Score        │
│  - Hazard Index & Toxicophore Penalties                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Pareto Frontier Sorting Engine                │
│  - Categorize Optimal vs High Hazard Compounds              │
│  - Construct Interactive 2D Bioavailability/Tox Scatter Map │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              React UI Dashboard & Presentation              │
│  Explorer | Analysis Lab | Ranking | Pareto Map | Care Plan │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Comprehensive Project Directory Structure

```
admetra-ai/
├── public/
│   └── favicon.ico              # Platform favicon
├── src/
│   ├── components/
│   │   └── Layout.tsx           # Primary layout frame, sidebar navigation & header
│   ├── data/
│   │   └── drugs.json           # Curated database of 50 benchmark molecules
│   ├── lib/
│   │   └── utils.ts             # Tailwind class merging utility (cn)
│   ├── pages/
│   │   ├── Analysis.tsx         # Deep-dive Single Compound Analysis Lab
│   │   ├── ApiInfo.tsx          # Developer API Reference & OpenAPI documentation
│   │   ├── CarePlan.tsx         # Personalized Care Plan & Therapeutic Strategy
│   │   ├── Comparison.tsx       # Multi-compound Side-by-Side Comparison Console
│   │   ├── Explorer.tsx         # Dataset Explorer & Compound Browser
│   │   ├── Landing.tsx          # Hero page, platform capabilities & quick stats
│   │   ├── Methodology.tsx      # Computational methodology & compute invariant specs
│   │   ├── Ranking.tsx          # Multi-objective Ranking Engine Console
│   │   └── Visualization.tsx    # Interactive Pareto Frontier Scatter Plot Map
│   ├── services/
│   │   ├── AnalysisContext.tsx  # Central React state manager, batch preloader & queue
│   │   ├── chemistry.ts         # RDKit WASM descriptor generator & scoring algorithms
│   │   └── gemini.ts            # Google GenAI Gemini 3 Flash structured client
│   ├── App.tsx                  # Client-side router configuration
│   ├── index.css                # Global styles with Tailwind CSS directives
│   ├── main.tsx                 # React DOM entry point
│   └── types.ts                 # TypeScript type definitions & interfaces
├── .env.example                 # Environment variables declaration template
├── metadata.json                # Application metadata & permissions configuration
├── package.json                 # Node package manifests & dependencies
├── README.md                    # Platform documentation
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite build tool configuration
```

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology / Package | Description |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | High-performance SPA frontend |
| **Language** | TypeScript 5 | Strict end-to-end type safety |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design |
| **Icons** | Lucide React | Clean, domain-appropriate SVG icons |
| **Animations** | Framer Motion | Smooth layout transitions & micro-interactions |
| **Cheminformatics** | `@rdkit/rdkit` (WASM) | Client-side C++ compiled 2D molecular engine |
| **AI SDK** | `@google/genai` | Google AI Studio SDK utilizing `gemini-3-flash-preview` |
| **Charts** | Custom SVG + Recharts | Responsive Pareto frontier scatter plots |

---

## 📡 API Reference Specifications

### 1. Molecular Analysis Endpoint

```http
POST /api/analysis/compute
Content-Type: application/json
```

#### Request Payload
```json
{
  "smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "name": "Acetaminophen",
  "engine": "gemini-3-flash",
  "options": {
    "extract_structural_alerts": true,
    "generate_care_plan": true
  }
}
```

#### Successful Response (200 OK)
```json
{
  "id": "mol_acetaminophen_001",
  "status": "completed",
  "smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "rdkit": {
    "mw": 151.16,
    "logp": 0.46,
    "tpsa": 49.33,
    "h_donors": 2,
    "h_acceptors": 2,
    "rotatable_bonds": 1
  },
  "gemini": {
    "functional_groups": ["Phenol", "Acetamide", "Aromatic Ring"],
    "adme": {
      "absorption": "Rapid and complete oral absorption",
      "permeability": "High passive permeability",
      "metabolism": "Hepatic glucuronidation and sulfation"
    },
    "toxicity": ["N-acetyl-p-benzoquinone imine (NAPQI) reactive metabolite at toxic doses"],
    "structural_alerts": ["Quinone-imine precursor"],
    "drug_likeness": "High",
    "personalized_plan": {
      "use_case": "Pain relief, fever reduction",
      "lifestyle": ["Maintain hydration", "Avoid alcohol during treatment"],
      "monitoring": ["Liver function tests (ALT/AST)"],
      "treatment": [
        "Standard titration: 500mg-1g q6h",
        "Max dose: 4g/day",
        "NAC intervention if hepatotoxicity detected"
      ]
    }
  },
  "scores": {
    "absorption_score": 2.06,
    "permeability_score": 2.05,
    "drug_score": 2.0,
    "toxicity_penalty": 0.0
  },
  "totalScore": 8.5
}
```

---

### 2. Multi-Objective Pareto Ranking Endpoint

```http
POST /api/ranking/pareto
Content-Type: application/json
```

#### Request Payload
```json
{
  "molecules": ["Paracetamol", "Ibuprofen", "Heroin", "Cocaine", "Amoxicillin"],
  "sort_by": "pareto_dominance"
}
```

#### Response Payload
```json
{
  "status": "success",
  "optimal_candidates": [
    { "rank": 1, "name": "Amoxicillin", "totalScore": 9.2, "hazard_index": 0.0 },
    { "rank": 2, "name": "Ibuprofen", "totalScore": 8.8, "hazard_index": 0.5 }
  ],
  "high_hazard_liabilities": [
    { "rank": 1, "name": "Heroin", "hazard_index": 4.5, "structural_alerts": ["Diacetylated morphinan core"] },
    { "rank": 2, "name": "Cocaine", "hazard_index": 4.3, "structural_alerts": ["Tropane ester alkaloid"] }
  ]
}
```

---

## 🧪 Installation & Local Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/admetra-ai/platform.git
   cd admetra-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

5. **Type Check & Linting**
   ```bash
   npm run lint
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

---

## ⚠️ Regulatory & Clinical Disclaimer

**ADMETra AI is an academic and technological decision-support software platform for preliminary chemical research.**

* **Non-Clinical Software**: ADMETra AI does NOT provide medical diagnoses, treatment instructions, or clinical drug prescriptions.
* **In Silico Predictions**: ADMET predictions, toxicity alerts, and therapeutic plans are computer-generated models and must be validated through wet-lab *in vitro* assays and *in vivo* preclinical trials before clinical translation.

---

## 📄 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.

---

## 👥 Contact & Support

* **Platform Maintainers**: ADMETra AI Computational Chemistry Team
* **Documentation**: Available in the `/api-reference` tab within the application.
* **Bug Reports & Feature Requests**: Submit an issue on the repository issue tracker.
