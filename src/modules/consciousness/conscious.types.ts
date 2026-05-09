// src/modules/consciousness/conscious.types.ts

export interface DesireState {

  dominance: number;

  exploration: number;

  stability: number;

  cooperation: number;
}


export interface EmotionalState {

  confidence: number;

  fear: number;

  ambition: number;

  curiosity: number;
}


export interface ConsciousProfile {

  name: string;

  desires: DesireState;

  emotions: EmotionalState;
}