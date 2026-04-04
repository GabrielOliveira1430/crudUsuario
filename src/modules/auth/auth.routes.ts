import { Router } from 'express';
import { login, refresh, logout, verify2FA } from './auth.controller';

import { validate } from '../../shared/middlewares/validate.middleware';
import { loginSchema, verify2FASchema } from './auth.schema';

import { ipBlockMiddleware } from '../../shared/middlewares/ipBlock.middleware';
import { authLimiter } from '../../shared/middlewares/rateLimit.middleware';

const router = Router();

// 🔐 LOGIN (ORDEM CORRETA: Redis → RateLimit → Validate → Controller)
router.post(
  '/login',
  ipBlockMiddleware,   // 🔥 verifica bloqueio no Redis primeiro
  authLimiter,         // 🔥 limita tentativas de login
  validate(loginSchema),
  login
);

// 🔐 VERIFICAÇÃO 2FA (também protegido)
router.post(
  '/verify-2fa',
  ipBlockMiddleware,
  authLimiter,
  validate(verify2FASchema),
  verify2FA
);

// 🔄 REFRESH TOKEN
router.post('/refresh', refresh);

// 🚪 LOGOUT
router.post('/logout', logout);

export default router;