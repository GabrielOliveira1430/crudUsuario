// src/modules/football/football.odds.engine.ts

import type {
  FootballMatch
} from './football.provider';

import {
  FootballPrediction,
  FootballPredictionEngine
} from './football.prediction.engine';

// ==========================================
// ⚽ ODDS RESULT
// ==========================================

export type OddsResult = {
  homeTeam: string;
  awayTeam: string;
  winner: string;

  probability: number;
  fairOdd: number;
  impliedProbability: number;
  edge: number;
  valueBet: boolean;
};

// ==========================================
// ⚽ ODDS ENGINE (REAL MODEL BASE)
// ==========================================

export class FootballOddsEngine {

  // ==========================================
  // 🎯 NORMALIZA PROBABILIDADE (REALISTA)
  // ==========================================

  private static normalizeProbability(
    confidence: number
  ): number {

    // proteção contra IA inflada
    const safe =
      Math.max(
        35,
        Math.min(
          confidence || 50,
          90
        )
      );

    // curva mais próxima de mercado real
    const curve =
      Math.pow(
        safe / 100,
        1.2
      ) * 100;

    // suavização (evita extremos)
    return Math.min(
      92,
      Math.max(
        38,
        curve
      )
    );
  }

  // ==========================================
  // 📊 SINGLE
  // ==========================================

  private static calculateSingle(
    prediction: FootballPrediction
  ): OddsResult {

    const probability =
      this.normalizeProbability(
        prediction.confidence
      );

    const fairOdd =
      Number(
        (
          100 / probability
        ).toFixed(2)
      );

    const impliedProbability =
      Number(
        (
          (1 / fairOdd) * 100
        ).toFixed(2)
      );

    // edge mais realista
    // (mercado sempre tem margem)
    const edge =
      Number(
        (
          probability -
          impliedProbability
        ).toFixed(2)
      );

    // filtro mais conservador
    // (evita falso positivo)
    const valueBet =
      edge >= 7;

    return {

      homeTeam:
        prediction.homeTeam,

      awayTeam:
        prediction.awayTeam,

      winner:
        prediction.winner,

      probability:
        Number(
          probability.toFixed(2)
        ),

      fairOdd,

      impliedProbability,

      edge,

      valueBet
    };
  }

  // ==========================================
  // 🚀 CALCULATE
  // ==========================================

  static calculate(
    matches: FootballMatch[]
  ): OddsResult[] {

    const predictions =
      FootballPredictionEngine.predict(
        matches
      );

    if (!predictions?.length) {

      return [];
    }

    return predictions

      .map(
        prediction =>

          this.calculateSingle(
            prediction
          )
      )

      .sort(
        (a, b) =>

          b.edge -
          a.edge
      );
  }
}