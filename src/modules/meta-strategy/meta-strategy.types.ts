// src/modules/meta-strategy/meta-strategy.types.ts

export type StrategyMix = {

  hot: number;

  cold: number;

  random: number;
};


export type MarketState =

  | 'stable'
  | 'volatile'
  | 'heated'
  | 'cold';


export interface MetaStrategyResult {

  dominantMode: string;

  marketState: MarketState;

  confidence: number;

  mix: StrategyMix;
}