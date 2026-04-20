"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditMiddleware = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const audit_service_1 = require("../../modules/audit/audit.service");
const detection_service_1 = require("../../modules/audit/detection.service");
const block_service_1 = require("../../shared/security/block.service");
const auditMiddleware = async (req, res, next) => {
    const start = Date.now();
    const user = req.user;
    const method = req.method;
    const url = req.originalUrl;
    const entity = extractEntity(url);
    const entityId = extractId(url);
    // ✅ proteção de tipos
    const userAgent = typeof req.headers['user-agent'] === 'string'
        ? req.headers['user-agent']
        : 'unknown';
    const ip = req.ip || 'unknown';
    let before = null;
    // 🔥 CAPTURA BEFORE
    if (entity === 'USERS' &&
        entityId &&
        ['PUT', 'PATCH', 'DELETE'].includes(method)) {
        try {
            before = await prisma_1.default.user.findUnique({
                where: { id: entityId }
            });
        }
        catch { }
    }
    res.on('finish', async () => {
        try {
            // ignora erros
            if (res.statusCode >= 400)
                return;
            let action = 'READ';
            if (method === 'POST')
                action = 'CREATE';
            if (method === 'PUT' || method === 'PATCH')
                action = 'UPDATE';
            if (method === 'DELETE')
                action = 'DELETE';
            let after = null;
            // 🔥 CAPTURA AFTER
            if (entity === 'USERS' && entityId && action !== 'DELETE') {
                try {
                    after = await prisma_1.default.user.findUnique({
                        where: { id: entityId }
                    });
                }
                catch { }
            }
            // 🔥 DETECÇÃO DE COMPORTAMENTO SUSPEITO
            const detection = await (0, detection_service_1.detectSuspiciousActivity)({
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
                await (0, block_service_1.blockIP)(ip);
                if (user?.id) {
                    await (0, block_service_1.blockUser)(user.id);
                }
            }
            // 🔥 AUDITORIA
            await (0, audit_service_1.logAudit)({
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
        }
        catch (err) {
            console.error('Erro auditoria:', err);
        }
    });
    next();
};
exports.auditMiddleware = auditMiddleware;
// 🔍 EXTRAI ENTIDADE (AJUSTADO PARA /api/v1/...)
function extractEntity(url) {
    const parts = url.split('/');
    return parts[3]?.toUpperCase() || 'UNKNOWN';
}
// 🔍 EXTRAI ID (AJUSTADO PARA /api/v1/users/:id)
function extractId(url) {
    const parts = url.split('/');
    const id = Number(parts[4]);
    return isNaN(id) ? undefined : id;
}
