"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let redis = null;
exports.redis = redis;
const redisUrl = process.env.REDIS_URL;
if (redisUrl) {
    exports.redis = redis = new ioredis_1.default(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
        lazyConnect: false,
    });
    console.log('🟢 Conectando ao Redis via REDIS_URL');
    redis.on('connect', () => {
        console.log('🟢 Redis conectado');
    });
    redis.on('ready', () => {
        console.log('✅ Redis pronto para uso');
    });
    redis.on('error', (err) => {
        console.error('🔴 Redis erro:', err.message);
    });
    redis.on('reconnecting', () => {
        console.log('🟡 Redis reconectando...');
    });
}
else {
    console.log('🟡 Redis desativado (sem REDIS_URL)');
}
