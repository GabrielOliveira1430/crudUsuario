import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../../docs/swagger';

export const swaggerSetup = (app: Express) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const serverUrl = isProduction
    ? 'https://api.coreauth.dev/api/v1'
    : 'http://localhost:3000/api/v1';

  const document = {
    ...swaggerDocument,
    servers: [
      {
        url: serverUrl,
        description: isProduction ? 'Production' : 'Local',
      },
    ],
  };

  console.log('🔥 Swagger rodando em:', serverUrl);

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