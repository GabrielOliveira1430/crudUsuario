import type {
  Request,
  Response,
} from 'express';

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


// ========================================
// 🔧 GET CLIENT IP
// ========================================

function getClientIp(
  req: Request
): string {

  let ip =
    (req.headers[
      'x-forwarded-for'
    ] as string)
      ?.split(',')[0]
      ?.trim() ||

    req.socket.remoteAddress ||

    req.ip ||

    'unknown';

  if (ip.startsWith('::ffff:')) {
    ip = ip.replace(
      '::ffff:',
      ''
    );
  }

  return ip;
}


// ========================================
// 🔐 LOGIN
// ========================================

export async function login(
  req: Request,
  res: Response
) {

  const ip =
    getClientIp(req);

  try {

    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        success: false,

        message:
          'Email e senha são obrigatórios',

        error:
          'Dados inválidos',

        data: null,
      });
    }

    const userAgent =
      req.headers[
        'user-agent'
      ] || 'unknown';

    const result =
      await loginService(
        email,
        password,
        ip,
        userAgent
      );

    await resetAttempts(ip);

    return res.status(200).json({

      success: true,

      message:
        result.message,

      data: {
        message:
          result.message,

        security: {
          suspiciousLogin:
            result.suspicious || false,
        },
      },
    });

  } catch (error: any) {

    await registerFailedAttempt(ip);

    return res.status(400).json({

      success: false,

      message:
        error.message ||
        'Erro no login',

      error:
        error.message ||
        'Erro no login',

      data: null,
    });
  }
}


// ========================================
// 🔐 VERIFY 2FA
// ========================================

export async function verify2FA(
  req: Request,
  res: Response
) {

  try {

    const {
      email,
      code,
    } = req.body;

    if (
      !email ||
      !code
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Email e código são obrigatórios',

        error:
          'Dados inválidos',

        data: null,
      });
    }

    const result =
      await verify2FAService(
        email,
        code
      );

    return res.json({

      success: true,

      message:
        '2FA verificado com sucesso',

      data: {
        accessToken:
          result.accessToken,

        refreshToken:
          result.refreshToken,
      },
    });

  } catch (error: any) {

    return res.status(400).json({

      success: false,

      message:
        error.message ||
        'Erro na verificação',

      error:
        error.message ||
        'Erro na verificação',

      data: null,
    });
  }
}


// ========================================
// 🔄 REFRESH TOKEN
// ========================================

export async function refresh(
  req: Request,
  res: Response
) {

  try {

    const {
      refreshToken,
    } = req.body;

    if (!refreshToken) {

      return res.status(400).json({

        success: false,

        message:
          'Refresh token obrigatório',

        error:
          'Refresh token obrigatório',

        data: null,
      });
    }

    // 🔍 verifica assinatura
    try {

      jwt.verify(
        refreshToken,
        process.env
          .JWT_REFRESH_SECRET as string
      );

    } catch {

      return res.status(403).json({

        success: false,

        message:
          'Refresh token inválido',

        error:
          'Refresh token inválido',

        data: null,
      });
    }

    // 🔍 banco
    const storedToken =
      await prisma.refreshToken.findUnique({
        where: {
          token:
            refreshToken,
        },
      });

    if (!storedToken) {

      return res.status(403).json({

        success: false,

        message:
          'Refresh token não encontrado',

        error:
          'Refresh token inválido',

        data: null,
      });
    }

    // ⏰ expirado
    if (
      storedToken.expiresAt <
      new Date()
    ) {

      await prisma.refreshToken.delete({
        where: {
          token:
            refreshToken,
        },
      });

      return res.status(403).json({

        success: false,

        message:
          'Refresh token expirado',

        error:
          'Refresh token expirado',

        data: null,
      });
    }

    // 🔥 service
    const result =
      await refreshService(
        refreshToken
      );

    return res.json({

      success: true,

      message:
        'Token renovado com sucesso',

      data: {
        accessToken:
          result.accessToken,

        refreshToken:
          result.refreshToken,
      },
    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        'Erro ao renovar token',

      error:
        error.message ||
        'Erro interno',

      data: null,
    });
  }
}


// ========================================
// 🚪 LOGOUT
// ========================================

export async function logout(
  req: Request,
  res: Response
) {

  try {

    const authHeader =
      req.headers.authorization;

    const {
      refreshToken,
    } = req.body;

    if (
      !authHeader ||
      !refreshToken
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Access token e refresh token são obrigatórios',

        error:
          'Dados inválidos',

        data: null,
      });
    }

    const [
      ,
      accessToken
    ] = authHeader.split(' ');

    // 🔥 blacklist access
    const decoded =
      jwt.decode(
        accessToken
      ) as jwt.JwtPayload;

    if (decoded?.exp) {

      await blacklistToken(
        accessToken,
        decoded.exp
      );
    }

    const result =
      await logoutService(
        refreshToken
      );

    return res.json({

      success: true,

      message:
        result.message,

      data: result,
    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        'Erro ao fazer logout',

      error:
        error.message ||
        'Erro interno',

      data: null,
    });
  }
}


// ========================================
// 📩 FORGOT PASSWORD
// ========================================

export async function forgotPassword(
  req: Request,
  res: Response
) {

  try {

    const {
      email
    } = req.body;

    if (!email) {

      return res.status(400).json({

        success: false,

        message:
          'Email obrigatório',

        error:
          'Dados inválidos',

        data: null,
      });
    }

    const result =
      await forgotPasswordService(
        email
      );

    return res.json({

      success: true,

      message:
        'Email enviado com sucesso',

      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({

      success: false,

      message:
        error.message,

      error:
        error.message,

      data: null,
    });
  }
}


// ========================================
// 🔐 RESET PASSWORD
// ========================================

export async function resetPassword(
  req: Request,
  res: Response
) {

  try {

    const {
      token,
      password
    } = req.body;

    if (
      !token ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Token e senha obrigatórios',

        error:
          'Dados inválidos',

        data: null,
      });
    }

    const result =
      await resetPasswordService(
        token,
        password
      );

    return res.json({

      success: true,

      message:
        'Senha redefinida com sucesso',

      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({

      success: false,

      message:
        error.message,

      error:
        error.message,

      data: null,
    });
  }
}