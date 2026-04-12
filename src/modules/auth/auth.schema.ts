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

// 📩 FORGOT PASSWORD
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido'),
});

// 🔐 RESET PASSWORD
export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(10, 'Token inválido'),

  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      'Senha deve conter letras e números'
    ),
});