// src/modules/analytics/frequency-analysis.engine.ts

import prisma from '../../database/prisma';


// ==========================================
// 📊 TYPES
// ==========================================

type FrequencyItem = {

  number: string;

  count: number;

  score: number;
};


// ==========================================
// 🧠 FREQUENCY ANALYSIS ENGINE
// ==========================================

export class FrequencyAnalysisEngine {


  // ==========================================
  // 📊 LOAD HISTORY
  // ==========================================

  private static async loadHistory() {

    return prisma.drawHistory.findMany({

      orderBy: {
        createdAt: 'desc'
      },

      take: 5000,

      select: {
        number: true,
        createdAt: true
      }
    });
  }


  // ==========================================
  // 🔥 HOT NUMBERS
  // ==========================================

  static async getHotNumbers(
    limit = 10
  ): Promise<FrequencyItem[]> {

    const history =
      await this.loadHistory();

    const map:
      Record<string, number> = {};

    for (const item of history) {

      map[item.number] =
        (map[item.number] || 0) + 1;
    }

    return Object.entries(map)

      .map(([number, count]) => ({

        number,

        count,

        score: count * 10
      }))

      .sort(
        (a, b) =>
          b.count - a.count
      )

      .slice(0, limit);
  }


  // ==========================================
  // ❄️ COLD NUMBERS
  // ==========================================

  static async getColdNumbers(
    limit = 10
  ): Promise<FrequencyItem[]> {

    const history =
      await this.loadHistory();

    const map:
      Record<string, number> = {};

    for (const item of history) {

      map[item.number] =
        (map[item.number] || 0) + 1;
    }

    return Object.entries(map)

      .map(([number, count]) => ({

        number,

        count,

        score: 100 - count
      }))

      .sort(
        (a, b) =>
          a.count - b.count
      )

      .slice(0, limit);
  }


  // ==========================================
  // 📈 TRENDING NUMBERS
  // ==========================================

  static async getTrendingNumbers(
    limit = 10
  ): Promise<FrequencyItem[]> {

    const history =
      await this.loadHistory();

    const recent =
      history.slice(0, 1000);

    const old =
      history.slice(1000);

    const recentMap:
      Record<string, number> = {};

    const oldMap:
      Record<string, number> = {};

    for (const item of recent) {

      recentMap[item.number] =
        (recentMap[item.number] || 0) + 1;
    }

    for (const item of old) {

      oldMap[item.number] =
        (oldMap[item.number] || 0) + 1;
    }

    const trends:
      FrequencyItem[] = [];

    for (const number in recentMap) {

      const recentCount =
        recentMap[number] || 0;

      const oldCount =
        oldMap[number] || 0;

      const growth =
        recentCount - oldCount;

      trends.push({

        number,

        count: recentCount,

        score: growth
      });
    }

    return trends

      .sort(
        (a, b) =>
          b.score - a.score
      )

      .slice(0, limit);
  }
}