// src/modules/football-ai/core/strategy-genome.engine.ts

// ======================================
// TYPES
// ======================================

export type StrategyGenome = {

  id: string;

  name: string;

  weights: {

    offense: number;

    defense: number;

    momentum: number;

    pressure: number;

    chaos: number;

    smartMoney: number;

    emotional: number;
  };

  accuracy: number;

  profit: number;

  survivalScore: number;

  generation: number;

  createdAt: string;
};

// ======================================
// ENGINE
// ======================================

export class StrategyGenomeEngine {

  static createRandom(): StrategyGenome {

    return {

      id:
        crypto.randomUUID(),

      name:
        `GEN-${Date.now()}`,

      weights: {

        offense:
          random(0.5, 3),

        defense:
          random(0.5, 3),

        momentum:
          random(0.5, 3),

        pressure:
          random(0.5, 3),

        chaos:
          random(0.5, 3),

        smartMoney:
          random(0.5, 3),

        emotional:
          random(0.5, 3)
      },

      accuracy: 50,

      profit: 0,

      survivalScore: 50,

      generation: 1,

      createdAt:
        new Date().toISOString()
    };
  }
}

// ======================================
// HELPERS
// ======================================

function random(
  min: number,
  max: number
) {

  return Number(
    (
      Math.random() *
      (max - min) +
      min
    ).toFixed(2)
  );
}