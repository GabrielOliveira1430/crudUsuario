// src/modules/analytics/analytics.service.ts

import {

  AnalyticsResult,

  FrequencyItem,

  DelayItem,

  RankingItem

} from './analytics.types';


// ==========================================
// 📊 ANALYTICS ENGINE
// ==========================================

export class AnalyticsService {


  // ==========================================
  // 🔥 FREQUÊNCIA
  // ==========================================

  static calculateFrequency(
    numbers: number[]
  ): FrequencyItem[] {

    const map =
      new Map<number, number>();

    for (const num of numbers) {

      map.set(
        num,
        (map.get(num) || 0) + 1
      );
    }

    const total =
      numbers.length;

    return Array
      .from(map.entries())
      .map(([number, count]) => ({

        number,

        count,

        percentage:
          Number(
            (
              (count / total) * 100
            ).toFixed(2)
          )
      }))
      .sort(
        (a, b) =>
          b.count - a.count
      );
  }


  // ==========================================
  // ⏳ ATRASO
  // ==========================================

  static calculateDelay(
    numbers: number[]
  ): DelayItem[] {

    const lastSeen =
      new Map<number, number>();

    numbers.forEach(
      (num, index) => {

        lastSeen.set(
          num,
          index
        );
      }
    );

    return Array
      .from(lastSeen.entries())
      .map(([number, lastIndex]) => ({

        number,

        delay:
          numbers.length - lastIndex
      }))
      .sort(
        (a, b) =>
          b.delay - a.delay
      );
  }


  // ==========================================
  // 🔥 NÚMEROS QUENTES
  // ==========================================

  static calculateHotNumbers(
    frequency: FrequencyItem[]
  ): RankingItem[] {

    return frequency
      .slice(0, 20)
      .map(item => ({

        number:
          item.number,

        score:
          Number(
            (
              item.percentage * 2
            ).toFixed(2)
          )
      }));
  }


  // ==========================================
  // ❄️ NÚMEROS FRIOS
  // ==========================================

  static calculateColdNumbers(
    delay: DelayItem[]
  ): RankingItem[] {

    return delay
      .slice(0, 20)
      .map(item => ({

        number:
          item.number,

        score:
          item.delay
      }));
  }


  // ==========================================
  // 🚀 RESULTADO FINAL
  // ==========================================

  static getStats(
    numbers: number[]
  ): AnalyticsResult {

    const frequency =
      this.calculateFrequency(
        numbers
      );

    const delay =
      this.calculateDelay(
        numbers
      );

    const hotNumbers =
      this.calculateHotNumbers(
        frequency
      );

    const coldNumbers =
      this.calculateColdNumbers(
        delay
      );

    return {

      total:
        numbers.length,

      unique:
        new Set(numbers).size,

      frequency,

      delay,

      hotNumbers,

      coldNumbers
    };
  }
}