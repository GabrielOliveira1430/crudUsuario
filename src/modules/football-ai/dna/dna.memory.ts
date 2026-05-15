// src/modules/football-ai/dna/dna.memory.ts

import fs from 'fs';
import path from 'path';

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

  private file = path.resolve(

    process.cwd(),

    'data/team-dna-memory.json'
  );

  private memory =
    new Map<string, TeamDNA>();

  constructor() {

    this.load();
  }

  // ======================================
  // LOAD
  // ======================================

  private load() {

    try {

      if (!fs.existsSync(this.file)) {

        return;
      }

      const raw =
        fs.readFileSync(
          this.file,
          'utf-8'
        );

      const parsed:
        TeamDNA[] =
          JSON.parse(raw);

      for (const item of parsed) {

        this.memory.set(
          item.team,
          item
        );
      }

    } catch (error) {

      console.error(
        '[DNA MEMORY LOAD ERROR]',
        error
      );
    }
  }

  // ======================================
  // SAVE
  // ======================================

  private persist() {

    try {

      const data =
        JSON.stringify(
          this.all(),
          null,
          2
        );

      const dir =
        path.dirname(
          this.file
        );

      if (
        !fs.existsSync(dir)
      ) {

        fs.mkdirSync(
          dir,
          {
            recursive: true
          }
        );
      }

      fs.writeFileSync(
        this.file,
        data,
        'utf-8'
      );

    } catch (error) {

      console.error(
        '[DNA MEMORY SAVE ERROR]',
        error
      );
    }
  }

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

    this.memory.set(
      team,
      {
        ...dna,

        updatedAt:
          new Date()
            .toISOString()
      }
    );

    this.persist();
  }

  // ======================================
  // HAS
  // ======================================

  has(team: string) {

    return this.memory.has(team);
  }

  // ======================================
  // DELETE
  // ======================================

  delete(team: string) {

    this.memory.delete(team);

    this.persist();
  }

  // ======================================
  // CLEAR
  // ======================================

  clear() {

    this.memory.clear();

    this.persist();
  }

  // ======================================
  // ALL
  // ======================================

  all() {

    return [
      ...this.memory.values()
    ];
  }

  // ======================================
  // TOP ATTACK
  // ======================================

  topOffensive(
    limit = 10
  ) {

    return this
      .all()
      .sort(
        (a, b) =>

          b.offensiveDNA -
          a.offensiveDNA
      )
      .slice(0, limit);
  }

  // ======================================
  // TOP DEFENSE
  // ======================================

  topDefensive(
    limit = 10
  ) {

    return this
      .all()
      .sort(
        (a, b) =>

          b.defensiveDNA -
          a.defensiveDNA
      )
      .slice(0, limit);
  }

  // ======================================
  // MOST CHAOTIC
  // ======================================

  mostChaotic(
    limit = 10
  ) {

    return this
      .all()
      .sort(
        (a, b) =>

          b.chaosIndex -
          a.chaosIndex
      )
      .slice(0, limit);
  }
}

export const dnaMemory =
  new DNAMemory();