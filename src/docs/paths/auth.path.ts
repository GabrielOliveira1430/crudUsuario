export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login do usuário',
      description: 'Realiza login e inicia fluxo com 2FA',
      security: [],
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
          description: 'Código 2FA enviado',
        },
        400: {
          description: 'Credenciais inválidas',
        },
        429: {
          description: 'Muitas tentativas',
        },
      },
    },
  },

  '/auth/verify-2fa': {
    post: {
      tags: ['Auth'],
      summary: 'Verificar código 2FA',
      description: 'Valida código enviado por email e retorna tokens',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Verify2FAInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login concluído com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        400: {
          description: 'Código inválido ou expirado',
        },
      },
    },
  },

  '/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Gerar novo access token',
      description: 'Usa refresh token',
      security: [],
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
      description: 'Invalida sessão/token',
      security: [{ bearerAuth: [] }],
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

  // 🔥 NOVOS ENDPOINTS

  '/auth/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Solicitar recuperação de senha',
      description: 'Envia link de recuperação por email',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ForgotPasswordInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email enviado (se existir)',
        },
      },
    },
  },

  '/auth/reset-password': {
    post: {
      tags: ['Auth'],
      summary: 'Redefinir senha',
      description: 'Atualiza senha usando token de recuperação',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResetPasswordInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Senha redefinida com sucesso',
        },
        400: {
          description: 'Token inválido ou expirado',
        },
      },
    },
  },
};