// src/modules/football/football.realtime.ts

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

import {
  FormEngine
} from '../../modules/football-ai/engines/form.engine';

import {
  ValueBetEngine
} from '../../modules/football-ai/engines/value-bet.engine';

import {
  broadcastFootball
} from '../../shared/websocket/ws.server';

// ==========================================
// ⚽ FOOTBALL REALTIME ENGINE
// ==========================================

export class FootballRealtime {

  private static started = false;

  private static interval:
    NodeJS.Timeout | null = null;

  private static processing = false;

  private static snapshot: any = null;

  private static lastHash = '';

  // ==========================================
  // 🚀 START
  // ==========================================

  static start() {

    if (this.started) {

      console.log(
        '⚠️ FootballRealtime já iniciado'
      );

      return;
    }

    this.started = true;

    console.log(
      '⚽ FootballRealtime iniciado'
    );

    this.update();

    this.interval = setInterval(
      () => this.update(),
      30000
    );
  }

  // ==========================================
  // 🔄 UPDATE
  // ==========================================

  private static async update() {

    if (this.processing) {

      console.log(
        '⚠️ FootballRealtime ocupado'
      );

      return;
    }

    this.processing = true;

    try {

      // ==========================================
      // ⚽ PROVIDER
      // ==========================================

      const result =
        await FootballProvider.getLiveMatches();

      if (!result.success) {

        console.log(
          '🔴 Falha provider futebol'
        );

        return;
      }

      // ==========================================
      // ⚽ FILTER MATCHES
      // ==========================================

      const rawMatches =
        result.matches || [];

      const matches =
        rawMatches.filter((match: any) => {

          const status =
            String(
              match?.status || ''
            ).toLowerCase();

          return (
            status.includes('live') ||
            status.includes('1h') ||
            status.includes('2h') ||
            status.includes('ht') ||
            status.includes('not started') ||
            status.includes('ns') ||
            status.includes('inplay')
          );
        });

      if (!matches.length) {

        console.log(
          '🟡 Nenhuma partida LIVE encontrada'
        );

        return;
      }

      // ==========================================
      // 📊 ANALYTICS
      // ==========================================

      const analytics =
        FootballAnalytics.analyze(
          matches
        );

      // ==========================================
      // 🧠 FORM ENGINE
      // ==========================================

      try {

        FormEngine.update(
          analytics
        );

      } catch (error) {

        console.error(
          '🔴 FormEngine erro:',
          error
        );
      }

      // ==========================================
      // 🧠 PREDICTIONS
      // ==========================================

      const predictions =
        FootballPredictionEngine
          .predict(matches)
          .sort(
            (a: any, b: any) =>
              b.confidence - a.confidence
          );

      // ==========================================
      // 💰 VALUE BETS
      // ==========================================

      const valueBets =
        ValueBetEngine
          .analyzeMany(
            predictions
          )
          .sort(
            (a, b) =>
              b.edge - a.edge
          );

      // ==========================================
      // 💰 ODDS
      // ==========================================

      const odds =
        FootballOddsEngine
          .calculate(matches)
          .sort(
            (a: any, b: any) =>
              b.fairOdd - a.fairOdd
          );

      // ==========================================
      // 🔥 TOP VALUES
      // ==========================================

      const topValueBets =
        valueBets
          .filter(
            (item) =>
              item.valueBet
          )
          .slice(0, 10);

      // ==========================================
      // 📸 SNAPSHOT
      // ==========================================

      const snapshot = {

        success: true,

        totalMatches:
          matches.length,

        matches,

        // ==========================================
        // 📊 ANALYTICS
        // ==========================================

        analytics,

        topTeams:
          analytics.slice(0, 10),

        hottestTeam:
          analytics[0] || null,

        // ==========================================
        // 🧠 PREDICTIONS
        // ==========================================

        predictions,

        totalPredictions:
          predictions.length,

        bestPrediction:
          predictions[0] || null,

        // ==========================================
        // 💰 ODDS
        // ==========================================

        odds,

        totalOdds:
          odds.length,

        // ==========================================
        // 💎 VALUE BETS
        // ==========================================

        valueBets,

        topValueBets,

        bestValueBet:
          topValueBets[0] || null,

        totalValueBets:
          topValueBets.length,

        // ==========================================
        // 🕒 META
        // ==========================================

        updatedAt:
          new Date().toISOString(),
      };

      // ==========================================
      // 🔥 HASH
      // ==========================================

      const hash =
        JSON.stringify({

          totalMatches:
            snapshot.totalMatches,

          firstMatch:
            snapshot.matches?.[0],

          lastMatch:
            snapshot.matches?.[
              snapshot.matches.length - 1
            ],

          bestPrediction:
            snapshot.bestPrediction,

          bestValueBet:
            snapshot.bestValueBet
        });

      // ==========================================
      // 🚫 NO CHANGES
      // ==========================================

      if (hash === this.lastHash) {

        console.log(
          '⚽ Sem mudanças nas partidas'
        );

        return;
      }

      // ==========================================
      // 💾 SAVE SNAPSHOT
      // ==========================================

      this.lastHash = hash;

      this.snapshot =
        Object.freeze({
          ...snapshot
        });

      console.log(
        '⚽ Snapshot atualizado:',
        snapshot.totalMatches
      );

      console.log(
        '💰 Value Bets:',
        snapshot.totalValueBets
      );

      // ==========================================
      // 🚀 BROADCAST
      // ==========================================

      broadcastFootball(
        snapshot
      );

    } catch (error) {

      console.error(
        '🔴 FootballRealtime erro:',
        error
      );

    } finally {

      this.processing = false;
    }
  }

  // ==========================================
  // 📸 SNAPSHOT
  // ==========================================

  static getSnapshot() {

    return this.snapshot;
  }

  // ==========================================
  // 🛑 STOP
  // ==========================================

  static stop() {

    if (this.interval) {

      clearInterval(
        this.interval
      );

      this.interval = null;
    }

    this.started = false;

    console.log(
      '🛑 FootballRealtime parado'
    );
  }
}