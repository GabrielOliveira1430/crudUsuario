// src/modules/draw-sync/draw-sync.types.ts


// ==========================================
// 🎲 DRAW DATA
// ==========================================

export type DrawData = {

  number: string;

  source: string;

  extractedAt: Date;

  metadata?: Record<string, any>;
};


// ==========================================
// 📡 LOTTERY RESULT
// ==========================================

export type LotteryResult = {

  concurso: number;

  data: string;

  numeros: string[];
};


// ==========================================
// 🔌 PROVIDER RESPONSE
// ==========================================

export type ProviderResult = {

  success: boolean;

  total: number;

  draws: DrawData[];
};