"use strict";
// block.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockUser = exports.unblockIP = exports.whitelistUser = exports.whitelistIP = exports.isBlocked = exports.blockUser = exports.blockIP = void 0;
const redis_1 = require("../config/redis");
const BLOCK_TIME = 60 * 10; // 10 min
// 🔥 KEYS
const IP_BLOCK = (ip) => `blocked:ip:${ip}`;
const USER_BLOCK = (id) => `blocked:user:${id}`;
const IP_WHITELIST = (ip) => `whitelist:ip:${ip}`;
const USER_WHITELIST = (id) => `whitelist:user:${id}`;
// 🚫 BLOQUEIO
const blockIP = async (ip) => {
    if (!redis_1.redis)
        return;
    const isWhite = await redis_1.redis.get(IP_WHITELIST(ip));
    if (isWhite)
        return;
    await redis_1.redis.set(IP_BLOCK(ip), '1', 'EX', BLOCK_TIME);
};
exports.blockIP = blockIP;
const blockUser = async (userId) => {
    if (!redis_1.redis)
        return;
    const isWhite = await redis_1.redis.get(USER_WHITELIST(userId));
    if (isWhite)
        return;
    await redis_1.redis.set(USER_BLOCK(userId), '1', 'EX', BLOCK_TIME);
};
exports.blockUser = blockUser;
// 🔍 VERIFICA BLOQUEIO
const isBlocked = async (ip, userId) => {
    // 🔒 sem Redis → não bloqueia
    if (!redis_1.redis)
        return false;
    if (await redis_1.redis.get(IP_WHITELIST(ip)))
        return false;
    if (userId && (await redis_1.redis.get(USER_WHITELIST(userId))))
        return false;
    const ipBlocked = await redis_1.redis.get(IP_BLOCK(ip));
    if (ipBlocked)
        return true;
    if (userId) {
        const userBlocked = await redis_1.redis.get(USER_BLOCK(userId));
        if (userBlocked)
            return true;
    }
    return false;
};
exports.isBlocked = isBlocked;
// 🟢 WHITELIST
const whitelistIP = async (ip) => {
    if (!redis_1.redis)
        return;
    await redis_1.redis.set(IP_WHITELIST(ip), '1');
};
exports.whitelistIP = whitelistIP;
const whitelistUser = async (userId) => {
    if (!redis_1.redis)
        return;
    await redis_1.redis.set(USER_WHITELIST(userId), '1');
};
exports.whitelistUser = whitelistUser;
// 🔓 DESBLOQUEIO
const unblockIP = async (ip) => {
    if (!redis_1.redis)
        return;
    await redis_1.redis.del(IP_BLOCK(ip));
};
exports.unblockIP = unblockIP;
const unblockUser = async (userId) => {
    if (!redis_1.redis)
        return;
    await redis_1.redis.del(USER_BLOCK(userId));
};
exports.unblockUser = unblockUser;
