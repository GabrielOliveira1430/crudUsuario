import request from 'supertest';
import app from '../../app';
import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';
import { redis } from '../../shared/config/redis';

// 🔥 MOCK REDIS COMPLETO
jest.mock('../../shared/config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn()
  }
}));

// 🔥 MOCK CORRETO DO MAIL SERVICE (CLASSE)
jest.mock('../../modules/mail/mail.service', () => {
  return {
    MailService: jest.fn().mockImplementation(() => ({
      send2FACode: jest.fn().mockResolvedValue(true)
    }))
  };
});

describe('Auth Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 🔥 não bloqueia IP/user
    (redis.get as jest.Mock).mockResolvedValue(null);

    // 🔥 contador de tentativas
    (redis.incr as jest.Mock).mockResolvedValue(1);
  });

  it('deve iniciar login e enviar 2FA', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@mail.com',
      password: 'hash',
      isActive: true,
      loginAttempts: 0,
      lockUntil: null,
      lastLoginIp: null,
      lastUserAgent: null
    });

    (prisma.user.update as jest.Mock).mockResolvedValue({});
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@mail.com',
        password: '123456'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });
});