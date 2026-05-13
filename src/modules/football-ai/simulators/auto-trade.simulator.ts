import type { FootballAlert } from '../engines/alert.engine';

// ======================================
// 🤖 AUTO TRADE SIMULATOR V6
// ======================================

export type TradePosition = {
  id: string;
  type: string;

  match?: {
    homeTeam: string;
    awayTeam: string;
  };

  entryOdds: number;
  confidence: number;
  stake: number;

  expectedReturn: number;
  expectedProfit: number;

  status: 'OPEN' | 'WIN' | 'LOSS';
  createdAt: number;
};

export class AutoTradeSimulator {

  private static positions: TradePosition[] = [];
  private static bankroll = 1000;
  private static winRateHistory: boolean[] = [];

  static generateFromAlert(alert: any): TradePosition | null {

    if (!alert) return null;

    const score = alert.finalScore ?? alert.score ?? 0;

    if (score < 70) return null;

    const confidence = Math.min(100, Math.max(0, alert.confidence || 0));
    const edge = alert.edge || 0;

    const baseStake = this.bankroll * 0.02;

    const riskMultiplier =
      alert.risk ? Math.max(0.5, 1 - alert.risk / 200) : 1;

    const stake = Number(
      Math.max(1, baseStake * (confidence / 100) * riskMultiplier).toFixed(2)
    );

    const entryOdds = Number(
      Math.max(1.2, Math.min(6, 1.6 + (edge / 120))).toFixed(2)
    );

    const expectedReturn = Number((stake * entryOdds).toFixed(2));
    const expectedProfit = Number((expectedReturn - stake).toFixed(2));

    if (expectedProfit < -stake * 0.6) return null;

    const position: TradePosition = {
      id: `${alert.type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: alert.type,
      match: alert.match,

      entryOdds,
      confidence,
      stake,

      expectedReturn,
      expectedProfit,

      status: 'OPEN',
      createdAt: Date.now(),
    };

    this.positions.unshift(position);

    if (this.positions.length > 500) {
      this.positions.pop();
    }

    console.log(`🤖 TRADE | ${alert.type} | stake=${stake} | odds=${entryOdds}`);

    return position;
  }

  static resolveTrade(positionId: string, win: boolean) {

    const position = this.positions.find(p => p.id === positionId);
    if (!position || position.status !== 'OPEN') return;

    position.status = win ? 'WIN' : 'LOSS';

    this.winRateHistory.push(win);

    if (this.winRateHistory.length > 300) {
      this.winRateHistory.shift();
    }

    if (win) {
      this.bankroll += position.expectedProfit;
    } else {
      this.bankroll -= position.stake;
    }

    this.bankroll = Math.max(0, Number(this.bankroll.toFixed(2)));
  }

  static getPerformance() {

    const wins = this.winRateHistory.filter(Boolean).length;
    const total = this.winRateHistory.length;

    return {
      bankroll: this.bankroll,
      winRate: total ? (wins / total) * 100 : 0,
      totalTrades: total,
      openPositions: this.positions.filter(p => p.status === 'OPEN').length,
      totalProfit: this.bankroll - 1000,
    };
  }

  static reset() {
    this.positions = [];
    this.bankroll = 1000;
    this.winRateHistory = [];
  }
}