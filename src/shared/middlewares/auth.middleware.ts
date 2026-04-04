import { Request, Response, NextFunction } from 'express';
import prisma from '../../database/prisma';

import { verifyAccessToken } from '../../modules/auth/token.service';

// ✅ NOVO IMPORT
import { isBlacklisted } from '../../modules/auth/tokenBlacklist.service';

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
    const decoded = verifyAccessToken(token);

    const userId = Number(decoded.sub);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }

    // 🔎 Busca usuário no banco
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
      role: user.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }
};