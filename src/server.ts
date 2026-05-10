if (
  process.env.NODE_ENV !== 'production'
) {
  require('dotenv').config();
}

import app from './app';

import { redis }
  from './shared/config/redis';

import {
  HistoryRealtimeEngine
} from './modules/history/history.realtime';

import {
  LearningMemory
} from './modules/auto-learning/learning.memory';

import {
  DrawSyncService
} from './modules/draw-sync/draw-sync.service';


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
    // 🧠 LOAD LEARNING MEMORY
    // ==========================================

    await LearningMemory.initialize();

    console.log(
      '🧠 LearningMemory inicializada'
    );


    // ==========================================
    // 📡 SYNC REAL LOTTERY DATA
    // ==========================================

    await DrawSyncService
      .syncMegaSena();

    console.log(
      '🎰 Mega-Sena sincronizada'
    );


    // ==========================================
    // 🚀 START REALTIME HISTORY ENGINE
    // ==========================================

    HistoryRealtimeEngine.start();

    console.log(
      '📡 HistoryRealtimeEngine iniciado'
    );


    // ==========================================
    // 🚀 START SERVER
    // ==========================================

    app.listen(
      PORT,
      '0.0.0.0',
      () => {

        console.log(
          `🚀 Servidor rodando na porta ${PORT}`
        );

        console.log(
          `📘 Health: /health`
        );
      }
    );

  } catch (error) {

    console.error(
      '🔴 Erro ao iniciar servidor:',
      error
    );

    app.listen(
      PORT,
      '0.0.0.0',
      () => {

        console.log(
          `🚀 Servidor rodando (fallback) na porta ${PORT}`
        );
      }
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