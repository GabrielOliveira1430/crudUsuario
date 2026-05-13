import type { FootballPrediction } from '../../football/football.prediction.engine';
import type { ValueBet } from './value-bet.engine';
import { broadcastAlert } from '../../../shared/websocket/ws.server';

// ======================================
// 🚨 ALERT TYPES (V6 UNIFIED)
// ======================================

export type AlertType =
  | 'VALUE_BET'
  | 'PRESSURE'
  | 'ODD_ERROR'
  | 'LIVE_OPPORTUNITY'
  | 'MARKET_TRAP';

// ======================================
// 🧠 V6 CORE ALERT (PIPELINE READY)
// ======================================

export type FootballAlert = {
  id: string;

  type: AlertType;
  title: string;
  message: string;

  confidence: number;
  edge?: number;
  risk?: number;

  // 🔥 CRITICAL FOR PIPELINE V6
  baseScore: number;

  timestamp: number;

  match?: {
    homeTeam: string;
    awayTeam: string;
  };
};

// ======================================
// 🚨 ALERT ENGINE V6 (INSTITUTIONAL)
// ======================================

export class AlertEngine {

  private static alerts: FootballAlert[] = [];
  private static MAX_ALERTS = 200;

  // ======================================
  // 📦 PUSH ENGINE
  // ======================================

  private static push(alert: FootballAlert) {

    this.alerts.unshift(alert);

    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts.pop();
    }

    console.log(`🚨 ALERT V6: [${alert.type}] ${alert.title}`);

    broadcastAlert(alert);
  }

  // ======================================
  // 🆔 ID GENERATOR
  // ======================================

  private static generateId(type: string) {
    return `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  // ======================================
  // 💰 VALUE BET ENGINE
  // ======================================

  static analyzeValueBets(valueBets: ValueBet[]) {

    for (const bet of valueBets) {

      if (bet.edge >= 15 && bet.valueBet) {

        this.push({
          id: this.generateId('VALUE_BET'),

          type: 'VALUE_BET',
          title: '💰 Value Bet Detectada',
          message: `${bet.homeTeam} vs ${bet.awayTeam} | edge ${bet.edge}%`,

          confidence: bet.confidence,
          edge: bet.edge,

          baseScore: 60 + bet.edge * 1.2,

          timestamp: Date.now(),

          match: {
            homeTeam: bet.homeTeam,
            awayTeam: bet.awayTeam,
          },
        });
      }

      if (bet.edge >= 25) {

        this.push({
          id: this.generateId('ODD_ERROR'),

          type: 'ODD_ERROR',
          title: '🚨 Odd Anômala Detectada',
          message: `Distorção forte no mercado (${bet.edge}%)`,

          confidence: bet.confidence,
          edge: bet.edge,

          baseScore: 70 + bet.edge * 1.5,

          timestamp: Date.now(),

          match: {
            homeTeam: bet.homeTeam,
            awayTeam: bet.awayTeam,
          },
        });
      }
    }
  }

  // ======================================
  // ⚽ PREDICTIONS ENGINE
  // ======================================

  static analyzePredictions(predictions: FootballPrediction[]) {

    for (const p of predictions) {

      if (p.confidence >= 85) {

        this.push({
          id: this.generateId('LIVE_OPPORTUNITY'),

          type: 'LIVE_OPPORTUNITY',
          title: '🔥 Oportunidade Forte ao Vivo',
          message: `${p.homeTeam} vs ${p.awayTeam} | confiança ${p.confidence}%`,

          confidence: p.confidence,
          edge: p.edge,
          risk: p.risk,

          baseScore: 50 + p.confidence * 0.6,

          timestamp: Date.now(),

          match: {
            homeTeam: p.homeTeam,
            awayTeam: p.awayTeam,
          },
        });
      }

      if (p.risk >= 70) {

        this.push({
          id: this.generateId('MARKET_TRAP'),

          type: 'MARKET_TRAP',
          title: '📉 Possível Armadilha de Mercado',
          message: `${p.homeTeam} vs ${p.awayTeam} | risco elevado`,

          confidence: p.confidence,
          edge: p.edge,
          risk: p.risk,

          baseScore: 40,

          timestamp: Date.now(),

          match: {
            homeTeam: p.homeTeam,
            awayTeam: p.awayTeam,
          },
        });
      }
    }
  }

  // ======================================
  // ⚽ PRESSURE ENGINE
  // ======================================

  static pressureAlert(match: any, pressure: any) {

    if (!pressure?.goalProbability) return;

    if (pressure.goalProbability >= 0.75) {

      this.push({
        id: this.generateId('PRESSURE'),

        type: 'PRESSURE',
        title: '⚽ Gol Iminente Detectado',
        message: `${match.homeTeam} vs ${match.awayTeam} | pressão extrema`,

        confidence: pressure.goalProbability * 100,
        risk: 80,

        baseScore: 75,

        timestamp: Date.now(),

        match,
      });
    }
  }

  // ======================================
  // 📡 GET ALERTS
  // ======================================

  static getAlerts(limit = 20) {
    return this.alerts.slice(0, limit);
  }

  // ======================================
  // 🧹 CLEAR
  // ======================================

  static clear() {
    this.alerts = [];
    console.log('🧹 AlertEngine V6 limpo');
  }
}