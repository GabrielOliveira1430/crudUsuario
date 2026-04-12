import {redis} from '../../shared/config/redis';

const PREFIX = 'permissions:';
const TTL = 60 * 10; // 10 minutos

export const getPermissionsFromCache = async (role: string) => {
  const data = await redis.get(PREFIX + role);

  if (!data) return null;

  return JSON.parse(data);
};

export const setPermissionsInCache = async (role: string, permissions: string[]) => {
  await redis.set(
    PREFIX + role,
    JSON.stringify(permissions),
    'EX',
    TTL
  );
};

export const invalidatePermissionCache = async (role: string) => {
  await redis.del(PREFIX + role);
};