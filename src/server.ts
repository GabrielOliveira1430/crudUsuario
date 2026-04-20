if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import app from './app';
import { redis } from './shared/config/redis';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    console.log('🔥 REDIS_URL:', process.env.REDIS_URL);

    // 🟡 Redis opcional (não pode quebrar a API)
    if (redis) {
      try {
        await redis.set('test', 'ok');
        const value = await redis.get('test');
        console.log('🟢 Redis conectado:', value);
      } catch (redisError) {
        console.log('🟡 Redis não conectado (continuando sem ele)');
      }
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📘 Swagger: /docs`);
    });

  } catch (error) {
    console.error('🔴 Erro ao iniciar servidor:', error);

    // 🔥 fallback seguro (nunca deixa o app cair)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando (fallback) na porta ${PORT}`);
    });
  }
}

// 🚫 evita rodar em testes
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };