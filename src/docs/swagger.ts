import { userPaths } from './paths/users.path';
import { userSchemas } from './schemas/user.docs';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Profissional',
    version: '1.0.0',
    description: 'API de usuários'
  },

  servers: [
    {
      url: 'http://localhost:3000/api/v1'
    }
  ],

  tags: [
    {
      name: 'Users',
      description: 'Rotas de usuários'
    }
  ],

  paths: {
    ...userPaths
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },

    schemas: {
      ...userSchemas
    }
  },

  security: [
    {
      bearerAuth: []
    }
  ]
};