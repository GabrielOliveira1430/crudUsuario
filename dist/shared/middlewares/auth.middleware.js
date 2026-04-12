"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const token_service_1 = require("../../modules/auth/token.service");
// ✅ NOVO IMPORT
const tokenBlacklist_service_1 = require("../../modules/auth/tokenBlacklist.service");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // 🚫 Sem token
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: 'Token não fornecido',
        });
    }
    // 🔐 Formato Bearer
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
        // 🚫 VERIFICA BLACKLIST
        const blocked = await (0, tokenBlacklist_service_1.isBlacklisted)(token);
        if (blocked) {
            return res.status(401).json({
                success: false,
                error: 'Token inválido (logout)',
            });
        }
        // 🔍 Valida token
        const decoded = (0, token_service_1.verifyAccessToken)(token);
        const userId = Number(decoded.sub);
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
        // 🔎 Busca usuário no banco
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
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
        req.user = {
            id: user.id,
            role: user.role,
        };
        return next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token inválido ou expirado',
        });
    }
};
exports.authMiddleware = authMiddleware;
