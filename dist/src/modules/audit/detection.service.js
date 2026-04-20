"use strict";
// detection.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectSuspiciousActivity = void 0;
const redis_1 = require("../../shared/config/redis");
const WINDOW = 60; // segundos
const detectSuspiciousActivity = async (data) => {
    const { userId, action, ip } = data;
    // 🔒 fallback seguro se Redis não existir
    if (!redis_1.redis) {
        return {
            suspicious: false,
        };
    }
    const keyBase = userId ? `user:${userId}` : `ip:${ip}`;
    // 🔥 contador geral
    const activityKey = `${keyBase}:activity`;
    const total = await redis_1.redis.incr(activityKey);
    if (total === 1) {
        await redis_1.redis.expire(activityKey, WINDOW);
    }
    // 🔥 contador de DELETE
    const deleteKey = `${keyBase}:delete`;
    let deleteCount = 0;
    if (action === 'DELETE') {
        deleteCount = await redis_1.redis.incr(deleteKey);
        if (deleteCount === 1) {
            await redis_1.redis.expire(deleteKey, WINDOW);
        }
    }
    // 🚨 REGRAS
    // 1. muitos deletes
    if (deleteCount >= 5) {
        return {
            suspicious: true,
            reason: 'Muitos DELETE em pouco tempo',
        };
    }
    // 2. muita atividade geral
    if (total >= 20) {
        return {
            suspicious: true,
            reason: 'Muitas ações em pouco tempo',
        };
    }
    return {
        suspicious: false,
    };
};
exports.detectSuspiciousActivity = detectSuspiciousActivity;
