// src/modules/analytics/analytics.types.ts


// ==========================================
// 📊 FREQUÊNCIA
// ==========================================

export interface FrequencyItem {

  number: number;

  count: number;

  percentage: number;
}


// ==========================================
// ⏳ ATRASO
// ==========================================

export interface DelayItem {

  number: number;

  delay: number;
}


// ==========================================
// 🔥 RANKING
// ==========================================

export interface RankingItem {

  number: number;

  score: number;
}


// ==========================================
// 📈 RESULTADO GERAL
// ==========================================

export interface AnalyticsResult {

  total: number;

  unique: number;

  frequency: FrequencyItem[];

  delay: DelayItem[];

  hotNumbers?: RankingItem[];

  coldNumbers?: RankingItem[];
}