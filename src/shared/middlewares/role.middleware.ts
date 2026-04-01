import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
};