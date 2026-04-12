import { Router } from 'express';
import {
  getBlocked,
  getWhitelist,
  unblockIp,
  unblockUserController,
  addWhitelistIp,
  addWhitelistUser
} from './security.controller';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { permissionMiddleware } from '../../shared/middlewares/permission.middleware';

const router = Router();

// 🔐 PROTEGIDO
router.use(authMiddleware);

// 🔐 PERMISSÃO ADMIN (ou crie: security:manage)
router.use(permissionMiddleware('user:delete')); // pode trocar depois

router.get('/blocked', getBlocked);
router.get('/whitelist', getWhitelist);

router.post('/unblock/ip', unblockIp);
router.post('/unblock/user', unblockUserController);

router.post('/whitelist/ip', addWhitelistIp);
router.post('/whitelist/user', addWhitelistUser);

export default router;