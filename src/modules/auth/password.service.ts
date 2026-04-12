import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '../../database/prisma';
import { MailService } from '../mail/mail.service';

const mailService = new MailService();

// 🔐 gerar token seguro
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// 🔐 hash do token
function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// 📩 FORGOT PASSWORD
export async function forgotPasswordService(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 🔒 não revela se usuário existe
  if (!user) {
    return { message: 'Se o email existir, um link será enviado' };
  }

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  // 🔥 remove tokens antigos
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  try {
    await mailService.sendGenericEmail(
      user.email,
      'Recuperação de senha',
      `
        <h2>Recuperação de senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Expira em 15 minutos</p>
      `
    );
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    // ❗ NÃO quebra fluxo (segurança)
  }

  return {
    message: 'Se o email existir, um link será enviado',
  };
}

// 🔐 RESET PASSWORD
export async function resetPasswordService(
  token: string,
  newPassword: string
) {
  const hashedToken = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!record) {
    throw new Error('Token inválido ou expirado');
  }

  if (record.expiresAt < new Date()) {
    // 🔥 remove token expirado
    await prisma.passwordResetToken.delete({
      where: { token: hashedToken },
    });

    throw new Error('Token expirado');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: record.userId },
    data: {
      password: hashedPassword,
    },
  });

  // 🚫 remove token usado
  await prisma.passwordResetToken.delete({
    where: { token: hashedToken },
  });

  // 🔥 derruba sessões
  await prisma.refreshToken.deleteMany({
    where: { userId: record.userId },
  });

  return {
    message: 'Senha redefinida com sucesso',
  };
} 