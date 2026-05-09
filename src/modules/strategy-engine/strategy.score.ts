// src/modules/strategy-engine/strategy.score.ts

import {
  GeneratedNumber
} from './strategy.types';


// ==========================================
// 📊 SCORE RESULT
// ==========================================

export type StrategyScore = {

  accuracy: number;

  diversity: number;

  coverage: number;

  finalScore: number;
};


// ==========================================
// 🧠 STRATEGY SCORE ENGINE
// ==========================================

export class StrategyScoreEngine {


  // ==========================================
  // 🎯 DIVERSIDADE
  // ==========================================

  static calculateDiversity(
    generated: GeneratedNumber[]
  ) {

    const unique =
      new Set(
        generated.map(
          g => g.number
        )
      );

    return Number(
      (
        unique.size /
        generated.length
      * 100
      ).toFixed(2)
    );
  }


  // ==========================================
  // 🌍 COBERTURA
  // ==========================================

  static calculateCoverage(
    generated: GeneratedNumber[]
  ) {

    const prefixes =
      new Set(
        generated.map(
          g => g.number.slice(0, 2)
        )
      );

    return Number(
      (
        prefixes.size / 100
      * 100
      ).toFixed(2)
    );
  }


  // ==========================================
  // 🧠 SCORE FINAL
  // ==========================================

  static calculateFinalScore(
    accuracy: number,
    weight: number,
    diversity: number,
    coverage: number
  ) {

    const score =
      (
        accuracy * 0.4
      ) +
      (
        weight * 0.3
      ) +
      (
        diversity * 0.2
      ) +
      (
        coverage * 0.1
      );

    return Number(
      score.toFixed(2)
    );
  }


  // ==========================================
  // 🚀 SCORE COMPLETO
  // ==========================================

  static evaluate(

    generated: GeneratedNumber[],

    accuracy: number,

    weight: number

  ): StrategyScore {

    const diversity =
      this.calculateDiversity(
        generated
      );

    const coverage =
      this.calculateCoverage(
        generated
      );

    const finalScore =
      this.calculateFinalScore(
        accuracy,
        weight,
        diversity,
        coverage
      );

    return {

      accuracy,

      diversity,

      coverage,

      finalScore
    };
  }
}