// src/modules/football-ai/learning/weight.optimizer.ts

import {
  learningMemory
} from './learning.memory';

// ======================================
// TYPES
// ======================================

export type DynamicWeights = {

  offense: number;

  defense: number;

  momentum: number;

  pressure: number;

  form: number;
};

// ======================================
// ENGINE
// ======================================

class WeightOptimizer {

  // ======================================
  // BASE WEIGHTS
  // ======================================

  private readonly baseWeights:
    DynamicWeights = {

    offense: 1,

    defense: 1,

    momentum: 2,

    pressure: 1.5,

    form: 1
  };

  // ======================================
  // CURRENT WEIGHTS
  // ======================================

  private weights:
    DynamicWeights = {

    offense: 1,

    defense: 1,

    momentum: 2,

    pressure: 1.5,

    form: 1
  };

  // ======================================
  // CLAMP
  // ======================================

  private clamp(
    value: number,
    min: number,
    max: number
  ) {

    return Math.min(
      max,
      Math.max(min, value)
    );
  }

  // ======================================
  // NORMALIZE
  // ======================================

  private normalize() {

    this.weights.offense =
      Number(
        this.clamp(
          this.weights.offense,
          0.5,
          5
        ).toFixed(2)
      );

    this.weights.defense =
      Number(
        this.clamp(
          this.weights.defense,
          0.5,
          5
        ).toFixed(2)
      );

    this.weights.momentum =
      Number(
        this.clamp(
          this.weights.momentum,
          0.5,
          5
        ).toFixed(2)
      );

    this.weights.pressure =
      Number(
        this.clamp(
          this.weights.pressure,
          0.5,
          5
        ).toFixed(2)
      );

    this.weights.form =
      Number(
        this.clamp(
          this.weights.form,
          0.5,
          5
        ).toFixed(2)
      );
  }

  // ======================================
  // RESET
  // ======================================

  reset() {

    this.weights = {
      ...this.baseWeights
    };

    console.log(
      '🧠 Pesos resetados'
    );
  }

  // ======================================
  // OPTIMIZE
  // ======================================

  optimize() {

    const stats =
      learningMemory.stats();

    const accuracy =
      Number(
        stats?.accuracy || 0
      );

    const total =
      Number(
        stats?.total || 0
      );

    // ======================================
    // PROTEÇÃO
    // ======================================

    if (total < 5) {

      this.normalize();

      return this.weights;
    }

    // ======================================
    // ELITE MODE
    // ======================================

    if (accuracy >= 80) {

      this.weights.pressure += 0.15;

      this.weights.momentum += 0.12;

      this.weights.offense += 0.08;
    }

    // ======================================
    // GOOD MODE
    // ======================================

    else if (accuracy >= 70) {

      this.weights.pressure += 0.08;

      this.weights.momentum += 0.08;
    }

    // ======================================
    // BAD MODE
    // ======================================

    else if (accuracy < 55) {

      this.weights.defense += 0.2;

      this.weights.form += 0.12;

      this.weights.pressure -= 0.08;
    }

    // ======================================
    // VERY BAD MODE
    // ======================================

    if (accuracy < 45) {

      this.weights.defense += 0.15;

      this.weights.form += 0.15;

      this.weights.offense -= 0.05;

      this.weights.momentum -= 0.05;
    }

    // ======================================
    // NORMALIZE
    // ======================================

    this.normalize();

    console.log(
      `🧠 Pesos otimizados | accuracy=${accuracy}%`
    );

    return {
      ...this.weights
    };
  }

  // ======================================
  // MANUAL UPDATE
  // ======================================

  setWeights(
    partial:
      Partial<DynamicWeights>
  ) {

    this.weights = {

      ...this.weights,

      ...partial
    };

    this.normalize();

    console.log(
      '⚙️ Pesos atualizados manualmente'
    );
  }

  // ======================================
  // GET
  // ======================================

  getWeights() {

    return {
      ...this.weights
    };
  }
}

export const weightOptimizer =
  new WeightOptimizer();