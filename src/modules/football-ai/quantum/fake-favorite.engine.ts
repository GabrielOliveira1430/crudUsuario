// src/modules/football-ai/quantum/fake-favorite.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

// ======================================
// ENGINE
// ======================================

export class FakeFavoriteEngine {

  static analyze(
    prediction: FootballPrediction
  ) {

    const suspicious =

      prediction.confidence < 65 &&

      prediction.fairOdd < 1.8;

    return {

      fakeFavorite:
        suspicious,

      dangerLevel:
        suspicious
          ? 'HIGH'
          : 'LOW'
    };
  }
}