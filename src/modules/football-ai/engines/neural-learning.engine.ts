// src/modules/football-ai/engines/neural-learning.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

// ======================================
// TYPES
// ======================================

export type LearningRecord = {

  match: string;

  prediction: string;

  actualResult: string;

  confidence: number;

  correct: boolean;

  edge: number;

  timestamp: number;
};

export type NeuralWeights = {

  formWeight: number;

  pressureWeight: number;

  momentumWeight: number;

  smartMoneyWeight: number;

  baseConfidence: number;
};

// ======================================
// ENGINE
// ======================================

export class NeuralLearningEngine {

  // ======================================
  // MEMORY
  // ======================================

  private static history: LearningRecord[] = [];

  private static weights: NeuralWeights = {

    formWeight: 1.0,

    pressureWeight: 1.0,

    momentumWeight: 1.0,

    smartMoneyWeight: 1.0,

    baseConfidence: 60,
  };

  // ======================================
  // SAVE PREDICTION RESULT
  // ======================================

  static learn(
    prediction: FootballPrediction,
    actualResult: string
  ) {

    const correct =
      prediction.prediction === actualResult;

    const record: LearningRecord = {

      match:
        `${prediction.homeTeam} vs ${prediction.awayTeam}`,

      prediction:
        prediction.prediction,

      actualResult,

      confidence:
        prediction.confidence,

      correct,

      edge:
        prediction.edge,

      timestamp:
        Date.now(),
    };

    this.history.push(record);

    // ======================================
    // ADAPT WEIGHTS
    // ======================================

    this.adjustWeights();

    console.log(
      `🧠 Neural learning updated | correct: ${correct}`
    );
  }

  // ======================================
  // ADAPTIVE LEARNING
  // ======================================

  private static adjustWeights() {

    const last = this.history.slice(-50);

    const accuracy =
      last.filter(r => r.correct).length /
      Math.max(1, last.length);

    // ======================================
    // IMPROVE OR CORRECT
    // ======================================

    if (accuracy > 0.65) {

      // IA está boa → reforça confiança

      this.weights.baseConfidence += 0.5;

      this.weights.formWeight += 0.05;

      this.weights.pressureWeight += 0.05;

    } else {

      // IA errando → reduzir agressividade

      this.weights.baseConfidence -= 0.5;

      this.weights.formWeight -= 0.05;

      this.weights.pressureWeight -= 0.05;
    }

    // ======================================
    // LIMITS
    // ======================================

    this.weights.baseConfidence =
      this.clamp(
        this.weights.baseConfidence,
        50,
        80
      );

    this.weights.formWeight =
      this.clamp(
        this.weights.formWeight,
        0.5,
        2
      );

    this.weights.pressureWeight =
      this.clamp(
        this.weights.pressureWeight,
        0.5,
        2
      );
  }

  // ======================================
  // APPLY LEARNING BOOST
  // ======================================

  static adjustConfidence(
    base: number,
    pressureImpact: number,
    momentumImpact: number
  ) {

    const adjusted =
      base *
      this.weights.baseConfidence / 60 +
      pressureImpact * this.weights.pressureWeight +
      momentumImpact * this.weights.momentumWeight;

    return Math.min(95, Math.max(40, adjusted));
  }

  // ======================================
  // GET WEIGHTS
  // ======================================

  static getWeights() {

    return this.weights;
  }

  // ======================================
  // HISTORY
  // ======================================

  static getHistory() {

    return this.history;
  }

  // ======================================
  // RESET
  // ======================================

  static reset() {

    this.history = [];

    this.weights = {

      formWeight: 1,

      pressureWeight: 1,

      momentumWeight: 1,

      smartMoneyWeight: 1,

      baseConfidence: 60,
    };
  }

  // ======================================
  // UTIL
  // ======================================

  private static clamp(
    value: number,
    min: number,
    max: number
  ) {

    return Math.max(
      min,
      Math.min(max, value)
    );
  }
}

export const neuralLearningEngine =
  new NeuralLearningEngine();