"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.verify2FA = verify2FA;
exports.refresh = refresh;
exports.logout = logout;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../database/prisma"));
const ipBlock_middleware_1 = require("../../shared/middlewares/ipBlock.middleware");
const auth_service_1 = require("./auth.service");
// ✅ NOVO IMPORT
const tokenBlacklist_service_1 = require("./tokenBlacklist.service");
// 🔧 função padrão pra pegar IP (com correção IPv6)
function getClientIp(req) {
    let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown';
    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    return ip;
}
// 🔐 LOGIN
async function login(req, res) {
    const ip = getClientIp(req);
    try {
        const { email, password } = req.body;
        const userAgent = req.headers['user-agent'] || 'unknown';
        const result = await (0, auth_service_1.loginService)(email, password, ip, userAgent);
        // ✅ resetar tentativas no Redis
        await (0, ipBlock_middleware_1.resetAttempts)(ip);
        return res.json({
            success: true,
            data: {
                message: result.message,
                security: {
                    suspiciousLogin: result.suspicious,
                },
            },
        });
    }
    catch (error) {
        // ✅ registrar tentativa no Redis
        await (0, ipBlock_middleware_1.registerFailedAttempt)(ip);
        return res.status(400).json({
            success: false,
            error: error.message || 'Erro no login',
        });
    }
}
// 🔐 VERIFY 2FA
async function verify2FA(req, res) {
    try {
        const { email, code } = req.body;
        const result = await (0, auth_service_1.verify2FAService)(email, code);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || 'Erro na verificação',
        });
    }
}
// 🔄 REFRESH TOKEN
async function refresh(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token obrigatório',
            });
        }
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await prisma_1.default.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!storedToken) {
            return res.status(403).json({
                success: false,
                error: 'Refresh token inválido',
            });
        }
        if (storedToken.expiresAt < new Date()) {
            await prisma_1.default.refreshToken.delete({
                where: { token: refreshToken },
            });
            return res.status(403).json({
                success: false,
                error: 'Refresh token expirado',
            });
        }
        const userId = Number(payload.sub);
        const result = await (0, auth_service_1.refreshService)(userId, refreshToken);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            error: 'Token inválido ou expirado',
        });
    }
}
// 🚪 LOGOUT (ATUALIZADO COM BLACKLIST)
async function logout(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({
                success: false,
                error: 'Token não fornecido',
            });
        }
        const [, token] = authHeader.split(' ');
        // 🔐 pega exp do token
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded?.exp) {
            await (0, tokenBlacklist_service_1.blacklistToken)(token, decoded.exp);
        }
        return res.json({
            success: true,
            data: {
                message: 'Logout realizado com sucesso',
            },
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            error: 'Erro ao fazer logout',
        });
    }
}
