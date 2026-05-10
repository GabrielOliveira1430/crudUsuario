// src/modules/feedback/feedback.memory.ts

import prisma from '../../database/prisma';


// ==========================================
// 📊 FEEDBACK TYPE
// ==========================================

export type FeedbackRecord = {

  strategy: string;

  hits: number;

  accuracy: number;

  performance: string;

  matched: string[];

  missed: string[];

  source: string;

  createdAt: Date;
};


// ==========================================
// 🧠 FEEDBACK MEMORY
// ==========================================

export class FeedbackMemory {

  private static memory:
    FeedbackRecord[] = [];


  // ==========================================
  // 🚀 INITIALIZE
  // ==========================================

  static async initialize() {

    try {

      // Prisma ainda pode não ter schema
      const feedbackModel =
        (prisma as any).feedbackHistory;

      if (!feedbackModel) {

        console.log(
          '🟡 feedbackHistory ainda não existe no Prisma'
        );

        return;
      }

      const feedbacks =
        await feedbackModel.findMany({

          orderBy: {
            createdAt: 'desc'
          },

          take: 5000
        });

      this.memory = feedbacks.map(

        (item: any) => ({

          strategy:
            item.strategy,

          hits:
            item.hits,

          accuracy:
            item.accuracy,

          performance:
            item.performance || 'unknown',

          matched:
            item.matched || [],

          missed:
            item.missed || [],

          source:
            item.source || 'system',

          createdAt:
            item.createdAt
        })
      );

      console.log(
        `🧠 FeedbackMemory carregada: ${this.memory.length} feedbacks`
      );

    } catch (error) {

      console.error(
        '🔴 Erro initialize FeedbackMemory:',
        error
      );
    }
  }


  // ==========================================
  // 💾 ADD
  // ==========================================

  static async add(
    feedback: FeedbackRecord
  ) {

    try {

      // RAM
      this.memory.unshift(
        feedback
      );

      // LIMIT
      if (
        this.memory.length > 5000
      ) {

        this.memory =
          this.memory.slice(
            0,
            5000
          );
      }

      // Prisma ainda pode não existir
      const feedbackModel =
        (prisma as any).feedbackHistory;

      if (feedbackModel) {

        await feedbackModel.create({

          data: {

            strategy:
              feedback.strategy,

            hits:
              feedback.hits,

            accuracy:
              feedback.accuracy,

            performance:
              feedback.performance,

            matched:
              feedback.matched,

            missed:
              feedback.missed,

            source:
              feedback.source,

            createdAt:
              feedback.createdAt
          }
        });
      }

      console.log(
        '✅ Feedback salvo:',
        feedback.strategy
      );

    } catch (error) {

      console.error(
        '🔴 Erro add FeedbackMemory:',
        error
      );
    }
  }


  // ==========================================
  // 📊 GET ALL
  // ==========================================

  static async getAll():
    Promise<FeedbackRecord[]> {

    return this.memory;
  }


  // ==========================================
  // 📊 GET BY STRATEGY
  // ==========================================

  static async getByStrategy(
    strategy: string
  ) {

    return this.memory.filter(

      item =>

        item.strategy ===
        strategy
    );
  }


  // ==========================================
  // 🧹 CLEAR
  // ==========================================

  static clear() {

    this.memory = [];
  }
}