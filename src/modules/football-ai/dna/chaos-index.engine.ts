// src/modules/football-ai/dna/chaos-index.engine.ts

import type {
  TeamDNA
} from './dna.memory';

// ======================================
// TYPES
// ======================================

export type ChaosAnalysis = {

  chaos: number;

  chaosIndex: number;

  volatility: number;

  offensiveChaos: number;

  emotionalChaos: number;

  momentumChaos: number;

  defensiveFragility: number;

  pressureInstability: number;

  dominanceConflict: number;

  highChaos: boolean;

  insaneMatch: boolean;

  stableMatch: boolean;

  recommendation:
    | 'OVER'
    | 'LIVE_GOAL'
    | 'AVOID'
    | 'BALANCED';
};

// ======================================
// ENGINE
// ======================================

export class ChaosIndexEngine {

  // ======================================
  // SAFE
  // ======================================

  private static safe(
    value: number,
    fallback = 0
  ) {

    if (
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {
      return fallback;
    }

    return value;
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
  // ANALYZE
  // ======================================

  static analyze(
    home: TeamDNA,
    away: TeamDNA
  ): ChaosAnalysis {

    // ======================================
    // OFFENSIVE CHAOS
    // ======================================

    const offensiveChaos =
      Number(
        (
          (
            this.safe(home.offensiveDNA) +
            this.safe(away.offensiveDNA)
          ) / 2
        ).toFixed(2)
      );

    // ======================================
    // EMOTIONAL CHAOS
    // ======================================

    const emotionalChaos =
      Number(
        (
          (
            (
              100 -
              this.safe(
                home.emotionalStability,
                50
              )
            ) +

            (
              100 -
              this.safe(
                away.emotionalStability,
                50
              )
            )
          ) / 2
        ).toFixed(2)
      );

    // ======================================
    // MOMENTUM CHAOS
    // ======================================

    const momentumChaos =
      Number(
        (
          Math.abs(
            this.safe(
              home.momentumStrength
            ) -
            this.safe(
              away.momentumStrength
            )
          )
        ).toFixed(2)
      );

    // ======================================
    // DEFENSIVE FRAGILITY
    // ======================================

    const defensiveFragility =
      Number(
        (
          (
            (
              100 -
              this.safe(
                home.defensiveDNA,
                50
              )
            ) +

            (
              100 -
              this.safe(
                away.defensiveDNA,
                50
              )
            )
          ) / 2
        ).toFixed(2)
      );

    // ======================================
    // PRESSURE INSTABILITY
    // ======================================

    const pressureInstability =
      Number(
        (
          (
            (
              100 -
              this.safe(
                home.pressureResponse,
                50
              )
            ) +

            (
              100 -
              this.safe(
                away.pressureResponse,
                50
              )
            )
          ) / 2
        ).toFixed(2)
      );

    // ======================================
    // DOMINANCE CONFLICT
    // ======================================

    const dominanceConflict =
      Number(
        (
          100 -
          Math.abs(
            this.safe(
              home.dominance,
              50
            ) -
            this.safe(
              away.dominance,
              50
            )
          )
        ).toFixed(2)
      );

    // ======================================
    // BASE CHAOS
    // ======================================

    const baseChaos =
      (
        this.safe(
          home.chaosIndex
        ) +

        this.safe(
          away.chaosIndex
        )
      ) / 2;

    // ======================================
    // VOLATILITY
    // ======================================

    const volatility =
      Number(
        (
          (
            momentumChaos * 0.25 +

            emotionalChaos * 0.2 +

            offensiveChaos * 0.2 +

            defensiveFragility * 0.2 +

            pressureInstability * 0.15
          )
        ).toFixed(2)
      );

    // ======================================
    // FINAL CHAOS
    // ======================================

    const chaos =
      Number(
        (
          this.limit(
            (
              baseChaos * 0.45 +

              volatility * 0.35 +

              dominanceConflict * 0.20
            )
          )
        ).toFixed(2)
      );

    // ======================================
    // STATES
    // ======================================

    const highChaos =
      chaos >= 70;

    const insaneMatch =
      chaos >= 85;

    const stableMatch =
      chaos <= 35;

    // ======================================
    // RECOMMENDATION
    // ======================================

    let recommendation:
      | 'OVER'
      | 'LIVE_GOAL'
      | 'AVOID'
      | 'BALANCED';

    if (
      insaneMatch
    ) {

      recommendation =
        'LIVE_GOAL';

    } else if (
      highChaos
    ) {

      recommendation =
        'OVER';

    } else if (
      stableMatch
    ) {

      recommendation =
        'AVOID';

    } else {

      recommendation =
        'BALANCED';
    }

    // ======================================
    // RESULT
    // ======================================

    return {

      chaos,

      chaosIndex: chaos,

      volatility,

      offensiveChaos,

      emotionalChaos,

      momentumChaos,

      defensiveFragility,

      pressureInstability,

      dominanceConflict,

      highChaos,

      insaneMatch,

      stableMatch,

      recommendation
    };
  }
}

export const chaosIndexEngine =
  new ChaosIndexEngine();