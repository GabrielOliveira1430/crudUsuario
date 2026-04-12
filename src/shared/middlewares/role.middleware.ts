import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

// 🔥 tipo seguro pro user no request
type AuthUser = {
  id: number;
  role: Role;
};

export const roleMiddleware = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;

    // 🚫 não autenticado
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    // 🚫 sem role válida
    if (!user.role) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado',
      });
    }

    // 🚫 role não permitida
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para acessar este recurso',
      });
    }

    // ✅ autorizado
    return next();
  };
};