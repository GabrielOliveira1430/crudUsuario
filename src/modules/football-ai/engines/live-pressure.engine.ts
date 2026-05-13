// src/modules/football-ai/engines/live-pressure.engine.ts

import type {
  FootballMatch
} from '../../football/football.provider';

// ======================================
// TYPES
// ======================================

export type PressureAnalysis = {

  homeTeam: string;

  awayTeam: string;

  homePressure: number;

  awayPressure: number;

  dominantTeam: string;

  nextGoalTeam: string;

  goalProbability: number;

  intensity:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'EXTREME';

  dangerous: boolean;

  momentumShift: boolean;

  attackingSide:
    | 'HOME'
    | 'AWAY'
    | 'BALANCED';

  confidence: number;

  reasons: string[];
};

// ======================================
// ENGINE
// ======================================

export class LivePressureEngine {

  // ======================================
  // SINGLE MATCH
  // ======================================

  static analyze(
    match: FootballMatch
  ): PressureAnalysis {

    const reasons: string[] = [];

    // ======================================
    // BASE VALUES
    // ======================================

    let homePressure =
      Math.floor(
        40 + Math.random() * 40
      );

    let awayPressure =
      Math.floor(
        40 + Math.random() * 40
      );

    const minute =
      Number(match.minute || 1);

    const homeGoals =
      Number(match.homeScore || 0);

    const awayGoals =
      Number(match.awayScore || 0);

    // ======================================
    // LOSING TEAM PRESSURE
    // ======================================

    if (homeGoals < awayGoals) {

      homePressure += 20;

      reasons.push(
        `${match.homeTeam} está pressionando atrás do placar`
      );
    }

    if (awayGoals < homeGoals) {

      awayPressure += 20;

      reasons.push(
        `${match.awayTeam} está pressionando atrás do placar`
      );
    }

    // ======================================
    // LATE GAME BOOST
    // ======================================

    if (minute >= 70) {

      homePressure += 10;
      awayPressure += 10;

      reasons.push(
        'Alta intensidade no final da partida'
      );
    }

    // ======================================
    // DRAW PRESSURE
    // ======================================

    if (homeGoals === awayGoals) {

      homePressure += 8;
      awayPressure += 8;

      reasons.push(
        'Jogo empatado aumenta agressividade'
      );
    }

    // ======================================
    // LIMITS
    // ======================================

    homePressure =
      Math.min(100, homePressure);

    awayPressure =
      Math.min(100, awayPressure);

    // ======================================
    // DOMINANT
    // ======================================

    let dominantTeam =
      'BALANCED';

    let attackingSide:
      | 'HOME'
      | 'AWAY'
      | 'BALANCED' =
      'BALANCED';

    if (
      homePressure >
      awayPressure + 10
    ) {

      dominantTeam =
        match.homeTeam;

      attackingSide =
        'HOME';
    }

    if (
      awayPressure >
      homePressure + 10
    ) {

      dominantTeam =
        match.awayTeam;

      attackingSide =
        'AWAY';
    }

    // ======================================
    // NEXT GOAL
    // ======================================

    let nextGoalTeam =
      'UNKNOWN';

    if (
      homePressure >
      awayPressure
    ) {

      nextGoalTeam =
        match.homeTeam;

    } else if (
      awayPressure >
      homePressure
    ) {

      nextGoalTeam =
        match.awayTeam;

    } else {

      nextGoalTeam =
        'BALANCED';
    }

    // ======================================
    // GOAL PROBABILITY
    // ======================================

    const goalProbability =
      Math.min(
        95,

        Math.floor(
          (
            homePressure +
            awayPressure
          ) / 2
        )
      );

    // ======================================
    // INTENSITY
    // ======================================

    let intensity:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'EXTREME';

    if (goalProbability >= 85) {

      intensity =
        'EXTREME';

    } else if (
      goalProbability >= 70
    ) {

      intensity =
        'HIGH';

    } else if (
      goalProbability >= 55
    ) {

      intensity =
        'MEDIUM';

    } else {

      intensity =
        'LOW';
    }

    // ======================================
    // MOMENTUM SHIFT
    // ======================================

    const momentumShift =
      Math.abs(
        homePressure -
        awayPressure
      ) >= 25;

    if (momentumShift) {

      reasons.push(
        'Mudança forte de momentum detectada'
      );
    }

    // ======================================
    // DANGEROUS MATCH
    // ======================================

    const dangerous =
      goalProbability >= 75;

    if (dangerous) {

      reasons.push(
        'Alta probabilidade de gol'
      );
    }

    // ======================================
    // CONFIDENCE
    // ======================================

    const confidence =
      Math.min(
        95,

        Math.floor(
          60 +
          (
            Math.abs(
              homePressure -
              awayPressure
            ) / 2
          )
        )
      );

    // ======================================
    // RESULT
    // ======================================

    return {

      homeTeam:
        match.homeTeam,

      awayTeam:
        match.awayTeam,

      homePressure,

      awayPressure,

      dominantTeam,

      nextGoalTeam,

      goalProbability,

      intensity,

      dangerous,

      momentumShift,

      attackingSide,

      confidence,

      reasons,
    };
  }

  // ======================================
  // MULTI MATCHES
  // ======================================

  static analyzeMany(
    matches: FootballMatch[]
  ) {

    return matches.map(match =>
      this.analyze(match)
    );
  }
}

export const livePressureEngine =
  new LivePressureEngine();