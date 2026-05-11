import { broadcastOrchestrator } from '../../shared/websocket/ws.server';
import { FootballProvider } from '../football/football.provider';
import { SourceWeightEngine } from '../analytics/source-weight.engine';

let interval: NodeJS.Timeout | null = null;

// ==========================================
// 🧠 ORCHESTRATOR REALTIME ENGINE
// ==========================================

export class OrchestratorRealtime {

  static start() {

    console.log('🧠 Orchestrator WS iniciado');

    interval = setInterval(async () => {

      try {

        const football = await FootballProvider.getLiveMatches();

        const weights = SourceWeightEngine.getAll();

        const generated = Array.from({ length: 10 }).map(() => ({

          number: String(Math.floor(Math.random() * 9999)).padStart(4, '0'),
          confidence: Math.floor(Math.random() * 100),
          source: 'AI-STREAM',
          cluster: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
          patternScore: Math.random() * 100
        }));

        const best = [...generated]
          .sort((a, b) => b.confidence - a.confidence)[0];

        const payload = {

          summary: {
            systemHealth: Math.floor(Math.random() * 100),
            bestStrategy: 'adaptive-stream',
            exploration: Math.floor(Math.random() * 100),
            exploitation: Math.floor(Math.random() * 100),
          },

          football: football.matches?.slice(0, 5) || [],

          generated,

          bestGenerated: best,

          weights,

          timestamp: Date.now()
        };

        broadcastOrchestrator(payload);

        console.log('⚡ WS UPDATE SENT');

      } catch (err) {
        console.error('WS ERROR:', err);
      }

    }, 5000);
  }

  static stop() {
    if (interval) clearInterval(interval);
  }
}