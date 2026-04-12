import prisma from '../../database/prisma';

type AuditData = {
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
};

/**
 * Registrar auditoria
 */
export const logAudit = async (data: AuditData) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        metadata: data.metadata ?? {},
        ip: data.ip ?? 'unknown',
        userAgent: data.userAgent ?? 'unknown'
      }
    });
  } catch (err) {
    console.error('Erro ao salvar auditoria:', err);
  }
};

/**
 * Listar logs de auditoria com paginação + filtros
 */
export const getAuditLogs = async (
  page: number,
  limit: number,
  filters?: {
    userId?: number;
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
  }
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    AND: []
  };

  if (filters?.userId) {
    where.AND.push({ userId: filters.userId });
  }

  if (filters?.action) {
    where.AND.push({ action: filters.action });
  }

  if (filters?.entity) {
    where.AND.push({ entity: filters.entity });
  }

  if (filters?.startDate || filters?.endDate) {
    where.AND.push({
      createdAt: {
        gte: filters.startDate ? new Date(filters.startDate) : undefined,
        lte: filters.endDate ? new Date(filters.endDate) : undefined
      }
    });
  }

  const finalWhere = where.AND.length ? where : undefined;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: finalWhere,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.auditLog.count({
      where: finalWhere
    })
  ]);

  return {
    data: logs,
    meta: {
      total,
      page,
      perPage: limit,
      lastPage: Math.ceil(total / limit)
    }
  };
};