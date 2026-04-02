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

// Login (com rate limit)
router.post('/login', authLimiter, validate(loginSchema), login);

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
 * 🔐 ADMIN
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
 * 🔐 CRUD ADMIN
 */

router.get('/', authMiddleware, roleMiddleware('ADMIN'), getUsers);

router.get('/:id', authMiddleware, roleMiddleware('ADMIN'), getUser);

router.put(
  '/:id',
  authMiddleware,
  validate(updateUserSchema),
  updateUser
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ADMIN'),
  deleteUser
);

export default router;