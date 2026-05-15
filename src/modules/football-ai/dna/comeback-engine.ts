// src/modules/football-ai/dna/comeback-engine.ts

import type {
  TeamDNA
} from './dna.memory';

// ======================================
// TYPES
// ======================================

export type ComebackAnalysis = {

  comebackScore: number;

  eliteComeback: boolean;

  resilienceLevel:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'ELITE';

  mentalStrength: number;

  attackingPotential: number;

  momentumCapacity: number;

  reasons: string[];
};

// ======================================
// ENGINE
// ======================================

export class ComebackEngine {

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
  ): ComebackAnalysis {

    const reasons: string[] = [];

    const comebackPower =
      this.safe(
        dna.comebackPower
      );

    const momentum =
      this.safe(
        dna.momentumStrength
      );

    const offense =
      this.safe(
        dna.offensiveDNA
      );

    const emotional =
      this.safe(
        dna.emotionalStability
      );

    const pressure =
      this.safe(
        dna.pressureResponse
      );

    const collapse =
      this.safe(
        dna.collapseRisk
      );

    // ======================================
    // BASE SCORE
    // ======================================

    let score =

      (
        comebackPower * 0.32
      ) +

      (
        momentum * 0.24
      ) +

      (
        offense * 0.22
      ) +

      (
        emotional * 0.12
      ) +

      (
        pressure * 0.10
      );

    // ======================================
    // ELITE ATTACK
    // ======================================

    if (
      offense >= 82
    ) {

      score += 4;

      reasons.push(
        'Ataque altamente agressivo'
      );
    }

    // ======================================
    // STRONG MOMENTUM
    // ======================================

    if (
      momentum >= 78
    ) {

      score += 4;

      reasons.push(
        'Grande força de reação'
      );
    }

    // ======================================
    // MENTAL STRENGTH
    // ======================================

    if (
      emotional >= 75
    ) {

      score += 3;

      reasons.push(
        'Equipe emocionalmente estável'
      );
    }

    // ======================================
    // PRESSURE RESPONSE
    // ======================================

    if (
      pressure >= 75
    ) {

      score += 3;

      reasons.push(
        'Boa resposta sob pressão'
      );
    }

    // ======================================
    // HIGH COLLAPSE PENALTY
    // ======================================

    if (
      collapse >= 70
    ) {

      score -= 12;

      reasons.push(
        'Risco elevado de colapso'
      );
    }

    // ======================================
    // VERY LOW OFFENSE
    // ======================================

    if (
      offense <= 40
    ) {

      score -= 8;

      reasons.push(
        'Baixo potencial ofensivo'
      );
    }

    // ======================================
    // VERY LOW MOMENTUM
    // ======================================

    if (
      momentum <= 35
    ) {

      score -= 6;

      reasons.push(
        'Momentum insuficiente'
      );
    }

    // ======================================
    // NORMALIZE
    // ======================================

    score =
      this.normalize(score);

    // ======================================
    // RESILIENCE
    // ======================================

    let resilienceLevel:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'ELITE';

    if (
      score >= 84
    ) {

      resilienceLevel =
        'ELITE';

    }

    else if (
      score >= 68
    ) {

      resilienceLevel =
        'HIGH';

    }

    else if (
      score >= 48
    ) {

      resilienceLevel =
        'MEDIUM';

    }

    else {

      resilienceLevel =
        'LOW';
    }

    // ======================================
    // RESULT
    // ======================================

    return {

      comebackScore:
        score,

      eliteComeback:
        score >= 82,

      resilienceLevel,

      mentalStrength:
        this.normalize(
          emotional
        ),

      attackingPotential:
        this.normalize(
          offense
        ),

      momentumCapacity:
        this.normalize(
          momentum
        ),

      reasons
    };
  }
}