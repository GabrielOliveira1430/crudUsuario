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
  MatchTimelineEngine
} from '../../modules/football-ai/engines/match-timeline.engine';

import {
  LiveEventEngine
} from '../../modules/football-ai/engines/live-event.engine';

import {
  QuantumScoreEngine
} from '../../modules/football-ai/engines/quantum-score.engine';

import {
  RankingEngine
} from '../../modules/football-ai/engines/ranking.engine';

import {
  weightOptimizer
} from '../football-ai/learning/weight.optimizer';

import {
  QuantumMarketEngine
} from '../../modules/football-ai/quantum/quantum-market.engine';

import {
  QuantumMatchEngine
} from '../../modules/football-ai/quantum/quantum-match.engine';

import {
  AICoreEngine
} from '../../modules/football-ai/core/ai-core.engine';

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
      // 🧠 PREDICTIONS + TIMELINE
      // ==========================================

      const predictions =
        FootballPredictionEngine
          .predict(matches)
          .map((prediction: any) => {

            const timeline =
              MatchTimelineEngine.analyze(

                `${prediction.homeTeam}_${prediction.awayTeam}`,

                prediction.pressure!
              );

            return {

              ...prediction,

              timeline
            };
          })
          .sort(
            (a: any, b: any) =>
              b.confidence - a.confidence
          );

      // ==========================================
      // ⚛️ QUANTUM MATCH ENGINE
      // ==========================================

      const quantum =
        QuantumMatchEngine
          .simulateMany(
            predictions
          );

      // ==========================================
      // ⚛️ QUANTUM MARKET ANALYSIS
      // ==========================================

      const quantumAnalysis =

        predictions.map(
          prediction => ({

            prediction,

            quantum:

              QuantumMarketEngine
                .analyze(
                  prediction
                )
          })
        );

      // ==========================================
      // 🧠 AI CORE
      // ==========================================

      const aiCore =
        AICoreEngine.process();

      // ==========================================
      // 🛰️ TACTICAL SNAPSHOT
      // ==========================================

      const tactical =
        predictions.map((p) => ({

          match:
            `${p.homeTeam} vs ${p.awayTeam}`,

          homeTeam:
            p.homeTeam,

          awayTeam:
            p.awayTeam,

          homeDanger:
            Math.floor(
              Math.random() * 100
            ),

          awayDanger:
            Math.floor(
              Math.random() * 100
            ),

          possessionHome:
            Math.floor(
              40 + Math.random() * 20
            ),

          possessionAway:
            Math.floor(
              40 + Math.random() * 20
            ),

          intensity:
            Math.floor(
              60 + Math.random() * 40
            ),

          zones: [],

          momentumFlow: []
        }));

      // ==========================================
      // 🚨 LIVE EVENTS
      // ==========================================

      const liveEvents =
        LiveEventEngine
          .analyzeMany(
            predictions
          );

      // ==========================================
      // ⚛️ QUANTUM SCORES
      // ==========================================

      const quantumScores =
        QuantumScoreEngine
          .analyzeMany(
            predictions,
            liveEvents
          )
          .sort(
            (a, b) =>
              b.quantumScore -
              a.quantumScore
          );

      // ==========================================
      // 🏆 RANKING ENGINE
      // ==========================================

      const rankedMatches =
        RankingEngine
          .analyze(
            quantumScores
          );

      const topSignals =
        RankingEngine
          .topSignals(
            rankedMatches
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
        // ⚛️ QUANTUM MATCH
        // ==========================================

        quantum,

        // ==========================================
        // ⚛️ QUANTUM MARKET
        // ==========================================

        quantumAnalysis,

        // ==========================================
        // 🧠 AI CORE
        // ==========================================

        aiCore,

        // ==========================================
        // 🛰️ TACTICAL
        // ==========================================

        tactical,

        // ==========================================
        // 🚨 LIVE EVENTS
        // ==========================================

        liveEvents,

        // ==========================================
        // ⚛️ QUANTUM
        // ==========================================

        quantumScores,

        bestQuantum:
          quantumScores[0] || null,

        // ==========================================
        // 🏆 RANKING
        // ==========================================

        rankedMatches,

        topSignals,

        bestRanked:
          rankedMatches[0] || null,

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
      // 🧠 AUTO EVOLUTION
      // ==========================================

      try {

        weightOptimizer.optimize();

      } catch (error) {

        console.error(
          '🔴 WeightOptimizer erro:',
          error
        );
      }

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
            snapshot.bestValueBet,

          bestQuantum:
            snapshot.bestQuantum,

          bestRanked:
            snapshot.bestRanked
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

      console.log(
        '🚨 Live Events:',
        snapshot.liveEvents?.length || 0
      );

      console.log(
        '⚛️ Quantum Scores:',
        snapshot.quantumScores?.length || 0
      );

      console.log(
        '🏆 Ranked Matches:',
        snapshot.rankedMatches?.length || 0
      );

      console.log(
        '🧠 Quantum Analysis:',
        snapshot.quantumAnalysis?.length || 0
      );

      console.log(
        '🛰️ Tactical Analysis:',
        snapshot.tactical?.length || 0
      );

      console.log(
        '⚛️ Quantum Match Simulations:',
        snapshot.quantum?.length || 0
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