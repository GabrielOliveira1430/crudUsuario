import {
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
// ⚽ ODDS ENGINE
// ==========================================

export class FootballOddsEngine {

  // ==========================================
  // 📊 SINGLE
  // ==========================================

  private static calculateSingle(

    prediction: FootballPrediction

  ): OddsResult {

    const probability =

      Math.max(
        1,
        prediction.confidence
      );

    const fairOdd =

      Number(
        (100 / probability)
          .toFixed(2)
      );

    const impliedProbability =

      Number(
        ((1 / fairOdd) * 100)
          .toFixed(2)
      );

    const edge = Number(

      (
        probability -
        impliedProbability
      ).toFixed(2)
    );

    const valueBet =

      edge > 5;

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

      FootballPredictionEngine
        .predict(matches);

    return predictions

      .map(prediction =>

        this.calculateSingle(
          prediction
        )
      )

      .sort(
        (a, b) =>
          b.edge - a.edge
      );
  }
}