// src/modules/football-ai/engines/match-timeline.engine.ts

import type {
  PressureAnalysis
} from './live-pressure.engine';

// ======================================
// TYPES
// ======================================

export type TimelineSnapshot = {

  timestamp: number;

  minute?: number;

  homePressure: number;

  awayPressure: number;

  goalProbability: number;

  dangerous: boolean;

  dominantTeam: string;

  intensity:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'EXTREME';

  pressureDifference: number;

  matchRhythm: number;

  homeMomentum?: number;

  awayMomentum?: number;

  tempoIndex?: number;

  emotionalPressure?: number;
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

  averagePressure: number;

  rhythmScore: number;

  stabilityScore: number;

  explosiveMoments: number;

  snapshots: TimelineSnapshot[];

  updatedAt: string;

  // ======================================
  // 🧠 NOVOS CAMPOS
  // ======================================

  averageGoalProbability?: number;

  emotionalIndex?: number;

  accelerationIndex?: number;

  dominanceScoreHome?: number;

  dominanceScoreAway?: number;

  chaosLevel?: number;

  trendConfidence?: number;
};

// ======================================
// ENGINE
// ======================================

export class MatchTimelineEngine {

  private static memory =
    new Map<
      string,
      TimelineSnapshot[]
    >();

  private static MAX_HISTORY = 20;

  // ======================================
  // SAFE
  // ======================================

  private static safe(
    value: number,
    min = 0,
    max = 100
  ) {

    return Number(
      (
        Math.max(
          min,
          Math.min(max, value)
        )
      ).toFixed(2)
    );
  }

  // ======================================
  // ANALYZE
  // ======================================

  static analyze(
    matchId: string,
    pressure: PressureAnalysis
  ): MatchTimelineAnalysis {

    const snapshot:
      TimelineSnapshot = {

      timestamp:
        Date.now(),

      minute:
        pressure.fatigueIndex,

      homePressure:
        pressure.homePressure ?? 0,

      awayPressure:
        pressure.awayPressure ?? 0,

      goalProbability:
        pressure.goalProbability ?? 0,

      dangerous:
        !!pressure.dangerous,

      dominantTeam:
        pressure.dominantTeam,

      intensity:
        pressure.intensity,

      pressureDifference:
        pressure.pressureDifference ?? 0,

      matchRhythm:
        pressure.matchRhythm ?? 0,

      homeMomentum:
        pressure.homeMomentum ?? 50,

      awayMomentum:
        pressure.awayMomentum ?? 50,

      tempoIndex:
        pressure.tempoIndex ?? 50,

      emotionalPressure:
        pressure.emotionalPressure ?? 50
    };

    const history =
      this.memory.get(
        matchId
      ) ?? [];

    history.push(snapshot);

    const limited =
      history.slice(
        -this.MAX_HISTORY
      );

    this.memory.set(
      matchId,
      limited
    );

    // ======================================
    // INITIAL
    // ======================================

    if (
      limited.length < 2
    ) {

      const base =
        pressure.goalProbability ?? 0;

      return {

        momentumTrend:
          'STABLE',

        pressureTrend:
          'STABLE',

        dominantWindow:
          'BALANCED',

        volatility: 0,

        dangerLevel:
          this.safe(base),

        comebackChance: 0,

        nextGoalProbability:
          this.safe(base),

        fatigueIndex:
          this.safe(
            limited.length * 3
          ),

        averagePressure:
          this.safe(

            (
              pressure.homePressure +
              pressure.awayPressure
            ) / 2
          ),

        rhythmScore:
          this.safe(
            pressure.matchRhythm ?? 0
          ),

        stabilityScore: 100,

        explosiveMoments: 0,

        snapshots: limited,

        updatedAt:
          new Date().toISOString(),

        averageGoalProbability:
          this.safe(base),

        emotionalIndex:
          this.safe(
            pressure.emotionalPressure ?? 50
          ),

        accelerationIndex: 0,

        dominanceScoreHome:
          this.safe(
            pressure.homePressure
          ),

        dominanceScoreAway:
          this.safe(
            pressure.awayPressure
          ),

        chaosLevel: 0,

        trendConfidence: 50
      };
    }

    const first =
      limited[0];

    const last =
      limited[
        limited.length - 1
      ];

    // ======================================
    // PRESSURE TREND
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

    let pressureTrend:
      | 'EXPLODING'
      | 'RISING'
      | 'STABLE'
      | 'FALLING';

    if (
      pressureDiff >= 35
    ) {

      pressureTrend =
        'EXPLODING';
    }

    else if (
      pressureDiff >= 15
    ) {

      pressureTrend =
        'RISING';
    }

    else if (
      pressureDiff <= -15
    ) {

      pressureTrend =
        'FALLING';
    }

    else {

      pressureTrend =
        'STABLE';
    }

    // ======================================
    // MOMENTUM TREND
    // ======================================

    let momentumTrend:
      | 'UP'
      | 'DOWN'
      | 'STABLE';

    const firstGoal =
      first.goalProbability ?? 0;

    const lastGoal =
      last.goalProbability ?? 0;

    if (
      lastGoal >
      firstGoal + 10
    ) {

      momentumTrend =
        'UP';
    }

    else if (
      lastGoal <
      firstGoal - 10
    ) {

      momentumTrend =
        'DOWN';
    }

    else {

      momentumTrend =
        'STABLE';
    }

    // ======================================
    // DOMINANCE
    // ======================================

    const homeAvg =

      limited.reduce(

        (a, i) =>

          a + i.homePressure,

        0
      ) / limited.length;

    const awayAvg =

      limited.reduce(

        (a, i) =>

          a + i.awayPressure,

        0
      ) / limited.length;

    let dominantWindow:
      | 'HOME'
      | 'AWAY'
      | 'BALANCED';

    if (
      homeAvg >
      awayAvg + 10
    ) {

      dominantWindow =
        'HOME';
    }

    else if (
      awayAvg >
      homeAvg + 10
    ) {

      dominantWindow =
        'AWAY';
    }

    else {

      dominantWindow =
        'BALANCED';
    }

    // ======================================
    // VOLATILITY
    // ======================================

    const volatility =

      limited.length > 1

        ? this.safe(

            limited.reduce(
              (
                acc,
                item,
                i
              ) => {

                if (i === 0) {
                  return acc;
                }

                const prev =
                  limited[i - 1];

                return (

                  acc +

                  Math.abs(

                    item.goalProbability -

                    prev.goalProbability
                  )
                );
              },

              0
            ) /

            (
              limited.length - 1
            )
          )

        : 0;

    // ======================================
    // AVERAGE PRESSURE
    // ======================================

    const averagePressure =
      this.safe(

        limited.reduce(
          (acc, item) =>

            acc +

            (
              item.homePressure +
              item.awayPressure
            ) / 2,

          0
        ) / limited.length
      );

    // ======================================
    // RHYTHM
    // ======================================

    const rhythmScore =
      this.safe(

        limited.reduce(
          (acc, item) =>

            acc +
            item.matchRhythm,

          0
        ) / limited.length
      );

    // ======================================
    // AVERAGE GOAL PROBABILITY
    // ======================================

    const averageGoalProbability =
      this.safe(

        limited.reduce(
          (acc, item) =>

            acc +
            item.goalProbability,

          0
        ) / limited.length
      );

    // ======================================
    // EXPLOSIVE MOMENTS
    // ======================================

    const explosiveMoments =

      limited.filter(

        item =>

          item.goalProbability >= 80 ||

          item.intensity ===
            'EXTREME'
      ).length;

    // ======================================
    // STABILITY
    // ======================================

    const stabilityScore =
      this.safe(
        100 - volatility
      );

    // ======================================
    // DANGER
    // ======================================

    const dangerLevel =
      this.safe(

        (
          last.goalProbability * 0.55 +

          volatility * 0.2 +

          rhythmScore * 0.25
        )
      );

    // ======================================
    // COMEBACK
    // ======================================

    const comebackChance =
      this.safe(

        (
          volatility * 0.5 +

          pressureDiff * 0.3 +

          explosiveMoments * 4
        )
      );

    // ======================================
    // FATIGUE
    // ======================================

    const fatigueIndex =
      this.safe(

        limited.length * 3.5
      );

    // ======================================
    // NEXT GOAL
    // ======================================

    const nextGoalProbability =
      this.safe(

        (
          last.goalProbability * 0.65 +

          dangerLevel * 0.2 +

          rhythmScore * 0.15
        )
      );

    // ======================================
    // EMOTIONAL INDEX
    // ======================================

    const emotionalIndex =
      this.safe(

        limited.reduce(
          (acc, item) =>

            acc +
            (
              item.emotionalPressure ?? 50
            ),

          0
        ) / limited.length
      );

    // ======================================
    // ACCELERATION
    // ======================================

    const accelerationIndex =
      this.safe(

        Math.abs(
          last.goalProbability -
          first.goalProbability
        ) * 1.5
      );

    // ======================================
    // CHAOS LEVEL
    // ======================================

    const chaosLevel =
      this.safe(

        (
          volatility * 0.4 +

          explosiveMoments * 6 +

          accelerationIndex * 0.3
        )
      );

    // ======================================
    // TREND CONFIDENCE
    // ======================================

    const trendConfidence =
      this.safe(

        (
          stabilityScore * 0.4 +

          averagePressure * 0.3 +

          rhythmScore * 0.3
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

      averagePressure,

      rhythmScore,

      stabilityScore,

      explosiveMoments,

      snapshots:
        limited,

      updatedAt:
        new Date().toISOString(),

      averageGoalProbability,

      emotionalIndex,

      accelerationIndex,

      dominanceScoreHome:
        this.safe(homeAvg),

      dominanceScoreAway:
        this.safe(awayAvg),

      chaosLevel,

      trendConfidence
    };
  }

  // ======================================
  // GET HISTORY
  // ======================================

  static getHistory(
    matchId: string
  ) {

    return (
      this.memory.get(
        matchId
      ) ?? []
    );
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