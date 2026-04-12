"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = exports.getProfile = exports.login = exports.create = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../shared/errors/AppError");
/**
 * Criar usuário (com hash da senha)
 */
const create = async (data) => {
    const exists = await prisma_1.default.user.findUnique({
        where: { email: data.email }
    });
    if (exists) {
        throw new AppError_1.AppError('Email já existe', 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await prisma_1.default.user.create({
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
exports.create = create;
/**
 * Login do usuário
 */
const login = async (data) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email }
    });
    if (!user) {
        throw new AppError_1.AppError('Credenciais inválidas', 401);
    }
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.AppError('Credenciais inválidas', 401);
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return {
        token
    };
};
exports.login = login;
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
            createdAt: true
        }
    });
    if (!user) {
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
    return user;
};
exports.getProfile = getProfile;
/**
 * Listar usuários com paginação + filtros avançados
 */
const getAll = async (page, limit, filters) => {
    const skip = (page - 1) * limit;
    const where = {
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
    let orderBy = { createdAt: 'desc' };
    if (filters?.sort) {
        const [field, order] = filters.sort.split(':');
        if (allowedSortFields.includes(field)) {
            orderBy = {
                [field]: order === 'asc' ? 'asc' : 'desc'
            };
        }
    }
    const users = await prisma_1.default.user.findMany({
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
    const total = await prisma_1.default.user.count({
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
            createdAt: true
        }
    });
    if (!user) {
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
    return user;
};
exports.getById = getById;
/**
 * Atualizar usuário
 */
const update = async (id, data) => {
    if (data.password) {
        data.password = await bcrypt_1.default.hash(data.password, 10);
    }
    try {
        return await prisma_1.default.user.update({
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
    }
    catch (error) {
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
};
exports.update = update;
/**
 * Deletar usuário
 */
const remove = async (id) => {
    try {
        await prisma_1.default.user.delete({
            where: { id }
        });
        return { message: 'Usuário deletado com sucesso' };
    }
    catch (error) {
        throw new AppError_1.AppError('Usuário não encontrado', 404);
    }
};
exports.remove = remove;
