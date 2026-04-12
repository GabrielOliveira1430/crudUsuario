import 'dotenv/config';
import app from './app';

// 🔥 REDIS
import { redis } from './shared/config/redis';

const PORT = process.env.PORT || 3000;

// 🚀 Função de inicialização
async function startServer() {
  try {
    // ✅ Teste de conexão com Redis
    await redis.set('test', 'ok');
    const value = await redis.get('test');

    console.log('🟢 Redis conectado:', value);

    // ✅ Subir servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📘 Swagger em http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('🔴 Erro ao conectar no Redis:', error);
    process.exit(1);
  }
}

// 🚀 Só inicia se NÃO estiver em teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };