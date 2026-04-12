"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
exports.verify2FAService = verify2FAService;
exports.refreshService = refreshService;
exports.logoutService = logoutService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../database/prisma"));
const token_service_1 = require("./token.service");
const mail_service_1 = require("../mail/mail.service");
const mailService = new mail_service_1.MailService();
// 🔐 GERAR 2FA
function generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// 🔐 LOGIN SERVICE
async function loginService(email, password, ip, userAgent) {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error('Credenciais inválidas');
    }
    if (!user.isActive) {
        throw new Error('Usuário bloqueado');
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
        throw new Error('Conta bloqueada temporariamente');
    }
    const passwordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        const attempts = user.loginAttempts + 1;
        if (attempts >= 5) {
            await prisma_1.default.user.update({
                where: { id: user.id },
                data: {
                    loginAttempts: 0,
                    lockUntil: new Date(Date.now() + 15 * 60 * 1000),
                },
            });
            throw new Error('Conta bloqueada por tentativas');
        }
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: attempts,
            },
        });
        throw new Error('Credenciais inválidas');
    }
    // 🔍 LOGIN SUSPEITO
    const suspicious = (user.lastLoginIp && user.lastLoginIp !== ip) ||
        (user.lastUserAgent && user.lastUserAgent !== userAgent);
    const code = generate2FACode();
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            loginAttempts: 0,
            lockUntil: null,
            lastLoginIp: ip,
            lastUserAgent: userAgent,
            twoFactorCode: code,
            twoFactorExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
    });
    try {
        await mailService.send2FACode(user.email, code);
    }
    catch (err) {
        console.error('Erro ao enviar email:', err);
    }
    return {
        message: 'Código de verificação enviado',
        suspicious,
    };
}
// 🔐 VERIFY 2FA SERVICE
async function verify2FAService(email, code) {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !user.twoFactorCode) {
        throw new Error('Código inválido ou expirado');
    }
    if (user.twoFactorExpires && user.twoFactorExpires < new Date()) {
        throw new Error('Código inválido ou expirado');
    }
    if (user.twoFactorCode !== code) {
        throw new Error('Código inválido ou expirado');
    }
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            twoFactorCode: null,
            twoFactorExpires: null,
        },
    });
    const accessToken = (0, token_service_1.generateAccessToken)(user.id);
    const refreshToken = (0, token_service_1.generateRefreshToken)(user.id);
    await prisma_1.default.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        accessToken,
        refreshToken,
    };
}
// 🔄 REFRESH SERVICE
async function refreshService(userId, oldToken) {
    await prisma_1.default.refreshToken.delete({
        where: { token: oldToken },
    });
    const accessToken = (0, token_service_1.generateAccessToken)(userId);
    const refreshToken = (0, token_service_1.generateRefreshToken)(userId);
    await prisma_1.default.refreshToken.create({
        data: {
            token: refreshToken,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        accessToken,
        refreshToken,
    };
}
// 🚪 LOGOUT SERVICE
async function logoutService(token) {
    await prisma_1.default.refreshToken.deleteMany({
        where: { token },
    });
    return {
        message: 'Logout realizado com sucesso',
    };
}
