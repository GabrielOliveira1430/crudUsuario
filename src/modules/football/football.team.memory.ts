// src/modules/football/football.team.memory.ts

import type {
  TeamForm
} from '../football-ai/engines/form.engine';

// ======================================
// TEAM MEMORY
// ======================================

export type TeamMemory = {

  team: string;

  offensiveStrength: number;

  defensiveStrength: number;

  formScore: number;

  consistency: number;

  momentum: number;

  averageGoalsScored: number;

  averageGoalsConceded: number;

  cleanSheets: number;

  failedToScore: number;

  recentForm: string[];

  updatedAt: number;
};

// ======================================
// MEMORY ENGINE
// ======================================

class FootballTeamMemory {

  private memory =
    new Map<string, TeamMemory>();

  // ======================================
  // SAVE
  // ======================================

  save(
    analysis: TeamForm
  ) {

    this.memory.set(
      analysis.team,

      {
        team:
          analysis.team,

        offensiveStrength:
          analysis.offensiveStrength,

        defensiveStrength:
          analysis.defensiveStrength,

        formScore:
          analysis.formScore,

        consistency:
          analysis.consistency,

        momentum:
          analysis.momentum,

        averageGoalsScored:
          analysis.averageGoals,

        averageGoalsConceded:
          analysis.averageConceded,

        cleanSheets:
          analysis.cleanSheets,

        failedToScore:
          analysis.failedToScore,

        recentForm:
          analysis.recentForm,

        updatedAt:
          Date.now(),
      }
    );

    console.log(
      `🧠 Team memory updated: ${analysis.team}`
    );
  }

  // ======================================
  // SAVE MANY
  // ======================================

  saveMany(
    analyses: TeamForm[]
  ) {

    for (const analysis of analyses) {

      this.save(analysis);
    }

    console.log(
      `🧠 Team memory batch updated: ${analyses.length} teams`
    );
  }

  // ======================================
  // GET
  // ======================================

  get(
    team: string
  ): TeamMemory | null {

    return (
      this.memory.get(team) ||
      null
    );
  }

  // ======================================
  // HAS
  // ======================================

  has(
    team: string
  ) {

    return this.memory.has(team);
  }

  // ======================================
  // GET ALL
  // ======================================

  getAll(): TeamMemory[] {

    return Array.from(
      this.memory.values()
    );
  }

  // ======================================
  // TOP OFFENSIVE
  // ======================================

  getTopOffensive(
    limit = 10
  ) {

    return this.getAll()

      .sort(
        (a, b) =>
          b.offensiveStrength -
          a.offensiveStrength
      )

      .slice(0, limit);
  }

  // ======================================
  // TOP DEFENSIVE
  // ======================================

  getTopDefensive(
    limit = 10
  ) {

    return this.getAll()

      .sort(
        (a, b) =>
          b.defensiveStrength -
          a.defensiveStrength
      )

      .slice(0, limit);
  }

  // ======================================
  // TOP MOMENTUM
  // ======================================

  getTopMomentum(
    limit = 10
  ) {

    return this.getAll()

      .sort(
        (a, b) =>
          b.momentum -
          a.momentum
      )

      .slice(0, limit);
  }

  // ======================================
  // WEAK DEFENSE
  // ======================================

  getWeakDefenses(
    limit = 10
  ) {

    return this.getAll()

      .sort(
        (a, b) =>
          a.defensiveStrength -
          b.defensiveStrength
      )

      .slice(0, limit);
  }

  // ======================================
  // TOP FORM
  // ======================================

  getTopForm(
    limit = 10
  ) {

    return this.getAll()

      .sort(
        (a, b) =>
          (
            b.formScore +
            b.momentum
          ) -
          (
            a.formScore +
            a.momentum
          )
      )

      .slice(0, limit);
  }

  // ======================================
  // CLEAR
  // ======================================

  clear() {

    this.memory.clear();

    console.log(
      '🧹 FootballTeamMemory limpo'
    );
  }
}

// ======================================
// SINGLETON
// ======================================

export const footballTeamMemory =
  new FootballTeamMemory();