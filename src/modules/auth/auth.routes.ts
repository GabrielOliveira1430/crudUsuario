import { Router } from 'express';
import { login, refresh, logout, verify2FA } from './auth.controller';
import { validate } from '../../shared/middlewares/validate.middleware';
import { loginSchema } from './auth.schema';
import { ipBlockMiddleware } from '../../shared/middlewares/ipBlock.middleware';

const router = Router();

// 🔐 LOGIN (com proteção de IP)
router.post('/login', ipBlockMiddleware, validate(loginSchema), login);

// 🔐 VERIFICAÇÃO 2FA
router.post('/verify-2fa', validate(loginSchema), verify2FA); 
// (pode criar um schema específico depois se quiser)


// 🔄 REFRESH TOKEN
router.post('/refresh', refresh);

// 🚪 LOGOUT
router.post('/logout', logout);

export default router;