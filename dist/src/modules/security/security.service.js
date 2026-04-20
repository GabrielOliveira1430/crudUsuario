"use strict";
// security.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWhitelist = exports.getBlocked = void 0;
const redis_1 = require("../../shared/config/redis");
// 🔍 LISTAR BLOQUEADOS
const getBlocked = async () => {
    // 🔒 fallback seguro
    if (!redis_1.redis)
        return [];
    // ✅ evita erro do TypeScript com redis possivelmente null
    const redisClient = redis_1.redis;
    const keys = await redisClient.keys('blocked:*');
    const data = await Promise.all(keys.map(async (key) => {
        const ttl = await redisClient.ttl(key);
        return { key, ttl };
    }));
    return data;
};
exports.getBlocked = getBlocked;
// 🔍 LISTAR WHITELIST
const getWhitelist = async () => {
    // 🔒 fallback seguro
    if (!redis_1.redis)
        return [];
    // ✅ evita erro do TypeScript com redis possivelmente null
    const redisClient = redis_1.redis;
    const keys = await redisClient.keys('whitelist:*');
    return keys;
};
exports.getWhitelist = getWhitelist;
