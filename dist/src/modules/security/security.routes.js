"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const security_controller_1 = require("./security.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const permission_middleware_1 = require("../../shared/middlewares/permission.middleware");
const router = (0, express_1.Router)();
// 🔐 PROTEGIDO
router.use(auth_middleware_1.authMiddleware);
// 🔐 PERMISSÃO ADMIN (ou crie: security:manage)
router.use((0, permission_middleware_1.permissionMiddleware)('user:delete')); // pode trocar depois
router.get('/blocked', security_controller_1.getBlocked);
router.get('/whitelist', security_controller_1.getWhitelist);
router.post('/unblock/ip', security_controller_1.unblockIp);
router.post('/unblock/user', security_controller_1.unblockUserController);
router.post('/whitelist/ip', security_controller_1.addWhitelistIp);
router.post('/whitelist/user', security_controller_1.addWhitelistUser);
exports.default = router;
