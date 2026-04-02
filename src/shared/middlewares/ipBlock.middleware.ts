const attempts = new Map<string, { count: number; lockUntil?: number }>();

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos

export function ipBlockMiddleware(req: any, res: any, next: any) {
  const ip = req.ip;

  const record = attempts.get(ip);

  // 🔒 IP bloqueado
  if (record?.lockUntil && record.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil(
      (record.lockUntil - Date.now()) / 60000
    );

    return res.status(429).json({
      success: false,
      error: `Muitas tentativas. Tente novamente em ${minutesLeft} minuto(s).`,
    });
  }

  // inicializa
  if (!record) {
    attempts.set(ip, { count: 0 });
  }

  next();
}

// 📈 registrar erro
export function registerFailedAttempt(ip: string) {
  const record = attempts.get(ip) || { count: 0 };

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.count = 0;
    record.lockUntil = Date.now() + BLOCK_TIME;
  }

  attempts.set(ip, record);
}

// ✅ resetar sucesso
export function resetAttempts(ip: string) {
  attempts.delete(ip);
}