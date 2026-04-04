import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60; // segundos

// 🔧 função padrão de IP (igual ao controller)
function getClientIp(req: Request): string {
  let ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    req.ip ||
    'unknown';

  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  return ip;
}

// 🔒 Middleware
export async function ipBlockMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = getClientIp(req);

  const blockKey = `login:block:${ip}`;

  const isBlocked = await redis.get(blockKey);

  if (isBlocked) {
    return res.status(429).json({
      success: false,
      error: 'IP bloqueado temporariamente. Tente novamente mais tarde.',
    });
  }

  return next();
}

// 📈 registrar erro
export async function registerFailedAttempt(ip: string) {
  const attemptsKey = `login:attempts:${ip}`;
  const blockKey = `login:block:${ip}`;

  const attempts = await redis.incr(attemptsKey);

  // define expiração na primeira tentativa
  if (attempts === 1) {
    await redis.expire(attemptsKey, BLOCK_TIME);
  }

  if (attempts >= MAX_ATTEMPTS) {
    await redis.set(blockKey, '1', 'EX', BLOCK_TIME);

    // limpa contador
    await redis.del(attemptsKey);
  }
}

// ✅ resetar sucesso
export async function resetAttempts(ip: string) {
  const attemptsKey = `login:attempts:${ip}`;
  const blockKey = `login:block:${ip}`;

  await redis.del(attemptsKey);
  await redis.del(blockKey);
}