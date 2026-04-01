import { Router } from 'express';

import {
  createUser,
  login,
  me,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from './user.controller';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { roleMiddleware } from '../../shared/middlewares/role.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import { authLimiter } from '../../shared/middlewares/rateLimit.middleware';

import {
  createUserSchema,
  loginSchema,
  updateUserSchema
} from './user.schema';

const router = Router();

/**
 * 🔓 ROTAS PÚBLICAS
 */

// Criar usuário
router.post('/', validate(createUserSchema), createUser);

// Login (com proteção contra brute force)
router.post('/login', authLimiter, validate(loginSchema), login);

/**
 * 🔐 ROTAS PROTEGIDAS
 */

// Perfil do usuário logado
router.get('/me', authMiddleware, me);

// Área admin (teste)
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware('ADMIN'),
  (req, res) => {
    return res.json({ message: 'Área admin' });
  }
);

/**
 * 🔐 CRUD
 */

// LISTAR (ADMIN)
router.get('/', authMiddleware, roleMiddleware('ADMIN'), getUsers);

// BUSCAR POR ID (ADMIN)
router.get('/:id', authMiddleware, roleMiddleware('ADMIN'), getUser);

// ATUALIZAR
router.put(
  '/:id',
  authMiddleware,
  validate(updateUserSchema),
  updateUser
);

// DELETAR (ADMIN)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ADMIN'),
  deleteUser
);

export default router;