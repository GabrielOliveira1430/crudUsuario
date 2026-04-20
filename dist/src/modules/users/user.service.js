"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.remove = exports.update = exports.getById = exports.getAll = exports.getProfile = exports.create = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const AppError_1 = require("../../shared/errors/AppError");
const SALT_ROUNDS = 10;
/**
 * 🔐 Criar usuário (SEGURO)
 */
const create = async (data) => {
    const exists = await prisma_1.default.user.findUnique({
        where: { email: data.email },
        select: { id: true },
    });
    if (exists) {
        throw new AppError_1.AppError('Email já existe', 400);
    }
    let role = client_1.Role.USER;
    if (data.role === client_1.Role.ADMIN) {
        throw new AppError_1.AppError('Não é permitido criar ADMIN diretamente', 403);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    const user = await prisma_1.default.user.create({
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
exports.create = create;
/**
 * Buscar perfil do usuário logado
 */
const getProfile = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
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
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
    return user;
};
exports.getProfile = getProfile;
/**
 * 🔥 LISTAGEM CORRIGIDA (PADRÃO FRONTEND)
 */
const getAll = async (page, limit, filters) => {
    const skip = (page - 1) * limit;
    const where = { AND: [] };
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
    let orderBy = { createdAt: 'desc' };
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
        prisma_1.default.user.findMany({
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
        prisma_1.default.user.count({
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
exports.getAll = getAll;
/**
 * Buscar usuário por ID
 */
const getById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
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
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
    return user;
};
exports.getById = getById;
/**
 * 🔐 Atualizar usuário
 */
const update = async (id, data) => {
    const exists = await prisma_1.default.user.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!exists) {
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
    const updateData = { ...data };
    if (updateData.role) {
        throw new AppError_1.AppError('Alteração de role não permitida', 403);
    }
    if (updateData.password) {
        updateData.password = await bcrypt_1.default.hash(updateData.password, SALT_ROUNDS);
    }
    const updated = await prisma_1.default.user.update({
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
exports.update = update;
/**
 * Deletar usuário
 */
const remove = async (id) => {
    const exists = await prisma_1.default.user.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!exists) {
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
    await prisma_1.default.user.delete({
        where: { id },
    });
    return { message: 'Usuário deletado com sucesso' };
};
exports.remove = remove;
/**
 * 📊 STATS (já estava correto)
 */
const getUserStats = async () => {
    const users = await prisma_1.default.user.findMany({
        select: {
            role: true,
            createdAt: true,
        },
    });
    const growthMap = {};
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
        ADMIN: users.filter((u) => u.role === client_1.Role.ADMIN).length,
        USER: users.filter((u) => u.role === client_1.Role.USER).length,
    };
    return {
        growth,
        roles,
    };
};
exports.getUserStats = getUserStats;
