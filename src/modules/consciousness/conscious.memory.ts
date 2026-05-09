// src/modules/consciousness/conscious.memory.ts

type ConsciousMemory = {

  agent: string;

  wins: number;

  failures: number;

  mood: string;
};


// ==========================================
// 🧠 CONSCIOUS MEMORY
// ==========================================

export class ConsciousMemoryStore {

  private static memory:
    Map<string, ConsciousMemory> =
      new Map();


  // ==========================================
  // 🚀 INIT
  // ==========================================

  static init(
    agent: string
  ) {

    if (
      !this.memory.has(agent)
    ) {

      this.memory.set(agent, {

        agent,

        wins: 0,

        failures: 0,

        mood: 'neutral'
      });
    }
  }


  // ==========================================
  // 🧠 UPDATE
  // ==========================================

  static update(
    agent: string,
    success: boolean
  ) {

    this.init(agent);

    const data =
      this.memory.get(agent)!;


    if (success) {

      data.wins += 1;

    } else {

      data.failures += 1;
    }


    // ==========================================
    // 😊 MOOD
    // ==========================================

    if (
      data.wins >
      data.failures
    ) {

      data.mood =
        'confident';

    } else if (
      data.failures >
      data.wins
    ) {

      data.mood =
        'fearful';

    } else {

      data.mood =
        'neutral';
    }


    this.memory.set(
      agent,
      data
    );
  }


  // ==========================================
  // 📋 GET
  // ==========================================

  static getAll() {

    return Array.from(
      this.memory.values()
    );
  }
}