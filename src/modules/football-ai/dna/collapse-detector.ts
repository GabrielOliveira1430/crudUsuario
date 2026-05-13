// src/modules/football-ai/dna/collapse-detector.ts

import type {
  TeamDNA
} from './dna.memory';

// ======================================
// ENGINE
// ======================================

export class CollapseDetector {

  static analyze(
    dna: TeamDNA
  ) {

    let risk = 0;

    // ======================================
    // EMOTIONAL
    // ======================================

    if (
      dna.emotionalStability < 50
    ) {
      risk += 25;
    }

    // ======================================
    // PRESSURE
    // ======================================

    if (
      dna.pressureResponse < 50
    ) {
      risk += 20;
    }

    // ======================================
    // CHAOS
    // ======================================

    if (
      dna.chaosIndex > 70
    ) {
      risk += 30;
    }

    // ======================================
    // COLLAPSE
    // ======================================

    if (
      dna.collapseRisk > 60
    ) {
      risk += 35;
    }

    return {

      collapseProbability:
        Math.min(100, risk),

      dangerous:
        risk >= 60
    };
  }
}