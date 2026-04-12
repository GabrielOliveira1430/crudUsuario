"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistToken = blacklistToken;
exports.isBlacklisted = isBlacklisted;
const redis_1 = require("../../shared/config/redis");
const PREFIX = 'blacklist:';
// ⏱ calcula tempo restante do token
function getTTL(exp) {
    const now = Math.floor(Date.now() / 1000);
    return exp - now;
}
// 🚫 adicionar token na blacklist
async function blacklistToken(token, exp) {
    const ttl = getTTL(exp);
    if (ttl > 0) {
        await redis_1.redis.set(`${PREFIX}${token}`, '1', 'EX', ttl);
    }
}
// 🔎 verificar se token está bloqueado
async function isBlacklisted(token) {
    const exists = await redis_1.redis.get(`${PREFIX}${token}`);
    return !!exists;
}
