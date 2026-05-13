// src/modules/football/football.prediction.engine.ts

import { footballTeamMemory } from './football.team.memory';

import {
  LivePressureEngine
} from '../../modules/football-ai/engines/live-pressure.engine';

import type {
  PressureAnalysis
} from '../../modules/football-ai/engines/live-pressure.engine';

import type {
  FootballMatch
} from './football.provider';

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

  market:
    | 'HOME_WIN'
    | 'AWAY_WIN'
    | 'DRAW'
    | 'OVER_1_5'
    | 'OVER_2_5'
    | 'LOW_CONFIDENCE';

  reasons: string[];

  pressure?: PressureAnalysis;

  timeline?: any;
};

// ======================================
// ENGINE
// ======================================

export class FootballPredictionEngine {

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
    // 🧠 LIVE PRESSURE
    // ======================================

    const pressure =
      LivePressureEngine.analyze(
        match
      );

    // ======================================
    // 🧠 DYNAMIC WEIGHTS
    // ======================================

    const weights =
      weightOptimizer.getWeights();

    // ======================================
    // 🧬 MATCH DNA
    // ======================================

    const {
      homeDNA,
      awayDNA
    } = MatchDNAEngine.build(
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
    // 🛟 FALLBACK MODE
    // ======================================

    if (!home || !away) {

      let randomConfidence =
        Number(
          (
            55 + Math.random() * 25
          ).toFixed(2)
        );

      randomConfidence =
        ConfidenceCalibrator
          .calibrate(
            randomConfidence
          );

      const homeAdvantage =
        pressure.homePressure >
        pressure.awayPressure;

      const winner =
        homeAdvantage
          ? match.homeTeam
          : match.awayTeam;

      let market:
        | 'HOME_WIN'
        | 'AWAY_WIN'
        | 'DRAW'
        | 'OVER_1_5'
        | 'OVER_2_5'
        | 'LOW_CONFIDENCE';

      market =
        pressure.goalProbability >= 75
          ? 'OVER_2_5'
          : 'OVER_1_5';

      const reasons = [
        'Fallback AI prediction',
        'Live pressure analysis',
        ...pressure.reasons,
      ];

      // ======================================
      // 🔥 CHAOS DETECTION
      // ======================================

      if (chaos.insaneMatch) {

        reasons.push(
          'Partida extremamente caótica'
        );

        market = 'OVER_2_5';
      }

      // ======================================
      // 💥 COLLAPSE
      // ======================================

      if (
        awayCollapse.dangerous
      ) {

        reasons.push(
          `${match.awayTeam} pode colapsar`
        );
      }

      if (
        homeCollapse.dangerous
      ) {

        reasons.push(
          `${match.homeTeam} pode colapsar`
        );
      }

      // ======================================
      // 🔄 COMEBACK
      // ======================================

      if (
        homeComeback.eliteComeback
      ) {

        reasons.push(
          `${match.homeTeam} possui forte tendência de reação`
        );
      }

      if (
        awayComeback.eliteComeback
      ) {

        reasons.push(
          `${match.awayTeam} possui forte tendência de reação`
        );
      }

      return {

        homeTeam:
          match.homeTeam,

        awayTeam:
          match.awayTeam,

        winner,

        prediction:
          homeAdvantage
            ? 'HOME'
            : 'AWAY',

        confidence:
          randomConfidence,

        fairOdd:
          Number(
            (
              100 /
              randomConfidence
            ).toFixed(2)
          ),

        risk:
          Number(
            (
              100 -
              randomConfidence
            ).toFixed(2)
          ),

        edge:
          Number(
            (
              randomConfidence - 50
            ).toFixed(2)
          ),

        recommendation:
          randomConfidence >= 70
            ? 'GOOD BET'
            : 'RISKY BET',

        market,

        reasons,

        pressure,
      };
    }

    // ======================================
    // REAL AI
    // ======================================

    let homeScore = 0;
    let awayScore = 0;

    const reasons: string[] = [];

    // ======================================
    // OFFENSE
    // ======================================

    homeScore +=
      (home.offensiveStrength || 0) *
      weights.offense;

    awayScore +=
      (away.offensiveStrength || 0) *
      weights.offense;

    // ======================================
    // DEFENSE
    // ======================================

    homeScore +=
      (home.defensiveStrength || 0) *
      weights.defense;

    awayScore +=
      (away.defensiveStrength || 0) *
      weights.defense;

    // ======================================
    // FORM
    // ======================================

    homeScore +=
      (home.formScore || 0) *
      weights.form;

    awayScore +=
      (away.formScore || 0) *
      weights.form;

    // ======================================
    // MOMENTUM
    // ======================================

    homeScore +=
      (home.momentum || 0) *
      weights.momentum;

    awayScore +=
      (away.momentum || 0) *
      weights.momentum;

    // ======================================
    // LIVE PRESSURE
    // ======================================

    homeScore +=
      pressure.homePressure *
      weights.pressure;

    awayScore +=
      pressure.awayPressure *
      weights.pressure;

    // ======================================
    // 🧬 DNA BOOSTS
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
    // 💥 COLLAPSE DETECTION
    // ======================================

    if (
      awayCollapse.dangerous
    ) {

      reasons.push(
        `${match.awayTeam} pode colapsar`
      );

      homeScore += 15;
    }

    if (
      homeCollapse.dangerous
    ) {

      reasons.push(
        `${match.homeTeam} pode colapsar`
      );

      awayScore += 15;
    }

    // ======================================
    // 🔄 COMEBACK ENGINE
    // ======================================

    if (
      homeComeback.eliteComeback
    ) {

      reasons.push(
        `${match.homeTeam} possui forte tendência de virada`
      );

      homeScore += 8;
    }

    if (
      awayComeback.eliteComeback
    ) {

      reasons.push(
        `${match.awayTeam} possui forte tendência de virada`
      );

      awayScore += 8;
    }

    // ======================================
    // REASONS
    // ======================================

    if (
      pressure.dominantTeam ===
      match.homeTeam
    ) {

      reasons.push(
        `${match.homeTeam} domina a partida`
      );
    }

    if (
      pressure.dominantTeam ===
      match.awayTeam
    ) {

      reasons.push(
        `${match.awayTeam} domina a partida`
      );
    }

    if (
      pressure.goalProbability >= 75
    ) {

      reasons.push(
        'Alta chance de gol'
      );
    }

    // ======================================
    // DIFFERENCE
    // ======================================

    const difference =
      Math.abs(
        homeScore - awayScore
      );

    // ======================================
    // PREDICTION
    // ======================================

    let prediction:
      | 'HOME'
      | 'AWAY'
      | 'DRAW';

    if (difference < 15) {

      prediction = 'DRAW';

    } else {

      prediction =
        homeScore > awayScore
          ? 'HOME'
          : 'AWAY';
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
      Math.min(
        95,

        Number(
          (
            60 +
            (
              difference / 2
            )
          ).toFixed(2)
        )
      );

    // ======================================
    // 🧠 CALIBRATION
    // ======================================

    confidence =
      ConfidenceCalibrator
        .calibrate(
          confidence
        );

    // ======================================
    // FAIR ODD
    // ======================================

    const fairOdd =
      Number(
        (
          100 / confidence
        ).toFixed(2)
      );

    // ======================================
    // RISK
    // ======================================

    const risk =
      Number(
        (
          100 - confidence
        ).toFixed(2)
      );

    // ======================================
    // EDGE
    // ======================================

    const edge =
      Number(
        (
          confidence - risk
        ).toFixed(2)
      );

    // ======================================
    // MARKET
    // ======================================

    let market:
      | 'HOME_WIN'
      | 'AWAY_WIN'
      | 'DRAW'
      | 'OVER_1_5'
      | 'OVER_2_5'
      | 'LOW_CONFIDENCE';

    if (
      pressure.goalProbability >= 80
    ) {

      market = 'OVER_2_5';

    } else if (
      pressure.goalProbability >= 65
    ) {

      market = 'OVER_1_5';

    } else {

      market =
        prediction === 'HOME'
          ? 'HOME_WIN'
          : prediction === 'AWAY'
          ? 'AWAY_WIN'
          : 'DRAW';
    }

    // ======================================
    // 🔥 CHAOS DETECTION
    // ======================================

    if (chaos.insaneMatch) {

      reasons.push(
        'Partida extremamente caótica'
      );

      market = 'OVER_2_5';

      confidence =
        Math.min(
          99,
          confidence + 5
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

      confidence,

      fairOdd,

      risk,

      edge,

      recommendation:
        confidence >= 80
          ? 'STRONG BET'
          : confidence >= 65
          ? 'GOOD BET'
          : 'RISKY BET',

      market,

      reasons: [
        ...reasons,
        ...pressure.reasons,
      ],

      pressure,
    };
  }

  // ======================================
  // MULTI
  // ======================================

  static predict(
    matches: FootballMatch[]
  ): FootballPrediction[] {

    return matches.map(match =>
      this.single(match)
    );
  }
}

export const footballPredictionEngine =
  new FootballPredictionEngine();