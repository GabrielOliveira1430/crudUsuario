import { NeuralTradeOptimizer } from '../neural/neural-trade.optimizer';
import { NeuralStrategySwitcherV6, StrategyType } from '../neural/neural-strategy.switcher';
import type { FootballAlert } from '../engines/alert.engine';

// ======================================
// 🏦 ALERT PIPELINE V6
// ======================================

export type ProcessedAlertV6 = FootballAlert & {
  finalScore: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  allowed: boolean;

  alphaScore: number;
  trustScore: number;
  liquidityScore: number;
};

type MemoryEntry = {
  lastSeen: number;
  count: number;
  volatilityPenalty: number;
};

export class AlertPipelineV6 {

  private static memory = new Map<string, MemoryEntry>();
  private static cooldown = new Map<string, number>();

  private static COOLDOWN = 10000;
  private static SPAM_LIMIT = 4;

  static process(alerts: FootballAlert[]): ProcessedAlertV6[] {

    const now = Date.now();
    const result: ProcessedAlertV6[] = [];

    for (const alert of alerts) {

      if (!alert?.match) continue;

      const key = `${alert.type}-${alert.match.homeTeam}-${alert.match.awayTeam}`;

      let mem = this.memory.get(key);

      if (!mem) {
        mem = { lastSeen: now, count: 1, volatilityPenalty: 0 };
      } else {
        mem.count++;
        mem.volatilityPenalty += 2;
        mem.lastSeen = now;
      }

      if (mem.count > this.SPAM_LIMIT) continue;

      this.memory.set(key, mem);

      const last = this.cooldown.get(alert.type);
      if (last && now - last < this.COOLDOWN) continue;

      this.cooldown.set(alert.type, now);

      // =========================
      // SCORE BASE
      // =========================

      let score = alert.baseScore;

      score = NeuralTradeOptimizer.adjustScore(alert.type as any, score);
      score = NeuralStrategySwitcherV6.modifyScore(score, 'BALANCED');

      const liquidityScore = 70;
      const trustScore = (alert.confidence || 0) * 0.5;

      let alphaScore =
        score + liquidityScore * 0.3 + trustScore * 0.4 - mem.volatilityPenalty;

      alphaScore = Math.max(0, Math.min(100, alphaScore));

      const confidenceBoost = (alert.confidence || 0) * 0.15;
      const edgeBoost = (alert.edge || 0) * 0.6;

      let finalScore = alphaScore + confidenceBoost + edgeBoost;
      finalScore = Math.max(0, Math.min(100, finalScore));

      const priority =
        finalScore >= 88 ? 'CRITICAL'
        : finalScore >= 75 ? 'HIGH'
        : finalScore >= 60 ? 'MEDIUM'
        : 'LOW';

      const allowed = finalScore >= 62;

      result.push({
        ...alert,
        finalScore,
        priority,
        allowed,
        alphaScore,
        trustScore,
        liquidityScore,
      });
    }

    return result.sort((a, b) => b.finalScore - a.finalScore);
  }
}