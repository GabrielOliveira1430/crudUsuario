import { footballTeamMemory } from './football.team.memory';

import type { PressureAnalysis } from './football.live-pressure.engine';
import type { FootballMatch } from './football.provider';

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

  prediction: 'HOME' | 'AWAY' | 'DRAW';

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
};

// ======================================
// ENGINE
// ======================================

export class FootballPredictionEngine {

  // ======================================
  // SINGLE MATCH
  // ======================================

  static single(
    input: FootballPredictionInput
  ): FootballPrediction {

    const home =
      footballTeamMemory.get(input.homeTeam);

    const away =
      footballTeamMemory.get(input.awayTeam);

    // ======================================
    // NO DATA SAFE
    // ======================================

    if (!home || !away) {
      return {
        homeTeam: input.homeTeam,
        awayTeam: input.awayTeam,

        winner: 'DRAW',
        prediction: 'DRAW',

        confidence: 0,
        fairOdd: 0,

        risk: 100,
        edge: 0,

        recommendation: 'NO DATA',

        market: 'LOW_CONFIDENCE',

        reasons: ['Insufficient data'],
      };
    }

    let homeScore = 0;
    let awayScore = 0;

    const reasons: string[] = [];

    // ======================================
    // SAFE STATS ADD
    // ======================================

    homeScore += home.offensiveStrength || 0;
    awayScore += away.offensiveStrength || 0;

    homeScore += home.defensiveStrength || 0;
    awayScore += away.defensiveStrength || 0;

    homeScore += home.formScore || 0;
    awayScore += away.formScore || 0;

    homeScore += (home.momentum || 0) * 2;
    awayScore += (away.momentum || 0) * 2;

    homeScore += home.consistency || 0;
    awayScore += away.consistency || 0;

    // ======================================
    // PRESSURE
    // ======================================

    if (input.pressure) {

      if (input.pressure.recommendation === 'HOME_PRESSURE') {
        homeScore += 25;
        reasons.push('Strong home pressure');
      }

      if (input.pressure.recommendation === 'AWAY_PRESSURE') {
        awayScore += 25;
        reasons.push('Strong away pressure');
      }
    }

    // ======================================
    // DIFFERENCE
    // ======================================

    const difference =
      Math.abs(homeScore - awayScore);

    // ======================================
    // PREDICTION
    // ======================================

    let prediction: 'HOME' | 'AWAY' | 'DRAW';

    if (difference < 15) {
      prediction = 'DRAW';
    } else {
      prediction = homeScore > awayScore ? 'HOME' : 'AWAY';
    }

    const winner =
      prediction === 'HOME'
        ? input.homeTeam
        : prediction === 'AWAY'
        ? input.awayTeam
        : 'DRAW';

    // ======================================
    // CONFIDENCE
    // ======================================

    const confidence = Math.min(
      100,
      Number((50 + difference / 2).toFixed(2))
    );

    const fairOdd = Number((100 / Math.max(confidence, 1)).toFixed(2));

    const risk = Number((100 - confidence).toFixed(2));

    const edge = Number((confidence - risk).toFixed(2));

    // ======================================
    // MARKET SAFE
    // ======================================

    const avgGoals =
      (home.averageGoalsScored || 0) +
      (away.averageGoalsScored || 0);

    let market: FootballPrediction['market'];

    if (confidence < 55) {
      market = 'LOW_CONFIDENCE';

    } else if (avgGoals >= 3) {
      market = 'OVER_2_5';
      reasons.push('High goal average');

    } else if (avgGoals >= 2) {
      market = 'OVER_1_5';
      reasons.push('Moderate goal average');

    } else {
      market =
        prediction === 'HOME'
          ? 'HOME_WIN'
          : prediction === 'AWAY'
          ? 'AWAY_WIN'
          : 'DRAW';
    }

    // ======================================
    // EXTRA REASONS
    // ======================================

    if ((home.momentum || 0) > (away.momentum || 0)) {
      reasons.push(`${home.team} better momentum`);
    }

    if ((away.defensiveStrength || 0) < 40) {
      reasons.push(`${away.team} weak defense`);
    }

    // ======================================
    // RECOMMENDATION
    // ======================================

    const recommendation =
      confidence >= 80
        ? 'STRONG BET'
        : confidence >= 65
        ? 'GOOD BET'
        : confidence >= 55
        ? 'RISKY BET'
        : 'AVOID';

    // ======================================
    // RETURN
    // ======================================

    return {
      homeTeam: input.homeTeam,
      awayTeam: input.awayTeam,

      winner,
      prediction,

      confidence,
      fairOdd,

      risk,
      edge,

      recommendation,
      market,

      reasons,
    };
  }

  // ======================================
  // MULTI MATCH
  // ======================================

  static predict(
    matches: FootballMatch[]
  ): FootballPrediction[] {

    return matches.map(match =>
      FootballPredictionEngine.single({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
      })
    );
  }
}

// ======================================
// OPTIONAL INSTANCE (SAFE)
// ======================================

export const footballPredictionEngine =
  new FootballPredictionEngine();