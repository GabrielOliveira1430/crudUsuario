import { redis } from '../../shared/config/redis';

const PREFIX = 'blacklist:';

// ⏱ calcula tempo restante do token
function getTTL(exp: number) {
  const now = Math.floor(Date.now() / 1000);
  return exp - now;
}

// 🚫 adicionar token na blacklist
export async function blacklistToken(token: string, exp: number) {
  const ttl = getTTL(exp);

  if (ttl > 0) {
    await redis.set(`${PREFIX}${token}`, '1', 'EX', ttl);
  }
}

// 🔎 verificar se token está bloqueado
export async function isBlacklisted(token: string) {
  const exists = await redis.get(`${PREFIX}${token}`);
  return !!exists;
}