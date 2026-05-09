import { Router } from 'express';

import {

  login,

  verify2FA,

  refresh,

  logout,

  forgotPassword,

  resetPassword,

} from './auth.controller';

import { me } from './me.controller';

import {

  loginSchema,

  verify2FASchema,

  forgotPasswordSchema,

  resetPasswordSchema,

} from './auth.schema';

import { validate }
from '../../shared/middlewares/validate.middleware';

import {
  ipBlockMiddleware
} from '../../shared/middlewares/ipBlock.middleware';

import {
  authLimiter
} from '../../shared/middlewares/rateLimit.middleware';

import {
  authMiddleware
} from '../../shared/middlewares/auth.middleware';

const router = Router();


// ========================================
// 🔐 LOGIN
// ========================================

router.post(

  '/login',

  ipBlockMiddleware,

  authLimiter,

  validate(loginSchema),

  login
);


// ========================================
// 🔐 VERIFY 2FA
// ========================================

router.post(

  '/verify-2fa',

  ipBlockMiddleware,

  authLimiter,

  validate(
    verify2FASchema
  ),

  verify2FA
);


// ========================================
// 🔄 REFRESH TOKEN
// ========================================

router.post(
  '/refresh',
  refresh
);


// ========================================
// 🚪 LOGOUT
// ========================================

router.post(
  '/logout',
  logout
);


// ========================================
// 👤 AUTH USER PROFILE
// ========================================

router.get(

  '/me',

  authMiddleware,

  me
);


// ========================================
// 📩 FORGOT PASSWORD
// ========================================

router.post(

  '/forgot-password',

  ipBlockMiddleware,

  authLimiter,

  validate(
    forgotPasswordSchema
  ),

  forgotPassword
);


// ========================================
// 🔐 RESET PASSWORD
// ========================================

router.post(

  '/reset-password',

  ipBlockMiddleware,

  authLimiter,

  validate(
    resetPasswordSchema
  ),

  resetPassword
);

export default router;