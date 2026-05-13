// src/modules/football-ai/engines/value-bet.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import type {
  SmartMoneySignal
} from './smart-money.engine';

import type {
  PressureAnalysis
} from './live-pressure.engine';

// ======================================
// TYPES
// ======================================

export type ValueBet = {

  match: string;

  homeTeam: string;

  awayTeam: string;

  prediction: string;

  market: string;

  probability: number;

  impliedProbability: number;

  edge: number;

  valueBet: boolean;

  strength:
    | 'WEAK'
    | 'MEDIUM'
    | 'STRONG'
    | 'ELITE';

  risk: number;

  confidence: number;

  finalScore: number;

  recommendation:
    | 'TAKE'
    | 'WATCH'
    | 'AVOID';

  reasons: string[];
};

// ======================================
// ENGINE
// ======================================

export class ValueBetEngine {

  // ======================================
  // SINGLE ANALYSIS
  // ======================================

  static analyze(
    prediction: FootballPrediction,
    smartMoney?: SmartMoneySignal,
    pressure?: PressureAnalysis
  ): ValueBet {

    const reasons: string[] = [];

    // ======================================
    // BASE PROBABILITY
    // ======================================

    const probability =
      prediction.confidence;

    // ======================================
    // IMPLIED ODDS
    // ======================================

    const impliedProbability =
      100 / prediction.fairOdd;

    // ======================================
    // BASE EDGE
    // ======================================

    let edge =
      probability - impliedProbability;

    // ======================================
    // SMART MONEY BOOST
    // ======================================

    if (smartMoney?.valueDetected) {

      edge += 8;

      reasons.push(
        'Smart money confirmando direção'
      );
    }

    if (smartMoney?.isTrap) {

      edge -= 15;

      reasons.push(
        'Possível armadilha de mercado'
      );
    }

    // ======================================
    // PRESSURE BOOST
    // ======================================

    if (pressure?.dangerous) {

      edge += 6;

      reasons.push(
        'Alta pressão ofensiva LIVE'
      );
    }

    if (pressure?.momentumShift) {

      edge += 4;

      reasons.push(
        'Mudança de momentum detectada'
      );
    }

    // ======================================
    // FINAL EDGE LIMIT
    // ======================================

    edge =
      Number(edge.toFixed(2));

    // ======================================
    // VALUE CHECK
    // ======================================

    const valueBet =
      edge >= 5;

    // ======================================
    // STRENGTH
    // ======================================

    let strength:
      | 'WEAK'
      | 'MEDIUM'
      | 'STRONG'
      | 'ELITE';

    if (edge >= 15) {

      strength = 'ELITE';

    } else if (edge >= 10) {

      strength = 'STRONG';

    } else if (edge >= 5) {

      strength = 'MEDIUM';

    } else {

      strength = 'WEAK';
    }

    // ======================================
    // RISK
    // ======================================

    const risk =
      Number(
        (
          100 - probability
        ).toFixed(2)
      );

    // ======================================
    // FINAL SCORE
    // ======================================

    const finalScore =
      Number(
        (
          edge * 2 +
          probability * 0.3
        ).toFixed(2)
      );

    // ======================================
    // RECOMMENDATION
    // ======================================

    let recommendation:
      | 'TAKE'
      | 'WATCH'
      | 'AVOID';

    if (valueBet && strength === 'ELITE') {

      recommendation = 'TAKE';

    } else if (valueBet) {

      recommendation = 'WATCH';

    } else {

      recommendation = 'AVOID';
    }

    return {

      match:
        `${prediction.homeTeam} vs ${prediction.awayTeam}`,

      homeTeam:
        prediction.homeTeam,

      awayTeam:
        prediction.awayTeam,

      prediction:
        prediction.prediction,

      market:
        prediction.market,

      probability,

      impliedProbability,

      edge,

      valueBet,

      strength,

      risk,

      confidence:
        prediction.confidence,

      finalScore,

      recommendation,

      reasons,
    };
  }

  // ======================================
  // MULTI ANALYSIS
  // ======================================

  static analyzeMany(
    predictions: FootballPrediction[]
  ): ValueBet[] {

    return predictions.map(p =>
      this.analyze(p)
    );
  }
}

export const valueBetEngine =
  new ValueBetEngine();