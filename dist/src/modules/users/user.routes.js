"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const role_middleware_1 = require("../../shared/middlewares/role.middleware");
const permission_middleware_1 = require("../../shared/middlewares/permission.middleware");
const validate_middleware_1 = require("../../shared/middlewares/validate.middleware");
const user_schema_1 = require("./user.schema");
const router = (0, express_1.Router)();
/**
 * 🔓 ROTAS PÚBLICAS
 */
// Criar usuário
router.post('/', (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), user_controller_1.createUser);
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
 * 🔥 STATS (DASHBOARD)
 * ✔ Mantém permission + reforça com role correta
 */
router.get('/stats', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), // ✅ CORRIGIDO
(0, permission_middleware_1.permissionMiddleware)('user:read'), user_controller_1.stats);
/**
 * 🔐 ADMIN
 */
router.get('/admin', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), // ✅ CORRIGIDO
(req, res) => {
    return res.json({ message: 'Área admin' });
});
/**
 * 🔐 RBAC (PERMISSÕES - PROFISSIONAL)
 */
// 🔥 LISTAR USUÁRIOS
router.get('/', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), // ✅ CORRIGIDO
(0, permission_middleware_1.permissionMiddleware)('user:read'), user_controller_1.getUsers);
// 🔥 BUSCAR POR ID
router.get('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), // ✅ CORRIGIDO
(0, permission_middleware_1.permissionMiddleware)('user:read'), user_controller_1.getUser);
// 🔥 ATUALIZAR
router.put('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), // ✅ CORRIGIDO
(0, permission_middleware_1.permissionMiddleware)('user:update'), (0, validate_middleware_1.validate)(user_schema_1.updateUserSchema), user_controller_1.updateUser);
// 🔥 DELETAR
router.delete('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), // ✅ CORRIGIDO
(0, permission_middleware_1.permissionMiddleware)('user:delete'), user_controller_1.deleteUser);
exports.default = router;
