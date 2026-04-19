import Redis from 'ioredis';

let redis: Redis | null = null;

// ✅ Só conecta se tiver URL EXPLÍCITA
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);

  redis.on('connect', () => {
    console.log('🟢 Redis conectado');
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