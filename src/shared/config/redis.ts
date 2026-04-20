import Redis from 'ioredis';

let redis: Redis | null = null;

const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
  console.log('🟢 Conectando ao Redis via REDIS_URL...');

  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy: () => null, // não fica em loop infinito
  });

  redis.on('connect', () => {
    console.log('🟢 Redis conectado');
  });

  redis.on('ready', () => {
    console.log('✅ Redis pronto para uso');
  });

  redis.on('error', (err: Error) => {
    console.log('🟡 Redis indisponível:', err.message);
  });
} else {
  console.log('🟡 Redis desativado (sem REDIS_URL)');
}

export { redis };