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

  xG?: number;

  xGA?: number;

  shotsPerGame?: number;

  dangerousAttacks?: number;

  possession?: number;

  updatedAt?: string;
};

// ======================================
// ENGINE
// ======================================

export class FormEngine {

  private static memory =
    new Map<string, TeamForm>();

  // ======================================
  // FORM WEIGHT
  // ======================================

  private static formWeight(
    index: number
  ) {

    return Math.pow(
      0.82,
      index
    );
  }

  // ======================================
  // SAFE NORMALIZE
  // ======================================

  private static normalize(
    value: number,
    min: number,
    max: number
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
  // 📊 CALCULATE
  // ======================================

  static calculate(
    matches: FootballMatch[]
  ): TeamForm[] {

    const map =
      new Map<string, TeamForm>();

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

        recentForm: [],

        xG: 0,

        xGA: 0,

        shotsPerGame: 0,

        dangerousAttacks: 0,

        possession: 50,

        updatedAt:
          new Date().toISOString()
      };
    }

    // ======================================
    // MATCH LOOP
    // ======================================

    for (const match of matches) {

      const home = match.homeTeam;
      const away = match.awayTeam;

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
        Number(
          match.homeScore ?? 0
        );

      const awayGoals =
        Number(
          match.awayScore ?? 0
        );

      homeData.matches++;
      awayData.matches++;

      homeData.averageGoals +=
        homeGoals;

      awayData.averageGoals +=
        awayGoals;

      homeData.averageConceded +=
        awayGoals;

      awayData.averageConceded +=
        homeGoals;

      // ======================================
      // APPROX REALISTIC xG
      // ======================================

      homeData.xG! +=
        (
          homeGoals * 0.7
        ) + 0.8;

      awayData.xG! +=
        (
          awayGoals * 0.7
        ) + 0.8;

      homeData.xGA! +=
        (
          awayGoals * 0.7
        ) + 0.8;

      awayData.xGA! +=
        (
          homeGoals * 0.7
        ) + 0.8;

      // ======================================
      // SHOTS
      // ======================================

      homeData.shotsPerGame! +=
        (
          homeGoals * 2
        ) + 8;

      awayData.shotsPerGame! +=
        (
          awayGoals * 2
        ) + 8;

      // ======================================
      // ATTACKS
      // ======================================

      homeData.dangerousAttacks! +=
        (
          homeGoals * 6
        ) + 20;

      awayData.dangerousAttacks! +=
        (
          awayGoals * 6
        ) + 20;

      // ======================================
      // POSSESSION
      // ======================================

      if (
        homeGoals >
        awayGoals
      ) {

        homeData.possession! += 2;
        awayData.possession! -= 2;
      }

      if (
        awayGoals >
        homeGoals
      ) {

        awayData.possession! += 2;
        homeData.possession! -= 2;
      }

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
      // FORM
      // ======================================

      if (
        homeGoals >
        awayGoals
      ) {

        homeData.recentForm.push('W');

        awayData.recentForm.push('L');

      } else if (
        awayGoals >
        homeGoals
      ) {

        awayData.recentForm.push('W');

        homeData.recentForm.push('L');

      } else {

        homeData.recentForm.push('D');

        awayData.recentForm.push('D');
      }
    }

    // ======================================
    // FINAL CALCULATION
    // ======================================

    const result =
      Array.from(
        map.values()
      );

    result.forEach(team => {

      const matches =
        Math.max(
          1,
          team.matches
        );

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

      team.xG =
        Number(
          (
            (team.xG ?? 0) /
            matches
          ).toFixed(2)
        );

      team.xGA =
        Number(
          (
            (team.xGA ?? 0) /
            matches
          ).toFixed(2)
        );

      team.shotsPerGame =
        Number(
          (
            (team.shotsPerGame ?? 0) /
            matches
          ).toFixed(2)
        );

      team.dangerousAttacks =
        Number(
          (
            (
              team.dangerousAttacks ?? 0
            ) / matches
          ).toFixed(2)
        );

      team.possession =
        this.normalize(
          Number(
            (
              (
                team.possession ?? 50
              ) / matches
            ).toFixed(2)
          ),
          35,
          70
        );

      // ======================================
      // OFFENSE
      // ======================================

      team.offensiveStrength =
        this.normalize(

          (
            (team.averageGoals * 35) +

            ((team.xG ?? 0) * 25) +

            (
              (
                team.shotsPerGame ?? 0
              ) * 1.2
            )
          ),

          0,
          100
        );

      // ======================================
      // DEFENSE
      // ======================================

      team.defensiveStrength =
        this.normalize(

          100 -

          (
            (team.averageConceded * 30) +

            ((team.xGA ?? 0) * 18)
          ),

          0,
          100
        );

      // ======================================
      // MOMENTUM
      // ======================================

      const lastFive =
        team.recentForm.slice(-5);

      let weighted = 0;
      let totalWeight = 0;

      lastFive
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

            totalWeight +=
              weight;

            if (result === 'W') {
              weighted +=
                100 * weight;
            }

            else if (
              result === 'D'
            ) {
              weighted +=
                50 * weight;
            }
          }
        );

      team.momentum =
        Number(
          (
            weighted /
            Math.max(
              1,
              totalWeight
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

      const draws =
        lastFive.filter(
          r => r === 'D'
        ).length;

      team.consistency =
        Number(
          (
            (
              (
                wins +
                (draws * 0.5)
              ) /

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
        this.normalize(

          (
            (team.momentum * 0.4) +

            (team.consistency * 0.25) +

            (team.offensiveStrength * 0.2) +

            (team.defensiveStrength * 0.15)
          ),

          0,
          100
        );

      // ======================================
      // FORM LIMIT
      // ======================================

      team.recentForm =
        lastFive;

      team.updatedAt =
        new Date().toISOString();
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
  // 🧠 UPDATE MEMORY
  // ======================================

  static update(
    data:
      TeamForm[] |
      FootballMatch[] |
      TeamStats[]
  ) {

    if (
      !data ||
      data.length === 0
    ) {
      return;
    }

    // MATCHES

    if (
      'homeTeam' in data[0]
    ) {

      const forms =
        this.calculate(
          data as FootballMatch[]
        );

      for (
        const form of forms
      ) {

        this.memory.set(
          form.team,
          form
        );
      }

      console.log(
        `🧠 FormEngine calculado: ${forms.length} times`
      );

      return;
    }

    // ANALYTICS

    if (
      'performance' in data[0]
    ) {

      const forms =
        this.fromAnalytics(
          data as TeamStats[]
        );

      for (
        const form of forms
      ) {

        this.memory.set(
          form.team,
          form
        );
      }

      console.log(
        `🧠 FormEngine analytics: ${forms.length} times`
      );

      return;
    }

    // DIRECT FORMS

    const forms =
      data as TeamForm[];

    for (
      const form of forms
    ) {

      this.memory.set(
        form.team,
        form
      );
    }

    console.log(
      `🧠 FormEngine atualizado: ${forms.length} times`
    );
  }

  // ======================================
  // 🔄 CONVERT ANALYTICS
  // ======================================

  private static fromAnalytics(
    analytics: TeamStats[]
  ): TeamForm[] {

    return analytics.map(
      team => ({

        team:
          team.team,

        matches:
          team.matches,

        formScore:
          team.performance,

        momentum:
          team.winRate,

        offensiveStrength:
          this.normalize(
            team.averageGoals * 28,
            0,
            100
          ),

        defensiveStrength:
          this.normalize(

            100 -

            (
              (
                team.conceded /

                Math.max(
                  1,
                  team.matches
                )
              ) * 22
            ),

            0,
            100
          ),

        consistency:
          team.winRate,

        averageGoals:
          team.averageGoals,

        averageConceded:
          Number(
            (
              team.conceded /

              Math.max(
                1,
                team.matches
              )
            ).toFixed(2)
          ),

        cleanSheets:
          team.cleanSheets,

        failedToScore:
          team.failedToScore,

        recentForm:
          team.form,

        xG:
          Number(
            (
              team.averageGoals * 1.15
            ).toFixed(2)
          ),

        xGA:
          Number(
            (
              (
                team.conceded /

                Math.max(
                  1,
                  team.matches
                )
              ) * 1.1
            ).toFixed(2)
          ),

        shotsPerGame:
          Number(
            (
              team.averageGoals * 4 + 8
            ).toFixed(2)
          ),

        dangerousAttacks:
          Number(
            (
              team.averageGoals * 12 + 25
            ).toFixed(2)
          ),

        possession:
          this.normalize(
            45 +
            (
              team.winRate * 0.2
            ),
            35,
            70
          ),

        updatedAt:
          new Date().toISOString()
      })
    );
  }

  // ======================================
  // GETTERS
  // ======================================

  static get(
    team: string
  ) {

    return this.memory.get(team);
  }

  static getAll() {

    return Array.from(
      this.memory.values()
    );
  }

  static clear() {

    this.memory.clear();

    console.log(
      '🧹 FormEngine limpo'
    );
  }
}