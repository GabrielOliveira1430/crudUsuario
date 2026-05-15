// src/modules/football-ai/quantum/quantum-match.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import type {
  Market
} from '../types/market.types';

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
// 🧠 TYPES
// ======================================

export type QuantumMarketAnalysis = {

  smartMoney: any;

  trap: any;

  fakeFavorite: any;

  steam: any;

  quantumScore: number;

  elite: boolean;

  strong: boolean;

  weak: boolean;

  marketDirection:
    | 'BULLISH'
    | 'BEARISH'
    | 'NEUTRAL';

  volatility:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';

  recommendation:
    | 'AVOID'
    | 'RISKY'
    | 'GOOD'
    | 'STRONG'
    | 'ELITE';
};

// ======================================
// 🧠 QUANTUM MARKET ENGINE
// ======================================

export class QuantumMarketEngine {

  // ======================================
  // SAFE
  // ======================================

  private static clamp(
    value: number,
    min = 1,
    max = 100
  ) {

    return Number(
      Math.max(
        min,
        Math.min(max, value)
      ).toFixed(2)
    );
  }

  // ======================================
  // ANALYZE
  // ======================================

  static analyze(
    prediction: FootballPrediction
  ): QuantumMarketAnalysis {

    // ======================================
    // 💰 SMART MONEY
    // ======================================

    const smartMoney =
      SmartMoneyTracker.analyze(
        prediction.winner
      );

    // ======================================
    // ⚠️ TRAP DETECTOR
    // ======================================

    const trap =
      TrapDetectorEngine.analyze(
        prediction,
        smartMoney
      );

    // ======================================
    // 🎭 FAKE FAVORITE
    // ======================================

    const fakeFavorite =
      FakeFavoriteEngine.analyze(
        prediction
      );

    // ======================================
    // 🚀 STEAM MOVE
    // ======================================

    const steam =
      SteamMoveEngine.analyze();

    // ======================================
    // 🧮 BASE SCORE
    // ======================================

    let quantumScore =
      Number(
        prediction.confidence ?? 50
      );

    // ======================================
    // 💰 SMART MONEY
    // ======================================

    if (
      smartMoney?.suspicious
    ) {

      quantumScore += 6;
    }

    // ======================================
    // ⚠️ TRAP
    // ======================================

    if (
      trap?.dangerous
    ) {

      quantumScore -= 12;
    }

    // ======================================
    // 🚀 STEAM
    // ======================================

    if (
      steam?.explosive
    ) {

      quantumScore += 8;
    }

    // ======================================
    // 🎭 FAKE FAVORITE
    // ======================================

    // ✅ CORRIGIDO:
    // fakeSignal ao invés de falseSignal

    if (
      fakeFavorite?.fakeSignal
    ) {

      quantumScore -= 5;
    }

    // ======================================
    // 🧠 CHAOS CONTROL
    // ======================================

    if (
      prediction.chaosIndex >= 75
    ) {

      quantumScore -= 7;
    }

    // ======================================
    // 🛡️ LOW RISK BOOST
    // ======================================

    if (
      prediction.risk <= 20
    ) {

      quantumScore += 4;
    }

    // ======================================
    // 📊 NORMALIZE
    // ======================================

    quantumScore =
      this.clamp(
        quantumScore
      );

    // ======================================
    // 📈 MARKET DIRECTION
    // ======================================

    let marketDirection:
      | 'BULLISH'
      | 'BEARISH'
      | 'NEUTRAL' =
      'NEUTRAL';

    if (
      quantumScore >= 75
    ) {

      marketDirection =
        'BULLISH';
    }

    else if (
      quantumScore <= 45
    ) {

      marketDirection =
        'BEARISH';
    }

    // ======================================
    // 🌪️ VOLATILITY
    // ======================================

    let volatility:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH' =
      'MEDIUM';

    if (
      prediction.chaosIndex >= 80 ||
      steam?.explosive
    ) {

      volatility =
        'HIGH';
    }

    else if (
      prediction.chaosIndex <= 35
    ) {

      volatility =
        'LOW';
    }

    // ======================================
    // 🏁 RECOMMENDATION
    // ======================================

    let recommendation:
      | 'AVOID'
      | 'RISKY'
      | 'GOOD'
      | 'STRONG'
      | 'ELITE' =
      'RISKY';

    if (
      quantumScore >= 90
    ) {

      recommendation =
        'ELITE';
    }

    else if (
      quantumScore >= 80
    ) {

      recommendation =
        'STRONG';
    }

    else if (
      quantumScore >= 65
    ) {

      recommendation =
        'GOOD';
    }

    else if (
      quantumScore < 45
    ) {

      recommendation =
        'AVOID';
    }

    // ======================================
    // 🏁 RESULT
    // ======================================

    return {

      smartMoney,

      trap,

      fakeFavorite,

      steam,

      quantumScore,

      elite:
        quantumScore >= 85,

      strong:
        quantumScore >= 70,

      weak:
        quantumScore < 50,

      marketDirection,

      volatility,

      recommendation
    };
  }

  // ======================================
  // 🎯 MARKET PICK
  // ======================================

  static pickMarket(
    prediction: FootballPrediction
  ): Market {

    return prediction.market;
  }
}