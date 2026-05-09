// src/modules/swarm/swarm.engine.ts

import {
  SwarmAgent
} from './swarm.agent';


// ==========================================
// 🧠 AI SWARM SYSTEM
// ==========================================

export class SwarmEngine {

  private static agents:
    SwarmAgent[] = [


    // ======================================
    // 🔥 HOT AGENT
    // ======================================

    new SwarmAgent({

      name: 'HotAgent',

      specialty:
        'hot numbers',

      power: 1.4,

      votes: [

        {
          strategy: 'hot',
          confidence: 88,
          weight: 1
        }
      ]
    }),


    // ======================================
    // ❄️ COLD AGENT
    // ======================================

    new SwarmAgent({

      name: 'ColdAgent',

      specialty:
        'cold numbers',

      power: 1.1,

      votes: [

        {
          strategy: 'cold',
          confidence: 61,
          weight: 1
        }
      ]
    }),


    // ======================================
    // 🎲 CHAOS AGENT
    // ======================================

    new SwarmAgent({

      name: 'ChaosAgent',

      specialty:
        'random exploration',

      power: 0.8,

      votes: [

        {
          strategy: 'random',
          confidence: 40,
          weight: 1
        }
      ]
    })
  ];


  // ==========================================
  // 🧠 CONSENSUS
  // ==========================================

  static run() {

    const votes =
      this.agents.map(
        agent =>
          agent.vote()
      );


    // ==========================================
    // 📊 RANKING
    // ==========================================

    const ranking =
      votes.sort(
        (a, b) =>
          (
            b.confidence *
            b.weight
          ) -
          (
            a.confidence *
            a.weight
          )
      );


    const best =
      ranking[0];


    // ==========================================
    // 🧠 RESULT
    // ==========================================

    return {

      totalAgents:
        this.agents.length,

      votes,

      consensus: {

        strategy:
          best.strategy,

        confidence:
          best.confidence,

        weightedScore:
          Number(
            (
              best.confidence *
              best.weight
            ).toFixed(2)
          )
      }
    };
  }
}