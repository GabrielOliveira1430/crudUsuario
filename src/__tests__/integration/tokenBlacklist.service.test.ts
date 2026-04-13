jest.mock('../../shared/config/redis', () => ({
  redis: {
    set: jest.fn(),
    get: jest.fn(),
  },
}));

import { blacklistToken, isBlacklisted } from '../../modules/auth/tokenBlacklist.service';
import { redis } from '../../shared/config/redis';

describe('TokenBlacklistService', () => {
  const token = 'test-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add token to blacklist with TTL', async () => {
    const exp = Math.floor(Date.now() / 1000) + 60;

    await blacklistToken(token, exp);

    expect(redis.set).toHaveBeenCalledTimes(1);
  });

  it('should not add expired token', async () => {
    const exp = Math.floor(Date.now() / 1000) - 10;

    await blacklistToken(token, exp);

    expect(redis.set).not.toHaveBeenCalled();
  });

  it('should return true if token is blacklisted', async () => {
    (redis.get as jest.Mock).mockResolvedValue('1');

    const result = await isBlacklisted(token);

    expect(result).toBe(true);
  });

  it('should return false if token is not blacklisted', async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    const result = await isBlacklisted(token);

    expect(result).toBe(false);
  });

  it('should return true if redis fails (secure fallback)', async () => {
    (redis.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

    const result = await isBlacklisted(token);

    expect(result).toBe(true);
  });

  it('should not throw if redis.set fails', async () => {
    (redis.set as jest.Mock).mockRejectedValue(new Error('Redis error'));

    const exp = Math.floor(Date.now() / 1000) + 60;

    await expect(blacklistToken(token, exp)).resolves.not.toThrow();
  });
});