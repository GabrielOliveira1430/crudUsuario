// src/modules/feedback/feedback.engine.ts

import {
  FeedbackMemory
} from './feedback.memory';

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  TemporalWeightEngine
} from '../strategy-engine/temporal-weight.engine';


// ==========================================
// 🎯 FEEDBACK INPUT
// ==========================================

type FeedbackInput = {

  strategy: string;

  generatedNumbers: string[];

  winningNumbers: string[];

  source?: string;
};


// ==========================================
// 📊 FEEDBACK RESULT
// ==========================================

type FeedbackResult = {

  strategy: string;

  hits: number;

  accuracy: number;

  matched: string[];

  missed: string[];

  performance: string;

  timestamp: Date;
};


// ==========================================
// 🧠 REAL FEEDBACK ENGINE
// ==========================================

export class FeedbackEngine {


  // ==========================================
  // 📊 PERFORMANCE LABEL
  // ==========================================

  private static getPerformance(
    accuracy: number
  ) {

    if (accuracy >= 80) {
      return 'excellent';
    }

    if (accuracy >= 60) {
      return 'great';
    }

    if (accuracy >= 40) {
      return 'good';
    }

    if (accuracy >= 20) {
      return 'medium';
    }

    return 'low';
  }


  // ==========================================
  // 🚀 PROCESS FEEDBACK
  // ==========================================

  static async process(
    input: FeedbackInput
  ): Promise<FeedbackResult> {

    const {
      strategy,
      generatedNumbers,
      winningNumbers,
      source = 'manual'
    } = input;


    // ==========================================
    // 🎯 MATCHES
    // ==========================================

    const matched = generatedNumbers.filter(
      n => winningNumbers.includes(n)
    );

    const missed = generatedNumbers.filter(
      n => !winningNumbers.includes(n)
    );

    const hits =
      matched.length;

    const accuracy =

      generatedNumbers.length > 0

        ? (
            hits /
            generatedNumbers.length
          ) * 100

        : 0;


    // ==========================================
    // 📈 PERFORMANCE
    // ==========================================

    const performance =
      this.getPerformance(
        accuracy
      );


    // ==========================================
    // 💾 SAVE FEEDBACK
    // ==========================================

    await FeedbackMemory.add({

      strategy,

      hits,

      accuracy,

      performance,

      matched,

      missed,

      source,

      createdAt:
        new Date()
    });


    // ==========================================
    // 🧠 UPDATE GLOBAL LEARNING
    // ==========================================

    await LearningMemory.update(
      strategy,
      hits
    );


    // ==========================================
    // 🕒 UPDATE TEMPORAL LEARNING
    // ==========================================

    const currentHour =
      new Date().getHours();

    await TemporalWeightEngine.update(

      strategy,

      hits,

      currentHour
    );


    // ==========================================
    // 📊 LOG
    // ==========================================

    console.log(

      `🧠 Feedback processado | ${strategy} | Hits: ${hits} | Accuracy: ${accuracy.toFixed(2)}%`
    );


    // ==========================================
    // 🚀 RESULT
    // ==========================================

    return {

      strategy,

      hits,

      accuracy:
        Number(
          accuracy.toFixed(2)
        ),

      matched,

      missed,

      performance,

      timestamp:
        new Date()
    };
  }


  // ==========================================
  // 📊 SYSTEM PERFORMANCE
  // ==========================================

  static async getSystemPerformance() {

    const feedbacks =
      await FeedbackMemory.getAll();

    if (!feedbacks.length) {

      return {

        totalRuns: 0,

        avgAccuracy: 0,

        totalHits: 0,

        bestStrategy: null
      };
    }


    // ==========================================
    // 📊 TOTALS
    // ==========================================

    const totalRuns =
      feedbacks.length;

    const totalHits =

      feedbacks.reduce(

        (acc, item) =>

          acc + item.hits,

        0
      );

    const avgAccuracy =

      feedbacks.reduce(

        (acc, item) =>

          acc + item.accuracy,

        0

      ) / totalRuns;


    // ==========================================
    // 🏆 BEST STRATEGY
    // ==========================================

    const strategyMap:
      Record<string, number[]> = {};

    for (const item of feedbacks) {

      if (!strategyMap[item.strategy]) {

        strategyMap[item.strategy] = [];
      }

      strategyMap[item.strategy]
        .push(item.accuracy);
    }

    let bestStrategy = '';

    let bestAvg = 0;

    for (const strategy in strategyMap) {

      const values =
        strategyMap[strategy];

      const avg =

        values.reduce(
          (a, b) => a + b,
          0
        ) / values.length;

      if (avg > bestAvg) {

        bestAvg = avg;

        bestStrategy = strategy;
      }
    }


    // ==========================================
    // 🚀 RESULT
    // ==========================================

    return {

      totalRuns,

      totalHits,

      avgAccuracy:
        Number(
          avgAccuracy.toFixed(2)
        ),

      bestStrategy
    };
  }
}