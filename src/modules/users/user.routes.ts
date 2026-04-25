import { Router } from 'express';
import { Role } from '@prisma/client';

import {
  createUser,
  me,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  stats
} from './user.controller';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { roleMiddleware } from '../../shared/middlewares/role.middleware';
import { permissionMiddleware } from '../../shared/middlewares/permission.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';

import {
  createUserSchema,
  updateUserSchema
} from './user.schema';

const router = Router();

/**
 * 🔐 CRIAR USUÁRIO (AGORA PROTEGIDO)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware('user:create'),
  validate(createUserSchema),
  createUser
);

/**
 * 🔐 ROTAS PROTEGIDAS
 */

// Usuário logado
router.get('/me', authMiddleware, me);

/**
 * 📊 STATS
 */
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware('user:read'),
  stats
);

/**
 * 🔐 ADMIN
 */
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  (req, res) => {
    return res.json({ message: 'Área admin' });
  }
);

/**
 * 🔐 USERS (RBAC)
 */

router.get(
  '/',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware('user:read'),
  getUsers
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware('user:read'),
  getUser
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware('user:update'),
  validate(updateUserSchema),
  updateUser
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware('user:delete'),
  deleteUser
);

export default router;