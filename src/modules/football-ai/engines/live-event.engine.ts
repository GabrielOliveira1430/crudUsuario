// src/modules/football-ai/engines/live-event.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import type {
  MatchTimelineAnalysis
} from './match-timeline.engine';

// ======================================
// TYPES
// ======================================

export type LiveEventType =

  | 'EXTREME_PRESSURE'

  | 'HIGH_GOAL_PROBABILITY'

  | 'DEFENSIVE_COLLAPSE'

  | 'MOMENTUM_SHIFT'

  | 'COMEBACK_SIGNAL'

  | 'MATCH_DEAD'

  | 'VOLATILE_MATCH'

  | 'ELITE_VALUE'

  | 'TRAP_DETECTED';

export type LiveEvent = {

  type: LiveEventType;

  severity:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'CRITICAL';

  message: string;

  confidence: number;

  timestamp: number;

  scoreImpact: number;
};

// ======================================
// ENGINE
// ======================================

export class LiveEventEngine {

  // ======================================
  // EVENT FACTORY
  // ======================================

  private static createEvent(
    type: LiveEventType,
    severity:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'CRITICAL',
    confidence: number,
    message: string,
    scoreImpact: number
  ): LiveEvent {

    return {

      type,

      severity,

      confidence:
        Number(
          Math.min(
            100,
            Math.max(0, confidence)
          ).toFixed(2)
        ),

      timestamp:
        Date.now(),

      message,

      scoreImpact
    };
  }

  // ======================================
  // ANALYZE
  // ======================================

  static analyze(
    prediction: FootballPrediction & {
      timeline?: MatchTimelineAnalysis;
    }
  ): LiveEvent[] {

    const events: LiveEvent[] = [];

    const timeline =
      prediction.timeline;

    if (!timeline) {
      return events;
    }

    // ======================================
    // EXTREME PRESSURE
    // ======================================

    if (
      timeline.dangerLevel >= 85
    ) {

      events.push(
        this.createEvent(
          'EXTREME_PRESSURE',
          'CRITICAL',
          timeline.dangerLevel,
          'Pressão extrema detectada',
          15
        )
      );
    }

    // ======================================
    // HIGH GOAL
    // ======================================

    if (
      timeline.nextGoalProbability >= 80
    ) {

      events.push(
        this.createEvent(
          'HIGH_GOAL_PROBABILITY',
          'HIGH',
          timeline.nextGoalProbability,
          'Alta probabilidade de próximo gol',
          12
        )
      );
    }

    // ======================================
    // DEFENSIVE COLLAPSE
    // ======================================

    if (

      timeline.pressureTrend ===
        'EXPLODING' &&

      timeline.volatility >= 25

    ) {

      events.push(
        this.createEvent(
          'DEFENSIVE_COLLAPSE',
          'CRITICAL',
          90,
          'Possível colapso defensivo',
          18
        )
      );
    }

    // ======================================
    // MOMENTUM SHIFT
    // ======================================

    if (
      timeline.momentumTrend ===
      'UP'
    ) {

      events.push(
        this.createEvent(
          'MOMENTUM_SHIFT',
          'MEDIUM',
          75,
          'Momentum ofensivo crescente',
          8
        )
      );
    }

    // ======================================
    // COMEBACK
    // ======================================

    if (
      timeline.comebackChance >= 40
    ) {

      events.push(
        this.createEvent(
          'COMEBACK_SIGNAL',
          'HIGH',
          timeline.comebackChance,
          'Possível reação ou virada',
          10
        )
      );
    }

    // ======================================
    // DEAD MATCH
    // ======================================

    if (

      timeline.dangerLevel <= 35 &&

      timeline.volatility <= 10

    ) {

      events.push(
        this.createEvent(
          'MATCH_DEAD',
          'LOW',
          70,
          'Partida sem intensidade',
          -15
        )
      );
    }

    // ======================================
    // VOLATILE MATCH
    // ======================================

    if (
      timeline.volatility >= 30
    ) {

      events.push(
        this.createEvent(
          'VOLATILE_MATCH',
          'HIGH',
          timeline.volatility,
          'Partida altamente volátil',
          6
        )
      );
    }

    // ======================================
    // ELITE VALUE
    // ======================================

    if (

      prediction.edge >= 25 &&

      prediction.confidence >= 82

    ) {

      events.push(
        this.createEvent(
          'ELITE_VALUE',
          'CRITICAL',
          prediction.confidence,
          'Elite value bet detectado',
          20
        )
      );
    }

    // ======================================
    // TRAP DETECTED
    // ======================================

    if (

      prediction.confidence <= 55 &&

      prediction.risk >= 45

    ) {

      events.push(
        this.createEvent(
          'TRAP_DETECTED',
          'HIGH',
          prediction.risk,
          'Possível armadilha detectada',
          -25
        )
      );
    }

    // ======================================
    // SORT
    // ======================================

    return events.sort(
      (a, b) =>
        b.scoreImpact - a.scoreImpact
    );
  }

  // ======================================
  // MANY
  // ======================================

  static analyzeMany(
    predictions: (
      FootballPrediction & {
        timeline?: MatchTimelineAnalysis;
      }
    )[]
  ) {

    return predictions.map(
      (prediction) => ({

        match:
          `${prediction.homeTeam} vs ${prediction.awayTeam}`,

        totalEvents:
          this.analyze(
            prediction
          ).length,

        criticalEvents:
          this.analyze(
            prediction
          ).filter(
            e =>
              e.severity ===
              'CRITICAL'
          ).length,

        events:
          this.analyze(
            prediction
          )
      })
    );
  }
}

export const liveEventEngine =
  new LiveEventEngine();