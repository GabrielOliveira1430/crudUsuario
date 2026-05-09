import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import prisma from '../../database/prisma';

import {
  verifyAccessToken,
} from '../../modules/auth/token.service';

import {
  isBlacklisted,
} from '../../modules/auth/tokenBlacklist.service';

import type {
  JwtPayload,
} from 'jsonwebtoken';


// ========================================
// 🔐 AUTH MIDDLEWARE
// ========================================

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    // ========================================
    // 🔍 AUTH HEADER
    // ========================================

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message:
          'Token não fornecido',

        error:
          'Unauthorized',

        data: null,
      });
    }


    // ========================================
    // 🔍 TOKEN FORMAT
    // ========================================

    const parts =
      authHeader.split(' ');

    if (parts.length !== 2) {

      return res.status(401).json({

        success: false,

        message:
          'Token mal formatado',

        error:
          'Unauthorized',

        data: null,
      });
    }

    const [
      scheme,
      token,
    ] = parts;

    if (
      !/^Bearer$/i.test(scheme)
    ) {

      return res.status(401).json({

        success: false,

        message:
          'Token mal formatado',

        error:
          'Unauthorized',

        data: null,
      });
    }


    // ========================================
    // 🚫 BLACKLIST
    // ========================================

    const blocked =
      await isBlacklisted(token);

    if (blocked) {

      return res.status(401).json({

        success: false,

        message:
          'Token inválido (logout)',

        error:
          'Unauthorized',

        data: null,
      });
    }


    // ========================================
    // 🔍 VERIFY JWT
    // ========================================

    const decoded =
      verifyAccessToken(
        token
      ) as JwtPayload;

    const userId =
      decoded.sub
        ? Number(decoded.sub)
        : null;

    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Token inválido',

        error:
          'Unauthorized',

        data: null,
      });
    }


    // ========================================
    // 👤 DATABASE USER
    // ========================================

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          isActive: true,
        },
      });

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          'Usuário não encontrado',

        error:
          'Not Found',

        data: null,
      });
    }


    // ========================================
    // 🚫 USER BLOCKED
    // ========================================

    if (!user.isActive) {

      return res.status(403).json({

        success: false,

        message:
          'Usuário bloqueado',

        error:
          'Forbidden',

        data: null,
      });
    }


    // ========================================
    // ✅ INJECT USER
    // ========================================

    (req as any).user = {

      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      plan:
        user.plan,
    };


    // ========================================
    // 🚀 NEXT
    // ========================================

    return next();

  } catch (error) {

    console.error(
      'AUTH ERROR:',
      error
    );

    return res.status(401).json({

      success: false,

      message:
        'Token inválido ou expirado',

      error:
        'Unauthorized',

      data: null,
    });
  }
};