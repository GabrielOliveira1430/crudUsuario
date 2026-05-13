// src/modules/football-ai/dna/dna.memory.ts

// ======================================
// TYPES
// ======================================

export type TeamDNA = {

  team: string;

  offensiveDNA: number;

  defensiveDNA: number;

  emotionalStability: number;

  pressureResponse: number;

  comebackPower: number;

  collapseRisk: number;

  chaosIndex: number;

  momentumStrength: number;

  dominance: number;

  updatedAt: string;
};

// ======================================
// MEMORY
// ======================================

class DNAMemory {

  private memory =
    new Map<string, TeamDNA>();

  // ======================================
  // GET
  // ======================================

  get(team: string) {

    return this.memory.get(team);
  }

  // ======================================
  // SET
  // ======================================

  set(
    team: string,
    dna: TeamDNA
  ) {

    this.memory.set(team, dna);
  }

  // ======================================
  // ALL
  // ======================================

  all() {

    return [
      ...this.memory.values()
    ];
  }
}

export const dnaMemory =
  new DNAMemory();