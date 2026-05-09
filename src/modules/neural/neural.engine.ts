// src/modules/neural/neural.engine.ts

import {
  NeuralAgent
} from './neural.agent';


// ==========================================
// 🧠 NEURAL EVOLUTION ENGINE
// ==========================================

export class NeuralEvolutionEngine {

  private static agents = [

    new NeuralAgent(

      'HotBrain',

      {

        curiosity: 0.3,

        aggression: 0.8,

        adaptation: 0.9,

        stability: 0.7
      }
    ),


    new NeuralAgent(

      'ColdBrain',

      {

        curiosity: 0.6,

        aggression: 0.2,

        adaptation: 0.8,

        stability: 0.9
      }
    ),


    new NeuralAgent(

      'ChaosBrain',

      {

        curiosity: 1,

        aggression: 0.4,

        adaptation: 1,

        stability: 0.2
      }
    )
  ];


  // ==========================================
  // 🚀 RUN
  // ==========================================

  static run() {

    const results =

      this.agents.map(
        agent =>
          agent.decide()
      );


    // ==========================================
    // 🏆 BEST
    // ==========================================

    const best =
      [...results]
        .sort(
          (a, b) =>
            b.confidence -
            a.confidence
        )[0];


    // ==========================================
    // 🧠 LEARNING
    // ==========================================

    for (
      const agent of
      this.agents
    ) {

      agent.learn(

        Math.random() > 0.5
      );
    }


    return {

      totalAgents:
        this.agents.length,

      results,

      dominantAgent:
        best
    };
  }
}