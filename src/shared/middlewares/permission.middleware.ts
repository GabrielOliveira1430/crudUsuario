// permission.middleware.ts

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

      let permissions: string[] = [];

      // 🔥 1. TENTA PEGAR DO REDIS (se existir)
      if (redis) {
        const cached = await redis.get(cacheKey);

        if (cached) {
          permissions = JSON.parse(cached);
        }
      }

      // 🔥 2. SE VAZIO → BUSCA NO BANCO
      if (!permissions || permissions.length === 0) {
        const rolePermissions = await prisma.rolePermission.findMany({
          where: { role },
          include: {
            permission: true,
          },
        });

        permissions = rolePermissions.map((rp) => rp.permission.name);

        // 🔥 só salva se tiver dados e Redis existir
        if (permissions.length > 0 && redis) {
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

      // 🔥 3. VALIDA
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