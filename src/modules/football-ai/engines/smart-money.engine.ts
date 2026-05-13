// src/modules/football-ai/engines/smart-money.engine.ts

import type {
  FootballMatch
} from '../../football/football.provider';

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

// ======================================
// TYPES
// ======================================

export type SmartMoneySignal = {

  match: string;

  homeTeam: string;

  awayTeam: string;

  publicBias: number;

  sharpMoney: number;

  marketMove: 'UP' | 'DOWN' | 'STABLE';

  isTrap: boolean;

  valueDetected: boolean;

  confidence: number;

  edge: number;

  recommendation:
    | 'STRONG_VALUE'
    | 'VALUE'
    | 'NO_VALUE'
    | 'AVOID';

  reasons: string[];
};

// ======================================
// ENGINE
// ======================================

export class SmartMoneyEngine {

  // ======================================
  // ANALYZE SINGLE
  // ======================================

  static analyze(
    match: FootballMatch,
    prediction?: FootballPrediction
  ): SmartMoneySignal {

    const reasons: string[] = [];

    // ======================================
    // PUBLIC BIAS (simulado)
    // ======================================

    const publicBias =
      Math.floor(
        50 + Math.random() * 40
      );

    // ======================================
    // SHARP MONEY (inverso inteligente)
    // ======================================

    let sharpMoney =
      100 - publicBias;

    // ======================================
    // MARKET MOVE SIMULATION
    // ======================================

    const moveRand =
      Math.random();

    let marketMove:
      | 'UP'
      | 'DOWN'
      | 'STABLE' =
      'STABLE';

    if (moveRand > 0.66) {

      marketMove = 'UP';

    } else if (moveRand < 0.33) {

      marketMove = 'DOWN';
    }

    // ======================================
    // TRAP DETECTION
    // ======================================

    const isTrap =
      publicBias >= 75 &&
      sharpMoney <= 30;

    if (isTrap) {

      reasons.push(
        'Possível armadilha de favoritismo público'
      );
    }

    // ======================================
    // VALUE DETECTION
    // ======================================

    const valueDetected =
      sharpMoney > publicBias + 10;

    if (valueDetected) {

      reasons.push(
        'Dinheiro inteligente contra o público'
      );
    }

    // ======================================
    // EDGE
    // ======================================

    const edge =
      Number(
        (
          sharpMoney -
          publicBias
        ).toFixed(2)
      );

    // ======================================
    // CONFIDENCE
    // ======================================

    const confidence =
      Math.min(
        95,
        Math.abs(edge) + 55
      );

    // ======================================
    // RECOMMENDATION
    // ======================================

    let recommendation:
      | 'STRONG_VALUE'
      | 'VALUE'
      | 'NO_VALUE'
      | 'AVOID';

    if (isTrap) {

      recommendation = 'AVOID';

    } else if (valueDetected && confidence > 75) {

      recommendation = 'STRONG_VALUE';

    } else if (valueDetected) {

      recommendation = 'VALUE';

    } else {

      recommendation = 'NO_VALUE';
    }

    return {

      match:
        `${match.homeTeam} vs ${match.awayTeam}`,

      homeTeam:
        match.homeTeam,

      awayTeam:
        match.awayTeam,

      publicBias,

      sharpMoney,

      marketMove,

      isTrap,

      valueDetected,

      confidence,

      edge,

      recommendation,

      reasons,
    };
  }

  // ======================================
  // ANALYZE MANY
  // ======================================

  static analyzeMany(
    predictions: FootballPrediction[]
  ) {

    return predictions.map(p =>
      this.analyze(
        {
          homeTeam: p.homeTeam,
          awayTeam: p.awayTeam,
        } as FootballMatch,
        p
      )
    );
  }
}

export const smartMoneyEngine =
  new SmartMoneyEngine();