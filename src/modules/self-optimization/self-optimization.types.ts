// src/modules/self-optimization/self-optimization.types.ts

export interface StrategyHealth {

  strategy: string;

  weight: number;

  runs: number;

  hits: number;

  successRate: number;

  health: number;

  status:
    | 'dominant'
    | 'stable'
    | 'weak'
    | 'dead';
}


export interface OptimizationResult {

  totalStrategies: number;

  dominantStrategies: number;

  weakStrategies: number;

  deadStrategies: number;

  recommendations: string[];

  strategies: StrategyHealth[];
}