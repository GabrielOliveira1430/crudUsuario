// src/modules/football/football.odds.engine.ts

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

  valueBet: boolean;
};


// ==========================================
// ⚽ ODDS ENGINE
// ==========================================

export class FootballOddsEngine {


  // ==========================================
  // 📊 SINGLE ODD
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

      100 / probability;

    const impliedProbability =

      (1 / fairOdd) * 100;

    const valueBet =

      probability >
      impliedProbability;

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

      fairOdd:
        Number(
          fairOdd.toFixed(2)
        ),

      impliedProbability:
        Number(
          impliedProbability.toFixed(2)
        ),

      valueBet
    };
  }


  // ==========================================
  // 🚀 CALCULATE ALL
  // ==========================================

  static calculate(
    matches: FootballMatch[]
  ): OddsResult[] {

    const predictions =

      FootballPredictionEngine
        .predict(matches);

    return predictions.map(

      prediction =>

        this.calculateSingle(
          prediction
        )
    );
  }
}