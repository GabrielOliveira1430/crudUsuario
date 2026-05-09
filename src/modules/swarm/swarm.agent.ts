// src/modules/swarm/swarm.agent.ts

import {
  SwarmVote,
  SwarmAgentData
} from './swarm.types';


// ==========================================
// 🧠 SWARM AGENT
// ==========================================

export class SwarmAgent {

  constructor(
    public data:
      SwarmAgentData
  ) {}


  // ==========================================
  // 🗳️ VOTE
  // ==========================================

  vote(): SwarmVote {

    const vote =

      this.data.votes[
        Math.floor(
          Math.random() *
          this.data.votes.length
        )
      ];

    return {

      strategy:
        vote.strategy,

      confidence:
        vote.confidence,

      weight:
        vote.weight *
        this.data.power
    };
  }
}