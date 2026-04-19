import Redis from 'ioredis';

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);

  redis.on('connect', () => {
    console.log('🟢 Redis conectado');
  });

  redis.on('error', (err: Error) => {
    console.error('🔴 Redis erro:', err.message);
  });

} else {
  console.log('🟡 Redis desativado (sem configuração)');
}

export { redis };