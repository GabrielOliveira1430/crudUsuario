// src/modules/feedback/feedback.service.ts

import prisma from '../../database/prisma';

import {
  FeedbackEngine
} from './feedback.engine';

import {
  FeedbackMemory
} from './feedback.memory';

import {
  LearningMemory
} from '../auto-learning/learning.memory';


// ==========================================
// 🎯 INPUT
// ==========================================

type FeedbackInput = {

  generatedNumbers: string[];

  realNumbers: string[];

  strategy: string;
};


// ==========================================
// 📊 RESULT
// ==========================================

type FeedbackResult = {

  hits: number;

  accuracy: number;

  matched: string[];

  missed: string[];

  performance: string;
};


// ==========================================
// 🧠 FEEDBACK SERVICE
// ==========================================

export class FeedbackService {


  // ==========================================
  // 🎯 MATCHES
  // ==========================================

  private static calculateHits(

    generated: string[],

    real: string[]

  ) {

    return generated.filter(

      n => real.includes(n)
    );
  }


  // ==========================================
  // 📊 PERFORMANCE
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
  // 🚀 PROCESS
  // ==========================================

  static async process(
    input: FeedbackInput
  ): Promise<FeedbackResult> {

    const {

      generatedNumbers,

      realNumbers,

      strategy

    } = input;


    // ==========================================
    // 🎯 MATCHES
    // ==========================================

    const matched =

      this.calculateHits(

        generatedNumbers,

        realNumbers
      );

    const missed =

      generatedNumbers.filter(

        n => !realNumbers.includes(n)
      );

    const hits =
      matched.length;


    // ==========================================
    // 📊 ACCURACY
    // ==========================================

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
    // 💾 MEMORY
    // ==========================================

    await FeedbackMemory.add({

      strategy,

      hits,

      accuracy,

      performance,

      matched,

      missed,

      source: 'manual',

      createdAt:
        new Date()
    });


    // ==========================================
    // 🧠 ENGINE
    // ==========================================

    await FeedbackEngine.process({

      strategy,

      generatedNumbers,

      winningNumbers:
        realNumbers
    });


    // ==========================================
    // 🤖 LEARNING
    // ==========================================

    await LearningMemory.update(

      strategy,

      hits
    );


    // ==========================================
    // 💾 DATABASE LOG
    // ==========================================

    try {

      const feedbackLog =
        (prisma as any).feedbackLog;

      if (feedbackLog) {

        await feedbackLog.create({

          data: {

            strategy,

            hits,

            accuracy,

            generated:
              generatedNumbers,

            real:
              realNumbers,

            performance
          }
        });
      }

    } catch (error) {

      console.log(
        '🟡 feedbackLog ainda não existe'
      );
    }


    // ==========================================
    // 🚀 RESULT
    // ==========================================

    return {

      hits,

      accuracy:
        Number(
          accuracy.toFixed(2)
        ),

      matched,

      missed,

      performance
    };
  }


  // ==========================================
  // 📊 STATS
  // ==========================================

  static async getStats() {

    const all =
      await FeedbackMemory.getAll();

    if (!all.length) {

      return {

        total: 0,

        averageAccuracy: 0,

        bestStrategy: null
      };
    }


    // ==========================================
    // 📊 AVERAGE
    // ==========================================

    const averageAccuracy =

      all.reduce(

        (acc, item) =>

          acc + item.accuracy,

        0

      ) / all.length;


    // ==========================================
    // 🏆 BEST STRATEGY
    // ==========================================

    const grouped:
      Record<string, number[]> = {};

    for (const item of all) {

      if (!grouped[item.strategy]) {

        grouped[item.strategy] = [];
      }

      grouped[item.strategy]
        .push(item.accuracy);
    }

    let bestStrategy = '';

    let bestAverage = 0;

    for (const strategy in grouped) {

      const avg =

        grouped[strategy]
          .reduce(
            (a, b) => a + b,
            0
          ) /

        grouped[strategy].length;

      if (avg > bestAverage) {

        bestAverage = avg;

        bestStrategy = strategy;
      }
    }


    // ==========================================
    // 🚀 OUTPUT
    // ==========================================

    return {

      total:
        all.length,

      averageAccuracy:
        Number(
          averageAccuracy.toFixed(2)
        ),

      bestStrategy,

      bestAverage:
        Number(
          bestAverage.toFixed(2)
        )
    };
  }
}