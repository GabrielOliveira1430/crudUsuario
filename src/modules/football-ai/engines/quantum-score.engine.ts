// src/modules/football-ai/engines/quantum-score.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import type {
  MatchTimelineAnalysis
} from './match-timeline.engine';

import type {
  LiveEvent
} from './live-event.engine';

// ======================================
// TYPES
// ======================================

export type QuantumSignal =

  | 'WEAK'
  | 'MEDIUM'
  | 'STRONG'
  | 'ELITE'
  | 'GODLIKE';

export type QuantumAction =

  | 'AVOID'
  | 'WATCH'
  | 'ENTER'
  | 'ENTER_NOW';

export type QuantumAnalysis = {

  match: string;

  quantumScore: number;

  signal: QuantumSignal;

  action: QuantumAction;

  confidenceLevel:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'EXTREME';

  riskLevel:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';

  eventScore: number;

  pressureScore: number;

  momentumScore: number;

  volatilityScore: number;

  reasons: string[];
};

// ======================================
// ENGINE
// ======================================

export class QuantumScoreEngine {

  // ======================================
  // ANALYZE
  // ======================================

  static analyze(

    prediction:
      FootballPrediction & {
        timeline?: MatchTimelineAnalysis;
      },

    events: LiveEvent[] = []

  ): QuantumAnalysis {

    const reasons: string[] = [];

    const timeline =
      prediction.timeline;

    // ======================================
    // BASE SCORE
    // ======================================

    let score =
      prediction.confidence * 0.35;

    // ======================================
    // EDGE
    // ======================================

    score +=
      prediction.edge * 1.8;

    // ======================================
    // RISK
    // ======================================

    score -=
      prediction.risk * 0.5;

    // ======================================
    // TIMELINE
    // ======================================

    let pressureScore = 0;
    let momentumScore = 0;
    let volatilityScore = 0;

    if (timeline) {

      // ====================================
      // DANGER
      // ====================================

      pressureScore =
        timeline.dangerLevel * 0.3;

      score += pressureScore;

      // ====================================
      // GOAL PROBABILITY
      // ====================================

      score +=
        timeline.nextGoalProbability * 0.25;

      // ====================================
      // MOMENTUM
      // ====================================

      if (
        timeline.momentumTrend === 'UP'
      ) {

        momentumScore = 12;

        score += 12;

        reasons.push(
          'Momentum ofensivo crescente'
        );
      }

      if (
        timeline.pressureTrend === 'EXPLODING'
      ) {

        score += 18;

        reasons.push(
          'Pressão extrema detectada'
        );
      }

      // ====================================
      // VOLATILITY
      // ====================================

      volatilityScore =
        timeline.volatility;

      if (
        timeline.volatility >= 30
      ) {

        score += 8;

        reasons.push(
          'Partida altamente volátil'
        );
      }

      // ====================================
      // COMEBACK
      // ====================================

      if (
        timeline.comebackChance >= 40
      ) {

        score += 6;

        reasons.push(
          'Possível virada/reação'
        );
      }
    }

    // ======================================
    // EVENTS
    // ======================================

    let eventScore = 0;

    for (const event of events) {

      switch (event.type) {

        case 'EXTREME_PRESSURE':

          score += 15;
          eventScore += 15;

          reasons.push(
            'Evento: pressão extrema'
          );

          break;

        case 'HIGH_GOAL_PROBABILITY':

          score += 12;
          eventScore += 12;

          reasons.push(
            'Evento: próximo gol provável'
          );

          break;

        case 'ELITE_VALUE':

          score += 20;
          eventScore += 20;

          reasons.push(
            'Evento: elite value detectado'
          );

          break;

        case 'TRAP_DETECTED':

          score -= 25;
          eventScore -= 25;

          reasons.push(
            'Trap detectada'
          );

          break;

        case 'MATCH_DEAD':

          score -= 15;
          eventScore -= 15;

          reasons.push(
            'Partida sem intensidade'
          );

          break;
      }
    }

    // ======================================
    // LIMIT
    // ======================================

    score =
      Math.max(
        0,

        Math.min(
          100,
          Number(score.toFixed(2))
        )
      );

    // ======================================
    // SIGNAL
    // ======================================

    let signal: QuantumSignal;

    if (score >= 95) {

      signal = 'GODLIKE';

    } else if (score >= 85) {

      signal = 'ELITE';

    } else if (score >= 70) {

      signal = 'STRONG';

    } else if (score >= 55) {

      signal = 'MEDIUM';

    } else {

      signal = 'WEAK';
    }

    // ======================================
    // ACTION
    // ======================================

    let action: QuantumAction;

    if (score >= 90) {

      action = 'ENTER_NOW';

    } else if (score >= 75) {

      action = 'ENTER';

    } else if (score >= 55) {

      action = 'WATCH';

    } else {

      action = 'AVOID';
    }

    // ======================================
    // CONFIDENCE LEVEL
    // ======================================

    let confidenceLevel:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'EXTREME';

    if (score >= 90) {

      confidenceLevel =
        'EXTREME';

    } else if (score >= 75) {

      confidenceLevel =
        'HIGH';

    } else if (score >= 55) {

      confidenceLevel =
        'MEDIUM';

    } else {

      confidenceLevel =
        'LOW';
    }

    // ======================================
    // RISK LEVEL
    // ======================================

    let riskLevel:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH';

    if (prediction.risk <= 20) {

      riskLevel = 'LOW';

    } else if (
      prediction.risk <= 40
    ) {

      riskLevel = 'MEDIUM';

    } else {

      riskLevel = 'HIGH';
    }

    // ======================================
    // RESULT
    // ======================================

    return {

      match:
        `${prediction.homeTeam} vs ${prediction.awayTeam}`,

      quantumScore: score,

      signal,

      action,

      confidenceLevel,

      riskLevel,

      eventScore,

      pressureScore:
        Number(
          pressureScore.toFixed(2)
        ),

      momentumScore,

      volatilityScore,

      reasons
    };
  }

  // ======================================
  // MANY
  // ======================================

  static analyzeMany(

    predictions: (
      FootballPrediction & {
        timeline?: MatchTimelineAnalysis;
      }
    )[],

    liveEvents: {
      match: string;
      events: LiveEvent[];
    }[]

  ) {

    return predictions.map(
      (prediction) => {

        const match =
          `${prediction.homeTeam} vs ${prediction.awayTeam}`;

        const found =
          liveEvents.find(
            item =>
              item.match === match
          );

        return this.analyze(
          prediction,
          found?.events || []
        );
      }
    );
  }
}

export const quantumScoreEngine =
  new QuantumScoreEngine();