// src/modules/football-ai/dna/chaos-index.engine.ts

import type {
  TeamDNA
} from './dna.memory';

// ======================================
// ENGINE
// ======================================

export class ChaosIndexEngine {

  static analyze(
    home: TeamDNA,
    away: TeamDNA
  ) {

    const total =

      (
        home.chaosIndex +
        away.chaosIndex
      ) / 2;

    return {

      chaos:
        Number(
          total.toFixed(2)
        ),

      highChaos:
        total >= 70,

      insaneMatch:
        total >= 85
    };
  }
}