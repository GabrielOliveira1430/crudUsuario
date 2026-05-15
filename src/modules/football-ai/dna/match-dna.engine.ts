// src/modules/football-ai/dna/match-dna.engine.ts

import {
  dnaMemory
} from './dna.memory';

import type {
  FootballMatch
} from '../../football/football.provider';

// ======================================
// TYPES
// ======================================

export type TeamDNA = {

  team: string;

  offensiveDNA: number;

  defensiveDNA: number;

  emotionalStability: number;

  pressureResponse: number;

  comebackPower: number;

  collapseRisk: number;

  chaosIndex: number;

  momentumStrength: number;

  dominance: number;

  updatedAt: string;
};

// ======================================
// ENGINE
// ======================================

export class MatchDNAEngine {

  // ======================================
  // SAFE
  // ======================================

  private static safe(
    value: unknown,
    fallback = 0
  ) {

    const parsed =
      Number(value);

    if (
      Number.isNaN(parsed) ||
      !Number.isFinite(parsed)
    ) {
      return fallback;
    }

    return parsed;
  }

  // ======================================
  // LIMIT
  // ======================================

  private static limit(
    value: number,
    min = 0,
    max = 100
  ) {

    return Math.min(
      max,
      Math.max(min, value)
    );
  }

  // ======================================
  // BUILD DNA
  // ======================================

  static build(
    match: FootballMatch
  ) {

    const homeGoals =
      this.safe(
        match.homeScore
      );

    const awayGoals =
      this.safe(
        match.awayScore
      );

    const minute =
      this.safe(
        match.minute,
        1
      );

    // ======================================
    // HOME DNA
    // ======================================

    const homeDNA: TeamDNA = {

      team:
        match.homeTeam,

      offensiveDNA:
        this.calculateOffensiveDNA(
          homeGoals,
          minute
        ),

      defensiveDNA:
        this.calculateDefensiveDNA(
          awayGoals
        ),

      emotionalStability:
        this.calculateEmotionalStability(
          homeGoals,
          awayGoals
        ),

      pressureResponse:
        this.calculatePressureResponse(
          minute,
          homeGoals,
          awayGoals
        ),

      comebackPower:
        this.calculateComebackPower(
          homeGoals,
          awayGoals,
          minute
        ),

      collapseRisk:
        this.calculateCollapseRisk(
          homeGoals,
          awayGoals,
          minute
        ),

      chaosIndex:
        this.calculateChaosIndex(
          homeGoals,
          awayGoals,
          minute
        ),

      momentumStrength:
        this.calculateMomentum(
          homeGoals,
          awayGoals,
          minute
        ),

      dominance:
        this.calculateDominance(
          homeGoals,
          awayGoals
        ),

      updatedAt:
        new Date().toISOString()
    };

    // ======================================
    // AWAY DNA
    // ======================================

    const awayDNA: TeamDNA = {

      team:
        match.awayTeam,

      offensiveDNA:
        this.calculateOffensiveDNA(
          awayGoals,
          minute
        ),

      defensiveDNA:
        this.calculateDefensiveDNA(
          homeGoals
        ),

      emotionalStability:
        this.calculateEmotionalStability(
          awayGoals,
          homeGoals
        ),

      pressureResponse:
        this.calculatePressureResponse(
          minute,
          awayGoals,
          homeGoals
        ),

      comebackPower:
        this.calculateComebackPower(
          awayGoals,
          homeGoals,
          minute
        ),

      collapseRisk:
        this.calculateCollapseRisk(
          awayGoals,
          homeGoals,
          minute
        ),

      chaosIndex:
        this.calculateChaosIndex(
          homeGoals,
          awayGoals,
          minute
        ),

      momentumStrength:
        this.calculateMomentum(
          awayGoals,
          homeGoals,
          minute
        ),

      dominance:
        this.calculateDominance(
          awayGoals,
          homeGoals
        ),

      updatedAt:
        new Date().toISOString()
    };

    // ======================================
    // MEMORY
    // ======================================

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

  // ======================================
  // OFFENSIVE DNA
  // ======================================

  private static calculateOffensiveDNA(
    goals: number,
    minute: number
  ) {

    let score = 42;

    score += goals * 18;

    if (
      minute >= 70
    ) {
      score += 8;
    }

    if (
      goals >= 3
    ) {
      score += 10;
    }

    return Number(
      this.limit(score)
        .toFixed(2)
    );
  }

  // ======================================
  // DEFENSIVE DNA
  // ======================================

  private static calculateDefensiveDNA(
    conceded: number
  ) {

    let score =
      100 -
      (conceded * 20);

    if (
      conceded >= 3
    ) {
      score -= 10;
    }

    return Number(
      this.limit(
        score,
        10,
        100
      ).toFixed(2)
    );
  }

  // ======================================
  // EMOTIONAL STABILITY
  // ======================================

  private static calculateEmotionalStability(
    goals: number,
    conceded: number
  ) {

    let score = 65;

    const diff =
      goals - conceded;

    if (
      diff > 0
    ) {
      score += diff * 10;
    }

    if (
      diff < 0
    ) {
      score += diff * 12;
    }

    return Number(
      this.limit(
        score,
        20,
        100
      ).toFixed(2)
    );
  }

  // ======================================
  // PRESSURE RESPONSE
  // ======================================

  private static calculatePressureResponse(
    minute: number,
    goals: number,
    conceded: number
  ) {

    let score = 50;

    if (
      minute >= 70
    ) {
      score += 12;
    }

    if (
      goals < conceded
    ) {
      score += 15;
    }

    if (
      goals > conceded
    ) {
      score += 5;
    }

    return Number(
      this.limit(score)
        .toFixed(2)
    );
  }

  // ======================================
  // COMEBACK POWER
  // ======================================

  private static calculateComebackPower(
    goals: number,
    conceded: number,
    minute: number
  ) {

    let score = 40;

    if (
      goals < conceded &&
      minute >= 55
    ) {

      score += 35;
    }

    if (
      goals === conceded &&
      minute >= 70
    ) {

      score += 15;
    }

    if (
      goals > conceded
    ) {

      score -= 5;
    }

    return Number(
      this.limit(score)
        .toFixed(2)
    );
  }

  // ======================================
  // COLLAPSE RISK
  // ======================================

  private static calculateCollapseRisk(
    goals: number,
    conceded: number,
    minute: number
  ) {

    let score = 15;

    if (
      conceded > goals
    ) {

      score += 25;
    }

    if (
      minute >= 75
    ) {

      score += 10;
    }

    if (
      conceded >= 3
    ) {

      score += 15;
    }

    return Number(
      this.limit(score)
        .toFixed(2)
    );
  }

  // ======================================
  // CHAOS INDEX
  // ======================================

  private static calculateChaosIndex(
    homeGoals: number,
    awayGoals: number,
    minute: number
  ) {

    const totalGoals =
      homeGoals + awayGoals;

    const diff =
      Math.abs(
        homeGoals - awayGoals
      );

    let score =
      totalGoals * 18;

    if (
      diff <= 1
    ) {
      score += 20;
    }

    if (
      minute >= 70
    ) {
      score += 10;
    }

    return Number(
      this.limit(score)
        .toFixed(2)
    );
  }

  // ======================================
  // MOMENTUM
  // ======================================

  private static calculateMomentum(
    goals: number,
    conceded: number,
    minute: number
  ) {

    let score =
      50 +
      (
        (goals - conceded) * 15
      );

    if (
      minute >= 70
    ) {
      score += 5;
    }

    return Number(
      this.limit(
        score,
        5,
        100
      ).toFixed(2)
    );
  }

  // ======================================
  // DOMINANCE
  // ======================================

  private static calculateDominance(
    goals: number,
    conceded: number
  ) {

    const score =
      50 +
      (
        (goals - conceded) * 20
      );

    return Number(
      this.limit(
        score,
        5,
        100
      ).toFixed(2)
    );
  }
}

export const matchDNAEngine =
  new MatchDNAEngine();