import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  /**
   * 🔴 ERRO DO ZOD
   */
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  /**
   * 🔴 ERRO PADRÃO (AppError ou outros)
   */
  const status = err.status || 500;

  return res.status(status).json({
    success: false,
    error: err.message || 'Erro interno do servidor'
  });
};