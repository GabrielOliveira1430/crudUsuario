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
// 💰 TYPES
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
// 🧠 VALUE BET ENGINE (STABLE)
// ======================================

export class ValueBetEngine {

  // ======================================
  // 🎯 SAFE NUMBER
  // ======================================

  private static safe(
    value: number,
    fallback = 0
  ): number {

    if (
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {

      return fallback;
    }

    return value;
  }

  // ======================================
  // 🎯 SINGLE ANALYSIS
  // ======================================

  static analyze(
    prediction: FootballPrediction,
    smartMoney?: SmartMoneySignal,
    pressure?: PressureAnalysis
  ): ValueBet {

    const reasons: string[] = [];

    // ======================================
    // 📊 PROBABILITY
    // ======================================

    const probability =
      Math.max(
        1,
        Math.min(
          95,
          this.safe(
            prediction.confidence,
            50
          )
        )
      );

    // ======================================
    // 💰 IMPLIED PROBABILITY
    // ======================================

    const fairOdd =
      Math.max(
        1.01,
        this.safe(
          prediction.fairOdd,
          2
        )
      );

    const impliedProbability =
      Number(
        (
          100 / fairOdd
        ).toFixed(2)
      );

    // ======================================
    // ⚖️ BASE EDGE
    // ======================================

    let edge =
      probability -
      impliedProbability;

    // ======================================
    // 💸 SMART MONEY BOOST
    // ======================================

    if (
      smartMoney?.valueDetected
    ) {

      edge += 6;

      reasons.push(
        'Smart money alinhado'
      );
    }

    if (
      smartMoney?.isTrap
    ) {

      edge -= 12;

      reasons.push(
        'Possível trap de mercado'
      );
    }

    // ======================================
    // 🔥 LIVE PRESSURE
    // ======================================

    if (
      pressure?.dangerous
    ) {

      edge += 5;

      reasons.push(
        'Alta pressão ofensiva'
      );
    }

    if (
      pressure?.momentumShift
    ) {

      edge += 3;

      reasons.push(
        'Momentum agressivo detectado'
      );
    }

    // ======================================
    // 📉 NORMALIZA EDGE
    // ======================================

    edge =
      Number(
        Math.max(
          -50,
          Math.min(
            50,
            edge
          )
        ).toFixed(2)
      );

    // ======================================
    // ✅ VALUE BET
    // ======================================

    const valueBet =
      edge >= 5;

    // ======================================
    // 💪 STRENGTH
    // ======================================

    let strength:
      | 'WEAK'
      | 'MEDIUM'
      | 'STRONG'
      | 'ELITE';

    if (edge >= 18) {

      strength = 'ELITE';

    }

    else if (
      edge >= 12
    ) {

      strength = 'STRONG';

    }

    else if (
      edge >= 5
    ) {

      strength = 'MEDIUM';

    }

    else {

      strength = 'WEAK';
    }

    // ======================================
    // ⚠️ RISK
    // ======================================

    const risk =
      Number(
        (
          100 - probability
        ).toFixed(2)
      );

    // ======================================
    // 🧠 FINAL SCORE
    // ======================================

    const finalScore =
      Number(
        (
          (edge * 1.8) +
          (probability * 0.35) -
          (risk * 0.15)
        ).toFixed(2)
      );

    // ======================================
    // 🎯 RECOMMENDATION
    // ======================================

    let recommendation:
      | 'TAKE'
      | 'WATCH'
      | 'AVOID';

    if (

      valueBet &&

      (
        strength === 'ELITE' ||
        strength === 'STRONG'
      )

    ) {

      recommendation =
        'TAKE';

    }

    else if (
      valueBet
    ) {

      recommendation =
        'WATCH';

    }

    else {

      recommendation =
        'AVOID';
    }

    // ======================================
    // AUTO REASONS
    // ======================================

    if (
      probability >= 75
    ) {

      reasons.push(
        'Alta confiança estatística'
      );
    }

    if (
      edge >= 10
    ) {

      reasons.push(
        'Edge acima da média'
      );
    }

    if (
      prediction.market === 'OVER_2_5'
    ) {

      reasons.push(
        'Tendência ofensiva forte'
      );
    }

    // ======================================
    // 📦 RESULT
    // ======================================

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

      probability:
        Number(
          probability.toFixed(2)
        ),

      impliedProbability,

      edge,

      valueBet,

      strength,

      risk,

      confidence:
        Number(
          prediction.confidence.toFixed(2)
        ),

      finalScore,

      recommendation,

      reasons
    };
  }

  // ======================================
  // 🚀 MULTI ANALYSIS
  // ======================================

  static analyzeMany(
    predictions: FootballPrediction[]
  ): ValueBet[] {

    if (
      !Array.isArray(
        predictions
      )
    ) {

      return [];
    }

    return predictions

      .map(
        prediction =>
          this.analyze(
            prediction
          )
      )

      .sort(
        (a, b) =>
          b.finalScore -
          a.finalScore
      );
  }
}

// ======================================
// SINGLETON
// ======================================

export const valueBetEngine =
  new ValueBetEngine();