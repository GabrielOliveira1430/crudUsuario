import {redis} from '../../shared/config/redis';

// 🔍 LISTAR BLOQUEADOS
export const getBlocked = async () => {
  const keys = await redis.keys('blocked:*');

  const data = await Promise.all(
    keys.map(async (key) => {
      const ttl = await redis.ttl(key);
      return { key, ttl };
    })
  );

  return data;
};

// 🔍 LISTAR WHITELIST
export const getWhitelist = async () => {
  const keys = await redis.keys('whitelist:*');

  return keys;
};