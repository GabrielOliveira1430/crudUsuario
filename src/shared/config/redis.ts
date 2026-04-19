import Redis from 'ioredis';

let redis: Redis;

if (process.env.REDIS_URL) {
  // 🚀 PRODUÇÃO (Railway)
  redis = new Redis(process.env.REDIS_URL);
} else {
  // 💻 LOCAL
  redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });
}

// logs
redis.on('connect', () => {
  console.log('🟢 Redis conectado');
});

redis.on('error', (err) => {
  console.error('🔴 Redis erro:', err.message);
});

export { redis };