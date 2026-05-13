// src/modules/football-ai/engines/alert-scoring.engine.ts

import type { FootballAlert } from './alert.engine';

// ======================================
// 🧠 ALERT SCORING ENGINE V6
// ======================================

export type ScoredAlert = FootballAlert & {
  score: number;
  quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ELITE';
};

export class AlertScoringEngine {

  static score(alert: FootballAlert): ScoredAlert {

    let score = 50;

    // ======================================
    // 💰 VALUE BET
    // ======================================

    if (alert.type === 'VALUE_BET') {
      score += 25;
      if ((alert.edge ?? 0) >= 20) score += 15;
      if (alert.confidence >= 80) score += 10;
    }

    // ======================================
    // 🚨 ODD ERROR
    // ======================================

    if (alert.type === 'ODD_ERROR') {
      score += 30;
      if ((alert.edge ?? 0) >= 25) score += 20;
    }

    // ======================================
    // ⚽ PRESSURE (corrigido nome V6)
    // ======================================

    if (alert.type === 'PRESSURE') {
      score += 20;
      if (alert.confidence >= 80) score += 20;
    }

    // ======================================
    // 🔥 LIVE OPPORTUNITY
    // ======================================

    if (alert.type === 'LIVE_OPPORTUNITY') {
      score += 15;
      if (alert.confidence >= 90) score += 25;
    }

    // ======================================
    // 📉 MARKET TRAP
    // ======================================

    if (alert.type === 'MARKET_TRAP') {
      score += 10;
      if (alert.confidence <= 60) score += 15;
    }

    // clamp final
    score = Math.max(0, Math.min(100, score));

    // ======================================
    // 🏷 QUALITY SYSTEM
    // ======================================

    let quality: ScoredAlert['quality'] = 'LOW';

    if (score >= 85) quality = 'ELITE';
    else if (score >= 70) quality = 'HIGH';
    else if (score >= 50) quality = 'MEDIUM';

    return {
      ...alert,
      score,
      quality,
    };
  }

  // ======================================
  // 🧹 FILTER ELITE SIGNALS
  // ======================================

  static filterElite(alerts: FootballAlert[]) {
    return alerts
      .map(a => this.score(a))
      .filter(a => a.score >= 70)
      .sort((a, b) => b.score - a.score);
  }

  // ======================================
  // 🎯 TOP SIGNAL
  // ======================================

  static topSignal(alerts: FootballAlert[]) {
    return alerts
      .map(a => this.score(a))
      .sort((a, b) => b.score - a.score)[0] || null;
  }
}