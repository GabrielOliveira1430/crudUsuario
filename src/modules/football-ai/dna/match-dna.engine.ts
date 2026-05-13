// src/modules/football-ai/dna/match-dna.engine.ts

import {
  dnaMemory
} from './dna.memory';

import type {
  FootballMatch
} from '../../football/providers/football.types';

// ======================================
// ENGINE
// ======================================

export class MatchDNAEngine {

  // ======================================
  // BUILD DNA
  // ======================================

  static build(
    match: FootballMatch
  ) {

    // ======================================
    // RANDOMIZED AI
    // ======================================

    const homeDNA = {

      team:
        match.homeTeam,

      offensiveDNA:
        random(50, 100),

      defensiveDNA:
        random(50, 100),

      emotionalStability:
        random(40, 100),

      pressureResponse:
        random(40, 100),

      comebackPower:
        random(30, 100),

      collapseRisk:
        random(0, 70),

      chaosIndex:
        random(10, 100),

      momentumStrength:
        random(40, 100),

      dominance:
        random(40, 100),

      updatedAt:
        new Date().toISOString()
    };

    const awayDNA = {

      team:
        match.awayTeam,

      offensiveDNA:
        random(50, 100),

      defensiveDNA:
        random(50, 100),

      emotionalStability:
        random(40, 100),

      pressureResponse:
        random(40, 100),

      comebackPower:
        random(30, 100),

      collapseRisk:
        random(0, 70),

      chaosIndex:
        random(10, 100),

      momentumStrength:
        random(40, 100),

      dominance:
        random(40, 100),

      updatedAt:
        new Date().toISOString()
    };

    dnaMemory.set(
      match.homeTeam,
      homeDNA
    );

    dnaMemory.set(
      match.awayTeam,
      awayDNA
    );

    return {

      homeDNA,

      awayDNA
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

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;
}