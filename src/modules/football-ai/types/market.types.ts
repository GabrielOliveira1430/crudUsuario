// src/modules/football-ai/types/market.types.ts

// ======================================
// ⚽ MARKET TYPES
// ======================================

export type Market =
  | 'HOME_WIN'
  | 'AWAY_WIN'
  | 'DRAW'
  | 'OVER_1_5'
  | 'OVER_2_5'
  | 'BTTS'
  | 'NO_BET'
  | 'LOW_CONFIDENCE';

// ======================================
// ⚡ LEGACY COMPATIBILITY
// ======================================

export type MarketType = Market;