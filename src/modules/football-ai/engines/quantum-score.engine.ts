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

  timelineScore: number;

  marketConfidence: number;

  attackStrength: number;

  stabilityIndex: number;

  dangerIndex: number;

  expectedGoals: number;

  trend:
    | 'BULLISH'
    | 'BEARISH'
    | 'NEUTRAL';

  eliteEntry: boolean;

  safeEntry: boolean;

  reasons: string[];
};

// ======================================
// ENGINE
// ======================================

export class QuantumScoreEngine {

  // ======================================
  // HELPERS
  // ======================================

  private static clamp(
    value: number,
    min: number,
    max: number
  ): number {

    return Math.max(
      min,
      Math.min(max, value)
    );
  }

  private static safe(
    value?: number,
    fallback = 0
  ): number {

    if (
      value === undefined ||
      value === null ||
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {
      return fallback;
    }

    return value;
  }

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
      this.safe(
        prediction.confidence
      ) * 0.35;

    // ======================================
    // EDGE
    // ======================================

    score +=
      this.safe(
        prediction.edge
      ) * 1.4;

    // ======================================
    // RISK
    // ======================================

    score -=
      this.safe(
        prediction.risk
      ) * 0.45;

    // ======================================
    // INTERNAL METRICS
    // ======================================

    let pressureScore = 0;

    let momentumScore = 0;

    let volatilityScore = 0;

    let timelineScore = 0;

    let attackStrength = 0;

    let stabilityIndex = 50;

    let dangerIndex = 0;

    let expectedGoals =
      this.safe(
        prediction.expectedGoalsHome
      ) +
      this.safe(
        prediction.expectedGoalsAway
      );

    let trend:
      | 'BULLISH'
      | 'BEARISH'
      | 'NEUTRAL' =
      'NEUTRAL';

    // ======================================
    // TIMELINE
    // ======================================

    if (timeline) {

      // ====================================
      // DANGER
      // ====================================

      pressureScore =
        Number(
          (
            this.safe(
              timeline.dangerLevel
            ) * 0.3
          ).toFixed(2)
        );

      score += pressureScore;

      timelineScore += pressureScore;

      // ====================================
      // NEXT GOAL
      // ====================================

      const nextGoalBoost =
        this.safe(
          timeline.nextGoalProbability
        ) * 0.22;

      score += nextGoalBoost;

      timelineScore += nextGoalBoost;

      // ====================================
      // ATTACK STRENGTH
      // ====================================

      attackStrength =
        Number(
          (
            (
              this.safe(
                timeline.nextGoalProbability
              ) +

              this.safe(
                timeline.dangerLevel
              )
            ) / 2
          ).toFixed(2)
        );

      // ====================================
      // EXPECTED GOALS
      // ====================================

      expectedGoals =
        Number(
          (
            (
              this.safe(
                timeline.nextGoalProbability
              ) / 45
            ) +

            (
              this.safe(
                timeline.dangerLevel
              ) / 65
            )
          ).toFixed(2)
        );

      // ====================================
      // MOMENTUM
      // ====================================

      if (
        timeline.momentumTrend === 'UP'
      ) {

        momentumScore += 10;

        score += 10;

        trend = 'BULLISH';

        reasons.push(
          'Momentum ofensivo crescente'
        );
      }

      else if (
        timeline.momentumTrend === 'DOWN'
      ) {

        momentumScore -= 8;

        score -= 8;

        trend = 'BEARISH';

        reasons.push(
          'Momentum ofensivo caiu'
        );
      }

      // ====================================
      // PRESSURE TREND
      // ====================================

      if (
        timeline.pressureTrend === 'EXPLODING'
      ) {

        score += 16;

        timelineScore += 16;

        reasons.push(
          'Pressão extrema detectada'
        );
      }

      else if (
        timeline.pressureTrend === 'RISING'
      ) {

        score += 9;

        timelineScore += 9;

        reasons.push(
          'Pressão ofensiva aumentando'
        );
      }

      else if (
        timeline.pressureTrend === 'FALLING'
      ) {

        score -= 9;

        timelineScore -= 9;

        reasons.push(
          'Ritmo ofensivo caiu'
        );
      }

      // ====================================
      // VOLATILITY
      // ====================================

      volatilityScore =
        this.safe(
          timeline.volatility
        );

      dangerIndex =
        volatilityScore;

      if (
        volatilityScore >= 30
      ) {

        score += 6;

        reasons.push(
          'Partida altamente volátil'
        );
      }

      // ====================================
      // COMEBACK
      // ====================================

      if (
        this.safe(
          timeline.comebackChance
        ) >= 40
      ) {

        score += 5;

        timelineScore += 5;

        reasons.push(
          'Possível virada/reação'
        );
      }

      // ====================================
      // STABILITY
      // ====================================

      stabilityIndex =
        Number(
          (
            Math.max(
              0,
              100 -
              (
                volatilityScore * 1.1
              )
            )
          ).toFixed(2)
        );
    }

    // ======================================
    // EVENTS
    // ======================================

    let eventScore = 0;

    for (const event of events) {

      switch (event.type) {

        case 'EXTREME_PRESSURE':

          score += 14;
          eventScore += 14;

          reasons.push(
            'Evento: pressão extrema'
          );

          break;

        case 'HIGH_GOAL_PROBABILITY':

          score += 10;
          eventScore += 10;

          reasons.push(
            'Evento: próximo gol provável'
          );

          break;

        case 'ELITE_VALUE':

          score += 18;
          eventScore += 18;

          reasons.push(
            'Evento: elite value detectado'
          );

          break;

        case 'TRAP_DETECTED':

          score -= 22;
          eventScore -= 22;

          reasons.push(
            'Trap detectada'
          );

          break;

        case 'MATCH_DEAD':

          score -= 14;
          eventScore -= 14;

          reasons.push(
            'Partida sem intensidade'
          );

          break;
      }
    }

    // ======================================
    // MARKET CONFIDENCE
    // ======================================

    const marketConfidence =
      Number(
        (
          (
            this.safe(
              prediction.confidence
            ) * 0.5
          ) +

          (
            this.safe(
              prediction.edge
            ) * 1.5
          ) +

          (
            pressureScore * 0.25
          )
        ).toFixed(2)
      );

    // ======================================
    // SAFE ENTRY
    // ======================================

    const safeEntry =

      prediction.risk <= 25 &&

      score >= 72;

    // ======================================
    // ELITE ENTRY
    // ======================================

    const eliteEntry =

      score >= 88 &&

      prediction.edge >= 14;

    // ======================================
    // LIMIT
    // ======================================

    score =
      this.clamp(
        Number(score.toFixed(2)),
        0,
        100
      );

    // ======================================
    // SIGNAL
    // ======================================

    let signal: QuantumSignal;

    if (score >= 94) {

      signal = 'GODLIKE';

    } else if (score >= 84) {

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

    } else if (score >= 74) {

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

      eventScore:
        Number(
          eventScore.toFixed(2)
        ),

      pressureScore:
        Number(
          pressureScore.toFixed(2)
        ),

      momentumScore:
        Number(
          momentumScore.toFixed(2)
        ),

      volatilityScore:
        Number(
          volatilityScore.toFixed(2)
        ),

      timelineScore:
        Number(
          timelineScore.toFixed(2)
        ),

      marketConfidence:
        Number(
          marketConfidence.toFixed(2)
        ),

      attackStrength:
        Number(
          attackStrength.toFixed(2)
        ),

      stabilityIndex:
        Number(
          stabilityIndex.toFixed(2)
        ),

      dangerIndex:
        Number(
          dangerIndex.toFixed(2)
        ),

      expectedGoals:
        Number(
          expectedGoals.toFixed(2)
        ),

      trend,

      eliteEntry,

      safeEntry,

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

  ): QuantumAnalysis[] {

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