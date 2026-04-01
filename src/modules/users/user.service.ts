import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CreateUserDTO, LoginDTO } from './user.types';
import { AppError } from '../../shared/errors/AppError';

/**
 * Criar usuário (com hash da senha)
 */
export const create = async (data: CreateUserDTO) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (exists) {
    throw new AppError('Email já existe', 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  return user;
};

/**
 * Login do usuário
 */
export const login = async (data: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return {
    token
  };
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
      createdAt: true
    }
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user;
};

/**
 * Listar usuários com paginação + filtros avançados
 */
export const getAll = async (
  page: number,
  limit: number,
  filters?: {
    name?: string;
    email?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
  }
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    AND: []
  };

  /**
   * 🔍 BUSCA GLOBAL (nome OU email)
   */
  if (filters?.search) {
    where.AND.push({
      OR: [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ]
    });
  }

  /**
   * 🔍 FILTRO POR NOME
   */
  if (filters?.name) {
    where.AND.push({
      name: {
        contains: filters.name,
        mode: 'insensitive'
      }
    });
  }

  /**
   * 🔍 FILTRO POR EMAIL
   */
  if (filters?.email) {
    where.AND.push({
      email: {
        contains: filters.email,
        mode: 'insensitive'
      }
    });
  }

  /**
   * 📅 FILTRO POR DATA
   */
  if (filters?.startDate || filters?.endDate) {
    where.AND.push({
      createdAt: {
        gte: filters.startDate ? new Date(filters.startDate) : undefined,
        lte: filters.endDate ? new Date(filters.endDate) : undefined
      }
    });
  }

  /**
   * 🔃 ORDENAÇÃO SEGURA
   */
  const allowedSortFields = ['name', 'email', 'createdAt'];

  let orderBy: any = { createdAt: 'desc' };

  if (filters?.sort) {
    const [field, order] = filters.sort.split(':');

    if (allowedSortFields.includes(field)) {
      orderBy = {
        [field]: order === 'asc' ? 'asc' : 'desc'
      };
    }
  }

  const users = await prisma.user.findMany({
    where: where.AND.length ? where : undefined,
    orderBy,
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  const total = await prisma.user.count({
    where: where.AND.length ? where : undefined
  });

  return {
    data: users,
    meta: {
      total,
      page,
      perPage: limit,
      lastPage: Math.ceil(total / limit)
    }
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
      createdAt: true
    }
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user;
};

/**
 * Atualizar usuário
 */
export const update = async (id: number, data: any) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });
  } catch (error) {
    throw new AppError('Usuário não encontrado', 404);
  }
};

/**
 * Deletar usuário
 */
export const remove = async (id: number) => {
  try {
    await prisma.user.delete({
      where: { id }
    });

    return { message: 'Usuário deletado com sucesso' };
  } catch (error) {
    throw new AppError('Usuário não encontrado', 404);
  }
};