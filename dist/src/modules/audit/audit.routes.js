"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("./audit.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const permission_middleware_1 = require("../../shared/middlewares/permission.middleware");
const router = (0, express_1.Router)();
// 🔐 apenas quem tem permissão
router.get('/', auth_middleware_1.authMiddleware, (0, permission_middleware_1.permissionMiddleware)('audit:read'), audit_controller_1.getLogs);
exports.default = router;
