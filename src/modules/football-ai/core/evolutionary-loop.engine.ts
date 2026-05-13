// src/modules/football-ai/core/evolutionary-loop.engine.ts

import {
  StrategyGenomeEngine
} from './strategy-genome.engine';

import {
  MutationEngine
} from './mutation.engine';

import {
  StrategySurvivalEngine
} from './strategy-survival.engine';

// ======================================
// ENGINE
// ======================================

export class EvolutionaryLoopEngine {

  private static population =
    Array.from(
      { length: 20 },
      () =>
        StrategyGenomeEngine
          .createRandom()
    );

  // ======================================
  // EVOLVE
  // ======================================

  static evolve() {

    // ======================================
    // EVALUATE
    // ======================================

    this.population =
      this.population.map(
        genome =>
          StrategySurvivalEngine
            .evaluate(
              genome
            )
      );

    // ======================================
    // BEST
    // ======================================

    const best =
      StrategySurvivalEngine
        .selectBest(
          this.population
        );

    // ======================================
    // MUTATE
    // ======================================

    const mutated =
      best.map(genome =>
        MutationEngine
          .mutate(genome)
      );

    // ======================================
    // NEXT GEN
    // ======================================

    this.population = [

      ...best,

      ...mutated
    ];

    return this.population;
  }

  // ======================================
  // GET BEST
  // ======================================

  static best() {

    return this.population

      .sort(
        (a, b) =>
          b.survivalScore -
          a.survivalScore
      )[0];
  }
}