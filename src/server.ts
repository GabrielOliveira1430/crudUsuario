import 'dotenv/config';
import app from './app';

// 🔥 REDIS
import { redis } from './shared/config/redis';

const PORT = process.env.PORT || 3000;

// 🚀 Função de inicialização
async function startServer() {
  try {
    // ✅ Teste de conexão com Redis (somente se existir)
    if (redis) {
      await redis.set('test', 'ok');
      const value = await redis.get('test');

      console.log('🟢 Redis conectado:', value);
    } else {
      console.log('🟡 Redis não configurado');
    }

    // ✅ Subir servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📘 Swagger em /api-docs`);
    });

  } catch (error) {
    console.error('🔴 Erro ao iniciar servidor:', error);

    // ❗ NÃO derruba a aplicação por causa do Redis
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT} (sem Redis)`);
    });
  }
}

// 🚀 Só inicia se NÃO estiver em teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };