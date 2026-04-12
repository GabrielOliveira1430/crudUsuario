import { Request, Response, NextFunction } from 'express';
import prisma from '../../database/prisma';
import { logAudit } from '../../modules/audit/audit.service';
import { detectSuspiciousActivity } from '../../modules/audit/detection.service';
import { blockIP, blockUser } from '../../shared/security/block.service';

export const auditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  const user = (req as any).user;

  const method = req.method;
  const url = req.originalUrl;

  const entity = extractEntity(url);
  const entityId = extractId(url);

  // ✅ proteção de tipos
  const userAgent =
    typeof req.headers['user-agent'] === 'string'
      ? req.headers['user-agent']
      : 'unknown';

  const ip = req.ip || 'unknown';

  let before: any = null;

  // 🔥 CAPTURA BEFORE
  if (
    entity === 'USERS' &&
    entityId &&
    ['PUT', 'PATCH', 'DELETE'].includes(method)
  ) {
    try {
      before = await prisma.user.findUnique({
        where: { id: entityId }
      });
    } catch {}
  }

  res.on('finish', async () => {
    try {
      // ignora erros
      if (res.statusCode >= 400) return;

      let action = 'READ';

      if (method === 'POST') action = 'CREATE';
      if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
      if (method === 'DELETE') action = 'DELETE';

      let after: any = null;

      // 🔥 CAPTURA AFTER
      if (entity === 'USERS' && entityId && action !== 'DELETE') {
        try {
          after = await prisma.user.findUnique({
            where: { id: entityId }
          });
        } catch {}
      }

      // 🔥 DETECÇÃO DE COMPORTAMENTO SUSPEITO
      const detection = await detectSuspiciousActivity({
        userId: user?.id,
        action,
        ip
      });

      if (detection.suspicious) {
        console.warn('🚨 ALERTA DE SEGURANÇA:', {
          userId: user?.id,
          ip,
          reason: detection.reason,
          action,
          url
        });

        // 💀 BLOQUEIO AUTOMÁTICO
        await blockIP(ip);

        if (user?.id) {
          await blockUser(user.id);
        }
      }

      // 🔥 AUDITORIA
      await logAudit({
        userId: user?.id,
        action,
        entity,
        entityId,
        ip,
        userAgent,
        metadata: {
          before,
          after,
          method,
          url,
          duration: Date.now() - start,
          suspicious: detection.suspicious,
          reason: detection.reason
        }
      });
    } catch (err) {
      console.error('Erro auditoria:', err);
    }
  });

  next();
};

// 🔍 EXTRAI ENTIDADE (AJUSTADO PARA /api/v1/...)
function extractEntity(url: string) {
  const parts = url.split('/');
  return parts[3]?.toUpperCase() || 'UNKNOWN';
}

// 🔍 EXTRAI ID (AJUSTADO PARA /api/v1/users/:id)
function extractId(url: string): number | undefined {
  const parts = url.split('/');
  const id = Number(parts[4]);
  return isNaN(id) ? undefined : id;
}