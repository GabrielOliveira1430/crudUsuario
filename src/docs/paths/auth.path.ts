export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login do usuário',
      description: 'Realiza login e inicia fluxo de autenticação (pode incluir 2FA)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login realizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        400: {
          description: 'Credenciais inválidas',
        },
        429: {
          description: 'Muitas tentativas de login',
        },
      },
    },
  },

  '/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Gerar novo access token',
      description: 'Usa refresh token para gerar um novo access token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RefreshInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Token renovado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        403: {
          description: 'Token inválido ou expirado',
        },
      },
    },
  },

  '/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Logout do usuário',
      description: 'Invalida sessão/token do usuário',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LogoutInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Logout realizado com sucesso',
        },
      },
    },
  },
};