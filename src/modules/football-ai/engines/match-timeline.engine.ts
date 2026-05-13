// src/modules/football-ai/engines/match-timeline.engine.ts

import type {
  PressureAnalysis
} from './live-pressure.engine';

// ======================================
// TYPES
// ======================================

export type TimelineSnapshot = {

  timestamp: number;

  homePressure: number;

  awayPressure: number;

  goalProbability: number;

  dangerous: boolean;
};

export type MatchTimelineAnalysis = {

  momentumTrend:
    | 'UP'
    | 'DOWN'
    | 'STABLE';

  pressureTrend:
    | 'EXPLODING'
    | 'RISING'
    | 'STABLE'
    | 'FALLING';

  dominantWindow:
    | 'HOME'
    | 'AWAY'
    | 'BALANCED';

  volatility: number;

  dangerLevel: number;

  comebackChance: number;

  nextGoalProbability: number;

  fatigueIndex: number;

  snapshots: TimelineSnapshot[];
};

// ======================================
// ENGINE
// ======================================

export class MatchTimelineEngine {

  // ======================================
  // MEMORY
  // ======================================

  private static memory =
    new Map<
      string,
      TimelineSnapshot[]
    >();

  private static MAX_HISTORY = 20;

  // ======================================
  // ANALYZE
  // ======================================

  static analyze(
    matchId: string,
    pressure: PressureAnalysis
  ): MatchTimelineAnalysis {

    // ======================================
    // SNAPSHOT
    // ======================================

    const snapshot: TimelineSnapshot = {

      timestamp:
        Date.now(),

      homePressure:
        pressure.homePressure,

      awayPressure:
        pressure.awayPressure,

      goalProbability:
        pressure.goalProbability,

      dangerous:
        pressure.dangerous
    };

    // ======================================
    // HISTORY
    // ======================================

    const history =
      this.memory.get(matchId) || [];

    history.push(snapshot);

    // ======================================
    // LIMIT
    // ======================================

    const limited =
      history.slice(
        -this.MAX_HISTORY
      );

    this.memory.set(
      matchId,
      limited
    );

    // ======================================
    // SAFE
    // ======================================

    if (limited.length < 2) {

      return {

        momentumTrend:
          'STABLE',

        pressureTrend:
          'STABLE',

        dominantWindow:
          'BALANCED',

        volatility: 0,

        dangerLevel:
          pressure.goalProbability,

        comebackChance: 0,

        nextGoalProbability:
          pressure.goalProbability,

        fatigueIndex: 0,

        snapshots:
          limited
      };
    }

    // ======================================
    // LASTS
    // ======================================

    const first =
      limited[0];

    const last =
      limited[
        limited.length - 1
      ];

    // ======================================
    // PRESSURE DIFF
    // ======================================

    const pressureDiff =
      (
        last.homePressure +
        last.awayPressure
      ) -
      (
        first.homePressure +
        first.awayPressure
      );

    // ======================================
    // PRESSURE TREND
    // ======================================

    let pressureTrend:
      | 'EXPLODING'
      | 'RISING'
      | 'STABLE'
      | 'FALLING';

    if (pressureDiff >= 35) {

      pressureTrend =
        'EXPLODING';

    } else if (
      pressureDiff >= 15
    ) {

      pressureTrend =
        'RISING';

    } else if (
      pressureDiff <= -15
    ) {

      pressureTrend =
        'FALLING';

    } else {

      pressureTrend =
        'STABLE';
    }

    // ======================================
    // MOMENTUM
    // ======================================

    let momentumTrend:
      | 'UP'
      | 'DOWN'
      | 'STABLE';

    if (
      last.goalProbability >
      first.goalProbability + 10
    ) {

      momentumTrend = 'UP';

    } else if (
      last.goalProbability <
      first.goalProbability - 10
    ) {

      momentumTrend = 'DOWN';

    } else {

      momentumTrend = 'STABLE';
    }

    // ======================================
    // DOMINANT TEAM
    // ======================================

    const homeAverage =
      limited.reduce(
        (acc, item) =>
          acc + item.homePressure,
        0
      ) / limited.length;

    const awayAverage =
      limited.reduce(
        (acc, item) =>
          acc + item.awayPressure,
        0
      ) / limited.length;

    let dominantWindow:
      | 'HOME'
      | 'AWAY'
      | 'BALANCED';

    if (
      homeAverage >
      awayAverage + 10
    ) {

      dominantWindow =
        'HOME';

    } else if (
      awayAverage >
      homeAverage + 10
    ) {

      dominantWindow =
        'AWAY';

    } else {

      dominantWindow =
        'BALANCED';
    }

    // ======================================
    // VOLATILITY
    // ======================================

    const volatility =
      Number(
        (
          limited.reduce(
            (acc, item, index) => {

              if (index === 0) {
                return acc;
              }

              const prev =
                limited[index - 1];

              return (
                acc +
                Math.abs(
                  item.goalProbability -
                  prev.goalProbability
                )
              );

            },
            0
          ) / limited.length
        ).toFixed(2)
      );

    // ======================================
    // DANGER LEVEL
    // ======================================

    const dangerLevel =
      Math.min(
        100,

        Number(
          (
            (
              last.goalProbability * 0.6
            ) +

            (
              volatility * 0.4
            )
          ).toFixed(2)
        )
      );

    // ======================================
    // COMEBACK CHANCE
    // ======================================

    const comebackChance =
      Number(
        (
          volatility * 0.8
        ).toFixed(2)
      );

    // ======================================
    // FATIGUE
    // ======================================

    const fatigueIndex =
      Number(
        (
          limited.length * 2.5
        ).toFixed(2)
      );

    // ======================================
    // NEXT GOAL
    // ======================================

    const nextGoalProbability =
      Math.min(
        100,

        Number(
          (
            (
              last.goalProbability * 0.7
            ) +

            (
              dangerLevel * 0.3
            )
          ).toFixed(2)
        )
      );

    // ======================================
    // RESULT
    // ======================================

    return {

      momentumTrend,

      pressureTrend,

      dominantWindow,

      volatility,

      dangerLevel,

      comebackChance,

      nextGoalProbability,

      fatigueIndex,

      snapshots:
        limited
    };
  }

  // ======================================
  // CLEAR
  // ======================================

  static clear(
    matchId?: string
  ) {

    if (matchId) {

      this.memory.delete(
        matchId
      );

      return;
    }

    this.memory.clear();
  }
}

export const matchTimelineEngine =
  new MatchTimelineEngine();