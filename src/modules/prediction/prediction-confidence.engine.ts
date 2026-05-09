// src/modules/prediction/prediction-confidence.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  TemporalWeightEngine
} from '../strategy-engine/temporal-weight.engine';


// ==========================================
// 📊 RESULT
// ==========================================

export type ConfidenceResult = {

  number: string;

  confidence: number;

  factors: {

    frequency: number;

    temporal: number;

    learning: number;

    diversity: number;
  };
};


// ==========================================
// 🧠 PREDICTION CONFIDENCE ENGINE
// ==========================================

export class PredictionConfidenceEngine {


  // ==========================================
  // 🚀 CALCULATE
  // ==========================================

  static calculate(

    number: string,

    history: string[],

    strategy: string
  ): ConfidenceResult {


    // ==========================================
    // 📊 FREQUENCY
    // ==========================================

    const occurrences =

      history.filter(
        n => n === number
      ).length;

    const frequency =

      history.length > 0

        ? (
            occurrences /
            history.length
          ) * 100

        : 0;


    // ==========================================
    // 🧠 LEARNING
    // ==========================================

    const memory =

      LearningMemory
        .getAll()
        .find(
          m =>
            m.name === strategy
        );

    const learning =
      (
        memory?.weight || 1
      ) * 10;


    // ==========================================
    // 🕒 TEMPORAL
    // ==========================================

    const currentHour =
      new Date().getHours();

    const temporal =
      TemporalWeightEngine.getWeight(

        strategy,

        currentHour
      ) * 10;


    // ==========================================
    // 🎲 DIVERSITY
    // ==========================================

    const uniqueDigits =
      new Set(
        number.split('')
      ).size;

    const diversity =
      (
        uniqueDigits / 4
      ) * 100;


    // ==========================================
    // 📊 FINAL SCORE
    // ==========================================

    const confidence =

      (
        frequency * 0.35
      ) +

      (
        learning * 0.30
      ) +

      (
        temporal * 0.20
      ) +

      (
        diversity * 0.15
      );


    return {

      number,

      confidence:
        Number(
          confidence.toFixed(2)
        ),

      factors: {

        frequency:
          Number(
            frequency.toFixed(2)
          ),

        temporal:
          Number(
            temporal.toFixed(2)
          ),

        learning:
          Number(
            learning.toFixed(2)
          ),

        diversity:
          Number(
            diversity.toFixed(2)
          )
      }
    };
  }
}