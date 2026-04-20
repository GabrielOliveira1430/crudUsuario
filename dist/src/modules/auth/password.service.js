"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordService = forgotPasswordService;
exports.resetPasswordService = resetPasswordService;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../database/prisma"));
const mail_service_1 = require("../mail/mail.service");
const mailService = new mail_service_1.MailService();
// 🔐 gerar token seguro
function generateToken() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
// 🔐 hash do token
function hashToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
// 📩 FORGOT PASSWORD
async function forgotPasswordService(email) {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    // 🔒 não revela se usuário existe
    if (!user) {
        return { message: 'Se o email existir, um link será enviado' };
    }
    const rawToken = generateToken();
    const hashedToken = hashToken(rawToken);
    // 🔥 remove tokens antigos
    await prisma_1.default.passwordResetToken.deleteMany({
        where: { userId: user.id },
    });
    await prisma_1.default.passwordResetToken.create({
        data: {
            token: hashedToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    try {
        await mailService.sendGenericEmail(user.email, 'Recuperação de senha', `
        <h2>Recuperação de senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Expira em 15 minutos</p>
      `);
    }
    catch (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        // ❗ NÃO quebra fluxo (segurança)
    }
    return {
        message: 'Se o email existir, um link será enviado',
    };
}
// 🔐 RESET PASSWORD
async function resetPasswordService(token, newPassword) {
    const hashedToken = hashToken(token);
    const record = await prisma_1.default.passwordResetToken.findUnique({
        where: { token: hashedToken },
    });
    if (!record) {
        throw new Error('Token inválido ou expirado');
    }
    if (record.expiresAt < new Date()) {
        // 🔥 remove token expirado
        await prisma_1.default.passwordResetToken.delete({
            where: { token: hashedToken },
        });
        throw new Error('Token expirado');
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma_1.default.user.update({
        where: { id: record.userId },
        data: {
            password: hashedPassword,
        },
    });
    // 🚫 remove token usado
    await prisma_1.default.passwordResetToken.delete({
        where: { token: hashedToken },
    });
    // 🔥 derruba sessões
    await prisma_1.default.refreshToken.deleteMany({
        where: { userId: record.userId },
    });
    return {
        message: 'Senha redefinida com sucesso',
    };
}
