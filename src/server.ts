if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import app from './app';

import { redis } from './shared/config/redis';

import {
  HistoryRealtimeEngine
} from './modules/history/history.realtime';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {

  try {

    console.log(
      '🔥 REDIS_URL:',
      process.env.REDIS_URL || 'não configurado'
    );

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
    // 🚀 START REALTIME HISTORY ENGINE
    // ==========================================
    HistoryRealtimeEngine.start();

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

if (
  process.env.NODE_ENV !== 'test'
) {
  startServer();
}

export {
  startServer
};