import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  role: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Sem token' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    // ✅ Agora inclui role também
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};