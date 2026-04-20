"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.logAudit = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
/**
 * Registrar auditoria
 */
const logAudit = async (data) => {
    try {
        await prisma_1.default.auditLog.create({
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
    }
    catch (err) {
        console.error('Erro ao salvar auditoria:', err);
    }
};
exports.logAudit = logAudit;
/**
 * Listar logs de auditoria com paginação + filtros
 */
const getAuditLogs = async (page, limit, filters) => {
    const skip = (page - 1) * limit;
    const where = {
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
        prisma_1.default.auditLog.findMany({
            where: finalWhere,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma_1.default.auditLog.count({
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
exports.getAuditLogs = getAuditLogs;
