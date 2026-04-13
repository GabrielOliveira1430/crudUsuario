import * as passwordService from '../../modules/auth/password.service';
import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';

// 🔥 MOCK MAIL SERVICE (EVITA SMTP REAL)
jest.mock('../../modules/mail/mail.service', () => {
  return {
    MailService: jest.fn().mockImplementation(() => ({
      sendGenericEmail: jest.fn().mockResolvedValue(true),
    })),
  };
});

// 🔥 MOCK PRISMA COMPLETO
jest.mock('../../database/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    passwordResetToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    refreshToken: {
      deleteMany: jest.fn(),
    },
  },
}));

// 🔥 MOCK BCRYPT
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashed-password'),
  compare: jest.fn(),
}));

// 🔥 MOCK CRYPTO (PARCIAL)
jest.mock('crypto', () => {
  const original = jest.requireActual('crypto');

  return {
    ...original,
    randomBytes: jest.fn(() => ({
      toString: () => 'reset-token',
    })),
  };
});

describe('Password Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // FORGOT PASSWORD
  // =========================
  describe('forgotPasswordService', () => {
    it('deve gerar token de reset para usuário existente', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
      });

      (prisma.passwordResetToken.create as jest.Mock).mockResolvedValue({
        id: 1,
      });

      (prisma.passwordResetToken.deleteMany as jest.Mock).mockResolvedValue({});

      const result = await passwordService.forgotPasswordService(
        'test@mail.com'
      );

      expect(result).toBeDefined();
      expect(prisma.passwordResetToken.create).toHaveBeenCalled();
    });

    it('deve retornar sucesso mesmo se usuário não existir (segurança)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await passwordService.forgotPasswordService(
        'fake@mail.com'
      );

      expect(result).toBeDefined();
    });
  });

  // =========================
  // RESET PASSWORD
  // =========================
  describe('resetPasswordService', () => {
    it('deve resetar senha com token válido', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        token: 'reset-token',
        userId: 1,
        expiresAt: new Date(Date.now() + 100000),
      });

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 1,
      });

      (prisma.passwordResetToken.delete as jest.Mock).mockResolvedValue({});
      (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({});

      const result = await passwordService.resetPasswordService(
        'reset-token',
        'newpassword'
      );

      expect(result).toBeDefined();
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('deve falhar se token não existir', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        passwordService.resetPasswordService('invalid', '123')
      ).rejects.toThrow();
    });

    it('deve falhar se token expirado', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        token: 'reset-token',
        userId: 1,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        passwordService.resetPasswordService('reset-token', '123')
      ).rejects.toThrow();
    });
  });
});