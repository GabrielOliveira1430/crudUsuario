// src/modules/prediction/prediction-confidence.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  TemporalWeightEngine
} from '../strategy-engine/temporal-weight.engine';

import {
  RecencyAnalysisEngine
} from '../analytics/recency-analysis.engine';

import prisma from '../../database/prisma';


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

    recency: number;

    trend: number;
  };
};


// ==========================================
// 🧠 PREDICTION CONFIDENCE ENGINE
// ==========================================

export class PredictionConfidenceEngine {


  // ==========================================
  // 📊 CACHE
  // ==========================================

  private static frequencyCache:
    Record<string, number> = {};

  private static lastCacheUpdate = 0;


  // ==========================================
  // 🚀 LOAD DATABASE ANALYTICS
  // ==========================================

  static async loadFrequencyCache() {

    const now = Date.now();

    // cache 30s
    if (
      now - this.lastCacheUpdate <
      30000
    ) {
      return;
    }

    console.log(
      '🧠 Atualizando Frequency Cache...'
    );

    const draws =
      await prisma.drawHistory.findMany({

        select: {
          number: true
        },

        take: 10000,

        orderBy: {
          createdAt: 'desc'
        }
      });

    const map:
      Record<string, number> = {};

    for (const draw of draws) {

      map[draw.number] =
        (map[draw.number] || 0) + 1;
    }

    this.frequencyCache = map;

    this.lastCacheUpdate = now;

    console.log(
      '✅ Frequency Cache atualizado:',
      Object.keys(map).length,
      'números'
    );
  }


  // ==========================================
  // 📊 FREQUENCY SCORE
  // ==========================================

  private static getFrequencyScore(
    number: string
  ) {

    const occurrences =
      this.frequencyCache[number] || 0;

    const maxFrequency = Math.max(
      ...Object.values(
        this.frequencyCache
      ),
      1
    );

    return (
      occurrences / maxFrequency
    ) * 100;
  }


  // ==========================================
  // 🚀 CALCULATE
  // ==========================================

  static async calculate(

    number: string,

    history: string[],

    strategy: string

  ): Promise<ConfidenceResult> {

    // ==========================================
    // 🧠 LOAD REAL CACHE
    // ==========================================

    await this.loadFrequencyCache();


    // ==========================================
    // 📊 REAL FREQUENCY
    // ==========================================

    const frequency =
      this.getFrequencyScore(
        number
      );


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
    // 🕒 REAL RECENCY
    // ==========================================

    const recency =

      await RecencyAnalysisEngine
        .getRecencyScore(
          number
        );


    // ==========================================
    // 📈 REAL TREND
    // ==========================================

    const trend =

      await RecencyAnalysisEngine
        .getTrendScore(
          number
        );


    // ==========================================
    // 📊 FINAL SCORE
    // ==========================================

    const confidence =

      (
        frequency * 0.30
      ) +

      (
        learning * 0.20
      ) +

      (
        temporal * 0.10
      ) +

      (
        diversity * 0.10
      ) +

      (
        recency * 0.15
      ) +

      (
        trend * 0.15
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
          ),

        recency:
          Number(
            recency.toFixed(2)
          ),

        trend:
          Number(
            trend.toFixed(2)
          )
      }
    };
  }
}