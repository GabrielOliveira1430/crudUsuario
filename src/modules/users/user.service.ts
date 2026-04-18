import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import { CreateUserDTO } from './user.types';
import { AppError } from '../../shared/errors/AppError';

const SALT_ROUNDS = 10;

type Filters = {
  name?: string;
  email?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
};

type UpdateUserDTO = {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
};

/**
 * 🔐 Criar usuário (SEGURO)
 */
export const create = async (data: CreateUserDTO) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (exists) {
    throw new AppError('Email já existe', 400);
  }

  let role: Role = Role.USER;

  if (data.role === Role.ADMIN) {
    throw new AppError('Não é permitido criar ADMIN diretamente', 403);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * Buscar perfil do usuário logado
 */
export const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user;
};

/**
 * 🔥 LISTAGEM CORRIGIDA (PADRÃO FRONTEND)
 */
export const getAll = async (
  page: number,
  limit: number,
  filters?: Filters
) => {
  const skip = (page - 1) * limit;

  const where: any = { AND: [] };

  if (filters?.search) {
    where.AND.push({
      OR: [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ],
    });
  }

  if (filters?.name) {
    where.AND.push({
      name: {
        contains: filters.name,
        mode: 'insensitive',
      },
    });
  }

  if (filters?.email) {
    where.AND.push({
      email: {
        contains: filters.email,
        mode: 'insensitive',
      },
    });
  }

  if (filters?.startDate || filters?.endDate) {
    where.AND.push({
      createdAt: {
        gte: filters.startDate ? new Date(filters.startDate) : undefined,
        lte: filters.endDate ? new Date(filters.endDate) : undefined,
      },
    });
  }

  const allowedSortFields = ['name', 'email', 'createdAt'];
  let orderBy: any = { createdAt: 'desc' };

  if (filters?.sort) {
    const [field, order] = filters.sort.split(':');

    if (allowedSortFields.includes(field)) {
      orderBy = {
        [field]: order === 'asc' ? 'asc' : 'desc',
      };
    }
  }

  const finalWhere = where.AND.length ? where : undefined;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: finalWhere,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({
      where: finalWhere,
    }),
  ]);

  // 🔥 AQUI ESTÁ A CORREÇÃO
  return {
    users,
    total,
    page,
    perPage: limit,
    lastPage: Math.ceil(total / limit),
  };
};

/**
 * Buscar usuário por ID
 */
export const getById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user;
};

/**
 * 🔐 Atualizar usuário
 */
export const update = async (id: number, data: UpdateUserDTO) => {
  const exists = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const updateData: any = { ...data };

  if (updateData.role) {
    throw new AppError('Alteração de role não permitida', 403);
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(
      updateData.password,
      SALT_ROUNDS
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return updated;
};

/**
 * Deletar usuário
 */
export const remove = async (id: number) => {
  const exists = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) {
    throw new AppError('Usuário não encontrado', 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'Usuário deletado com sucesso' };
};

/**
 * 📊 STATS (já estava correto)
 */
export const getUserStats = async () => {
  const users = await prisma.user.findMany({
    select: {
      role: true,
      createdAt: true,
    },
  });

  const growthMap: Record<string, number> = {};

  users.forEach((user) => {
    const date = new Date(user.createdAt);
    const month = date.toLocaleString('pt-BR', { month: 'short' });

    growthMap[month] = (growthMap[month] || 0) + 1;
  });

  const growth = Object.entries(growthMap).map(([month, total]) => ({
    name: month,
    users: total,
  }));

  const roles = {
    ADMIN: users.filter((u) => u.role === Role.ADMIN).length,
    USER: users.filter((u) => u.role === Role.USER).length,
  };

  return {
    growth,
    roles,
  };

  
};

