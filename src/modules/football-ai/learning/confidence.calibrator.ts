// src/modules/football-ai/learning/confidence.calibrator.ts

import {
  learningMemory
} from './learning.memory';

// ======================================
// ENGINE
// ======================================

export class ConfidenceCalibrator {

  static calibrate(
    confidence: number
  ) {

    const stats =
      learningMemory.stats();

    // ======================================
    // AJUSTE BASEADO NA ASSERTIVIDADE
    // ======================================

    const accuracy =
      stats.accuracy || 50;

    const factor =
      accuracy / 100;

    const calibrated =
      confidence * factor;

    return Math.max(
      45,

      Math.min(
        95,

        Number(
          calibrated.toFixed(2)
        )
      )
    );
  }
}