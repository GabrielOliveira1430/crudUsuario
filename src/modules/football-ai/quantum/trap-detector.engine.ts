// src/modules/football-ai/quantum/trap-detector.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import type {
  SmartMoneyFlow
} from './smart-money-tracker';

// ======================================
// ENGINE
// ======================================

export class TrapDetectorEngine {

  static analyze(

    prediction: FootballPrediction,

    smartMoney: SmartMoneyFlow
  ) {

    let trapScore = 0;

    // ======================================
    // LOW AI CONFIDENCE
    // ======================================

    if (
      prediction.confidence < 60
    ) {

      trapScore += 25;
    }

    // ======================================
    // SUSPICIOUS MONEY
    // ======================================

    if (
      smartMoney.suspicious
    ) {

      trapScore += 40;
    }

    // ======================================
    // MARKET EDGE
    // ======================================

    if (
      prediction.edge < 5
    ) {

      trapScore += 20;
    }

    return {

      trapScore,

      dangerous:
        trapScore >= 60
    };
  }
}