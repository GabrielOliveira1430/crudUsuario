// src/modules/football-ai/quantum/football.quantum.types.ts

import type {
  Market
} from '../types/market.types';

// ======================================
// ⚛️ QUANTUM SCENARIO
// ======================================

export type QuantumScenario = {

  score: string;

  probability: number;

  minute: number;

  nextGoalTeam?: string;

  // ======================================
  // 🧠 SAFE EXTENSIONS
  // ======================================

  momentumShift?: boolean;

  dangerous?: boolean;

  intensity?:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'EXTREME';

  pressureDifference?: number;

  confidence?: number;

  chaosLevel?: number;
};

// ======================================
// ⚛️ MARKET SIGNAL
// ======================================

export type QuantumMarketSignal = {

  // ======================================
  // ✅ MARKET SAFE
  // ======================================

  market: Extract<
    Market,
    | 'HOME_WIN'
    | 'AWAY_WIN'
    | 'DRAW'
    | 'OVER_1_5'
    | 'OVER_2_5'
    | 'BTTS'
    | 'NO_BET'
    | 'LOW_CONFIDENCE'
  >;

  confidence: number;

  edge: number;

  fairOdd: number;

  recommendation:
    | 'SKIP'
    | 'RISKY'
    | 'GOOD'
    | 'STRONG'
    | 'ELITE';
};

// ======================================
// ⚛️ QUANTUM TIMELINE EVENT
// ======================================

export type QuantumTimelineEvent = {

  minute: number;

  type:
    | 'GOAL'
    | 'PRESSURE'
    | 'MOMENTUM'
    | 'COLLAPSE'
    | 'COMEBACK'
    | 'CHAOS';

  team?: string;

  probability: number;

  description: string;
};

// ======================================
// ⚛️ QUANTUM SIMULATION
// ======================================

export type QuantumSimulation = {

  // ======================================
  // MATCH
  // ======================================

  match: string;

  homeTeam: string;

  awayTeam: string;

  simulations: number;

  // ======================================
  // EXPECTED GOALS
  // ======================================

  expectedGoalsHome: number;

  expectedGoalsAway: number;

  totalExpectedGoals: number;

  // ======================================
  // WIN PROBABILITY
  // ======================================

  winProbabilityHome: number;

  winProbabilityAway: number;

  drawProbability: number;

  // ======================================
  // NEXT GOAL
  // ======================================

  nextGoalProbabilityHome: number;

  nextGoalProbabilityAway: number;

  // ======================================
  // CHAOS / VOLATILITY
  // ======================================

  chaosLevel: number;

  volatilityIndex: number;

  confidence: number;

  marketConfidence: number;

  // ======================================
  // AI ANALYSIS
  // ======================================

  dominantTeam?: string;

  valueRating?:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'ELITE';

  momentumTrend?:
    | 'UP'
    | 'DOWN'
    | 'STABLE';

  pressureTrend?:
    | 'EXPLODING'
    | 'RISING'
    | 'STABLE'
    | 'FALLING';

  // ======================================
  // MARKETS
  // ======================================

  bestMarket?:
    QuantumMarketSignal;

  marketSignals?:
    QuantumMarketSignal[];

  // ======================================
  // SCENARIOS
  // ======================================

  scenarios:
    QuantumScenario[];

  // ======================================
  // TIMELINE
  // ======================================

  timeline?:
    QuantumTimelineEvent[];

  // ======================================
  // EXTRA METRICS
  // ======================================

  dangerousMoments?: number;

  explosivePotential?: number;

  comebackProbability?: number;

  collapseProbability?: number;

  // ======================================
  // META
  // ======================================

  generatedAt?: string;
};