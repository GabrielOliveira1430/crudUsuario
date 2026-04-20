import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../../docs/swagger';

export const swaggerSetup = (app: any) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const serverUrl = isProduction
    ? 'https://crudusuario-production.up.railway.app/api/v1'
    : 'http://localhost:3000/api/v1';

  const document = {
    ...swaggerDocument,

    // 🔥 FIX DEFINITIVO
    servers: [
      {
        url: serverUrl,
      },
    ],
  };

  console.log('🔥 Swagger rodando em:', serverUrl);

  // 🚀 GARANTE CACHE LIMPO DO SWAGGER UI
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};