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
};

// ======================================
// ENGINE
// ======================================

export class LiveEventEngine {

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

      events.push({

        type:
          'EXTREME_PRESSURE',

        severity:
          'CRITICAL',

        confidence:
          timeline.dangerLevel,

        timestamp:
          Date.now(),

        message:
          'Pressão extrema detectada'
      });
    }

    // ======================================
    // HIGH GOAL
    // ======================================

    if (
      timeline.nextGoalProbability >= 80
    ) {

      events.push({

        type:
          'HIGH_GOAL_PROBABILITY',

        severity:
          'HIGH',

        confidence:
          timeline.nextGoalProbability,

        timestamp:
          Date.now(),

        message:
          'Alta probabilidade de próximo gol'
      });
    }

    // ======================================
    // DEFENSIVE COLLAPSE
    // ======================================

    if (

      timeline.pressureTrend ===
        'EXPLODING' &&

      timeline.volatility >= 25

    ) {

      events.push({

        type:
          'DEFENSIVE_COLLAPSE',

        severity:
          'CRITICAL',

        confidence:
          90,

        timestamp:
          Date.now(),

        message:
          'Possível colapso defensivo'
      });
    }

    // ======================================
    // MOMENTUM SHIFT
    // ======================================

    if (
      timeline.momentumTrend ===
      'UP'
    ) {

      events.push({

        type:
          'MOMENTUM_SHIFT',

        severity:
          'MEDIUM',

        confidence:
          75,

        timestamp:
          Date.now(),

        message:
          'Momentum ofensivo crescente'
      });
    }

    // ======================================
    // COMEBACK
    // ======================================

    if (
      timeline.comebackChance >= 40
    ) {

      events.push({

        type:
          'COMEBACK_SIGNAL',

        severity:
          'HIGH',

        confidence:
          timeline.comebackChance,

        timestamp:
          Date.now(),

        message:
          'Possível reação ou virada'
      });
    }

    // ======================================
    // DEAD MATCH
    // ======================================

    if (

      timeline.dangerLevel <= 35 &&

      timeline.volatility <= 10

    ) {

      events.push({

        type:
          'MATCH_DEAD',

        severity:
          'LOW',

        confidence:
          70,

        timestamp:
          Date.now(),

        message:
          'Partida sem intensidade'
      });
    }

    // ======================================
    // VOLATILE MATCH
    // ======================================

    if (
      timeline.volatility >= 30
    ) {

      events.push({

        type:
          'VOLATILE_MATCH',

        severity:
          'HIGH',

        confidence:
          timeline.volatility,

        timestamp:
          Date.now(),

        message:
          'Partida altamente volátil'
      });
    }

    // ======================================
    // ELITE VALUE
    // ======================================

    if (

      prediction.edge >= 25 &&

      prediction.confidence >= 82

    ) {

      events.push({

        type:
          'ELITE_VALUE',

        severity:
          'CRITICAL',

        confidence:
          prediction.confidence,

        timestamp:
          Date.now(),

        message:
          'Elite value bet detectado'
      });
    }

    // ======================================
    // TRAP DETECTED
    // ======================================

    if (

      prediction.confidence <= 55 &&

      prediction.risk >= 45

    ) {

      events.push({

        type:
          'TRAP_DETECTED',

        severity:
          'HIGH',

        confidence:
          prediction.risk,

        timestamp:
          Date.now(),

        message:
          'Possível armadilha detectada'
      });
    }

    return events;
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