// src/modules/football/football.analytics.ts

import {
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

  performance: number;

  form: string[];

  cleanSheets: number;

  failedToScore: number;
};


// ==========================================
// ⚽ FOOTBALL ANALYTICS
// ==========================================

export class FootballAnalytics {

  // ==========================================
  // 📊 ANALYZE TEAMS
  // ==========================================

  static analyze(
    matches: FootballMatch[]
  ): TeamStats[] {

    const map =
      new Map<string, TeamStats>();


    // ==========================================
    // 🧠 CREATE TEAM
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

        performance: 0,

        form: [],

        cleanSheets: 0,

        failedToScore: 0
      };
    }


    // ==========================================
    // 🔥 LOOP MATCHES
    // ==========================================

    for (const match of matches) {

      const home = match.homeTeam;
      const away = match.awayTeam;

      if (!map.has(home)) {
        map.set(home, createTeam(home));
      }

      if (!map.has(away)) {
        map.set(away, createTeam(away));
      }

      const homeStats = map.get(home)!;
      const awayStats = map.get(away)!;


      // ==========================================
      // 🚫 IGNORA JOGOS SEM RESULTADO
      // ==========================================

      if (match.status !== 'finished') {
        continue;
      }

      const homeGoals = Number(match.homeScore ?? 0);
      const awayGoals = Number(match.awayScore ?? 0);


      // ==========================================
      // 📊 MATCHES
      // ==========================================

      homeStats.matches++;
      awayStats.matches++;


      // ==========================================
      // ⚽ GOALS
      // ==========================================

      homeStats.goals += homeGoals;
      homeStats.conceded += awayGoals;

      awayStats.goals += awayGoals;
      awayStats.conceded += homeGoals;


      // ==========================================
      // 🧤 CLEAN SHEETS
      // ==========================================

      if (awayGoals === 0) homeStats.cleanSheets++;
      if (homeGoals === 0) awayStats.cleanSheets++;


      // ==========================================
      // 🚫 FAILED TO SCORE
      // ==========================================

      if (homeGoals === 0) homeStats.failedToScore++;
      if (awayGoals === 0) awayStats.failedToScore++;


      // ==========================================
      // 🏆 RESULTADO
      // ==========================================

      if (homeGoals > awayGoals) {

        homeStats.wins++;
        awayStats.losses++;

        homeStats.form.push('W');
        awayStats.form.push('L');

      } else if (awayGoals > homeGoals) {

        awayStats.wins++;
        homeStats.losses++;

        awayStats.form.push('W');
        homeStats.form.push('L');

      } else {

        homeStats.draws++;
        awayStats.draws++;

        homeStats.form.push('D');
        awayStats.form.push('D');
      }
    }


    // ==========================================
    // 📈 FINALIZA ESTATÍSTICAS
    // ==========================================

    const result =
      Array.from(map.values());


    result.forEach(team => {

      team.goalDifference =
        team.goals - team.conceded;

      team.performance = Number(
        (
          ((team.wins * 3 + team.draws) /
            Math.max(1, team.matches * 3)
          ) * 100
        ).toFixed(2)
      );

      // últimos 5 jogos
      team.form = team.form.slice(-5);
    });


    // ==========================================
    // 🏆 ORDERNAR
    // ==========================================

    return result.sort((a, b) => {

      if (b.performance !== a.performance) {
        return b.performance - a.performance;
      }

      return b.goalDifference - a.goalDifference;
    });
  }
}