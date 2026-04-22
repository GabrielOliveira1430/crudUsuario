import { userPaths } from './paths/users.path';
import { authPaths } from './paths/auth.path';

import { userSchemas } from './schemas/user.docs';
import { authSchemas } from './schemas/auth.docs';

export const swaggerDocument = {
  openapi: '3.0.0',

  info: {
    title: 'CoreAuth API',
    version: '1.0.0',
    description: 'API de usuários e autenticação com JWT',
  },

  servers: [
    {
      url:
        process.env.NODE_ENV === 'production'
          ? 'https://api.coreauth.dev/api/v1'
          : 'http://localhost:3000/api/v1',
    },
  ],

  tags: [
    {
      name: 'Users',
      description: 'CRUD de usuários',
    },
    {
      name: 'Auth',
      description: 'Autenticação e login',
    },
  ],

  paths: {
    ...userPaths,
    ...authPaths,
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Formato: Bearer {token}',
      },
    },

    schemas: {
      ...userSchemas,
      ...authSchemas,
    },
  },

  // 🔐 Protege tudo por padrão
  security: [
    {
      bearerAuth: [],
    },
  ],
};