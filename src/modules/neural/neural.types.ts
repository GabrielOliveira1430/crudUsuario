// src/modules/neural/neural.types.ts

export interface NeuralState {

  curiosity: number;

  aggression: number;

  adaptation: number;

  stability: number;
}


export interface NeuralMemory {

  agent: string;

  experience: number;

  wins: number;

  failures: number;

  evolutionLevel: number;
}