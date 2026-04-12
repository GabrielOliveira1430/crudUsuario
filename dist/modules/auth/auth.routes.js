"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../shared/middlewares/validate.middleware");
const auth_schema_1 = require("./auth.schema");
const ipBlock_middleware_1 = require("../../shared/middlewares/ipBlock.middleware");
const rateLimit_middleware_1 = require("../../shared/middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
// 🔐 LOGIN (ORDEM CORRETA: Redis → RateLimit → Validate → Controller)
router.post('/login', ipBlock_middleware_1.ipBlockMiddleware, // 🔥 verifica bloqueio no Redis primeiro
rateLimit_middleware_1.authLimiter, // 🔥 limita tentativas de login
(0, validate_middleware_1.validate)(auth_schema_1.loginSchema), auth_controller_1.login);
// 🔐 VERIFICAÇÃO 2FA (também protegido)
router.post('/verify-2fa', ipBlock_middleware_1.ipBlockMiddleware, rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.verify2FASchema), auth_controller_1.verify2FA);
// 🔄 REFRESH TOKEN
router.post('/refresh', auth_controller_1.refresh);
// 🚪 LOGOUT
router.post('/logout', auth_controller_1.logout);
exports.default = router;
