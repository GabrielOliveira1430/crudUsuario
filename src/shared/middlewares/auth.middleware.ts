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

  // 🚫 Sem token
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Token não fornecido',
    });
  }

  // 🔐 Formato Bearer
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
    // 🚫 VERIFICA BLACKLIST
    const blocked = await isBlacklisted(token);

    if (blocked) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido (logout)',
      });
    }

    // 🔍 Valida token
    const decoded = verifyAccessToken(token) as JwtPayload;

    const userId = decoded.sub ? Number(decoded.sub) : null;
    const roleFromToken = decoded.role as string | undefined;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }

    // 🔎 Busca usuário no banco (SEGURANÇA)
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

    // ✅ Injeta user no request
    (req as any).user = {
      id: user.id,
      role: roleFromToken || user.role,
    };

    // 🧠 LOG PARA DEBUG
    console.log('USER DO TOKEN:', (req as any).user);

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }
};