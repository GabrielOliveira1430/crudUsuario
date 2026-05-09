// src/modules/strategy-engine/strategy.types.ts


// ==========================================
// 🧬 STRATEGY DNA
// ==========================================

export interface StrategyDNA {

  aggressiveness: number;

  randomness: number;

  hotBias: number;

  coldBias: number;

  mutationRate: number;

  confidenceBias: number;

  explorationRate: number;

  clusterPreference?: string;
}


// ==========================================
// 📜 LINEAGE
// ==========================================

export interface StrategyLineage {

  generation: number;

  parent?: string;

  species?: string;
}


// ==========================================
// 🔥 HISTORICAL RESULT
// ==========================================

export interface DrawResult {

  number: string;

  extractedAt?: Date;

  source?: string;
}


// ==========================================
// 🎲 GENERATED NUMBER
// ==========================================

export interface GeneratedNumber {

  number: string;

  score?: number;

  strategy?: string;

  tags?: string[];
}


// ==========================================
// 🧠 STRATEGY CONTEXT
// ==========================================

export interface StrategyContext {

  history: DrawResult[];
}


// ==========================================
// 🧬 STRATEGY ENTITY
// ==========================================

export interface Strategy {

  name: string;

  dna?: StrategyDNA;

  lineage?: StrategyLineage;

  execute(
    context: StrategyContext
  ): GeneratedNumber[];
}