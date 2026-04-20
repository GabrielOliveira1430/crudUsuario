"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidatePermissionCache = exports.setPermissionsInCache = exports.getPermissionsFromCache = void 0;
const redis_1 = require("../../shared/config/redis");
const PREFIX = 'permissions:';
const TTL = 60 * 10; // 10 minutos
const getPermissionsFromCache = async (role) => {
    try {
        // 🔒 fallback seguro caso Redis não esteja configurado
        if (!redis_1.redis)
            return null;
        const data = await redis_1.redis.get(PREFIX + role);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Erro ao buscar permissões no cache:', error);
        return null; // fallback seguro
    }
};
exports.getPermissionsFromCache = getPermissionsFromCache;
const setPermissionsInCache = async (role, permissions) => {
    try {
        // 🔒 não quebra se Redis estiver desativado
        if (!redis_1.redis)
            return;
        await redis_1.redis.set(PREFIX + role, JSON.stringify(permissions), 'EX', TTL);
    }
    catch (error) {
        console.error('Erro ao salvar permissões no cache:', error);
        // não quebra fluxo
    }
};
exports.setPermissionsInCache = setPermissionsInCache;
const invalidatePermissionCache = async (role) => {
    try {
        // 🔒 não quebra se Redis estiver desativado
        if (!redis_1.redis)
            return;
        await redis_1.redis.del(PREFIX + role);
    }
    catch (error) {
        console.error('Erro ao invalidar cache de permissões:', error);
        // não quebra fluxo
    }
};
exports.invalidatePermissionCache = invalidatePermissionCache;
