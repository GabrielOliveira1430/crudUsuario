// src/modules/football-ai/engines/live-pressure.engine.ts

import type {
  FootballMatch
} from '../../football/football.provider';

import {
  footballTeamMemory
} from '../../football/football.team.memory';

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

  pressureDifference: number;

  matchRhythm: number;

  fatigueIndex: number;

  homeMomentum: number;

  awayMomentum: number;

  updatedAt: string;

  // ======================================
  // 🧠 NOVOS CAMPOS
  // ======================================

  homeExpectedGoals?: number;

  awayExpectedGoals?: number;

  tempoIndex?: number;

  emotionalPressure?: number;

  collapseRiskHome?: number;

  collapseRiskAway?: number;
};

// ======================================
// ENGINE
// ======================================

export class LivePressureEngine {

  // ======================================
  // NORMALIZE
  // ======================================

  private static normalize(
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
  // SAFE
  // ======================================

  private static safe(
    value: number,
    fallback = 0
  ) {

    if (
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
    match: FootballMatch
  ): PressureAnalysis {

    const reasons: string[] = [];

    const minute =
      Number(
        match.minute ?? 1
      );

    const homeGoals =
      Number(
        match.homeScore ?? 0
      );

    const awayGoals =
      Number(
        match.awayScore ?? 0
      );

    // ======================================
    // TEAM MEMORY
    // ======================================

    const homeMemory =
      footballTeamMemory.get(
        match.homeTeam
      );

    const awayMemory =
      footballTeamMemory.get(
        match.awayTeam
      );

    // ======================================
    // BASE PRESSURE
    // ======================================

    let homePressure =

      (
        (homeMemory?.offensiveStrength ?? 50) * 0.35 +

        (homeMemory?.momentum ?? 50) * 0.25 +

        (homeMemory?.formScore ?? 50) * 0.2 +

        (
          (
            homeMemory?.averageGoalsScored ?? 1
          ) * 10
        )
      );

    let awayPressure =

      (
        (awayMemory?.offensiveStrength ?? 50) * 0.35 +

        (awayMemory?.momentum ?? 50) * 0.25 +

        (awayMemory?.formScore ?? 50) * 0.2 +

        (
          (
            awayMemory?.averageGoalsScored ?? 1
          ) * 10
        )
      );

    // ======================================
    // LOSING BOOST
    // ======================================

    if (
      homeGoals <
      awayGoals
    ) {

      homePressure += 18;

      reasons.push(
        `${match.homeTeam} pressiona atrás do placar`
      );
    }

    if (
      awayGoals <
      homeGoals
    ) {

      awayPressure += 18;

      reasons.push(
        `${match.awayTeam} pressiona atrás do placar`
      );
    }

    // ======================================
    // DRAW MODE
    // ======================================

    if (
      homeGoals ===
      awayGoals
    ) {

      homePressure += 6;
      awayPressure += 6;

      reasons.push(
        'Empate aumenta agressividade'
      );
    }

    // ======================================
    // FINAL GAME BOOST
    // ======================================

    if (minute >= 70) {

      homePressure += 10;
      awayPressure += 10;

      reasons.push(
        'Alta intensidade final'
      );
    }

    if (minute >= 85) {

      homePressure += 8;
      awayPressure += 8;

      reasons.push(
        'Fase crítica da partida'
      );
    }

    // ======================================
    // CLEAN SHEETS
    // ======================================

    if (
      (homeMemory?.cleanSheets ?? 0) >

      (homeMemory?.matches ?? 1) * 0.4
    ) {

      awayPressure -= 5;
    }

    if (
      (awayMemory?.cleanSheets ?? 0) >

      (awayMemory?.matches ?? 1) * 0.4
    ) {

      homePressure -= 5;
    }

    // ======================================
    // FAILED TO SCORE
    // ======================================

    if (
      (homeMemory?.failedToScore ?? 0) >

      (homeMemory?.matches ?? 1) * 0.35
    ) {

      homePressure -= 6;
    }

    if (
      (awayMemory?.failedToScore ?? 0) >

      (awayMemory?.matches ?? 1) * 0.35
    ) {

      awayPressure -= 6;
    }

    // ======================================
    // SAFE LIMITS
    // ======================================

    homePressure =
      this.normalize(
        homePressure
      );

    awayPressure =
      this.normalize(
        awayPressure
      );

    // ======================================
    // PRESSURE DIFFERENCE
    // ======================================

    const pressureDifference =
      Number(
        Math.abs(
          homePressure -
          awayPressure
        ).toFixed(2)
      );

    // ======================================
    // DOMINANT TEAM
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
      awayPressure + 8
    ) {

      dominantTeam =
        match.homeTeam;

      attackingSide =
        'HOME';
    }

    else if (
      awayPressure >
      homePressure + 8
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
      'BALANCED';

    if (
      homePressure >
      awayPressure
    ) {

      nextGoalTeam =
        match.homeTeam;
    }

    else if (
      awayPressure >
      homePressure
    ) {

      nextGoalTeam =
        match.awayTeam;
    }

    // ======================================
    // MATCH RHYTHM
    // ======================================

    const matchRhythm =
      this.normalize(

        (
          homePressure +
          awayPressure
        ) / 2
      );

    // ======================================
    // FATIGUE
    // ======================================

    const fatigueIndex =
      this.normalize(

        minute * 1.1,

        0,
        100
      );

    // ======================================
    // GOAL PROBABILITY
    // ======================================

    let goalProbability =

      (
        matchRhythm * 0.65 +

        pressureDifference * 0.35
      );

    if (

      homeGoals +
      awayGoals >= 3

    ) {

      goalProbability += 6;

      reasons.push(
        'Jogo aberto ofensivamente'
      );
    }

    if (
      matchRhythm >= 75
    ) {

      goalProbability += 5;
    }

    goalProbability =
      this.normalize(
        goalProbability,
        5,
        95
      );

    // ======================================
    // INTENSITY
    // ======================================

    let intensity:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'EXTREME';

    if (
      goalProbability >= 85
    ) {

      intensity =
        'EXTREME';
    }

    else if (
      goalProbability >= 70
    ) {

      intensity =
        'HIGH';
    }

    else if (
      goalProbability >= 55
    ) {

      intensity =
        'MEDIUM';
    }

    else {

      intensity =
        'LOW';
    }

    // ======================================
    // MOMENTUM SHIFT
    // ======================================

    const momentumShift =

      pressureDifference >= 22;

    if (
      momentumShift
    ) {

      reasons.push(
        'Mudança forte de momentum'
      );
    }

    // ======================================
    // DANGEROUS
    // ======================================

    const dangerous =

      goalProbability >= 75;

    if (
      dangerous
    ) {

      reasons.push(
        'Alta probabilidade de gol'
      );
    }

    // ======================================
    // CONFIDENCE
    // ======================================

    const confidence =
      this.normalize(

        (
          goalProbability * 0.6 +

          pressureDifference * 0.4
        ),

        45,
        95
      );

    // ======================================
    // LOW INTENSITY
    // ======================================

    if (
      goalProbability <= 40
    ) {

      reasons.push(
        'Partida lenta'
      );
    }

    // ======================================
    // EXPECTED GOALS
    // ======================================

    const homeExpectedGoals =
      Number(
        (
          (
            (homeMemory?.averageGoalsScored ?? 1) * 0.65
          ) +

          (
            (awayMemory?.averageGoalsConceded ?? 1) * 0.35
          ) +

          (
            homePressure / 100
          )
        ).toFixed(2)
      );

    const awayExpectedGoals =
      Number(
        (
          (
            (awayMemory?.averageGoalsScored ?? 1) * 0.65
          ) +

          (
            (homeMemory?.averageGoalsConceded ?? 1) * 0.35
          ) +

          (
            awayPressure / 100
          )
        ).toFixed(2)
      );

    // ======================================
    // TEMPO INDEX
    // ======================================

    const tempoIndex =
      this.normalize(

        (
          matchRhythm * 0.5 +

          goalProbability * 0.3 +

          pressureDifference * 0.2
        )
      );

    // ======================================
    // EMOTIONAL PRESSURE
    // ======================================

    const emotionalPressure =
      this.normalize(

        (
          pressureDifference * 0.5 +

          fatigueIndex * 0.3 +

          goalProbability * 0.2
        )
      );

    // ======================================
    // COLLAPSE RISK
    // ======================================

    const collapseRiskHome =
      this.normalize(

        (
          fatigueIndex * 0.45 +

          (
            awayPressure -
            homePressure
          ) * 0.55
        ),

        0,
        100
      );

    const collapseRiskAway =
      this.normalize(

        (
          fatigueIndex * 0.45 +

          (
            homePressure -
            awayPressure
          ) * 0.55
        ),

        0,
        100
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

      pressureDifference,

      matchRhythm,

      fatigueIndex,

      homeMomentum:
        Number(
          (
            homeMemory?.momentum ?? 50
          ).toFixed(2)
        ),

      awayMomentum:
        Number(
          (
            awayMemory?.momentum ?? 50
          ).toFixed(2)
        ),

      updatedAt:
        new Date().toISOString(),

      homeExpectedGoals:
        this.safe(
          homeExpectedGoals
        ),

      awayExpectedGoals:
        this.safe(
          awayExpectedGoals
        ),

      tempoIndex:
        this.safe(
          tempoIndex
        ),

      emotionalPressure:
        this.safe(
          emotionalPressure
        ),

      collapseRiskHome:
        this.safe(
          collapseRiskHome
        ),

      collapseRiskAway:
        this.safe(
          collapseRiskAway
        )
    };
  }

  // ======================================
  // MULTI
  // ======================================

  static analyzeMany(
    matches: FootballMatch[]
  ) {

    return matches.map(
      m => this.analyze(m)
    );
  }
}

// ======================================
// SINGLETON
// ======================================

export const livePressureEngine =
  new LivePressureEngine();