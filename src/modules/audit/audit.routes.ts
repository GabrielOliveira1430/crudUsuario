import { Router } from 'express';
import { getLogs } from './audit.controller';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { permissionMiddleware } from '../../shared/middlewares/permission.middleware';

const router = Router();

// 🔐 apenas quem tem permissão
router.get(
  '/',
  authMiddleware,
  permissionMiddleware('audit:read'),
  getLogs
);

export default router;