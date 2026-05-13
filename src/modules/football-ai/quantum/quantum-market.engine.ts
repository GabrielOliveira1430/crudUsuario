// src/modules/football-ai/quantum/quantum-market.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import {
  SmartMoneyTracker
} from './smart-money-tracker';

import {
  TrapDetectorEngine
} from './trap-detector.engine';

import {
  FakeFavoriteEngine
} from './fake-favorite.engine';

import {
  SteamMoveEngine
} from './steam-move.engine';

// ======================================
// ENGINE
// ======================================

export class QuantumMarketEngine {

  static analyze(
    prediction: FootballPrediction
  ) {

    // ======================================
    // SMART MONEY
    // ======================================

    const smartMoney =
      SmartMoneyTracker.analyze(
        prediction.winner
      );

    // ======================================
    // TRAP
    // ======================================

    const trap =
      TrapDetectorEngine.analyze(
        prediction,
        smartMoney
      );

    // ======================================
    // FAKE FAVORITE
    // ======================================

    const fakeFavorite =
      FakeFavoriteEngine.analyze(
        prediction
      );

    // ======================================
    // STEAM MOVE
    // ======================================

    const steam =
      SteamMoveEngine.analyze();

    // ======================================
    // QUANTUM SCORE
    // ======================================

    let quantumScore =
      prediction.confidence;

    if (
      smartMoney.suspicious
    ) {

      quantumScore += 8;
    }

    if (
      trap.dangerous
    ) {

      quantumScore -= 15;
    }

    if (
      steam.explosive
    ) {

      quantumScore += 10;
    }

    // ======================================
    // FINAL
    // ======================================

    quantumScore =
      Math.max(
        1,

        Math.min(
          100,
          quantumScore
        )
      );

    return {

      smartMoney,

      trap,

      fakeFavorite,

      steam,

      quantumScore,

      elite:
        quantumScore >= 85
    };
  }
}