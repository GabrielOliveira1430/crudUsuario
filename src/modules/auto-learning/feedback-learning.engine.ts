// src/modules/auto-learning/feedback-learning.engine.ts

import {
  LearningMemory
} from './learning.memory';


// ==========================================
// 📊 PREDICTION
// ==========================================

type PredictionEntry = {

  number: string;

  strategy: string;

  confidence: number;

  createdAt: Date;
};


// ==========================================
// 🧠 FEEDBACK LEARNING ENGINE
// ==========================================

export class FeedbackLearningEngine {

  private static predictions:
    PredictionEntry[] = [];


  // ==========================================
  // 💾 STORE PREDICTIONS
  // ==========================================

  static storePredictions(
    predictions: PredictionEntry[]
  ) {

    this.predictions.push(
      ...predictions
    );

    // mantém últimas 5000
    if (
      this.predictions.length > 5000
    ) {

      this.predictions =
        this.predictions.slice(-5000);
    }

    console.log(

      '🧠 Predictions armazenadas:',

      this.predictions.length
    );
  }


  // ==========================================
  // 🎯 PROCESS REAL DRAW
  // ==========================================

  static async processDraw(
    realNumber: string
  ) {

    console.log(
      '🎯 Processando feedback:',
      realNumber
    );

    const recentPredictions =

      this.predictions.slice(-200);


    let totalHits = 0;


    for (
      const prediction
      of recentPredictions
    ) {

      let hits = 0;


      // ======================================
      // 🎯 EXACT MATCH
      // ======================================

      if (
        prediction.number ===
        realNumber
      ) {

        hits = 5;
      }


      // ======================================
      // 🔢 PARTIAL MATCH
      // ======================================

      else {

        const predictionDigits =
          prediction.number.split('');

        const realDigits =
          realNumber.split('');

        hits =
          predictionDigits.filter(
            d =>
              realDigits.includes(d)
          ).length;
      }


      // ======================================
      // 🧠 UPDATE LEARNING
      // ======================================

      await LearningMemory.update(

        prediction.strategy,

        hits
      );


      totalHits += hits;
    }


    console.log(

      `🚀 Feedback finalizado | Hits=${totalHits}`
    );

    return {

      success: true,

      analyzed:
        recentPredictions.length,

      totalHits
    };
  }
}