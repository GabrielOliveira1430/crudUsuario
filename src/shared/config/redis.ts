import Redis from 'ioredis';

let client: Redis | null = null;

if (process.env.REDIS_URL) {
  client = new Redis(process.env.REDIS_URL);

  client.on('connect', () => {
    console.log('🟢 Redis conectado');
  });

  client.on('error', (err: Error) => {
    console.error('🔴 Redis erro:', err.message);
  });

  client.on('reconnecting', () => {
    console.log('🟡 Redis reconectando...');
  });
} else {
  console.log('🟡 Redis desativado (sem REDIS_URL)');
}

// ✅ Wrapper seguro
export const redis = {
  async get(key: string) {
    if (!client) return null;
    return client.get(key);
  },

  async set(key: string, value: string, ttl?: number) {
    if (!client) return null;
    if (ttl) {
      return client.set(key, value, 'EX', ttl);
    }
    return client.set(key, value);
  },

  async del(key: string) {
    if (!client) return null;
    return client.del(key);
  },

  async exists(key: string) {
    if (!client) return false;
    return client.exists(key);
  }
};