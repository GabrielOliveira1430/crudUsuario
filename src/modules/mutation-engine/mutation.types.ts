// src/modules/mutation-engine/mutation.types.ts

export interface MutatedStrategy {

  name: string;

  parents: string[];

  generation: number;

  score: number;

  status:
    | 'testing'
    | 'active'
    | 'failed';

  createdAt: Date;
}