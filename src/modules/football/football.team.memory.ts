// src/modules/football/football.team.memory.ts

import type {
  TeamFormAnalysis
} from './football.form.engine';

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
    analysis: TeamFormAnalysis
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
          analysis.averageGoalsScored,

        averageGoalsConceded:
          analysis.averageGoalsConceded,

        updatedAt:
          Date.now(),
      }
    );

    console.log(
      `🧠 Team memory updated: ${analysis.team}`
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
}


// ======================================
// SINGLETON
// ======================================

export const footballTeamMemory =
  new FootballTeamMemory();