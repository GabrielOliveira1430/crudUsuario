// src/modules/neural/neural.agent.ts

import {
  NeuralState
} from './neural.types';

import {
  NeuralMemoryStore
} from './neural.memory';


// ==========================================
// 🧠 NEURAL AGENT
// ==========================================

export class NeuralAgent {

  constructor(

    public name: string,

    public state:
      NeuralState
  ) {

    NeuralMemoryStore.init(
      name
    );
  }


  // ==========================================
  // 🧠 DECIDE
  // ==========================================

  decide() {

    const memory =

      NeuralMemoryStore
        .getAll()
        .find(
          m =>
            m.agent ===
            this.name
        );


    const evolution =

      memory?.evolutionLevel || 1;


    // ==========================================
    // 🎯 CONFIDENCE
    // ==========================================

    const confidence =

      Number(
        (
          (
            this.state.adaptation +
            this.state.stability
          ) *
          evolution *
          10
        ).toFixed(2)
      );


    return {

      agent:
        this.name,

      confidence,

      evolution
    };
  }


  // ==========================================
  // 🚀 LEARN
  // ==========================================

  learn(
    success: boolean
  ) {

    NeuralMemoryStore.update(

      this.name,

      success
    );
  }
}