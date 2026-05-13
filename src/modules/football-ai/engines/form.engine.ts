// src/modules/football-ai/engines/form.engine.ts

import type {
  FootballMatch
} from '../../football/football.provider';

import type {
  TeamStats
} from '../../football/football.analytics';

// ======================================
// TYPES
// ======================================

export type TeamForm = {

  team: string;

  matches: number;

  formScore: number;

  momentum: number;

  offensiveStrength: number;

  defensiveStrength: number;

  consistency: number;

  averageGoals: number;

  averageConceded: number;

  cleanSheets: number;

  failedToScore: number;

  recentForm: string[];
};

// ======================================
// ENGINE
// ======================================

export class FormEngine {

  // ======================================
  // 🧠 MEMORY
  // ======================================

  private static memory =
    new Map<string, TeamForm>();

  // ======================================
  // 📊 CALCULATE
  // ======================================

  static calculate(
    matches: FootballMatch[]
  ): TeamForm[] {

    const map =
      new Map<string, TeamForm>();

    // ======================================
    // CREATE TEAM
    // ======================================

    function createTeam(
      team: string
    ): TeamForm {

      return {

        team,

        matches: 0,

        formScore: 0,

        momentum: 0,

        offensiveStrength: 0,

        defensiveStrength: 0,

        consistency: 0,

        averageGoals: 0,

        averageConceded: 0,

        cleanSheets: 0,

        failedToScore: 0,

        recentForm: []
      };
    }

    // ======================================
    // PROCESS MATCHES
    // ======================================

    for (const match of matches) {

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

      const homeData =
        map.get(home)!;

      const awayData =
        map.get(away)!;

      const homeGoals =
        Number(match.homeScore || 0);

      const awayGoals =
        Number(match.awayScore || 0);

      // ======================================
      // MATCHES
      // ======================================

      homeData.matches++;
      awayData.matches++;

      // ======================================
      // GOALS
      // ======================================

      homeData.averageGoals +=
        homeGoals;

      awayData.averageGoals +=
        awayGoals;

      homeData.averageConceded +=
        awayGoals;

      awayData.averageConceded +=
        homeGoals;

      // ======================================
      // CLEAN SHEETS
      // ======================================

      if (awayGoals === 0) {
        homeData.cleanSheets++;
      }

      if (homeGoals === 0) {
        awayData.cleanSheets++;
      }

      // ======================================
      // FAILED TO SCORE
      // ======================================

      if (homeGoals === 0) {
        homeData.failedToScore++;
      }

      if (awayGoals === 0) {
        awayData.failedToScore++;
      }

      // ======================================
      // RESULT
      // ======================================

      if (homeGoals > awayGoals) {

        homeData.recentForm.push('W');
        awayData.recentForm.push('L');

        homeData.formScore += 3;

      } else if (awayGoals > homeGoals) {

        awayData.recentForm.push('W');
        homeData.recentForm.push('L');

        awayData.formScore += 3;

      } else {

        homeData.recentForm.push('D');
        awayData.recentForm.push('D');

        homeData.formScore += 1;
        awayData.formScore += 1;
      }
    }

    // ======================================
    // FINALIZE
    // ======================================

    const result =
      Array.from(map.values());

    result.forEach(team => {

      const matches =
        Math.max(1, team.matches);

      // ======================================
      // AVERAGES
      // ======================================

      team.averageGoals =
        Number(
          (
            team.averageGoals /
            matches
          ).toFixed(2)
        );

      team.averageConceded =
        Number(
          (
            team.averageConceded /
            matches
          ).toFixed(2)
        );

      // ======================================
      // OFFENSE
      // ======================================

      team.offensiveStrength =
        Number(
          (
            team.averageGoals * 25
          ).toFixed(2)
        );

      // ======================================
      // DEFENSE
      // ======================================

      team.defensiveStrength =
        Number(
          (
            Math.max(
              0,
              100 -
              (
                team.averageConceded * 20
              )
            )
          ).toFixed(2)
        );

      // ======================================
      // LAST FIVE
      // ======================================

      const lastFive =
        team.recentForm.slice(-5);

      // ======================================
      // MOMENTUM
      // ======================================

      let momentum = 0;

      lastFive.forEach(result => {

        if (result === 'W') {
          momentum += 20;
        }

        if (result === 'D') {
          momentum += 10;
        }
      });

      team.momentum =
        Number(
          (
            momentum /
            Math.max(
              1,
              lastFive.length
            )
          ).toFixed(2)
        );

      // ======================================
      // CONSISTENCY
      // ======================================

      const wins =
        lastFive.filter(
          r => r === 'W'
        ).length;

      team.consistency =
        Number(
          (
            (
              wins /
              Math.max(
                1,
                lastFive.length
              )
            ) * 100
          ).toFixed(2)
        );

      // ======================================
      // FORM SCORE
      // ======================================

      team.formScore =
        Number(
          (
            (
              team.formScore /
              (matches * 3)
            ) * 100
          ).toFixed(2)
        );

      // ======================================
      // LIMIT RECENT FORM
      // ======================================

      team.recentForm =
        lastFive;
    });

    // ======================================
    // SORT
    // ======================================

    return result.sort(
      (a, b) =>
        (
          b.formScore +
          b.momentum
        ) -
        (
          a.formScore +
          a.momentum
        )
    );
  }

  // ======================================
  // 🔄 CONVERT ANALYTICS
  // ======================================

  private static fromAnalytics(
    analytics: TeamStats[]
  ): TeamForm[] {

    return analytics.map(team => ({

      team:
        team.team,

      matches:
        team.matches,

      formScore:
        team.performance,

      momentum:
        team.winRate,

      offensiveStrength:
        Number(
          (
            team.averageGoals * 25
          ).toFixed(2)
        ),

      defensiveStrength:
        Number(
          (
            Math.max(
              0,
              100 -
              (
                (
                  team.conceded /
                  Math.max(1, team.matches)
                ) * 20
              )
            )
          ).toFixed(2)
        ),

      consistency:
        team.winRate,

      averageGoals:
        team.averageGoals,

      averageConceded:
        Number(
          (
            team.conceded /
            Math.max(1, team.matches)
          ).toFixed(2)
        ),

      cleanSheets:
        team.cleanSheets,

      failedToScore:
        team.failedToScore,

      recentForm:
        team.form
    }));
  }

  // ======================================
  // 🧠 UPDATE MEMORY
  // ======================================

  static update(
    data:
      TeamForm[] |
      FootballMatch[] |
      TeamStats[]
  ) {

    // ======================================
    // EMPTY
    // ======================================

    if (!data.length) {
      return;
    }

    // ======================================
    // CASE 1:
    // MATCHES
    // ======================================

    if ('homeTeam' in data[0]) {

      const forms =
        this.calculate(
          data as FootballMatch[]
        );

      forms.forEach(form => {

        this.memory.set(
          form.team,
          form
        );
      });

      console.log(
        `🧠 FormEngine calculado: ${forms.length} times`
      );

      return;
    }

    // ======================================
    // CASE 2:
    // ANALYTICS
    // ======================================

    if (
      'performance' in data[0]
    ) {

      const forms =
        this.fromAnalytics(
          data as TeamStats[]
        );

      forms.forEach(form => {

        this.memory.set(
          form.team,
          form
        );
      });

      console.log(
        `🧠 FormEngine analytics: ${forms.length} times`
      );

      return;
    }

    // ======================================
    // CASE 3:
    // FORMS
    // ======================================

    const forms =
      data as TeamForm[];

    forms.forEach(form => {

      this.memory.set(
        form.team,
        form
      );
    });

    console.log(
      `🧠 FormEngine atualizado: ${forms.length} times`
    );
  }

  // ======================================
  // 🔍 GET TEAM
  // ======================================

  static get(
    team: string
  ) {

    return this.memory.get(team);
  }

  // ======================================
  // 📦 GET ALL
  // ======================================

  static getAll() {

    return Array.from(
      this.memory.values()
    );
  }

  // ======================================
  // 🧹 CLEAR
  // ======================================

  static clear() {

    this.memory.clear();

    console.log(
      '🧹 FormEngine limpo'
    );
  }
}