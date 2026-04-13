import { redis } from '../../shared/config/redis';

const PREFIX = 'permissions:';
const TTL = 60 * 10; // 10 minutos

export const getPermissionsFromCache = async (role: string) => {
  try {
    const data = await redis.get(PREFIX + role);

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao buscar permissões no cache:', error);
    return null; // fallback seguro
  }
};

export const setPermissionsInCache = async (role: string, permissions: string[]) => {
  try {
    await redis.set(
      PREFIX + role,
      JSON.stringify(permissions),
      'EX',
      TTL
    );
  } catch (error) {
    console.error('Erro ao salvar permissões no cache:', error);
    // não quebra fluxo
  }
};

export const invalidatePermissionCache = async (role: string) => {
  try {
    await redis.del(PREFIX + role);
  } catch (error) {
    console.error('Erro ao invalidar cache de permissões:', error);
    // não quebra fluxo
  }
};