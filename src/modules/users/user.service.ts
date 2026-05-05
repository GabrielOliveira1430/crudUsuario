import prisma from "../../database/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

import { CreateUserDTO } from "./user.types";
import { AppError } from "../../shared/errors/AppError";

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

type UpdateRoleDTO = Role;

/**
 * 🔐 Criar usuário
 */
export const create = async (data: CreateUserDTO) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (exists) {
    throw new AppError("Email já existe", 400);
  }

  if (data.role === Role.ADMIN) {
    throw new AppError("Não é permitido criar ADMIN diretamente", 403);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: Role.USER,
      plan: "FREE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });
};

/**
 * 👤 Perfil
 */
export const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!user) throw new AppError("Usuário não encontrado", 404);

  return user;
};

/**
 * 📋 LISTAGEM
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
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ],
    });
  }

  const finalWhere = where.AND.length ? where : undefined;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: finalWhere,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: finalWhere }),
  ]);

  return {
    users,
    total,
    page,
    perPage: limit,
    lastPage: Math.ceil(total / limit),
  };
};

/**
 * 🔍 POR ID
 */
export const getById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!user) throw new AppError("Usuário não encontrado", 404);

  return user;
};

/**
 * ✏️ UPDATE
 */
export const update = async (id: number, data: UpdateUserDTO) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new AppError("Usuário não encontrado", 404);

  const updateData: any = {};

  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.role) updateData.role = data.role;

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      updatedAt: true,
    },
  });
};

/**
 * 🔁 ROLE
 */
export const updateRole = async (id: number, role: UpdateRoleDTO) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new AppError("Usuário não encontrado", 404);

  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });
};

/**
 * 🗑 DELETE
 */
export const remove = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new AppError("Usuário não encontrado", 404);

  await prisma.user.delete({ where: { id } });

  return { message: "Usuário deletado com sucesso" };
};

/**
 * 📊 STATS
 */
export const getUserStats = async () => {
  const users = await prisma.user.findMany({
    select: {
      role: true,
      createdAt: true,
    },
  });

  const growthMap: Record<string, number> = {};

  for (const user of users) {
    const month = new Date(user.createdAt).toLocaleString("pt-BR", {
      month: "short",
    });

    growthMap[month] = (growthMap[month] || 0) + 1;
  }

  const growth = Object.entries(growthMap).map(([name, users]) => ({
    name,
    users,
  }));

  return {
    growth,
    roles: {
      ADMIN: users.filter((u) => u.role === Role.ADMIN).length,
      USER: users.filter((u) => u.role === Role.USER).length,
    },
  };
};

/**
 * 🚀 UPGRADE PARA PRO (🔥 FALTAVA ISSO AQUI)
 */
export const upgradePlan = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return prisma.user.update({
    where: { id: userId },
    data: { plan: "PRO" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      updatedAt: true,
    },
  });
};