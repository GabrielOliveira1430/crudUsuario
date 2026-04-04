import { z } from 'zod';

// 🔐 LOGIN
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido'),

  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// 🔐 VERIFICAÇÃO 2FA
export const verify2FASchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido'),

  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Código deve conter exatamente 6 números'),
});