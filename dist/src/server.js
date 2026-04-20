"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
// ✅ Carrega .env APENAS em ambiente local
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const app_1 = __importDefault(require("./app"));
const redis_1 = require("./shared/config/redis");
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        // 🔍 Debug para garantir que a variável chegou
        console.log('🔥 REDIS_URL:', process.env.REDIS_URL);
        // 🔥 Testa conexão com Redis se existir
        if (redis_1.redis) {
            await redis_1.redis.set('test', 'ok');
            const value = await redis_1.redis.get('test');
            console.log('🟢 Redis conectado:', value);
        }
        else {
            console.log('🟡 Rodando sem Redis');
        }
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📘 Swagger em /api-docs`);
        });
    }
    catch (error) {
        console.error('🔴 Erro ao iniciar servidor:', error);
        // 👉 Não derruba o servidor se Redis falhar
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT} (sem Redis)`);
        });
    }
}
// 🚫 Evita rodar em testes
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
