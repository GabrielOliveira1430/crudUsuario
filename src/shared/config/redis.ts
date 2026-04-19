import Redis from 'ioredis';

const isRedisEnabled = !!process.env.REDIS_URL;

let redis: any;

if (isRedisEnabled) {
  redis = new Redis(process.env.REDIS_URL!);

  redis.on('connect', () => {
    console.log('🟢 Redis conectado');
  });

  redis.on('error', (err: Error) => {
    console.error('🔴 Redis erro:', err.message);
  });

} else {
  console.log('🟡 Redis desativado (modo fallback)');

  // 🔥 Fake Redis (não quebra seu sistema)
  redis = {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 0,
    exists: async () => 0,
    incr: async () => 0,
    expire: async () => 0,
    keys: async () => [],
    ttl: async () => -1,
  };
}

export { redis };