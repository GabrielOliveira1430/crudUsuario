"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
/**
 * 🔐 Regra de senha forte
 */
const strongPassword = zod_1.z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos 1 letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos 1 número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos 1 caractere especial');
/**
 * Criar usuário
 */
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome muito curto'),
    email: zod_1.z.string().email('Email inválido'),
    password: strongPassword
});
/**
 * Login
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Senha inválida')
});
/**
 * Atualizar usuário
 */
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome muito curto').optional(),
    email: zod_1.z.string().email('Email inválido').optional(),
    password: strongPassword.optional(),
    role: zod_1.z.enum(['USER', 'ADMIN']).optional()
});
