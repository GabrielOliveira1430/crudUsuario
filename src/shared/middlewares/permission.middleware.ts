import { Request, Response, NextFunction } from 'express';
import prisma from '../../database/prisma';
import {redis} from '../config/redis';

const CACHE_PREFIX = 'permissions:';
const CACHE_TTL = 60 * 10; // 10 minutos

export function permissionMiddleware(permissionName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
        });
      }

      const role = user.role;
      const cacheKey = CACHE_PREFIX + role;

      // 🔥 1. TENTA PEGAR DO REDIS
      let permissions: string[] | null = null;

      const cached = await redis.get(cacheKey);

      if (cached) {
        permissions = JSON.parse(cached);
      }

      // 🔥 2. SE NÃO EXISTIR → BUSCA NO BANCO
      if (!permissions) {
        const rolePermissions = await prisma.rolePermission.findMany({
          where: { role },
          include: {
            permission: true,
          },
        });

        permissions = rolePermissions.map(rp => rp.permission.name);

        // 🔥 salva no cache
        await redis.set(
          cacheKey,
          JSON.stringify(permissions),
          'EX',
          CACHE_TTL
        );
      }

      // 🔥 3. VERIFICA PERMISSÃO
      if (!permissions.includes(permissionName)) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado',
        });
      }

      return next();
    } catch {
      return res.status(500).json({
        success: false,
        error: 'Erro ao verificar permissão',
      });
    }
  };
}