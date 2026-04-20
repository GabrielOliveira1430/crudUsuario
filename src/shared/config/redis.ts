import Redis from 'ioredis';

let redis: Redis | null = null;

const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    lazyConnect: false,
  });

  console.log('🟢 Conectando ao Redis via REDIS_URL');

  redis.on('connect', () => {
    console.log('🟢 Redis conectado');
  });

  redis.on('ready', () => {
    console.log('✅ Redis pronto para uso');
  });

  redis.on('error', (err: Error) => {
    console.error('🔴 Redis erro:', err.message);
  });

  redis.on('reconnecting', () => {
    console.log('🟡 Redis reconectando...');
  });
} else {
  console.log('🟡 Redis desativado (sem REDIS_URL)');
}

export { redis };