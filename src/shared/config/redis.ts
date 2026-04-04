import Redis from 'ioredis';

// 🔧 CONFIGURAÇÃO
export const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,

  // 🔄 RECONEXÃO AUTOMÁTICA
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// ✅ CONECTADO
redis.on('connect', () => {
  console.log('🟢 Redis conectado');
});

// ❌ ERRO
redis.on('error', (err: Error) => {
  console.error('🔴 Redis erro:', err.message);
});

// 🔄 RECONNECT
redis.on('reconnecting', () => {
  console.log('🟡 Redis reconectando...');
});