// tokenBlacklist.service.ts

import { redis } from '../../shared/config/redis';

const PREFIX = 'blacklist:';

// ⏱ calcula tempo restante do token
function getTTL(exp: number) {
  const now = Math.floor(Date.now() / 1000);
  return exp - now;
}

// 🚫 adicionar token na blacklist
export async function blacklistToken(token: string, exp: number) {
  try {
    const ttl = getTTL(exp);

    // 🔒 evita salvar token já expirado
    if (ttl <= 0) return;

    // 🔒 fallback seguro caso Redis não esteja configurado
    if (!redis) return;

    await redis.set(`${PREFIX}${token}`, '1', 'EX', ttl);
  } catch (error) {
    console.error('Erro ao adicionar token na blacklist:', error);
    // não quebra o fluxo (segurança resiliente)
  }
}

// 🔎 verificar se token está bloqueado
export async function isBlacklisted(token: string) {
  try {
    // 🔒 fallback seguro:
    // se Redis estiver indisponível, bloqueia por segurança
    if (!redis) return true;

    const exists = await redis.get(`${PREFIX}${token}`);
    return !!exists;
  } catch (error) {
    console.error('Erro ao verificar blacklist:', error);

    // 🔒 fallback seguro:
    // se Redis falhar, bloqueia o acesso
    return true;
  }
}