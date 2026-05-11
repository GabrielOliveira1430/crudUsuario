// src/modules/football/football.form.engine.ts

// ======================================
// TYPES
// ======================================

export type TeamMatch = {
  homeTeam: string;
  awayTeam: string;

  homeScore: number;
  awayScore: number;

  winner:
    | 'HOME'
    | 'AWAY'
    | 'DRAW';
};

export type TeamFormAnalysis = {
  team: string;

  matches: number;

  wins: number;
  draws: number;
  losses: number;

  goalsScored: number;
  goalsConceded: number;

  averageGoalsScored: number;
  averageGoalsConceded: number;

  offensiveStrength: number;
  defensiveStrength: number;

  formScore: number;

  consistency: number;

  momentum: number;
};


// ======================================
// ENGINE
// ======================================

export class FootballFormEngine {

  // ======================================
  // ANALYZE TEAM
  // ======================================

  analyze(
    team: string,
    matches: TeamMatch[]
  ): TeamFormAnalysis {

    const recentMatches =
      matches.slice(-10);

    let wins = 0;
    let draws = 0;
    let losses = 0;

    let goalsScored = 0;
    let goalsConceded = 0;

    let momentum = 0;

    for (const match of recentMatches) {

      const isHome =
        match.homeTeam === team;

      const scored =
        isHome
          ? match.homeScore
          : match.awayScore;

      const conceded =
        isHome
          ? match.awayScore
          : match.homeScore;

      goalsScored += scored;

      goalsConceded += conceded;

      // ======================================
      // RESULT
      // ======================================

      if (
        (isHome && match.winner === 'HOME') ||
        (!isHome && match.winner === 'AWAY')
      ) {

        wins++;

        momentum += 3;

      } else if (
        match.winner === 'DRAW'
      ) {

        draws++;

        momentum += 1;

      } else {

        losses++;

        momentum -= 2;
      }
    }

    // ======================================
    // TOTAL
    // ======================================

    const total =
      recentMatches.length || 1;

    const averageGoalsScored =
      goalsScored / total;

    const averageGoalsConceded =
      goalsConceded / total;

    // ======================================
    // OFFENSIVE
    // ======================================

    const offensiveStrength =
      Number(
        (
          averageGoalsScored * 20
        ).toFixed(2)
      );

    // ======================================
    // DEFENSIVE
    // ======================================

    const defensiveStrength =
      Number(
        (
          100 -
          (
            averageGoalsConceded * 15
          )
        ).toFixed(2)
      );

    // ======================================
    // FORM SCORE
    // ======================================

    const formScore =
      Number(
        (
          (
            wins * 3 +
            draws -
            losses
          ) * 10
        ).toFixed(2)
      );

    // ======================================
    // CONSISTENCY
    // ======================================

    const consistency =
      Number(
        (
          (
            wins / total
          ) * 100
        ).toFixed(2)
      );

    // ======================================
    // RETURN
    // ======================================

    return {

      team,

      matches: total,

      wins,
      draws,
      losses,

      goalsScored,
      goalsConceded,

      averageGoalsScored:
        Number(
          averageGoalsScored.toFixed(2)
        ),

      averageGoalsConceded:
        Number(
          averageGoalsConceded.toFixed(2)
        ),

      offensiveStrength,

      defensiveStrength,

      formScore,

      consistency,

      momentum,
    };
  }
}


// ======================================
// SINGLETON
// ======================================

export const footballFormEngine =
  new FootballFormEngine();