import { AlertPipelineV6 } from '../pipeline/alert-pipeline.engine';
import { NeuralStrategySwitcherV6, StrategyType } from '../neural/neural-strategy.switcher';
import { NeuralTradeOptimizer } from '../neural/neural-trade.optimizer';
import { AutoTradeSimulator } from '../simulators/auto-trade.simulator';

// ======================================
// 🧠 UNIFIED CORE V6
// ======================================

export class UnifiedAITradingCore {

  private static initialized = false;
  private static alertBuffer: any[] = [];
  private static processing = false;

  static init() {

    if (this.initialized) return;

    this.initialized = true;

    NeuralStrategySwitcherV6.init();
    console.log('🧠 CORE V6 ONLINE');
  }

  static ingestAlerts(alerts: any[]) {
    this.alertBuffer.push(...alerts);
    this.process();
  }

  private static async process() {

    if (this.processing) return;
    this.processing = true;

    try {

      if (!this.alertBuffer.length) return;

      const processed = AlertPipelineV6.process(this.alertBuffer);
      this.alertBuffer = [];

      const valid = processed.filter(a => a.allowed);
      if (!valid.length) return;

      const forecast = NeuralStrategySwitcherV6.forecast();
      const strategy = this.pickStrategy(forecast);

      for (const alert of valid) {

        const adjusted = NeuralTradeOptimizer.adjustScore(alert.type, alert.finalScore);

        const final = NeuralStrategySwitcherV6.modifyScore(adjusted, strategy);

        AutoTradeSimulator.generateFromAlert({
          ...alert,
          score: final,
        });
      }

    } finally {
      this.processing = false;
    }
  }

  private static pickStrategy(forecast: any): StrategyType {
    const alloc = forecast?.allocation || {};
    return (Object.keys(alloc).reduce((a, b) =>
      alloc[a] > alloc[b] ? a : b
    ) || 'BALANCED') as StrategyType;
  }
}