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
      createdAt: { type: 'string', example: '2026-01-01T00:00:00Z' }
    }
  },

  /**
   * 📥 CREATE USER
   */
  CreateUser: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', example: 'Gabriel' },
      email: { type: 'string', example: 'gabriel@email.com' },
      password: { type: 'string', example: '123456' }
    }
  },

  /**
   * 🔐 LOGIN
   */
  Login: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', example: 'gabriel@email.com' },
      password: { type: 'string', example: '123456' }
    }
  },

  /**
   * ✏️ UPDATE USER
   */
  UpdateUser: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Gabriel Atualizado' },
      email: { type: 'string', example: 'novo@email.com' },
      password: { type: 'string', example: '123456' },
      role: {
        type: 'string',
        enum: ['USER', 'ADMIN'],
        example: 'USER'
      }
    }
  }
};