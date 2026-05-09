// src/modules/swarm/swarm.types.ts

export interface SwarmVote {

  strategy: string;

  confidence: number;

  weight: number;
}


export interface SwarmAgentData {

  name: string;

  specialty: string;

  power: number;

  votes: SwarmVote[];
}