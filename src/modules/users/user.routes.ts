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
 * 🔓 ROTAS PÚBLICAS
 */

// Criar usuário
router.post('/', validate(createUserSchema), createUser);

/**
 * 🔐 ROTAS PROTEGIDAS
 */

// Teste de autenticação
router.get('/protected', authMiddleware, (req, res) => {
  return res.json({
    success: true,
    message: 'Rota protegida funcionando 🚀',
    user: (req as any).user
  });
});

// Usuário logado
router.get('/me', authMiddleware, me);

/**
 * 🔥 STATS (DASHBOARD)
 * ✔ Mantém permission + reforça com role correta
 */
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(Role.ADMIN), // ✅ CORRIGIDO
  permissionMiddleware('user:read'),
  stats
);

/**
 * 🔐 ADMIN
 */
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware(Role.ADMIN), // ✅ CORRIGIDO
  (req, res) => {
    return res.json({ message: 'Área admin' });
  }
);

/**
 * 🔐 RBAC (PERMISSÕES - PROFISSIONAL)
 */

// 🔥 LISTAR USUÁRIOS
router.get(
  '/',
  authMiddleware,
  roleMiddleware(Role.ADMIN), // ✅ CORRIGIDO
  permissionMiddleware('user:read'),
  getUsers
);

// 🔥 BUSCAR POR ID
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.ADMIN), // ✅ CORRIGIDO
  permissionMiddleware('user:read'),
  getUser
);

// 🔥 ATUALIZAR
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.ADMIN), // ✅ CORRIGIDO
  permissionMiddleware('user:update'),
  validate(updateUserSchema),
  updateUser
);

// 🔥 DELETAR
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.ADMIN), // ✅ CORRIGIDO
  permissionMiddleware('user:delete'),
  deleteUser
);

export default router;