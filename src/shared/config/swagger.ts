import swaggerUi from 'swagger-ui-express';

import { swaggerDocument } from '../../docs/swagger';
import { authSchemas } from '../../docs/schemas/auth.docs';
import { authPaths } from '../../docs/paths/auth.path';

export const swaggerSetup = (app: any) => {
  const serverUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://crudusuario-production.up.railway.app'
      : 'http://localhost:3000';

  const document = {
    ...swaggerDocument,

    // 🔥 FORÇA sobrescrever o servers
    servers: [
      {
        url: serverUrl + '/api/v1',
      },
    ],

    paths: {
      ...swaggerDocument.paths,
      ...authPaths,
    },

    components: {
      ...swaggerDocument.components,
      schemas: {
        ...(swaggerDocument.components?.schemas || {}),
        ...authSchemas,
      },
    },
  };

  console.log("🔥 Swagger server:", serverUrl); // debug

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(document));
};