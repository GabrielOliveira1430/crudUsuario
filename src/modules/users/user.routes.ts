import { Router } from 'express';

import {
  createUser,
  me,
  getUsers,
  getUser,
  updateUser,
  deleteUser
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
 * 🔐 ADMIN (ROLE - opcional manter)
 */

router.get(
  '/admin',
  authMiddleware,
  roleMiddleware('ADMIN'),
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
  permissionMiddleware('user:read'),
  getUsers
);

// 🔥 BUSCAR POR ID
router.get(
  '/:id',
  authMiddleware,
  permissionMiddleware('user:read'),
  getUser
);

// 🔥 ATUALIZAR
router.put(
  '/:id',
  authMiddleware,
  permissionMiddleware('user:update'),
  validate(updateUserSchema),
  updateUser
);

// 🔥 DELETAR
router.delete(
  '/:id',
  authMiddleware,
  permissionMiddleware('user:delete'),
  deleteUser
);

export default router;