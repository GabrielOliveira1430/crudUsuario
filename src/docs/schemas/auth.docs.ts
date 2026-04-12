export const authSchemas = {
  LoginInput: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'gabriel@email.com',
      },
      password: {
        type: 'string',
        example: '123@Abc',
      },
    },
    required: ['email', 'password'],
  },

  // 🔐 RESPOSTA DO LOGIN (2FA)
  LoginResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      data: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Código de verificação enviado',
          },
          security: {
            type: 'object',
            properties: {
              suspiciousLogin: {
                type: 'boolean',
                example: false,
              },
            },
          },
        },
      },
    },
  },

  // 🔐 VERIFY 2FA
  Verify2FAInput: {
    type: 'object',
    required: ['email', 'code'],
    properties: {
      email: {
        type: 'string',
        example: 'teste@teste.com',
      },
      code: {
        type: 'string',
        example: '123456',
      },
    },
  },

  // 🔐 RESPOSTA COM TOKENS
  AuthResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'jwt_token_aqui',
          },
          refreshToken: {
            type: 'string',
            example: 'refresh_token_aqui',
          },
        },
      },
    },
  },

  // 🔄 REFRESH
  RefreshInput: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        example: 'refresh_token_aqui',
      },
    },
    required: ['refreshToken'],
  },

  // 🚪 LOGOUT
  LogoutInput: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        example: 'refresh_token_aqui',
      },
    },
    required: ['refreshToken'],
  },

  // 🔥 NOVOS SCHEMAS

  // 📩 FORGOT PASSWORD
  ForgotPasswordInput: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'usuario@email.com',
      },
    },
    required: ['email'],
  },

  // 🔐 RESET PASSWORD
  ResetPasswordInput: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        example: 'token_recebido_email',
      },
      password: {
        type: 'string',
        example: 'NovaSenha123',
      },
    },
    required: ['token', 'password'],
  },
};