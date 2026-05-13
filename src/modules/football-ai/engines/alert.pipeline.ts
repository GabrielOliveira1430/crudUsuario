// src/modules/football-ai/engines/alert.pipeline.ts

import { AlertEngine, FootballAlert } from './alert.engine';
import { AlertScoringEngine, ScoredAlert } from './alert.scoring.engine';

import {
  broadcastAlert
} from '../../../shared/websocket/ws.server';

// ======================================
// 🚨 ALERT PIPELINE
// ======================================

export class AlertPipeline {

  private static buffer: ScoredAlert[] = [];

  private static MAX_BUFFER = 200;

  // ======================================
  // 🚀 PROCESS ALL ALERTS
  // ======================================

  static process(alerts: FootballAlert[]) {

    if (!alerts || alerts.length === 0) return;

    // ======================================
    // 🧠 SCORE + FILTER
    // ======================================

    const scored = alerts.map(a =>
      AlertScoringEngine.score(a)
    );

    const filtered = scored.filter(
      a => a.score >= 65
    );

    // ======================================
    // 📊 SAVE BUFFER
    // ======================================

    this.buffer.unshift(...filtered);

    if (this.buffer.length > this.MAX_BUFFER) {
      this.buffer = this.buffer.slice(0, this.MAX_BUFFER);
    }

    // ======================================
    // 📡 BROADCAST STRATEGY
    // ======================================

    for (const alert of filtered) {

      // 🔥 ELITE ALERTS = instant push
      if (alert.quality === 'ELITE') {

        broadcastAlert({
          ...alert,
          priority: 'ELITE',
        });

        continue;
      }

      // ⚡ HIGH ALERTS = normal push
      if (alert.quality === 'HIGH') {

        broadcastAlert({
          ...alert,
          priority: 'HIGH',
        });

        continue;
      }

      // 🟡 MEDIUM = batch delayed (anti-spam)
      if (alert.quality === 'MEDIUM') {
        setTimeout(() => {
          broadcastAlert({
            ...alert,
            priority: 'MEDIUM',
          });
        }, 2000);

        continue;
      }
    }

    console.log(
      `📡 Pipeline: ${filtered.length} alerts enviados | buffer=${this.buffer.length}`
    );
  }

  // ======================================
  // 🔥 GET ELITE FEED
  // ======================================

  static getEliteFeed(limit = 20) {

    return this.buffer
      .filter(a => a.quality === 'ELITE')
      .slice(0, limit);
  }

  // ======================================
  // 📊 GET ALL SCORED ALERTS
  // ======================================

  static getAll(limit = 50) {

    return this.buffer.slice(0, limit);
  }

  // ======================================
  // 🧹 CLEAR PIPELINE
  // ======================================

  static clear() {
    this.buffer = [];
    console.log('🧹 AlertPipeline limpo');
  }
}