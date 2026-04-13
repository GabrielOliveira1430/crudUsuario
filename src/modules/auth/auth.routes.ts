import { Router } from 'express';

import {
  login,
  refresh,
  logout,
  verify2FA,
  forgotPassword,
  resetPassword,
} from './auth.controller';

import { validate } from '../../shared/middlewares/validate.middleware';

import {
  loginSchema,
  verify2FASchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.schema';

import { ipBlockMiddleware } from '../../shared/middlewares/ipBlock.middleware';
import { authLimiter } from '../../shared/middlewares/rateLimit.middleware';

const router = Router();

/**
 * 🔐 AUTH (CENTRALIZADO)
 */

// 🔐 LOGIN
router.post(
  '/login',
  ipBlockMiddleware,
  authLimiter,
  validate(loginSchema),
  login
);

// 🔐 2FA
router.post(
  '/verify-2fa',
  ipBlockMiddleware,
  authLimiter,
  validate(verify2FASchema),
  verify2FA
);

// 📩 FORGOT PASSWORD
router.post(
  '/forgot-password',
  ipBlockMiddleware,
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

// 🔐 RESET PASSWORD
router.post(
  '/reset-password',
  ipBlockMiddleware,
  authLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

// 🔄 REFRESH TOKEN
router.post('/refresh', refresh);

// 🚪 LOGOUT
router.post('/logout', logout);

export default router;