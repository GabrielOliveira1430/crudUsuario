import { Request, Response, NextFunction } from 'express';
import prisma from '../../database/prisma';
import { redis } from '../config/redis';
import { Role } from '@prisma/client';

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

      const role = user.role as Role;
      const cacheKey = CACHE_PREFIX + role;

      let permissions: string[] | null = null;

      // 🔥 1. tenta Redis (com segurança)
      try {
        if (redis) {
          const cached = await redis.get(cacheKey);

          if (cached) {
            const parsed = JSON.parse(cached);

            if (Array.isArray(parsed)) {
              permissions = parsed;
            }
          }
        }
      } catch (err) {
        console.warn('Redis falhou, indo para DB');
      }

      // 🔥 2. se não tem cache válido → banco
      if (!permissions) {
        const rolePermissions = await prisma.rolePermission.findMany({
          where: { role },
          include: {
            permission: true,
          },
        });

        permissions = rolePermissions
          .map((rp) => rp.permission?.name)
          .filter(Boolean) as string[];

        // 🔥 salva cache apenas se válido
        if (redis && permissions.length > 0) {
          await redis.set(
            cacheKey,
            JSON.stringify(permissions),
            'EX',
            CACHE_TTL
          );
        }
      }

      // 🧠 DEBUG
      console.log({
        role,
        permissionRequired: permissionName,
        permissionsLoaded: permissions,
      });

      // 🔥 3. segurança extra: ADMIN bypass opcional (recomendado)
      if (role === 'ADMIN') {
        return next();
      }

      // 🔥 4. valida permissão
      if (!permissions.includes(permissionName)) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado',
        });
      }

      return next();
    } catch (error) {
      console.error('Erro no permissionMiddleware:', error);

      return res.status(500).json({
        success: false,
        error: 'Erro ao verificar permissão',
      });
    }
  };
}