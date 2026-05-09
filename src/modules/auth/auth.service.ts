import bcrypt from 'bcrypt';
import prisma from '../../database/prisma';
import crypto from 'crypto';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './token.service';

import { MailService } from '../mail/mail.service';

const mailService = new MailService();

// 🔥 DEV MODE
const DEV_MODE =
  process.env.NODE_ENV !== 'production';


// ========================================
// 🔐 2FA
// ========================================

function generate2FACode() {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

function hashCode(code: string) {
  return crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');
}


// ========================================
// 🔐 LOGIN
// ========================================

export async function loginService(
  email: string,
  password: string,
  ip: string,
  userAgent: string
) {

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      isActive: true,
      loginAttempts: true,
      lockUntil: true,
      lastLoginIp: true,
      lastUserAgent: true,
    },
  });

  if (!user || !user.isActive) {
    throw new Error('Credenciais inválidas');
  }

  // 🔒 conta bloqueada
  if (
    user.lockUntil &&
    user.lockUntil > new Date()
  ) {
    throw new Error(
      'Conta temporariamente bloqueada'
    );
  }

  // 🔑 senha
  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatch) {

    const attempts =
      user.loginAttempts + 1;

    // 🔥 bloqueio
    if (attempts >= 5) {

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: 0,
          lockUntil: new Date(
            Date.now() + 15 * 60 * 1000
          ),
        },
      });

      throw new Error(
        'Conta temporariamente bloqueada'
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: attempts,
      },
    });

    throw new Error('Credenciais inválidas');
  }

  // 🔍 login suspeito
  const suspicious =
    (user.lastLoginIp &&
      user.lastLoginIp !== ip) ||

    (user.lastUserAgent &&
      user.lastUserAgent !== userAgent);

  // 🔐 gerar 2FA
  const code = generate2FACode();

  const hashedCode = hashCode(code);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      loginAttempts: 0,
      lockUntil: null,

      lastLoginIp: ip,
      lastUserAgent: userAgent,

      twoFactorCode: hashedCode,

      twoFactorExpires:
        new Date(
          Date.now() + 5 * 60 * 1000
        ),
    },
  });

  try {

    if (DEV_MODE) {

      console.log(
        '🔐 Código 2FA (DEV):',
        code
      );

    } else {

      await mailService.send2FACode(
        user.email,
        code
      );
    }

  } catch (err) {

    console.error(
      '❌ Erro envio 2FA:',
      err
    );

    console.log(
      '🔐 Código fallback:',
      code
    );
  }

  return {
    message:
      'Código de verificação enviado',
    suspicious,
  };
}


// ========================================
// 🔐 VERIFY 2FA
// ========================================

export async function verify2FAService(
  email: string,
  code: string
) {

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,

      twoFactorCode: true,
      twoFactorExpires: true,

      role: true,
      plan: true,
    },
  });

  if (
    !user ||
    !user.twoFactorCode
  ) {
    throw new Error(
      'Código inválido'
    );
  }

  // ⏰ expirado
  if (
    !user.twoFactorExpires ||
    user.twoFactorExpires < new Date()
  ) {
    throw new Error(
      'Código expirado'
    );
  }

  const hashedCode =
    hashCode(code);

  if (
    user.twoFactorCode !== hashedCode
  ) {
    throw new Error(
      'Código inválido'
    );
  }

  // 🧹 limpa 2FA
  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFactorCode: null,
      twoFactorExpires: null,
    },
  });

  // 🔐 tokens
  const accessToken =
    generateAccessToken(
      user.id,
      user.role,
      user.plan
    );

  const refreshToken =
    generateRefreshToken(user.id);

  // 💾 salva refresh
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,

      userId: user.id,

      expiresAt:
        new Date(
          Date.now() +
          7 * 24 * 60 * 60 * 1000
        ),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}


// ========================================
// 🔄 REFRESH TOKEN
// ========================================

export async function refreshService(
  oldRefreshToken: string
) {

  // 🔍 verifica assinatura JWT
  const payload =
    verifyRefreshToken(
      oldRefreshToken
    );

  const userId =
    Number(payload.sub);

  if (!userId) {
    throw new Error(
      'Refresh token inválido'
    );
  }

  // 🔍 procura no banco
  const tokenExists =
    await prisma.refreshToken.findUnique({
      where: {
        token: oldRefreshToken,
      },
    });

  if (!tokenExists) {
    throw new Error(
      'Refresh token não encontrado'
    );
  }

  // ⏰ expirado
  if (
    tokenExists.expiresAt <
    new Date()
  ) {

    await prisma.refreshToken.delete({
      where: {
        token: oldRefreshToken,
      },
    });

    throw new Error(
      'Refresh token expirado'
    );
  }

  // 🔥 rotation
  await prisma.refreshToken.delete({
    where: {
      token: oldRefreshToken,
    },
  });

  // 👤 usuário
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        role: true,
        plan: true,
      },
    });

  if (!user) {
    throw new Error(
      'Usuário não encontrado'
    );
  }

  // 🔐 novos tokens
  const accessToken =
    generateAccessToken(
      userId,
      user.role,
      user.plan
    );

  const refreshToken =
    generateRefreshToken(
      userId
    );

  // 💾 salva novo refresh
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,

      userId,

      expiresAt:
        new Date(
          Date.now() +
          7 * 24 * 60 * 60 * 1000
        ),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}


// ========================================
// 🚪 LOGOUT
// ========================================

export async function logoutService(
  refreshToken: string
) {

  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
    },
  });

  return {
    message:
      'Logout realizado com sucesso',
  };
}