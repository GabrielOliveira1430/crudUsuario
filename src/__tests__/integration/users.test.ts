import request from 'supertest';
import app from '../../app';
import { redis } from '../../shared/config/redis';

// 🔥 mock correto do redis
jest.mock('../../shared/config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  }
}));

describe('Users Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 🔥 não bloqueia
    (redis.get as jest.Mock).mockResolvedValue(null);
  });

  it('deve bloquear sem token', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.status).toBe(401);
  });
});