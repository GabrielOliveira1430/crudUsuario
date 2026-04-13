import * as userService from '../../modules/users/user.service';
import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../../shared/errors/AppError';

// 🔥 MOCK PRISMA
jest.mock('../../database/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// 🔥 MOCK BCRYPT
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashed-password'),
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================
  describe('create', () => {
    it('deve criar usuário com sucesso', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'User',
        email: 'user@mail.com',
        role: 'USER',
        createdAt: new Date(),
      });

      const result = await userService.create({
        name: 'User',
        email: 'user@mail.com',
        password: '123456',
        role: 'USER',
      });

      expect(result).toHaveProperty('id');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('deve lançar erro se email já existir', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
      });

      await expect(
        userService.create({
          name: 'User',
          email: 'user@mail.com',
          password: '123456',
          role: 'USER',
        })
      ).rejects.toThrow(AppError);
    });
  });

  // =========================
  // GET PROFILE
  // =========================
  describe('getProfile', () => {
    it('deve retornar perfil', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'User',
        email: 'user@mail.com',
      });

      const result = await userService.getProfile(1);

      expect(result).toHaveProperty('id');
    });

    it('deve lançar erro se usuário não existir', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getProfile(1)).rejects.toThrow(AppError);
    });
  });

  // =========================
  // GET BY ID
  // =========================
  describe('getById', () => {
    it('deve retornar usuário por id', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'User',
      });

      const result = await userService.getById(1);

      expect(result.id).toBe(1);
    });

    it('deve lançar erro se não encontrar usuário', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getById(1)).rejects.toThrow(AppError);
    });
  });

  // =========================
  // UPDATE
  // =========================
  describe('update', () => {
    it('deve atualizar usuário com sucesso', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
      });

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Updated',
      });

      const result = await userService.update(1, {
        name: 'Updated',
      });

      expect(result.name).toBe('Updated');
    });

    it('deve hash senha ao atualizar', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
      });

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 1,
      });

      await userService.update(1, {
        password: '123456',
      });

      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('deve lançar erro se usuário não existir', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.update(1, { name: 'x' })
      ).rejects.toThrow(AppError);
    });
  });

  // =========================
  // DELETE
  // =========================
  describe('remove', () => {
    it('deve deletar usuário', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
      });

      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      const result = await userService.remove(1);

      expect(result.message).toBeDefined();
    });

    it('deve lançar erro ao deletar usuário inexistente', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.remove(1)).rejects.toThrow(AppError);
    });
  });

  // =========================
  // GET ALL
  // =========================
  describe('getAll', () => {
    it('deve listar usuários', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: 'User' },
      ]);

      (prisma.user.count as jest.Mock).mockResolvedValue(1);

      const result = await userService.getAll(1, 10);

      expect(result.data.length).toBe(1);
      expect(result.meta.total).toBe(1);
    });

    it('deve aplicar filtros de search', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await userService.getAll(1, 10, {
        search: 'test',
      });

      expect(prisma.user.findMany).toHaveBeenCalled();
    });

    it('deve aplicar sort customizado válido', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await userService.getAll(1, 10, {
        sort: 'name:asc',
      });

      expect(prisma.user.findMany).toHaveBeenCalled();
    });

    it('deve ignorar sort inválido', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await userService.getAll(1, 10, {
        sort: 'invalid:asc',
      });

      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });
});