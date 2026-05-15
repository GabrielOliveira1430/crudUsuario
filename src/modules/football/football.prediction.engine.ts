// src/modules/football/football.prediction.engine.ts

import { footballTeamMemory } from './football.team.memory';

import { LivePressureEngine } from '../../modules/football-ai/engines/live-pressure.engine';

import type {
  PressureAnalysis
} from '../../modules/football-ai/engines/live-pressure.engine';

import type {
  FootballMatch
} from './providers/football.types';

import type {
  Market,
  MarketType
} from '../football-ai/types/market.types';

import {
  weightOptimizer
} from '../football-ai/learning/weight.optimizer';

import {
  ConfidenceCalibrator
} from '../football-ai/learning/confidence.calibrator';

import {
  MatchDNAEngine
} from '../football-ai/dna/match-dna.engine';

import {
  CollapseDetector
} from '../football-ai/dna/collapse-detector';

import {
  ComebackEngine
} from '../football-ai/dna/comeback-engine';

import {
  ChaosIndexEngine
} from '../football-ai/dna/chaos-index.engine';

// ======================================
// TYPES
// ======================================

export type FootballPredictionInput = {

  homeTeam: string;

  awayTeam: string;

  pressure?: PressureAnalysis;
};

export type FootballPrediction = {

  homeTeam: string;

  awayTeam: string;

  winner: string;

  prediction:
    | 'HOME'
    | 'AWAY'
    | 'DRAW';

  confidence: number;

  fairOdd: number;

  risk: number;

  edge: number;

  recommendation: string;

  market: Market;

  expectedGoalsHome: number;

  expectedGoalsAway: number;

  matchIntensity:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'EXTREME';

  chaosIndex: number;

  reasons: string[];

  pressure?: PressureAnalysis;

  timeline?: any;
};

// ======================================
// ENGINE
// ======================================

export class FootballPredictionEngine {

  // ======================================
  // HELPERS
  // ======================================

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

  private static normalizeScore(
    score: number
  ): number {

    return Math.min(
      100,
      Math.max(0, score)
    );
  }

  private static toFixed(
    value: number,
    decimals = 2
  ): number {

    return Number(
      value.toFixed(decimals)
    );
  }

  // ======================================
  // SINGLE
  // ======================================

  static single(
    match: FootballMatch
  ): FootballPrediction {

    const home =
      footballTeamMemory.get(
        match.homeTeam
      );

    const away =
      footballTeamMemory.get(
        match.awayTeam
      );

    // ======================================
    // LIVE PRESSURE
    // ======================================

    const pressure: PressureAnalysis =

      LivePressureEngine.analyze(
        match
      ) ?? {

        homeTeam:
          match.homeTeam,

        awayTeam:
          match.awayTeam,

        homePressure: 50,

        awayPressure: 50,

        dominantTeam:
          'BALANCED',

        nextGoalTeam:
          'BALANCED',

        goalProbability: 50,

        intensity:
          'MEDIUM',

        dangerous: false,

        momentumShift: false,

        attackingSide:
          'BALANCED',

        confidence: 50,

        reasons: []
      };

    // ======================================
    // WEIGHTS
    // ======================================

    const weights =
      weightOptimizer.getWeights();

    // ======================================
    // DNA
    // ======================================

    const {
      homeDNA,
      awayDNA
    } =
      MatchDNAEngine.build(
        match
      );

    const homeCollapse =
      CollapseDetector.analyze(
        homeDNA
      );

    const awayCollapse =
      CollapseDetector.analyze(
        awayDNA
      );

    const homeComeback =
      ComebackEngine.analyze(
        homeDNA
      );

    const awayComeback =
      ComebackEngine.analyze(
        awayDNA
      );

    const chaos =
      ChaosIndexEngine.analyze(
        homeDNA,
        awayDNA
      );

    // ======================================
    // FALLBACK
    // ======================================

    if (
      !home ||
      !away
    ) {

      let confidence =
        55 + Math.random() * 20;

      confidence =
        ConfidenceCalibrator
          .calibrate(
            confidence
          );

      const homeAdvantage =

        pressure.homePressure >=
        pressure.awayPressure;

      const prediction:
        FootballPrediction['prediction'] =

        homeAdvantage
          ? 'HOME'
          : 'AWAY';

      const winner =

        homeAdvantage
          ? match.homeTeam
          : match.awayTeam;

      let market: Market =

        pressure.goalProbability >= 78
          ? 'OVER_2_5'
          : 'OVER_1_5';

      const reasons = [

        'Fallback AI mode',

        ...(pressure.reasons || [])
      ];

      if (
        chaos.insaneMatch
      ) {

        reasons.push(
          'Partida extremamente caótica'
        );

        market =
          'OVER_2_5';

        confidence += 3;
      }

      confidence =
        Math.min(
          95,
          confidence
        );

      const fairOdd =
        100 / confidence;

      const risk =
        100 - confidence;

      const edge =
        confidence - risk;

      return {

        homeTeam:
          match.homeTeam,

        awayTeam:
          match.awayTeam,

        winner,

        prediction,

        confidence:
          this.toFixed(
            confidence
          ),

        fairOdd:
          this.toFixed(
            fairOdd
          ),

        risk:
          this.toFixed(
            risk
          ),

        edge:
          this.toFixed(
            edge
          ),

        recommendation:

          confidence >= 78
            ? 'STRONG BET'
            : confidence >= 65
              ? 'GOOD BET'
              : 'RISKY BET',

        market,

        expectedGoalsHome:
          this.toFixed(
            pressure.homePressure / 45
          ),

        expectedGoalsAway:
          this.toFixed(
            pressure.awayPressure / 45
          ),

        matchIntensity:
          pressure.intensity,

        chaosIndex:
          this.toFixed(
            chaos.chaosIndex
          ),

        reasons,

        pressure
      };
    }

    // ======================================
    // REAL AI SCORE
    // ======================================

    let homeScore = 0;
    let awayScore = 0;

    const reasons: string[] = [];

    // ======================================
    // OFFENSE
    // ======================================

    homeScore +=
      this.safe(
        home.offensiveStrength
      ) * weights.offense;

    awayScore +=
      this.safe(
        away.offensiveStrength
      ) * weights.offense;

    // ======================================
    // DEFENSE
    // ======================================

    homeScore +=
      this.safe(
        home.defensiveStrength
      ) * weights.defense;

    awayScore +=
      this.safe(
        away.defensiveStrength
      ) * weights.defense;

    // ======================================
    // FORM
    // ======================================

    homeScore +=
      this.safe(
        home.formScore
      ) * weights.form;

    awayScore +=
      this.safe(
        away.formScore
      ) * weights.form;

    // ======================================
    // MOMENTUM
    // ======================================

    homeScore +=
      this.safe(
        home.momentum
      ) * weights.momentum;

    awayScore +=
      this.safe(
        away.momentum
      ) * weights.momentum;

    // ======================================
    // PRESSURE
    // ======================================

    homeScore +=
      pressure.homePressure *
      weights.pressure;

    awayScore +=
      pressure.awayPressure *
      weights.pressure;

    // ======================================
    // HOME ADVANTAGE
    // ======================================

    homeScore += 4;

    // ======================================
    // DNA
    // ======================================

    homeScore +=
      homeDNA.offensiveDNA * 0.4;

    awayScore +=
      awayDNA.offensiveDNA * 0.4;

    homeScore +=
      homeDNA.emotionalStability * 0.25;

    awayScore +=
      awayDNA.emotionalStability * 0.25;

    homeScore +=
      homeDNA.dominance * 0.3;

    awayScore +=
      awayDNA.dominance * 0.3;

    // ======================================
    // COLLAPSE
    // ======================================

    if (
      awayCollapse.dangerous
    ) {

      reasons.push(
        `${match.awayTeam} risco de colapso`
      );

      homeScore += 10;
    }

    if (
      homeCollapse.dangerous
    ) {

      reasons.push(
        `${match.homeTeam} risco de colapso`
      );

      awayScore += 10;
    }

    // ======================================
    // COMEBACK
    // ======================================

    if (
      homeComeback.eliteComeback
    ) {

      reasons.push(
        `${match.homeTeam} forte reação`
      );

      homeScore += 5;
    }

    if (
      awayComeback.eliteComeback
    ) {

      reasons.push(
        `${match.awayTeam} forte reação`
      );

      awayScore += 5;
    }

    // ======================================
    // CHAOS
    // ======================================

    if (
      chaos.insaneMatch
    ) {

      reasons.push(
        'Jogo extremamente caótico'
      );
    }

    // ======================================
    // NORMALIZE
    // ======================================

    homeScore =
      this.normalizeScore(
        homeScore
      );

    awayScore =
      this.normalizeScore(
        awayScore
      );

    // ======================================
    // DIFF
    // ======================================

    const diff =
      Math.abs(
        homeScore -
        awayScore
      );

    // ======================================
    // PREDICTION
    // ======================================

    let prediction:
      FootballPrediction['prediction'];

    if (
      diff < 12
    ) {

      prediction =
        'DRAW';

    } else if (
      homeScore >
      awayScore
    ) {

      prediction =
        'HOME';

    } else {

      prediction =
        'AWAY';
    }

    // ======================================
    // WINNER
    // ======================================

    const winner =

      prediction === 'HOME'
        ? match.homeTeam

        : prediction === 'AWAY'
          ? match.awayTeam
          : 'DRAW';

    // ======================================
    // CONFIDENCE
    // ======================================

    let confidence =

      55 +

      (diff * 0.7);

    if (
      prediction === 'DRAW'
    ) {

      confidence -= 8;
    }

    if (
      chaos.insaneMatch
    ) {

      confidence -= 5;
    }

    confidence =
      ConfidenceCalibrator
        .calibrate(
          Math.min(
            95,
            confidence
          )
        );

    confidence =
      Math.max(
        35,
        confidence
      );

    // ======================================
    // FAIR ODD / RISK
    // ======================================

    const fairOdd =
      100 / confidence;

    const risk =
      100 - confidence;

    const edge =
      confidence - risk;

    // ======================================
    // EXPECTED GOALS
    // ======================================

    const expectedGoalsHome =
      this.toFixed(

        (
          (
            this.safe(
              home.averageGoalsScored
            ) * 0.65
          ) +

          (
            this.safe(
              away.averageGoalsConceded
            ) * 0.35
          ) +

          (
            pressure.homePressure / 100
          )
        )
      );

    const expectedGoalsAway =
      this.toFixed(

        (
          (
            this.safe(
              away.averageGoalsScored
            ) * 0.65
          ) +

          (
            this.safe(
              home.averageGoalsConceded
            ) * 0.35
          ) +

          (
            pressure.awayPressure / 100
          )
        )
      );

    // ======================================
    // MARKET
    // ======================================

    let market: Market;

    const totalExpectedGoals =
      expectedGoalsHome +
      expectedGoalsAway;

    if (
      totalExpectedGoals >= 3
    ) {

      market =
        'OVER_2_5';

    } else if (
      totalExpectedGoals >= 2
    ) {

      market =
        'OVER_1_5';

    } else if (
      prediction === 'HOME'
    ) {

      market =
        'HOME_WIN';

    } else if (
      prediction === 'AWAY'
    ) {

      market =
        'AWAY_WIN';

    } else {

      market =
        'DRAW';
    }

    // ======================================
    // CHAOS MARKET
    // ======================================

    if (
      chaos.insaneMatch
    ) {

      market =
        'OVER_2_5';
    }

    // ======================================
    // LOW CONFIDENCE FILTER
    // ======================================

    if (
      confidence < 52
    ) {

      market =
        'LOW_CONFIDENCE';
    }

    // ======================================
    // RECOMMENDATION
    // ======================================

    let recommendation =
      'RISKY BET';

    if (
      confidence >= 82 &&
      risk <= 18
    ) {

      recommendation =
        'STRONG BET';

    } else if (
      confidence >= 68
    ) {

      recommendation =
        'GOOD BET';
    }

    // ======================================
    // EXTRA REASONS
    // ======================================

    if (
      pressure.dangerous
    ) {

      reasons.push(
        'Alta pressão ofensiva'
      );
    }

    if (
      pressure.momentumShift
    ) {

      reasons.push(
        'Mudança de momentum'
      );
    }

    if (
      totalExpectedGoals >= 3
    ) {

      reasons.push(
        'Alta expectativa de gols'
      );
    }

    // ======================================
    // RESULT
    // ======================================

    return {

      homeTeam:
        match.homeTeam,

      awayTeam:
        match.awayTeam,

      winner,

      prediction,

      confidence:
        this.toFixed(
          confidence
        ),

      fairOdd:
        this.toFixed(
          fairOdd
        ),

      risk:
        this.toFixed(
          risk
        ),

      edge:
        this.toFixed(
          edge
        ),

      recommendation,

      market,

      expectedGoalsHome,

      expectedGoalsAway,

      matchIntensity:
        pressure.intensity,

      chaosIndex:
        this.toFixed(
          chaos.chaosIndex
        ),

      reasons: [

        ...new Set([
          ...reasons,
          ...(pressure.reasons || [])
        ])
      ],

      pressure
    };
  }

  // ======================================
  // MULTI
  // ======================================

  static predict(
    matches: FootballMatch[]
  ): FootballPrediction[] {

    if (
      !Array.isArray(matches)
    ) {

      return [];
    }

    return matches

      .map(match =>
        this.single(match)
      )

      .sort(
        (a, b) =>
          b.confidence -
          a.confidence
      );
  }
}

// ======================================
// SINGLETON
// ======================================

export const footballPredictionEngine =
  new FootballPredictionEngine();