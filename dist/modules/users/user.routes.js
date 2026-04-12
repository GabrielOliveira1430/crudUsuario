"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const role_middleware_1 = require("../../shared/middlewares/role.middleware");
const validate_middleware_1 = require("../../shared/middlewares/validate.middleware");
const rateLimit_middleware_1 = require("../../shared/middlewares/rateLimit.middleware");
const user_schema_1 = require("./user.schema");
const router = (0, express_1.Router)();
/**
 * 🔓 ROTAS PÚBLICAS
 */
// Criar usuário
router.post('/', (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), user_controller_1.createUser);
// Login (com rate limit)
router.post('/login', rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(user_schema_1.loginSchema), user_controller_1.login);
/**
 * 🔐 ROTAS PROTEGIDAS
 */
// Teste de autenticação
router.get('/protected', auth_middleware_1.authMiddleware, (req, res) => {
    return res.json({
        success: true,
        message: 'Rota protegida funcionando 🚀',
        user: req.user
    });
});
// Usuário logado
router.get('/me', auth_middleware_1.authMiddleware, user_controller_1.me);
/**
 * 🔐 ADMIN
 */
router.get('/admin', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)('ADMIN'), (req, res) => {
    return res.json({ message: 'Área admin' });
});
/**
 * 🔐 CRUD ADMIN
 */
router.get('/', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)('ADMIN'), user_controller_1.getUsers);
router.get('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)('ADMIN'), user_controller_1.getUser);
router.put('/:id', auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(user_schema_1.updateUserSchema), user_controller_1.updateUser);
router.delete('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)('ADMIN'), user_controller_1.deleteUser);
exports.default = router;
