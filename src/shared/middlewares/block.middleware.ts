import { Request, Response, NextFunction } from 'express';
import { isBlocked } from '../security/block.service';

export const blockMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  const ip = req.ip || 'unknown';

  const blocked = await isBlocked(ip, user?.id);

  if (blocked) {
    return res.status(403).json({
      success: false,
      error: 'Acesso bloqueado temporariamente'
    });
  }

  return next();
};