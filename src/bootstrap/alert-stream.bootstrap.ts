import { MarketFeedEngine } from '../modules/football-ai/engines/market-feed.engine';
import { ValueBetEngine } from '../modules/football-ai/engines/value-bet.engine';
import { AlertEngine } from '../modules/football-ai/engines/alert.engine';
import { AlertPipelineV6 } from '../modules/football-ai/pipeline/alert-pipeline.engine';
import { UnifiedAITradingCore } from '../modules/football-ai/core/unified-ai-trading.core';
import { broadcast } from '../shared/websocket/ws.server';

export class AlertStreamBootstrap {

  static start() {

    console.log('🚀 PRODUCTION MODE ENABLED');

    setInterval(async () => {

      // ======================================
      // 📡 REAL MARKET DATA
      // ======================================

      const odds = await MarketFeedEngine.fetchLiveOdds();

      // ======================================
      // 🧠 VALUE BET ENGINE REAL
      // ======================================

      const valueBets = odds.map(o =>
        ValueBetEngine.analyze({
          homeTeam: o.homeTeam,
          awayTeam: o.awayTeam,
          prediction: 'UNKNOWN',
          market: o.market,
          confidence: 70,
          fairOdd: o.homeOdd,
        } as any)
      );

      // ======================================
      // 🚨 ALERT ENGINE
      // ======================================

      AlertEngine.analyzeValueBets(valueBets as any);

      const alerts = AlertEngine.getAlerts(50);

      const processed = AlertPipelineV6.process(alerts);

      UnifiedAITradingCore.ingestAlerts(processed);

      // ======================================
      // 📡 LIVE STREAM
      // ======================================

      broadcast('football:stream', {
        mode: 'PRODUCTION',
        alerts: processed.slice(0, 5),
        timestamp: Date.now(),
      });

    }, 2000);
  }
}