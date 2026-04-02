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
  },

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

  RefreshInput: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        example: 'refresh_token_aqui',
      },
    },
  },

  LogoutInput: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        example: 'refresh_token_aqui',
      },
    },
  },
};