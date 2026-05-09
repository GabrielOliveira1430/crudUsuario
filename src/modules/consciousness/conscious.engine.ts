// src/modules/consciousness/conscious.engine.ts

import {
  ConsciousAgent
} from './conscious.agent';


// ==========================================
// 🧠 CONSCIOUS DECISION ENGINE
// ==========================================

export class ConsciousDecisionEngine {

  private static agents = [


    // ======================================
    // 🔥 DOMINANT AGENT
    // ======================================

    new ConsciousAgent({

      name: 'DominantAI',

      desires: {

        dominance: 1,

        exploration: 0.3,

        stability: 0.8,

        cooperation: 0.4
      },

      emotions: {

        confidence: 0.9,

        fear: 0.2,

        ambition: 1,

        curiosity: 0.5
      }
    }),


    // ======================================
    // 🎲 CHAOS AGENT
    // ======================================

    new ConsciousAgent({

      name: 'ChaosAI',

      desires: {

        dominance: 0.4,

        exploration: 1,

        stability: 0.1,

        cooperation: 0.2
      },

      emotions: {

        confidence: 0.5,

        fear: 0.1,

        ambition: 0.7,

        curiosity: 1
      }
    })
  ];


  // ==========================================
  // 🚀 RUN
  // ==========================================

  static run() {

    const thoughts =

      this.agents.map(
        a => a.think()
      );


    // ==========================================
    // 🏆 DOMINANT THOUGHT
    // ==========================================

    const dominant =

      [...thoughts]
        .sort(
          (a, b) =>
            b.score - a.score
        )[0];


    // ==========================================
    // 🧠 EXPERIENCE LOOP
    // ==========================================

    for (
      const agent of
      this.agents
    ) {

      agent.experience(

        Math.random() > 0.5
      );
    }


    return {

      totalAgents:
        this.agents.length,

      thoughts,

      dominantMind:
        dominant
    };
  }
}