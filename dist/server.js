"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
// 🔥 REDIS
const redis_1 = require("./shared/config/redis");
const PORT = process.env.PORT || 3000;
// 🚀 TESTAR REDIS NA INICIALIZAÇÃO
async function startServer() {
    try {
        // Teste de conexão com Redis
        await redis_1.redis.set('test', 'ok');
        const value = await redis_1.redis.get('test');
        console.log('🟢 Redis conectado:', value);
        // Iniciar servidor
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log(`📘 Swagger em http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error('🔴 Erro ao conectar no Redis:', error);
        process.exit(1);
    }
}
startServer();
