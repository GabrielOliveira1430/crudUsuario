jest.mock('../../shared/config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

import {
  getPermissionsFromCache,
  setPermissionsInCache,
  invalidatePermissionCache,
} from '../../modules/auth/permissionCache.service';

import { redis } from '../../shared/config/redis';

describe('PermissionCacheService', () => {
  const role = 'admin';
  const permissions = ['read', 'write'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return permissions from cache', async () => {
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(permissions));

    const result = await getPermissionsFromCache(role);

    expect(result).toEqual(permissions);
  });

  it('should return null if cache is empty', async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    const result = await getPermissionsFromCache(role);

    expect(result).toBeNull();
  });

  it('should return null if redis fails', async () => {
    (redis.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

    const result = await getPermissionsFromCache(role);

    expect(result).toBeNull();
  });

  it('should return null if JSON parse fails', async () => {
    (redis.get as jest.Mock).mockResolvedValue('invalid-json');

    const result = await getPermissionsFromCache(role);

    expect(result).toBeNull();
  });

  it('should set permissions in cache', async () => {
    await setPermissionsInCache(role, permissions);

    expect(redis.set).toHaveBeenCalledTimes(1);
  });

  it('should not throw if redis.set fails', async () => {
    (redis.set as jest.Mock).mockRejectedValue(new Error('Redis error'));

    await expect(setPermissionsInCache(role, permissions)).resolves.not.toThrow();
  });

  it('should invalidate cache', async () => {
    await invalidatePermissionCache(role);

    expect(redis.del).toHaveBeenCalledTimes(1);
  });

  it('should not throw if redis.del fails', async () => {
    (redis.del as jest.Mock).mockRejectedValue(new Error('Redis error'));

    await expect(invalidatePermissionCache(role)).resolves.not.toThrow();
  });
});