import { userPaths } from './paths/users.path'; 
import { authPaths } from './paths/auth.path';

import { userSchemas } from './schemas/user.docs';
import { authSchemas } from './schemas/auth.docs';

export const swaggerDocument = {
  openapi: '3.0.0',

  info: {
    title: 'API Profissional',
    version: '1.0.0',
    description: 'API de usuários e autenticação com segurança avançada',
  },

  // ❌ REMOVIDO servers daqui

  tags: [
    {
      name: 'Users',
      description: 'Rotas de usuários',
    },
    {
      name: 'Auth',
      description: 'Rotas de autenticação',
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
        description: 'Insira o token JWT no formato: Bearer {token}',
      },
    },

    schemas: {
      ...userSchemas,
      ...authSchemas,
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};