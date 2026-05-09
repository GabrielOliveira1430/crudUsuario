// src/modules/evolution-engine/evolution.types.ts

export interface EvolutionCycle {

  generation: number;

  created: number;

  promoted: number;

  failed: number;

  active: number;

  timestamp: Date;
}