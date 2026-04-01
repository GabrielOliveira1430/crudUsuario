import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CreateUserDTO, LoginDTO } from './user.types';

/**
 * Criar usuário (com hash da senha)
 */
export const create = async (data: CreateUserDTO) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (exists) throw new Error('Email já existe');

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
    throw new Error('Credenciais inválidas');
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
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
    throw new Error('Usuário não encontrado');
  }

  return user;
};

/**
 * Listar usuários com paginação
 */
export const getAll = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
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

  const total = await prisma.user.count();

  return {
    data: users,
    meta: {
      total,
      page,
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

  if (!user) throw new Error('Usuário não encontrado');

  return user;
};

/**
 * Atualizar usuário
 */
export const update = async (id: number, data: any) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
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
};

/**
 * Deletar usuário
 */
export const remove = async (id: number) => {
  await prisma.user.delete({
    where: { id }
  });

  return { message: 'Usuário deletado com sucesso' };
};