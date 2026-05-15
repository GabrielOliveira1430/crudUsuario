// src/modules/football-ai/dna/collapse-detector.ts

import type {
  TeamDNA
} from './dna.memory';

// ======================================
// TYPES
// ======================================

export type CollapseAnalysis = {

  collapseProbability: number;

  dangerous: boolean;

  level:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'CRITICAL';

  stabilityScore: number;

  triggers: string[];
};

// ======================================
// ENGINE
// ======================================

export class CollapseDetector {

  // ======================================
  // NORMALIZE
  // ======================================

  private static normalize(
    value: number,
    min = 0,
    max = 100
  ) {

    return Number(
      (
        Math.max(
          min,
          Math.min(max, value)
        )
      ).toFixed(2)
    );
  }

  // ======================================
  // SAFE
  // ======================================

  private static safe(
    value: number,
    fallback = 50
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
  // ANALYZE
  // ======================================

  static analyze(
    dna: TeamDNA
  ): CollapseAnalysis {

    const triggers: string[] = [];

    const emotional =
      this.safe(
        dna.emotionalStability
      );

    const pressure =
      this.safe(
        dna.pressureResponse
      );

    const chaos =
      this.safe(
        dna.chaosIndex
      );

    const collapse =
      this.safe(
        dna.collapseRisk
      );

    const defense =
      this.safe(
        dna.defensiveDNA
      );

    const momentum =
      this.safe(
        dna.momentumStrength
      );

    // ======================================
    // BASE RISK
    // ======================================

    let risk =

      (
        (100 - emotional) * 0.22
      ) +

      (
        (100 - pressure) * 0.18
      ) +

      (
        chaos * 0.20
      ) +

      (
        collapse * 0.28
      ) +

      (
        (100 - defense) * 0.12
      );

    // ======================================
    // LOW MOMENTUM
    // ======================================

    if (
      momentum <= 35
    ) {

      risk += 6;

      triggers.push(
        'Baixo momentum competitivo'
      );
    }

    // ======================================
    // HIGH CHAOS
    // ======================================

    if (
      chaos >= 75
    ) {

      risk += 5;

      triggers.push(
        'Partida altamente instável'
      );
    }

    // ======================================
    // LOW EMOTIONAL
    // ======================================

    if (
      emotional <= 45
    ) {

      risk += 8;

      triggers.push(
        'Equipe emocionalmente vulnerável'
      );
    }

    // ======================================
    // DEFENSIVE INSTABILITY
    // ======================================

    if (
      defense <= 45
    ) {

      risk += 6;

      triggers.push(
        'Defesa vulnerável'
      );
    }

    // ======================================
    // HIGH COLLAPSE HISTORY
    // ======================================

    if (
      collapse >= 70
    ) {

      risk += 8;

      triggers.push(
        'Histórico elevado de colapso'
      );
    }

    // ======================================
    // STRONG TEAMS PROTECTION
    // ======================================

    if (
      emotional >= 80 &&
      pressure >= 80 &&
      defense >= 75
    ) {

      risk -= 12;

      triggers.push(
        'Equipe altamente resiliente'
      );
    }

    // ======================================
    // NORMALIZE
    // ======================================

    const collapseProbability =
      this.normalize(risk);

    const stabilityScore =
      this.normalize(
        100 - collapseProbability
      );

    // ======================================
    // LEVEL
    // ======================================

    let level:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'CRITICAL';

    if (
      collapseProbability >= 80
    ) {

      level = 'CRITICAL';

    }

    else if (
      collapseProbability >= 62
    ) {

      level = 'HIGH';

    }

    else if (
      collapseProbability >= 42
    ) {

      level = 'MEDIUM';

    }

    else {

      level = 'LOW';
    }

    // ======================================
    // RESULT
    // ======================================

    return {

      collapseProbability,

      dangerous:
        collapseProbability >= 60,

      level,

      stabilityScore,

      triggers
    };
  }
}