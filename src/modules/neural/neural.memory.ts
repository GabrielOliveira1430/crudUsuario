// src/modules/neural/neural.memory.ts

import {
  NeuralMemory
} from './neural.types';


// ==========================================
// 🧠 NEURAL MEMORY
// ==========================================

export class NeuralMemoryStore {

  private static memory:
    Map<string, NeuralMemory> =
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

        experience: 0,

        wins: 0,

        failures: 0,

        evolutionLevel: 1
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

    data.experience += 1;

    if (success) {

      data.wins += 1;

    } else {

      data.failures += 1;
    }


    // ==========================================
    // 🚀 EVOLUTION
    // ==========================================

    data.evolutionLevel =

      Number(
        (
          1 +
          (
            data.wins /
            Math.max(
              1,
              data.experience
            )
          ) * 10
        ).toFixed(2)
      );


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