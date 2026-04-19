import 'dotenv/config';
import app from './app';
import { redis } from './shared/config/redis';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 🔥 Só testa Redis se existir
    if (redis) {
      await redis.set('test', 'ok');
      const value = await redis.get('test');
      console.log('🟢 Redis conectado:', value);
    } else {
      console.log('🟡 Rodando sem Redis');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📘 Swagger em /api-docs`);
    });

  } catch (error) {
    console.error('🔴 Erro ao iniciar servidor:', error);

    // 👉 NÃO derruba o servidor se Redis falhar
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT} (sem Redis)`);
    });
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };