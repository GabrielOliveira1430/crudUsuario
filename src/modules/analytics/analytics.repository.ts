// src/modules/analytics/analytics.repository.ts

import prisma from '../../database/prisma';


// ==========================================
// 📊 ANALYTICS REPOSITORY
// ==========================================

export class AnalyticsRepository {

  // ==========================================
  // 📦 GET ALL DRAWS
  // ==========================================

  static async getAllDraws() {

    return prisma.drawHistory.findMany({

      orderBy: {
        createdAt: 'desc'
      },

      take: 10000
    });
  }


  // ==========================================
  // 📊 GET SOURCE STATS
  // ==========================================

  static async getSourceStats() {

    const draws =
      await this.getAllDraws();

    const stats:
      Record<string, number> = {};

    for (const draw of draws) {

      const source =
        draw.source || 'unknown';

      stats[source] =
        (stats[source] || 0) + 1;
    }

    return Object.entries(stats).map(

      ([source, total]) => ({

        source,

        total
      })
    );
  }


  // ==========================================
  // 🔥 GET HOT NUMBERS
  // ==========================================

  static async getHotNumbers() {

    const draws =
      await this.getAllDraws();

    const frequency:
      Record<string, number> = {};

    for (const draw of draws) {

      frequency[draw.number] =

        (frequency[draw.number] || 0) + 1;
    }

    return Object.entries(frequency)

      .sort(
        (a, b) => b[1] - a[1]
      )

      .slice(0, 20)

      .map(([number, total]) => ({

        number,

        total
      }));
  }


  // ==========================================
  // ❄️ GET COLD NUMBERS
  // ==========================================

  static async getColdNumbers() {

    const draws =
      await this.getAllDraws();

    const frequency:
      Record<string, number> = {};

    for (const draw of draws) {

      frequency[draw.number] =

        (frequency[draw.number] || 0) + 1;
    }

    return Object.entries(frequency)

      .sort(
        (a, b) => a[1] - b[1]
      )

      .slice(0, 20)

      .map(([number, total]) => ({

        number,

        total
      }));
  }
}