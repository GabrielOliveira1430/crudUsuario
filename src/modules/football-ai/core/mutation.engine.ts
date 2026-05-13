// src/modules/football-ai/core/mutation.engine.ts

import type {
  StrategyGenome
} from './strategy-genome.engine';

// ======================================
// ENGINE
// ======================================

export class MutationEngine {

  static mutate(
    genome: StrategyGenome
  ): StrategyGenome {

    const clone =
      structuredClone(genome);

    clone.id =
      crypto.randomUUID();

    clone.generation += 1;

    // ======================================
    // RANDOM MUTATIONS
    // ======================================

    for (
      const key
      of Object.keys(
        clone.weights
      )
    ) {

      const mutation =
        Number(
          (
            (Math.random() - 0.5) *
            0.6
          ).toFixed(2)
        );

      clone.weights[
        key as keyof typeof clone.weights
      ] += mutation;
    }

    clone.createdAt =
      new Date().toISOString();

    return clone;
  }
}