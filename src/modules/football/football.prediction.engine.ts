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
    // 🛟 FALLBACK MODE
    // ======================================

    if (!home || !away) {

      const randomConfidence =
        Number(
          (
            55 + Math.random() * 25
          ).toFixed(2)
        );

      const homeAdvantage =
        pressure.homePressure >
        pressure.awayPressure;

      const winner =
        homeAdvantage
          ? match.homeTeam
          : match.awayTeam;

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

        market:
          pressure.goalProbability >= 75
            ? 'OVER_2_5'
            : 'OVER_1_5',

        reasons: [
          'Fallback AI prediction',
          'Live pressure analysis',
          ...pressure.reasons,
        ],

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
      home.offensiveStrength || 0;

    awayScore +=
      away.offensiveStrength || 0;

    // ======================================
    // DEFENSE
    // ======================================

    homeScore +=
      home.defensiveStrength || 0;

    awayScore +=
      away.defensiveStrength || 0;

    // ======================================
    // FORM
    // ======================================

    homeScore +=
      home.formScore || 0;

    awayScore +=
      away.formScore || 0;

    // ======================================
    // MOMENTUM
    // ======================================

    homeScore +=
      (home.momentum || 0) * 2;

    awayScore +=
      (away.momentum || 0) * 2;

    // ======================================
    // LIVE PRESSURE
    // ======================================

    homeScore +=
      pressure.homePressure * 1.5;

    awayScore +=
      pressure.awayPressure * 1.5;

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

    const confidence =
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