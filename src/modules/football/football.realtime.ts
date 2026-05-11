import {
  FootballProvider
} from './football.provider';

import {
  FootballAnalytics
} from './football.analytics';

import {
  FootballPredictionEngine
} from './football.prediction.engine';

import {
  FootballOddsEngine
} from './football.odds.engine';

import { broadcastFootball } from '../../shared/websocket/ws.server';


// ==========================================
// ⚽ FOOTBALL REALTIME ENGINE
// ==========================================

export class FootballRealtime {

  static lastSnapshot: any = null;

  static start() {

    console.log('⚽ FootballRealtime iniciado');

    setInterval(async () => {

      try {

        const result = await FootballProvider.getLiveMatches();

        if (!result.success) {
          console.log('🔴 Falha futebol realtime');
          return;
        }

        const matches = result.matches || [];

        if (!matches.length) {
          console.log('🟡 Nenhuma partida encontrada');
          return;
        }

        // ==========================================
        // 📊 ANALYTICS
        // ==========================================

        const analytics =
          FootballAnalytics.analyze(matches);

        // ==========================================
        // 🧠 PREDICTIONS
        // ==========================================

        const predictions =
          FootballPredictionEngine.predict(matches);

        // ==========================================
        // 💰 ODDS
        // ==========================================

        const odds =
          FootballOddsEngine.calculate(matches);

        // ==========================================
        // 📸 SNAPSHOT
        // ==========================================

        const snapshot = {

          success: true,

          totalMatches: matches.length,

          matches,

          analytics,

          topTeams: analytics.slice(0, 10),

          hottestTeam: analytics[0] || null,

          predictions,

          totalPredictions: predictions.length,

          bestPrediction: predictions[0] || null,

          odds,

          updatedAt: new Date().toISOString()
        };

        this.lastSnapshot = snapshot;

        console.log(
          '⚽ Snapshot atualizado:',
          snapshot.totalMatches
        );

        // ==========================================
        // 🚀 WEBSOCKET BROADCAST
        // ==========================================

        broadcastFootball(snapshot);

      } catch (error) {

        console.error('🔴 FootballRealtime erro:', error);
      }

    }, 30000);
  }

  static getSnapshot() {
    return this.lastSnapshot;
  }
}