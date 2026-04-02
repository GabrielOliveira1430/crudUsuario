import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../database/prisma';

interface TokenPayload {
  id: number;
  role: string;
}

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

  // 🔐 Verifica formato Bearer
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    // 🔎 Busca usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // 🚫 Usuário inexistente ou bloqueado
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
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }
};