if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import app from './app';
import { redis } from './shared/config/redis';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🔥 REDIS_URL:', process.env.REDIS_URL);

    if (redis) {
      await redis.set('test', 'ok');
      const value = await redis.get('test');
      console.log('🟢 Redis conectado:', value);
    } else {
      console.log('🟡 Rodando sem Redis');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📘 Swagger: /docs`);
    });

  } catch (error) {
    console.error('🔴 Erro ao iniciar servidor:', error);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT} (fallback)`);
    });
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };