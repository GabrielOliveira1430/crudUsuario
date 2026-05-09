// src/modules/analytics/temporal.analytics.ts

import {
  FakeDraw
} from '../history/history.generator';


// ==========================================
// 📊 TYPES
// ==========================================

export type TemporalFrequency = {

  label: string;

  count: number;
};


export type TrendResult = {

  number: string;

  occurrences: number;

  trend: 'up' | 'down' | 'stable';
};


// ==========================================
// 🧠 TEMPORAL ANALYTICS
// ==========================================

export class TemporalAnalytics {


  // ==========================================
  // 🕒 FREQUÊNCIA POR HORA
  // ==========================================

  static byHour(
    history: FakeDraw[]
  ): TemporalFrequency[] {

    const map =
      new Map<number, number>();

    for (const draw of history) {

      const hour =
        draw.extractedAt.getHours();

      map.set(
        hour,
        (
          map.get(hour) || 0
        ) + 1
      );
    }

    return Array.from(
      map.entries()
    )
      .map(([hour, count]) => ({

        label:
          `${hour}:00`,

        count
      }))
      .sort(
        (a, b) =>
          a.label.localeCompare(
            b.label
          )
      );
  }


  // ==========================================
  // 📅 FREQUÊNCIA POR DIA
  // ==========================================

  static byWeekday(
    history: FakeDraw[]
  ): TemporalFrequency[] {

    const days = [

      'Dom',
      'Seg',
      'Ter',
      'Qua',
      'Qui',
      'Sex',
      'Sab'
    ];

    const map =
      new Map<string, number>();

    for (const draw of history) {

      const day =
        days[
          draw.extractedAt.getDay()
        ];

      map.set(
        day,
        (
          map.get(day) || 0
        ) + 1
      );
    }

    return Array.from(
      map.entries()
    )
      .map(([label, count]) => ({
        label,
        count
      }));
  }


  // ==========================================
  // 📈 TENDÊNCIAS
  // ==========================================

  static trends(
    history: FakeDraw[]
  ): TrendResult[] {

    const recent =
      history.slice(-500);

    const old =
      history.slice(0, 500);

    const recentMap =
      new Map<string, number>();

    const oldMap =
      new Map<string, number>();


    // 🔥 recent
    for (const draw of recent) {

      recentMap.set(

        draw.number,

        (
          recentMap.get(
            draw.number
          ) || 0
        ) + 1
      );
    }


    // 🔥 old
    for (const draw of old) {

      oldMap.set(

        draw.number,

        (
          oldMap.get(
            draw.number
          ) || 0
        ) + 1
      );
    }


    const results:
      TrendResult[] = [];


    for (
      const [number, count]
      of recentMap.entries()
    ) {

      const oldCount =
        oldMap.get(number) || 0;

      let trend:
        'up'
        | 'down'
        | 'stable';

      if (count > oldCount) {

        trend = 'up';

      } else if (
        count < oldCount
      ) {

        trend = 'down';

      } else {

        trend = 'stable';
      }

      results.push({

        number,

        occurrences: count,

        trend
      });
    }

    return results
      .sort(
        (a, b) =>
          b.occurrences -
          a.occurrences
      )
      .slice(0, 20);
  }
}