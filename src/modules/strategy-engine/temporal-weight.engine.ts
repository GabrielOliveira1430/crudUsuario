// src/modules/strategy-engine/temporal-weight.engine.ts

type TemporalMemory = {

  strategy: string;

  hour: number;

  hits: number;

  runs: number;

  weight: number;
};


// ==========================================
// 🧠 TEMPORAL WEIGHT ENGINE
// ==========================================

export class TemporalWeightEngine {


  // ==========================================
  // 🧠 MEMÓRIA TEMPORAL
  // ==========================================

  private static memory:
    Map<string, TemporalMemory>
      = new Map();


  // ==========================================
  // 🔑 KEY
  // ==========================================

  private static key(
    strategy: string,
    hour: number
  ) {

    return `${strategy}-${hour}`;
  }


  // ==========================================
  // 🚀 UPDATE
  // ==========================================

  static update(

    strategy: string,

    hits: number,

    hour: number
  ) {

    const key =
      this.key(
        strategy,
        hour
      );

    if (
      !this.memory.has(key)
    ) {

      this.memory.set(key, {

        strategy,

        hour,

        hits: 0,

        runs: 0,

        weight: 1
      });
    }

    const data =
      this.memory.get(key)!;

    data.runs += 1;

    data.hits += hits;


    // ==========================================
    // 🧠 PERFORMANCE
    // ==========================================

    const performance =

      data.hits /
      data.runs;


    // ==========================================
    // ⚖️ WEIGHT
    // ==========================================

    data.weight =
      Math.max(
        0.1,
        performance * 10
      );

    this.memory.set(
      key,
      data
    );
  }


  // ==========================================
  // 🔥 GET WEIGHT
  // ==========================================

  static getWeight(

    strategy: string,

    hour: number
  ) {

    const key =
      this.key(
        strategy,
        hour
      );

    return (
      this.memory.get(key)
        ?.weight || 1
    );
  }


  // ==========================================
  // 📊 GET ALL
  // ==========================================

  static getAll() {

    return Array.from(
      this.memory.values()
    );
  }
}