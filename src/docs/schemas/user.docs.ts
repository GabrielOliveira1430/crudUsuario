export const userSchemas = {
  /**
   * 📦 USER
   */
  User: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Gabriel' },
      email: { type: 'string', example: 'gabriel@email.com' },
      role: { type: 'string', example: 'USER' },
      createdAt: {
        type: 'string',
        example: '2026-01-01T00:00:00Z'
      }
    }
  },

  /**
   * 📥 CREATE USER
   */
  CreateUser: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        example: 'Gabriel'
      },
      email: {
        type: 'string',
        example: 'gabriel@email.com'
      },
      password: {
        type: 'string',
        example: 'Senha@123',
        description:
          'Senha deve conter no mínimo 6 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial'
      }
    }
  },

  /**
   * 🔐 LOGIN
   */
  Login: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        example: 'gabriel@email.com'
      },
      password: {
        type: 'string',
        example: 'Senha@123'
      }
    }
  },

  /**
   * ✏️ UPDATE USER
   */
  UpdateUser: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Gabriel Atualizado'
      },
      email: {
        type: 'string',
        example: 'novo@email.com'
      },
      password: {
        type: 'string',
        example: 'NovaSenha@123',
        description:
          'Senha deve conter no mínimo 6 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial'
      },
      role: {
        type: 'string',
        enum: ['USER', 'ADMIN'],
        example: 'USER'
      }
    }
  }
};