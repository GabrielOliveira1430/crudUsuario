import rateLimit from 'express-rate-limit';

/**
 * 🛡 Rate limit global
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 🔥 AUMENTADO TEMPORARIAMENTE
  message: {
    success: false,
    error: 'Muitas requisições, tente novamente mais tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 🔐 Rate limit para login (mais restrito)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 🔥 AUMENTADO TEMPORARIAMENTE PARA TESTES
  message: {
    success: false,
    error: 'Muitas tentativas de login, tente novamente mais tarde'
  }
});