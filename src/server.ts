// ✅ Carrega .env APENAS em ambiente local
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import app from './app';
import { redis } from './shared/config/redis';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 🔍 Debug para garantir que a variável chegou
    console.log('🔥 REDIS_URL:', process.env.REDIS_URL);

    // 🔥 Testa conexão com Redis se existir
    if (redis) {
      await redis.set('test', 'ok');
      const value = await redis.get('test');
      console.log('🟢 Redis conectado:', value);
    } else {
      console.log('🟡 Rodando sem Redis');
    }

    // ✅ ROTA RAIZ (NOVO)
    app.get("/", (req, res) => {
      res.send("API rodando 🚀");
    });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📘 Swagger em /api-docs`);
    });

  } catch (error) {
    console.error('🔴 Erro ao iniciar servidor:', error);

    // 👉 Não derruba o servidor se Redis falhar
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT} (sem Redis)`);
    });
  }
}

// 🚫 Evita rodar em testes
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };