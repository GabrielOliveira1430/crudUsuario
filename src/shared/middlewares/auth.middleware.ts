import { Request, Response, NextFunction } from 'express';
import prisma from '../../database/prisma';

import { verifyAccessToken } from '../../modules/auth/token.service';
import { isBlacklisted } from '../../modules/auth/tokenBlacklist.service';

import { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Token não fornecido',
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({
      success: false,
      error: 'Token mal formatado',
    });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      success: false,
      error: 'Token mal formatado',
    });
  }

  try {
    // 🚫 blacklist
    const blocked = await isBlacklisted(token);

    if (blocked) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido (logout)',
      });
    }

    // 🔍 valida token
    const decoded = verifyAccessToken(token) as JwtPayload;

    const userId = decoded.sub ? Number(decoded.sub) : null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }

    // 🔎 SEMPRE busca no banco (fonte da verdade)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Usuário bloqueado',
      });
    }

    // ✅ IMPORTANTE: role vem do banco (NUNCA do token)
    (req as any).user = {
      id: user.id,
      role: user.role,
    };

    console.log('USER AUTH FINAL:', (req as any).user);

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }
};