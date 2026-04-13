jest.mock('../database/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn()
    }
  }
}));

jest.mock('../shared/config/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  }
}));

// mocks globais úteis
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-token'),
  verify: jest.fn(() => ({ sub: '1' })), // 🔥 importante pro refresh
  decode: jest.fn(() => ({ exp: Math.floor(Date.now() / 1000) + 1000 }))
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));