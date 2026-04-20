"use strict";
// tokenBlacklist.service.ts
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
    try {
        const ttl = getTTL(exp);
        // 🔒 evita salvar token já expirado
        if (ttl <= 0)
            return;
        // 🔒 fallback seguro caso Redis não esteja configurado
        if (!redis_1.redis)
            return;
        await redis_1.redis.set(`${PREFIX}${token}`, '1', 'EX', ttl);
    }
    catch (error) {
        console.error('Erro ao adicionar token na blacklist:', error);
        // não quebra o fluxo (segurança resiliente)
    }
}
// 🔎 verificar se token está bloqueado
async function isBlacklisted(token) {
    try {
        // 🔒 fallback seguro:
        // se Redis estiver indisponível, bloqueia por segurança
        if (!redis_1.redis)
            return true;
        const exists = await redis_1.redis.get(`${PREFIX}${token}`);
        return !!exists;
    }
    catch (error) {
        console.error('Erro ao verificar blacklist:', error);
        // 🔒 fallback seguro:
        // se Redis falhar, bloqueia o acesso
        return true;
    }
}
