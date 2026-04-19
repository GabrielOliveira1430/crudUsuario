import Redis from 'ioredis';

let redis: Redis | null = null;

/**
 * Railway-safe Redis config
 *
 * PRODUÇÃO:
 * usa apenas REDIS_URL
 *
 * LOCAL:
 * sem REDIS_URL → Redis desativado
 *
 * Isso evita crash no Railway e evita localhost indevido.
 */

const redisUrl = process.env.REDIS_URL;

try {
  // 🔥 PRODUÇÃO (Railway)
  if (redisUrl) {
    console.log('🟢 Usando REDIS_URL do Railway...');

    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: false,
      connectTimeout: 10000,
    });

    redis.on('connect', () => {
      console.log('🟢 Redis conectado');
    });

    redis.on('ready', () => {
      console.log('✅ Redis pronto para uso');
    });

    redis.on('reconnecting', () => {
      console.log('🟡 Redis reconectando...');
    });

    redis.on('error', (err: Error) => {
      console.error('🔴 Redis erro:', err.message);
    });
  }

  // 🔥 SEM REDIS LOCAL → não tenta localhost
  else {
    console.log('🟡 REDIS_URL não encontrada → Redis desativado');

    redis = null;
  }
} catch (error) {
  console.error('🔴 Falha ao iniciar Redis:', error);

  // fallback seguro
  redis = null;
}

export { redis };