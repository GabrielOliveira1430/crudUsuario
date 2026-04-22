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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios',
        error: 'Dados inválidos',
        data: null,
      });
    }

    const userAgent = req.headers['user-agent'] || 'unknown';

    console.log('🔐 Tentativa de login:', { email, ip });

    const result = await loginService(email, password, ip, userAgent);

    await resetAttempts(ip);

    return res.status(200).json({
      success: true,
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

    console.error('❌ Erro no login:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message || 'Erro no login',
      error: error.message || 'Erro no login',
      data: null,
    });
  }
}

// 🔐 VERIFY 2FA
export async function verify2FA(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email e código são obrigatórios',
        error: 'Dados inválidos',
        data: null,
      });
    }

    const result = await verify2FAService(email, code);

    return res.json({
      success: true,
      message: '2FA verificado com sucesso',
      data: result,
    });
  } catch (error: any) {
    console.error('❌ Erro no 2FA:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message || 'Erro na verificação',
      error: error.message || 'Erro na verificação',
      data: null,
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
        message: 'Refresh token obrigatório',
        error: 'Refresh token obrigatório',
        data: null,
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
        message: 'Refresh token inválido',
        error: 'Refresh token inválido',
        data: null,
      });
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      return res.status(403).json({
        success: false,
        message: 'Refresh token expirado',
        error: 'Refresh token expirado',
        data: null,
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
      message: 'Token inválido ou expirado',
      error: 'Token inválido ou expirado',
      data: null,
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
        message: 'Token não fornecido',
        error: 'Token não fornecido',
        data: null,
      });
    }

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token obrigatório',
        error: 'Refresh token obrigatório',
        data: null,
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
      message: 'Erro ao fazer logout',
      error: 'Erro ao fazer logout',
      data: null,
    });
  }
}

// 📩 FORGOT PASSWORD
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
        error: 'Dados inválidos',
        data: null,
      });
    }

    const result = await forgotPasswordService(email);

    return res.json({
      success: true,
      message: 'Email de recuperação enviado',
      data: result,
    });
  } catch (error: any) {
    console.error('❌ Erro forgot password:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message || 'Erro ao solicitar recuperação',
      error: error.message || 'Erro ao solicitar recuperação',
      data: null,
    });
  }
}

// 🔐 RESET PASSWORD
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token e senha são obrigatórios',
        error: 'Dados inválidos',
        data: null,
      });
    }

    const result = await resetPasswordService(token, password);

    return res.json({
      success: true,
      message: 'Senha redefinida com sucesso',
      data: result,
    });
  } catch (error: any) {
    console.error('❌ Erro reset password:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message || 'Erro ao redefinir senha',
      error: error.message || 'Erro ao redefinir senha',
      data: null,
    });
  }
}