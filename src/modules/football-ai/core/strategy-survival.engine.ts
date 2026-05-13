// src/modules/football-ai/core/strategy-survival.engine.ts

import type {
  StrategyGenome
} from './strategy-genome.engine';

// ======================================
// ENGINE
// ======================================

export class StrategySurvivalEngine {

  static evaluate(
    genome: StrategyGenome
  ) {

    let score = 0;

    // ======================================
    // ACCURACY
    // ======================================

    score +=
      genome.accuracy * 0.6;

    // ======================================
    // PROFIT
    // ======================================

    score +=
      genome.profit * 0.3;

    // ======================================
    // GENERATION BONUS
    // ======================================

    score +=
      genome.generation * 2;

    genome.survivalScore =
      Number(score.toFixed(2));

    return genome;
  }

  // ======================================
  // FILTER BEST
  // ======================================

  static selectBest(
    genomes: StrategyGenome[]
  ) {

    return genomes

      .sort(
        (a, b) =>
          b.survivalScore -
          a.survivalScore
      )

      .slice(0, 10);
  }
}