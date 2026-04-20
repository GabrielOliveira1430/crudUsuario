"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verify2FASchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// 🔐 LOGIN
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Email inválido'),
    password: zod_1.z
        .string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
// 🔐 VERIFICAÇÃO 2FA
exports.verify2FASchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Email inválido'),
    code: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'Código deve conter exatamente 6 números'),
});
// 📩 FORGOT PASSWORD
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Email inválido'),
});
// 🔐 RESET PASSWORD
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z
        .string()
        .min(10, 'Token inválido'),
    password: zod_1.z
        .string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Senha deve conter letras e números'),
});
