import Redis from 'ioredis';

let redis: Redis | null = null;

/**
 * Railway + Local fallback seguro
 *
 * Ordem:
 * 1. REDIS_URL (preferencial no Railway)
 * 2. REDIS_HOST + REDIS_PORT + REDIS_PASSWORD
 * 3. Localhost (somente ambiente local)
 */

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT || 6379);
const redisPassword = process.env.REDIS_PASSWORD;

try {
  // 🔥 PRODUÇÃO (Railway normalmente usa REDIS_URL)
  if (redisUrl) {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: false,
    });

    console.log('🟢 Tentando conectar via REDIS_URL...');
  }

  // 🔥 PRODUÇÃO alternativa (host + port + password)
  else if (redisHost) {
    redis = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: false,
    });

    console.log('🟢 Tentando conectar via REDIS_HOST...');
  }

  // 🔥 LOCAL DEV
  else {
    redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: false,
    });

    console.log('🟡 Redis local (localhost:6379)');
  }

  if (redis) {
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
} catch (error) {
  console.error('🔴 Erro ao conectar no Redis:', error);
  redis = null;
}

export { redis };