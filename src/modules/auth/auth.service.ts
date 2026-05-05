import bcrypt from 'bcrypt';
import prisma from '../../database/prisma';
import crypto from 'crypto';
import {
  generateAccessToken,
  generateRefreshToken,
} from './token.service';
import { MailService } from '../mail/mail.service';

const mailService = new MailService();

// 🔐 GERAR 2FA
function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔐 HASH DO 2FA
function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

// 🔐 LOGIN SERVICE
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

  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new Error('Conta temporariamente bloqueada');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const attempts = user.loginAttempts + 1;

    if (attempts >= 5) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: 0,
          lockUntil: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      throw new Error('Conta temporariamente bloqueada');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: attempts },
    });

    throw new Error('Credenciais inválidas');
  }

  const suspicious =
    (user.lastLoginIp && user.lastLoginIp !== ip) ||
    (user.lastUserAgent && user.lastUserAgent !== userAgent);

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
      twoFactorExpires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  try {
    console.log('📨 Enviando 2FA para:', user.email);
    await mailService.send2FACode(user.email, code);
    console.log('✅ Email 2FA enviado com sucesso');
  } catch (err) {
    console.error('❌ Falha ao enviar email 2FA:', err);
  }

  return {
    message: 'Código de verificação enviado',
    suspicious,
  };
}

// 🔐 VERIFY 2FA SERVICE (🔥 CORRIGIDO)
export async function verify2FAService(email: string, code: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      twoFactorCode: true,
      twoFactorExpires: true,

      // 🔥 ESSENCIAL
      role: true,
      plan: true,
    },
  });

  if (!user || !user.twoFactorCode) {
    throw new Error('Código inválido ou expirado');
  }

  if (user.twoFactorExpires && user.twoFactorExpires < new Date()) {
    throw new Error('Código inválido ou expirado');
  }

  const hashedCode = hashCode(code);

  if (user.twoFactorCode !== hashedCode) {
    throw new Error('Código inválido ou expirado');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFactorCode: null,
      twoFactorExpires: null,
    },
  });

  // 🔥 AGORA COM ROLE + PLAN
  const accessToken = generateAccessToken(
    user.id,
    user.role,
    user.plan
  );

  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

// 🔄 REFRESH SERVICE (🔥 ATUALIZADO)
export async function refreshService(userId: number, oldToken: string) {
  const tokenExists = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
  });

  if (!tokenExists) {
    throw new Error('Refresh token inválido');
  }

  if (tokenExists.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { token: oldToken },
    });

    throw new Error('Refresh token expirado');
  }

  await prisma.refreshToken.delete({
    where: { token: oldToken },
  });

  // 🔥 BUSCAR USER COMPLETO
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      plan: true,
    },
  });

  const accessToken = generateAccessToken(
    userId,
    user?.role,
    user?.plan
  );

  const refreshToken = generateRefreshToken(userId);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

// 🚪 LOGOUT SERVICE
export async function logoutService(
  refreshToken: string,
  accessToken: string
) {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  return {
    message: 'Logout realizado com sucesso',
  };
}