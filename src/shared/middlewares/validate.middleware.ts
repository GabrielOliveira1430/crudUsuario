import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: err.issues.map((e) => e.message)
        });
      }

      return res.status(500).json({ error: 'Erro interno' });
    }
  };
};