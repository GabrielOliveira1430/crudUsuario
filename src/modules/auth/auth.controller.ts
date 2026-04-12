import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import prisma from '../../database/prisma';

import {
  registerFailedAttempt,
  resetAttempts,
} from '../../shared/middlewares/ipBlock.middleware';

import {
  loginService,
  verify2FAService,
  refreshService,
  logoutService,
} from './auth.service';

import {
  forgotPasswordService,
  resetPasswordService,
} from './password.service';

import { blacklistToken } from './tokenBlacklist.service';

// 🔧 função padrão pra pegar IP
function getClientIp(req: Request): string {
  let ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    req.ip ||
    'unknown';

  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  return ip;
}

// 🔐 LOGIN
export async function login(req: Request, res: Response) {
  const ip = getClientIp(req);

  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await loginService(email, password, ip, userAgent);

    await resetAttempts(ip);

    return res.status(200).json({
      success: true,

      // ✅ ADICIONADO PARA O TESTE
      message: result.message || 'Código 2FA enviado com sucesso',

      data: {
        message: result.message,
        security: {
          suspiciousLogin: result.suspicious,
        },
      },
    });
  } catch (error: any) {
    await registerFailedAttempt(ip);

    return res.status(400).json({
      success: false,
      error: error.message || 'Erro no login',
    });
  }
}

// 🔐 VERIFY 2FA
export async function verify2FA(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    const result = await verify2FAService(email, code);

    return res.json({
      success: true,
      message: '2FA verificado com sucesso',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro na verificação',
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

    const userId = Number(payload.sub);

    const result = await refreshService(userId, refreshToken);

    return res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: result,
    });
  } catch {
    return res.status(403).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }
}

// 🚪 LOGOUT
export async function logout(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    const { refreshToken } = req.body;

    if (!authHeader) {
      return res.status(400).json({
        success: false,
        error: 'Token não fornecido',
      });
    }

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token obrigatório',
      });
    }

    const [, accessToken] = authHeader.split(' ');

    const decoded = jwt.decode(accessToken) as jwt.JwtPayload;

    if (decoded?.exp) {
      await blacklistToken(accessToken, decoded.exp);
    }

    const result = await logoutService(refreshToken, accessToken);

    return res.json({
      success: true,
      message: 'Logout realizado com sucesso',
      data: result,
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Erro ao fazer logout',
    });
  }
}

// 📩 FORGOT PASSWORD
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const result = await forgotPasswordService(email);

    return res.json({
      success: true,
      message: 'Email de recuperação enviado',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao solicitar recuperação',
    });
  }
}

// 🔐 RESET PASSWORD
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    const result = await resetPasswordService(token, password);

    return res.json({
      success: true,
      message: 'Senha redefinida com sucesso',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao redefinir senha',
    });
  }
}