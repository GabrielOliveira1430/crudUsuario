// src/modules/football-ai/learning/learning.memory.ts

import fs from 'fs';
import path from 'path';

// ======================================
// TYPES
// ======================================

export type LearningEntry = {

  id: string;

  match: string;

  league: string;

  prediction: string;

  winner: string;

  confidence: number;

  market: string;

  result:
    | 'WIN'
    | 'LOSS';

  createdAt: string;
};

// ======================================
// ENGINE
// ======================================

class LearningMemory {

  private file = path.resolve(

    process.cwd(),

    'data/football-learning.json'
  );

  private memory:
    LearningEntry[] = [];

  constructor() {

    this.load();
  }

  // ======================================
  // LOAD
  // ======================================

  private load() {

    try {

      if (!fs.existsSync(this.file)) {

        this.memory = [];

        return;
      }

      const raw =
        fs.readFileSync(
          this.file,
          'utf-8'
        );

      this.memory =
        JSON.parse(raw);

    } catch {

      this.memory = [];
    }
  }

  // ======================================
  // SAVE
  // ======================================

  private persist() {

    fs.writeFileSync(

      this.file,

      JSON.stringify(
        this.memory,
        null,
        2
      )
    );
  }

  // ======================================
  // ADD
  // ======================================

  add(
    entry: LearningEntry
  ) {

    this.memory.push(entry);

    this.persist();
  }

  // ======================================
  // GET ALL
  // ======================================

  getAll() {

    return this.memory;
  }

  // ======================================
  // STATS
  // ======================================

  stats() {

    const total =
      this.memory.length;

    const wins =
      this.memory.filter(
        x => x.result === 'WIN'
      ).length;

    const losses =
      total - wins;

    const accuracy =
      total
        ? Number(
            (
              wins / total * 100
            ).toFixed(2)
          )
        : 0;

    return {

      total,

      wins,

      losses,

      accuracy
    };
  }
}

export const learningMemory =
  new LearningMemory();