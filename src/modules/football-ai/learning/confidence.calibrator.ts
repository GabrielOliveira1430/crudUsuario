// src/modules/football-ai/learning/confidence.calibrator.ts

import {
  learningMemory
} from './learning.memory';

// ======================================
// TYPES
// ======================================

export type ConfidenceCalibration = {

  original: number;

  calibrated: number;

  accuracyFactor: number;

  boost: number;

  penalty: number;

  safeMode: boolean;
};

// ======================================
// ENGINE
// ======================================

export class ConfidenceCalibrator {

  // ======================================
  // SAFE
  // ======================================

  private static safe(
    value: number,
    min = 0,
    max = 100
  ) {

    return Number(
      Math.max(
        min,
        Math.min(max, value)
      ).toFixed(2)
    );
  }

  // ======================================
  // CALIBRATE
  // ======================================

  static calibrate(
    confidence: number
  ) {

    const stats =
      learningMemory.stats();

    // ======================================
    // BASE ACCURACY
    // ======================================

    const accuracy =
      stats?.accuracy || 50;

    // ======================================
    // BASE FACTOR
    // ======================================

    let factor = 1;

    let boost = 0;

    let penalty = 0;

    // ======================================
    // ELITE AI
    // ======================================

    if (accuracy >= 90) {

      factor += 0.18;

      boost += 10;
    }

    // ======================================
    // VERY STRONG AI
    // ======================================

    else if (accuracy >= 80) {

      factor += 0.12;

      boost += 7;
    }

    // ======================================
    // STRONG AI
    // ======================================

    else if (accuracy >= 70) {

      factor += 0.08;

      boost += 5;
    }

    // ======================================
    // NORMAL AI
    // ======================================

    else if (accuracy >= 60) {

      factor += 0.03;

      boost += 2;
    }

    // ======================================
    // WEAK AI
    // ======================================

    else if (accuracy <= 45) {

      factor -= 0.08;

      penalty += 5;
    }

    // ======================================
    // VERY WEAK AI
    // ======================================

    else if (accuracy <= 35) {

      factor -= 0.14;

      penalty += 10;
    }

    // ======================================
    // SAFE FACTOR
    // ======================================

    factor =
      Math.max(
        0.82,
        Math.min(
          1.35,
          factor
        )
      );

    // ======================================
    // CALIBRATION
    // ======================================

    let calibrated =

      (
        confidence * factor
      ) +

      boost -

      penalty;

    // ======================================
    // HIGH CONFIDENCE BONUS
    // ======================================

    if (
      confidence >= 75 &&
      accuracy >= 70
    ) {

      calibrated += 4;
    }

    // ======================================
    // ELITE BONUS
    // ======================================

    if (
      confidence >= 85 &&
      accuracy >= 80
    ) {

      calibrated += 5;
    }

    // ======================================
    // ANTI OVERCONFIDENCE
    // ======================================

    if (
      confidence >= 92 &&
      accuracy < 60
    ) {

      calibrated -= 10;
    }

    // ======================================
    // LOW CONFIDENCE PROTECTION
    // ======================================

    if (
      confidence <= 45
    ) {

      calibrated -= 5;
    }

    // ======================================
    // FINAL SAFE
    // ======================================

    calibrated =
      this.safe(
        calibrated,
        35,
        98
      );

    return calibrated;
  }

  // ======================================
  // FULL ANALYSIS
  // ======================================

  static analyze(
    confidence: number
  ): ConfidenceCalibration {

    const stats =
      learningMemory.stats();

    const accuracy =
      stats?.accuracy || 50;

    const calibrated =
      this.calibrate(
        confidence
      );

    const factor =
      Number(
        (
          accuracy / 100
        ).toFixed(2)
      );

    let boost = 0;

    let penalty = 0;

    // ======================================
    // BOOSTS
    // ======================================

    if (accuracy >= 90) {

      boost = 10;

    } else if (accuracy >= 80) {

      boost = 7;

    } else if (accuracy >= 70) {

      boost = 5;

    } else if (accuracy >= 60) {

      boost = 2;
    }

    // ======================================
    // PENALTIES
    // ======================================

    if (accuracy <= 35) {

      penalty = 10;

    } else if (accuracy <= 45) {

      penalty = 5;
    }

    return {

      original:
        Number(
          confidence.toFixed(2)
        ),

      calibrated,

      accuracyFactor:
        factor,

      boost,

      penalty,

      safeMode:
        accuracy < 55
    };
  }
}