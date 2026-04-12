"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipBlockMiddleware = ipBlockMiddleware;
exports.registerFailedAttempt = registerFailedAttempt;
exports.resetAttempts = resetAttempts;
const redis_1 = require("../config/redis");
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60; // segundos
// 🔧 função padrão de IP (igual ao controller)
function getClientIp(req) {
    let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown';
    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    return ip;
}
// 🔒 Middleware
async function ipBlockMiddleware(req, res, next) {
    const ip = getClientIp(req);
    const blockKey = `login:block:${ip}`;
    const isBlocked = await redis_1.redis.get(blockKey);
    if (isBlocked) {
        return res.status(429).json({
            success: false,
            error: 'IP bloqueado temporariamente. Tente novamente mais tarde.',
        });
    }
    return next();
}
// 📈 registrar erro
async function registerFailedAttempt(ip) {
    const attemptsKey = `login:attempts:${ip}`;
    const blockKey = `login:block:${ip}`;
    const attempts = await redis_1.redis.incr(attemptsKey);
    // define expiração na primeira tentativa
    if (attempts === 1) {
        await redis_1.redis.expire(attemptsKey, BLOCK_TIME);
    }
    if (attempts >= MAX_ATTEMPTS) {
        await redis_1.redis.set(blockKey, '1', 'EX', BLOCK_TIME);
        // limpa contador
        await redis_1.redis.del(attemptsKey);
    }
}
// ✅ resetar sucesso
async function resetAttempts(ip) {
    const attemptsKey = `login:attempts:${ip}`;
    const blockKey = `login:block:${ip}`;
    await redis_1.redis.del(attemptsKey);
    await redis_1.redis.del(blockKey);
}
