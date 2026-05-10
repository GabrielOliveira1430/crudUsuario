// src/modules/analytics/recency-analysis.engine.ts

import prisma from '../../database/prisma';


// ==========================================
// 🧠 RECENCY ANALYSIS ENGINE
// ==========================================

export class RecencyAnalysisEngine {


  // ==========================================
  // 📊 RECENCY SCORE
  // ==========================================

  static async getRecencyScore(
    number: string
  ): Promise<number> {

    const history =

      await prisma.drawHistory.findMany({

        where: {
          number
        },

        orderBy: {
          createdAt: 'desc'
        },

        take: 30
      });

    if (!history.length) {

      return 0;
    }

    const latest =
      history[0];

    const now =
      Date.now();

    const drawTime =
      new Date(
        latest.createdAt
      ).getTime();

    const diffMinutes =

      (now - drawTime) /

      (1000 * 60);

    // ==========================================
    // 🎯 RECENCY SCORE
    // ==========================================

    const score =

      Math.max(

        0,

        100 - diffMinutes
      );

    return Number(
      score.toFixed(2)
    );
  }


  // ==========================================
  // 📈 TREND SCORE
  // ==========================================

  static async getTrendScore(
    number: string
  ): Promise<number> {

    const recent =

      await prisma.drawHistory.count({

        where: {

          number,

          createdAt: {

            gte: new Date(
              Date.now() -
              1000 * 60 * 60
            )
          }
        }
      });

    const old =

      await prisma.drawHistory.count({

        where: {

          number,

          createdAt: {

            lt: new Date(
              Date.now() -
              1000 * 60 * 60
            )
          }
        }
      });

    const score =
      recent - old;

    return Number(
      score.toFixed(2)
    );
  }
}