// src/modules/football/football.analytics.ts

import type {
  FootballMatch
} from './football.provider';

// ==========================================
// ⚽ TEAM STATS
// ==========================================

export type TeamStats = {

  team: string;

  matches: number;

  wins: number;

  draws: number;

  losses: number;

  goals: number;

  conceded: number;

  goalDifference: number;

  points: number;

  performance: number;

  form: string[];

  cleanSheets: number;

  failedToScore: number;

  averageGoals: number;

  averageConceded: number;

  winRate: number;

  drawRate: number;

  lossRate: number;

  offensiveRating: number;

  defensiveRating: number;

  consistency: number;

  momentum: number;

  xgScore: number;

  updatedAt: number;
};

// ==========================================
// ⚽ ANALYTICS ENGINE
// ==========================================

export class FootballAnalytics {

  // ==========================================
  // FORM WEIGHT
  // ==========================================

  private static formWeight(
    index: number
  ): number {

    return Math.pow(
      0.82,
      index
    );
  }

  // ==========================================
  // ANALYZE
  // ==========================================

  static analyze(
    matches: FootballMatch[]
  ): TeamStats[] {

    const map =
      new Map<string, TeamStats>();

    // ==========================================
    // CREATE TEAM
    // ==========================================

    function createTeam(
      name: string
    ): TeamStats {

      return {

        team: name,

        matches: 0,

        wins: 0,

        draws: 0,

        losses: 0,

        goals: 0,

        conceded: 0,

        goalDifference: 0,

        points: 0,

        performance: 0,

        form: [],

        cleanSheets: 0,

        failedToScore: 0,

        averageGoals: 0,

        averageConceded: 0,

        winRate: 0,

        drawRate: 0,

        lossRate: 0,

        offensiveRating: 0,

        defensiveRating: 0,

        consistency: 0,

        momentum: 0,

        xgScore: 0,

        updatedAt:
          Date.now()
      };
    }

    // ==========================================
    // LOOP MATCHES
    // ==========================================

    for (const match of matches) {

      // ======================================
      // VALIDATE
      // ======================================

      if (

        match.homeScore === undefined ||

        match.awayScore === undefined

      ) {

        continue;
      }

      const home =
        match.homeTeam;

      const away =
        match.awayTeam;

      if (!map.has(home)) {

        map.set(
          home,
          createTeam(home)
        );
      }

      if (!map.has(away)) {

        map.set(
          away,
          createTeam(away)
        );
      }

      const homeStats =
        map.get(home)!;

      const awayStats =
        map.get(away)!;

      const homeGoals =
        Number(match.homeScore);

      const awayGoals =
        Number(match.awayScore);

      // ======================================
      // MATCHES
      // ======================================

      homeStats.matches++;
      awayStats.matches++;

      // ======================================
      // GOALS
      // ======================================

      homeStats.goals +=
        homeGoals;

      awayStats.goals +=
        awayGoals;

      homeStats.conceded +=
        awayGoals;

      awayStats.conceded +=
        homeGoals;

      // ======================================
      // CLEAN SHEETS
      // ======================================

      if (awayGoals === 0) {
        homeStats.cleanSheets++;
      }

      if (homeGoals === 0) {
        awayStats.cleanSheets++;
      }

      // ======================================
      // FAILED TO SCORE
      // ======================================

      if (homeGoals === 0) {
        homeStats.failedToScore++;
      }

      if (awayGoals === 0) {
        awayStats.failedToScore++;
      }

      // ======================================
      // RESULT
      // ======================================

      if (homeGoals > awayGoals) {

        homeStats.wins++;
        awayStats.losses++;

        homeStats.points += 3;

        homeStats.form.push('W');
        awayStats.form.push('L');

      }

      else if (
        awayGoals > homeGoals
      ) {

        awayStats.wins++;
        homeStats.losses++;

        awayStats.points += 3;

        awayStats.form.push('W');
        homeStats.form.push('L');

      }

      else {

        homeStats.draws++;
        awayStats.draws++;

        homeStats.points += 1;
        awayStats.points += 1;

        homeStats.form.push('D');
        awayStats.form.push('D');
      }
    }

    // ==========================================
    // FINAL CALCULATIONS
    // ==========================================

    const result =
      Array.from(map.values());

    result.forEach(team => {

      const matches =
        Math.max(
          1,
          team.matches
        );

      // ======================================
      // BASIC
      // ======================================

      team.goalDifference =
        team.goals -
        team.conceded;

      // ======================================
      // PERFORMANCE
      // ======================================

      const maxPoints =
        matches * 3;

      const ratio =
        team.points /
        maxPoints;

      team.performance =
        Number(
          (
            ratio * 100
          ).toFixed(2)
        );

      // ======================================
      // GOALS
      // ======================================

      team.averageGoals =
        Number(
          (
            team.goals /
            matches
          ).toFixed(2)
        );

      team.averageConceded =
        Number(
          (
            team.conceded /
            matches
          ).toFixed(2)
        );

      // ======================================
      // RATES
      // ======================================

      team.winRate =
        Number(
          (
            (
              team.wins /
              matches
            ) * 100
          ).toFixed(2)
        );

      team.drawRate =
        Number(
          (
            (
              team.draws /
              matches
            ) * 100
          ).toFixed(2)
        );

      team.lossRate =
        Number(
          (
            (
              team.losses /
              matches
            ) * 100
          ).toFixed(2)
        );

      // ======================================
      // OFFENSIVE RATING
      // ======================================

      team.offensiveRating =
        Number(
          (
            (
              team.averageGoals * 25
            ) +

            (
              team.winRate * 0.35
            )
          ).toFixed(2)
        );

      // ======================================
      // DEFENSIVE RATING
      // ======================================

      team.defensiveRating =
        Number(
          (
            Math.max(
              0,

              100 -

              (
                team.averageConceded * 22
              )
            )
          ).toFixed(2)
        );

      // ======================================
      // CONSISTENCY
      // ======================================

      const recent =
        team.form.slice(-5);

      const wins =
        recent.filter(
          r => r === 'W'
        ).length;

      team.consistency =
        Number(
          (
            (
              wins /
              Math.max(
                1,
                recent.length
              )
            ) * 100
          ).toFixed(2)
        );

      // ======================================
      // MOMENTUM
      // ======================================

      let momentum = 0;

      recent
        .reverse()
        .forEach(
          (
            result,
            index
          ) => {

            const weight =
              this.formWeight(
                index
              );

            if (result === 'W') {
              momentum +=
                100 * weight;
            }

            else if (
              result === 'D'
            ) {

              momentum +=
                50 * weight;
            }
          }
        );

      team.momentum =
        Number(
          (
            momentum /
            Math.max(
              1,
              recent.length
            )
          ).toFixed(2)
        );

      // ======================================
      // XG SCORE ESTIMATION
      // ======================================

      team.xgScore =
        Number(
          (
            (
              team.averageGoals * 0.65
            ) +

            (
              (
                team.goalDifference /
                matches
              ) * 0.35
            )
          ).toFixed(2)
        );

      // ======================================
      // LIMIT FORM
      // ======================================

      team.form =
        recent;

      team.updatedAt =
        Date.now();
    });

    // ==========================================
    // SORT
    // ==========================================

    return result.sort(
      (a, b) => {

        const scoreA =

          (a.performance * 0.45) +

          (a.offensiveRating * 0.2) +

          (a.defensiveRating * 0.2) +

          (a.momentum * 0.15);

        const scoreB =

          (b.performance * 0.45) +

          (b.offensiveRating * 0.2) +

          (b.defensiveRating * 0.2) +

          (b.momentum * 0.15);

        return scoreB - scoreA;
      }
    );
  }
}