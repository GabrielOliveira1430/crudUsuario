import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../database/prisma';

import {
  generateAccessToken,
  generateRefreshToken,
} from './token.service';

import {
  registerFailedAttempt,
  resetAttempts,
} from '../../shared/middlewares/ipBlock.middleware';

// 📩 MAIL SERVICE
import { MailService } from '../mail/mail.service';

const mailService = new MailService();

// 🔐 GERAR CÓDIGO 2FA
function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔐 LOGIN
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown';

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      registerFailedAttempt(ip);
      return res.status(400).json({
        success: false,
        error: 'Credenciais inválidas',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Usuário bloqueado',
      });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutes = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000
      );

      return res.status(403).json({
        success: false,
        error: `Conta bloqueada. Tente novamente em ${minutes} minuto(s).`,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      registerFailedAttempt(ip);

      const attempts = user.loginAttempts + 1;

      if (attempts >= 5) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockUntil: new Date(Date.now() + 15 * 60 * 1000),
          },
        });

        return res.status(403).json({
          success: false,
          error:
            'Conta bloqueada por muitas tentativas. Tente novamente em 15 minutos.',
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: attempts,
        },
      });

      return res.status(400).json({
        success: false,
        error: 'Credenciais inválidas',
      });
    }

    // 🔍 DETECÇÃO DE LOGIN SUSPEITO
    const currentIp = ip;
    const currentAgent = req.headers['user-agent'] || 'unknown';

    let suspicious = false;

    if (user.lastLoginIp && user.lastLoginIp !== currentIp) {
      suspicious = true;
    }

    if (user.lastUserAgent && user.lastUserAgent !== currentAgent) {
      suspicious = true;
    }

    // 🔐 2FA
    const code = generate2FACode();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockUntil: null,
        lastLoginIp: currentIp,
        lastUserAgent: currentAgent,
        twoFactorCode: code,
        twoFactorExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    resetAttempts(ip);

    // 📩 ENVIO DE EMAIL (não quebra login se falhar)
    try {
      await mailService.send2FACode(user.email, code);
    } catch (err) {
      console.error('Erro ao enviar email:', err);
    }

    return res.json({
      success: true,
      data: {
        message: 'Código de verificação enviado',
        security: {
          suspiciousLogin: suspicious,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro no login',
    });
  }
}

// 🔐 VERIFICAR 2FA
export async function verify2FA(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.twoFactorCode) {
      return res.status(400).json({
        success: false,
        error: 'Código inválido ou expirado',
      });
    }

    if (user.twoFactorExpires && user.twoFactorExpires < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Código inválido ou expirado',
      });
    }

    if (user.twoFactorCode !== code) {
      return res.status(400).json({
        success: false,
        error: 'Código inválido ou expirado',
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorExpires: null,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro na verificação',
    });
  }
}

// 🔄 REFRESH TOKEN
export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token obrigatório',
      });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return res.status(403).json({
        success: false,
        error: 'Refresh token inválido',
      });
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      return res.status(403).json({
        success: false,
        error: 'Refresh token expirado',
      });
    }

    // 🔄 ROTAÇÃO
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    const userId = Number(payload.sub);

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }
}

// 🚪 LOGOUT
export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token obrigatório',
      });
    }

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return res.json({
      success: true,
      data: {
        message: 'Logout realizado com sucesso',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro ao fazer logout',
    });
  }
}