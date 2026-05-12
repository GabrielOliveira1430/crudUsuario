if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import app from './app';
import http from 'http';

import { redis } from './shared/config/redis';

import { HistoryRealtimeEngine } from './modules/history/history.realtime';
import { LearningMemory } from './modules/auto-learning/learning.memory';
import { DrawSyncService } from './modules/draw-sync/draw-sync.service';
import { SourceWeightEngine } from './modules/analytics/source-weight.engine';
import { FootballRealtime } from './modules/football/football.realtime';

import { initWebSocket } from './shared/websocket/ws.server';
import { OrchestratorRealtime } from './modules/ai-orchestrator/orchestrator.realtime';

const PORT =
  Number(process.env.PORT) || 3000;

// ==========================================
// 🚀 SERVER START
// ==========================================

async function startServer() {

  try {

    console.log(
      '🔥 REDIS_URL:',
      process.env.REDIS_URL || 'não configurado'
    );

    // ==========================================
    // 🔴 REDIS
    // ==========================================

    if (redis) {

      try {

        await redis.set(
          'test',
          'ok'
        );

        const value =
          await redis.get('test');

        console.log(
          '🟢 Redis conectado:',
          value
        );

      } catch {

        console.log(
          '🟡 Redis não conectado (continuando sem ele)'
        );
      }
    }

    // ==========================================
    // 🧠 AI MEMORY
    // ==========================================

    await LearningMemory.initialize();

    console.log(
      '🧠 LearningMemory inicializada'
    );

    console.log(
      '⚖️ Source Weights:',
      SourceWeightEngine.getAll()
    );

    // ==========================================
    // 📡 SYNC DATA
    // ==========================================

    await DrawSyncService.syncMegaSena();

    console.log(
      '🎰 Mega-Sena sincronizada'
    );

    // ==========================================
    // 🚀 HTTP SERVER
    // ==========================================

    const server =
      http.createServer(app);

    // ==========================================
    // ⚡ WEBSOCKET
    // ==========================================

    const wss =
      initWebSocket(server);

    console.log(
      '⚡ WebSocket inicializado'
    );

    // ==========================================
    // 🚀 REALTIME ENGINES
    // ==========================================

    HistoryRealtimeEngine.start();

    console.log(
      '📡 HistoryRealtimeEngine iniciado'
    );

    FootballRealtime.start();

    console.log(
      '⚽ FootballRealtime iniciado'
    );

    OrchestratorRealtime.start();

    console.log(
      '🧠 OrchestratorRealtime iniciado'
    );

    // ==========================================
    // 🚀 SERVER LISTEN
    // ==========================================

    server.listen(
      PORT,
      '0.0.0.0',
      () => {

        console.log(
          `🚀 Servidor rodando na porta ${PORT}`
        );

        console.log(
          `📘 Health: /health`
        );

        console.log(
          `⚡ WebSocket ativo: ws://localhost:${PORT}/ws`
        );

        console.log(
          `🔌 WS clients conectados: ${wss?.clients?.size || 0}`
        );
      }
    );

    // ==========================================
    // 🔌 DEBUG CLIENTS
    // ==========================================

    setInterval(() => {

      console.log(
        `🔌 WS clients ativos: ${wss?.clients?.size || 0}`
      );

    }, 15000);

  } catch (error) {

    console.error(
      '🔴 Erro ao iniciar servidor:',
      error
    );
  }
}

// ==========================================
// 🚀 AUTO START
// ==========================================

if (
  process.env.NODE_ENV !== 'test'
) {

  startServer();
}

export {
  startServer
};