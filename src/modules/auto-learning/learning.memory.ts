// src/modules/auto-learning/learning.memory.ts

// ==========================================
// 🧠 MEMORY MODEL
// ==========================================

export type StrategyMemory = {

  name: string;

  weight: number;

  hits: number;

  runs: number;

  accuracy: number;

  lastUpdate: Date;
};


// ==========================================
// 🧠 LEARNING MEMORY
// ==========================================

export class LearningMemory {

  private static memory:
    Map<string, StrategyMemory>
      = new Map();


  // ==========================================
  // 🚀 INIT
  // ==========================================

  static initStrategy(
    name: string
  ) {

    if (
      !this.memory.has(name)
    ) {

      this.memory.set(name, {

        name,

        weight: 1,

        hits: 0,

        runs: 0,

        accuracy: 0,

        lastUpdate: new Date()
      });
    }
  }


  // ==========================================
  // 🔥 UPDATE LEARNING
  // ==========================================

  static update(
    name: string,
    hits: number,
    totalGenerated = 50
  ) {

    this.initStrategy(name);

    const data =
      this.memory.get(name)!;


    // ==========================================
    // 📊 UPDATE CORE
    // ==========================================

    data.runs += 1;

    data.hits += hits;

    data.accuracy =
      data.hits /
      (
        data.runs *
        totalGenerated
      );


    // ==========================================
    // 🧠 CONFIDENCE FACTOR
    // ==========================================

    const confidence =
      Math.min(
        1,
        data.runs / 100
      );


    // ==========================================
    // ⚖️ WEIGHT FORMULA
    // ==========================================

    const adaptiveWeight =
      (
        data.accuracy * 100
      ) * confidence;


    // ==========================================
    // 🔥 SMOOTHING
    // ==========================================

    data.weight =
      (
        data.weight * 0.7
      ) +
      (
        adaptiveWeight * 0.3
      );


    // ==========================================
    // 🕒 UPDATE TIME
    // ==========================================

    data.lastUpdate =
      new Date();


    // ==========================================
    // 💾 SAVE
    // ==========================================

    this.memory.set(
      name,
      data
    );
  }


  // ==========================================
  // 📋 GET ALL
  // ==========================================

  static getAll() {

    return Array.from(
      this.memory.values()
    )
      .sort(
        (a, b) =>
          b.weight - a.weight
      );
  }


  // ==========================================
  // 🎯 GET ONE
  // ==========================================

  static get(
    name: string
  ) {

    return this.memory.get(name);
  }
}