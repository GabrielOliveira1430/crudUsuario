import swaggerUi from 'swagger-ui-express';

import { swaggerDocument } from '../../docs/swagger';
import { authSchemas } from '../../docs/schemas/auth.docs';
import { authPaths } from '../../docs/paths/auth.path';

export const swaggerSetup = (app: any) => {
  const document = {
    ...swaggerDocument,

    // ✅ Junta TODAS as rotas (users + auth)
    paths: {
      ...swaggerDocument.paths,
      ...authPaths,
    },

    // ✅ Junta TODOS os schemas sem sobrescrever
    components: {
      ...swaggerDocument.components,
      schemas: {
        ...(swaggerDocument.components?.schemas || {}),
        ...authSchemas,
      },
    },
  };

  // 🚀 Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(document));
};