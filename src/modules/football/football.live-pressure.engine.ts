// src/modules/football/football.live-pressure.engine.ts

// ======================================
// TYPES
// ======================================

export type LiveMatchStats = {

  homeTeam: string;

  awayTeam: string;

  possessionHome: number;
  possessionAway: number;

  shotsHome: number;
  shotsAway: number;

  dangerousAttacksHome: number;
  dangerousAttacksAway: number;

  cornersHome: number;
  cornersAway: number;
};


// ======================================
// PRESSURE RESULT
// ======================================

export type PressureAnalysis = {

  dominantTeam: string;

  homePressure: number;
  awayPressure: number;

  pressureDifference: number;

  intensity: number;

  recommendation:
    | 'HOME_PRESSURE'
    | 'AWAY_PRESSURE'
    | 'BALANCED';
};


// ======================================
// ENGINE
// ======================================

export class FootballLivePressureEngine {

  // ======================================
  // ANALYZE
  // ======================================

  analyze(
    stats: LiveMatchStats
  ): PressureAnalysis {

    // ======================================
    // HOME SCORE
    // ======================================

    const homePressure =

      (
        stats.possessionHome * 0.2
      ) +

      (
        stats.shotsHome * 8
      ) +

      (
        stats.dangerousAttacksHome * 1.5
      ) +

      (
        stats.cornersHome * 3
      );

    // ======================================
    // AWAY SCORE
    // ======================================

    const awayPressure =

      (
        stats.possessionAway * 0.2
      ) +

      (
        stats.shotsAway * 8
      ) +

      (
        stats.dangerousAttacksAway * 1.5
      ) +

      (
        stats.cornersAway * 3
      );

    // ======================================
    // DOMINANT
    // ======================================

    const dominantTeam =

      homePressure >
      awayPressure

        ? stats.homeTeam

        : stats.awayTeam;

    // ======================================
    // DIFFERENCE
    // ======================================

    const pressureDifference =
      Math.abs(
        homePressure -
        awayPressure
      );

    // ======================================
    // INTENSITY
    // ======================================

    const intensity =
      Number(
        (
          (
            homePressure +
            awayPressure
          ) / 2
        ).toFixed(2)
      );

    // ======================================
    // RECOMMENDATION
    // ======================================

    let recommendation:
      PressureAnalysis['recommendation'];

    if (
      pressureDifference < 10
    ) {

      recommendation =
        'BALANCED';

    } else if (
      homePressure >
      awayPressure
    ) {

      recommendation =
        'HOME_PRESSURE';

    } else {

      recommendation =
        'AWAY_PRESSURE';
    }

    // ======================================
    // RETURN
    // ======================================

    return {

      dominantTeam,

      homePressure:
        Number(
          homePressure.toFixed(2)
        ),

      awayPressure:
        Number(
          awayPressure.toFixed(2)
        ),

      pressureDifference:
        Number(
          pressureDifference.toFixed(2)
        ),

      intensity,

      recommendation,
    };
  }
}


// ======================================
// SINGLETON
// ======================================

export const footballLivePressureEngine =
  new FootballLivePressureEngine();