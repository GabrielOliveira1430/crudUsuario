// security.service.ts

import { redis } from '../../shared/config/redis';

// 🔍 LISTAR BLOQUEADOS
export const getBlocked = async () => {
  // 🔒 fallback seguro
  if (!redis) return [];

  // ✅ evita erro do TypeScript com redis possivelmente null
  const redisClient = redis;

  const keys = await redisClient.keys('blocked:*');

  const data = await Promise.all(
    keys.map(async (key) => {
      const ttl = await redisClient.ttl(key);
      return { key, ttl };
    })
  );

  return data;
};

// 🔍 LISTAR WHITELIST
export const getWhitelist = async () => {
  // 🔒 fallback seguro
  if (!redis) return [];

  // ✅ evita erro do TypeScript com redis possivelmente null
  const redisClient = redis;

  const keys = await redisClient.keys('whitelist:*');

  return keys;
};