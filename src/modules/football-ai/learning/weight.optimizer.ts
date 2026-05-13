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

  private weights: DynamicWeights = {

    offense: 1,

    defense: 1,

    momentum: 2,

    pressure: 1.5,

    form: 1
  };

  // ======================================
  // OPTIMIZE
  // ======================================

  optimize() {

    const stats =
      learningMemory.stats();

    // ======================================
    // IA EVOLUTIVA
    // ======================================

    if (stats.accuracy >= 70) {

      this.weights.pressure += 0.1;

      this.weights.momentum += 0.1;
    }

    if (stats.accuracy < 55) {

      this.weights.defense += 0.2;

      this.weights.form += 0.1;
    }

    // ======================================
    // LIMITS
    // ======================================

    this.weights.pressure =
      Math.min(
        5,
        this.weights.pressure
      );

    this.weights.momentum =
      Math.min(
        5,
        this.weights.momentum
      );

    return this.weights;
  }

  // ======================================
  // GET
  // ======================================

  getWeights() {

    return this.weights;
  }
}

export const weightOptimizer =
  new WeightOptimizer();