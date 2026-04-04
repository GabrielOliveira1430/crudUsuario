import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const roleMiddleware = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado',
      });
    }

    return next();
  };
};