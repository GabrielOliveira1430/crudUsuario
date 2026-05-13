// src/modules/football-ai/learning/prediction.feedback.ts

import crypto from 'crypto';

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import {
  learningMemory
} from './learning.memory';

// ======================================
// ENGINE
// ======================================

export class PredictionFeedback {

  // ======================================
  // REGISTER RESULT
  // ======================================

  static register(

    prediction: FootballPrediction,

    realWinner: string,

    league = 'Unknown'
  ) {

    const result =

      prediction.winner === realWinner
        ? 'WIN'
        : 'LOSS';

    learningMemory.add({

      id:
        crypto.randomUUID(),

      match:
        `${prediction.homeTeam} vs ${prediction.awayTeam}`,

      league,

      prediction:
        prediction.winner,

      winner:
        realWinner,

      confidence:
        prediction.confidence,

      market:
        prediction.market,

      result,

      createdAt:
        new Date().toISOString()
    });

    return result;
  }
}