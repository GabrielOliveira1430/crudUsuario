import request from 'supertest';
import app from '../../app';
import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';
import { redis } from '../../shared/config/redis';
import { blacklistToken } from '../../modules/auth/tokenBlacklist.service';

// 🔥 MOCK REDIS COMPLETO
jest.mock('../../shared/config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  },
}));

// 🔥 MOCK MAIL SERVICE
jest.mock('../../modules/mail/mail.service', () => {
  return {
    MailService: jest.fn().mockImplementation(() => ({
      send2FACode: jest.fn().mockResolvedValue(true),
    })),
  };
});

// 🔥 MOCK BLACKLIST
jest.mock('../../modules/auth/tokenBlacklist.service', () => ({
  blacklistToken: jest.fn(),
}));

describe('Auth Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (redis.get as jest.Mock).mockResolvedValue(null);
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
      lastUserAgent: null,
    });

    (prisma.user.update as jest.Mock).mockResolvedValue({});
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@mail.com',
        password: '123456',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
  });
});

describe('Refresh Token', () => {
  const fakeToken = 'valid-refresh-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renovar token com sucesso', async () => {
    (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
      token: fakeToken,
      userId: 1,
      expiresAt: new Date(Date.now() + 100000),
    });

    (prisma.refreshToken.delete as jest.Mock).mockResolvedValue({});
    (prisma.refreshToken.create as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: fakeToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('deve falhar sem refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('deve falhar com token inexistente no banco', async () => {
    (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'invalid-token' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('deve falhar com token expirado', async () => {
    (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
      token: fakeToken,
      userId: 1,
      expiresAt: new Date(Date.now() - 1000),
    });

    (prisma.refreshToken.delete as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: fakeToken });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('deve falhar com token JWT inválido', async () => {
    const jwt = require('jsonwebtoken');

    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: fakeToken });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

describe('Logout', () => {
  const fakeAccessToken = 'fake-access-token';
  const fakeRefreshToken = 'fake-refresh-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer logout com sucesso', async () => {
    (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${fakeAccessToken}`)
      .send({ refreshToken: fakeRefreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');

    expect(blacklistToken).toHaveBeenCalled();
  });

  it('deve falhar sem authorization header', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: fakeRefreshToken });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('deve falhar sem refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${fakeAccessToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});