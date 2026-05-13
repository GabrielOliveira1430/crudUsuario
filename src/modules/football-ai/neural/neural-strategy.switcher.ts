export type StrategyType =
  | 'CONSERVATIVE'
  | 'BALANCED'
  | 'AGGRESSIVE'
  | 'DEFENSIVE'
  | 'MOMENTUM';

type MarketRegime =
  | 'CALM'
  | 'TRENDING'
  | 'VOLATILE'
  | 'CHAOTIC';

type StrategyMetrics = {
  profit: number;
  wins: number;
  losses: number;
  trades: number;
  weight: number;
  recentScore: number[];
  lastUpdate: number;
};

// ======================================
// 🧠 NEURAL STRATEGY SWITCHER V6 (FINAL)
// ======================================

export class NeuralStrategySwitcherV6 {

  private static portfolio: Record<StrategyType, StrategyMetrics> = {
    CONSERVATIVE: { profit: 0, wins: 0, losses: 0, trades: 0, weight: 1, recentScore: [], lastUpdate: Date.now() },
    BALANCED:     { profit: 0, wins: 0, losses: 0, trades: 0, weight: 1, recentScore: [], lastUpdate: Date.now() },
    AGGRESSIVE:   { profit: 0, wins: 0, losses: 0, trades: 0, weight: 1, recentScore: [], lastUpdate: Date.now() },
    DEFENSIVE:    { profit: 0, wins: 0, losses: 0, trades: 0, weight: 1, recentScore: [], lastUpdate: Date.now() },
    MOMENTUM:     { profit: 0, wins: 0, losses: 0, trades: 0, weight: 1, recentScore: [], lastUpdate: Date.now() },
  };

  private static history: string[] = [];
  private static regime: MarketRegime = 'CALM';

  // ======================================
  // 🚀 INIT
  // ======================================

  static init() {
    console.log('🧠 Neural Strategy Switcher V6 iniciado');
  }

  // ======================================
  // 📊 REGISTER RESULT
  // ======================================

  static registerResult(strategy: StrategyType, win: boolean, profit: number) {

    const s = this.portfolio[strategy];

    s.trades++;

    if (win) {
      s.wins++;
      s.profit += profit;
    } else {
      s.losses++;
      s.profit -= Math.abs(profit);
    }

    const signal = win ? 1 : -1;

    s.recentScore.push(signal);

    if (s.recentScore.length > 50) {
      s.recentScore.shift();
    }

    s.lastUpdate = Date.now();

    this.rebalance();
    this.detectRegime();
  }

  // ======================================
  // 🌍 MARKET REGIME DETECTOR
  // ======================================

  private static detectRegime() {

    const all = Object.values(this.portfolio);

    const volatility =
      all.reduce((acc, s) => acc + Math.abs(s.profit), 0) / Math.max(1, all.length);

    const avgTrades =
      all.reduce((acc, s) => acc + s.trades, 0) / Math.max(1, all.length);

    if (volatility > 1200) this.regime = 'CHAOTIC';
    else if (volatility > 600) this.regime = 'VOLATILE';
    else if (avgTrades > 50) this.regime = 'TRENDING';
    else this.regime = 'CALM';
  }

  // ======================================
  // ⚖️ META REBALANCE ENGINE
  // ======================================

  private static rebalance() {

    const strategies = Object.keys(this.portfolio) as StrategyType[];

    let total = 0;
    const scores: Record<StrategyType, number> = {} as any;

    for (const s of strategies) {

      const m = this.portfolio[s];

      const winRate = m.trades > 0 ? m.wins / m.trades : 0;

      const avgRecent =
        m.recentScore.length
          ? m.recentScore.reduce((a, b) => a + b, 0) / m.recentScore.length
          : 0;

      const momentumBoost =
        this.regime === 'TRENDING' && s === 'MOMENTUM' ? 20 : 0;

      const defensiveBoost =
        this.regime === 'VOLATILE' && s === 'DEFENSIVE' ? 15 : 0;

      const aggressivePenalty =
        this.regime === 'CHAOTIC' && s === 'AGGRESSIVE' ? -10 : 0;

      const score =
        (m.profit * 0.5) +
        (winRate * 100 * 0.3) +
        (avgRecent * 20) +
        momentumBoost +
        defensiveBoost +
        aggressivePenalty;

      const safeScore = Math.max(0.1, score);

      scores[s] = safeScore;
      total += safeScore;
    }

    if (total <= 0) total = 1;

    for (const s of strategies) {
      this.portfolio[s].weight = scores[s] / total;
    }
  }

  // ======================================
  // 🧠 SCORE MODIFIER
  // ======================================

  static modifyScore(baseScore: number, strategy?: StrategyType): number {

    let adjusted = baseScore;

    if (strategy) {
      adjusted *= this.portfolio[strategy].weight;
    }

    if (this.regime === 'CHAOTIC') adjusted *= 0.8;
    if (this.regime === 'VOLATILE') adjusted *= 0.9;
    if (this.regime === 'TRENDING') adjusted *= 1.15;

    return this.clamp(adjusted);
  }

  // ======================================
  // 🔮 FORECAST ENGINE
  // ======================================

  static forecast() {

    const p = this.portfolio;

    const expectedReturn =
      Object.values(p).reduce((acc, s) => acc + s.profit * s.weight, 0);

    return {
      regime: this.regime,
      expectedReturn: Number(expectedReturn.toFixed(2)),
      allocation: {
        CONSERVATIVE: p.CONSERVATIVE.weight,
        BALANCED: p.BALANCED.weight,
        AGGRESSIVE: p.AGGRESSIVE.weight,
        DEFENSIVE: p.DEFENSIVE.weight,
        MOMENTUM: p.MOMENTUM.weight,
      },
    };
  }

  // ======================================
  // 📊 STATUS
  // ======================================

  static getStatus() {
    return {
      regime: this.regime,
      portfolio: this.portfolio,
      forecast: this.forecast(),
      history: this.history.slice(-20),
    };
  }

  // ======================================
  // 🧹 RESET
  // ======================================

  static reset() {

    for (const key of Object.keys(this.portfolio) as StrategyType[]) {
      this.portfolio[key] = {
        profit: 0,
        wins: 0,
        losses: 0,
        trades: 0,
        weight: 1,
        recentScore: [],
        lastUpdate: Date.now(),
      };
    }

    this.history = [];
    this.regime = 'CALM';

    console.log('🧹 V6 Meta Hedge Fund resetado');
  }

  // ======================================
  // 🧮 UTILS
  // ======================================

  private static clamp(v: number) {
    const n = Number(v.toFixed(2));
    return Math.max(0, Math.min(100, n));
  }
}