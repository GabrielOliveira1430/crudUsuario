import 'dotenv/config';
import app from './app';
import { redis } from './shared/config/redis';

const PORT = process.env.PORT || 8080;

async function startServer() {
  let redisOk = false;

  try {
    // 🔥 tenta conectar Redis
    await redis.set('test', 'ok');
    const value = await redis.get('test');

    console.log('🟢 Redis conectado:', value);
    redisOk = true;
  } catch (error) {
    console.log('🟡 Redis não conectado (API continua sem cache)');
  }

  // 🚀 sobe servidor mesmo sem Redis
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📘 Swagger em /api-docs`);

    if (!redisOk) {
      console.log('⚠️ Rodando SEM Redis');
    }
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };