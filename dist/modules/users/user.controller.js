"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.me = exports.login = exports.createUser = void 0;
const service = __importStar(require("./user.service"));
/**
 * Criar usuário
 */
const createUser = async (req, res) => {
    try {
        const user = await service.create(req.body);
        return res.status(201).json({
            success: true,
            data: user
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.createUser = createUser;
/**
 * Login
 */
const login = async (req, res) => {
    try {
        const result = await service.login(req.body);
        return res.json({
            success: true,
            data: result
        });
    }
    catch (err) {
        return res.status(401).json({ error: err.message });
    }
};
exports.login = login;
/**
 * Perfil do usuário logado
 */
const me = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await service.getProfile(userId);
        return res.json({
            success: true,
            data: user
        });
    }
    catch (err) {
        return res.status(404).json({ error: err.message });
    }
};
exports.me = me;
/**
 * Listar usuários com paginação + filtros avançados + meta
 */
const getUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const users = await service.getAll(page, limit, {
            name: req.query.name,
            email: req.query.email,
            search: req.query.search,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            sort: req.query.sort
        });
        return res.json({
            success: true,
            data: users.data,
            meta: users.meta
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.getUsers = getUsers;
/**
 * Buscar usuário por ID
 */
const getUser = async (req, res) => {
    try {
        const user = await service.getById(Number(req.params.id));
        return res.json({
            success: true,
            data: user
        });
    }
    catch (err) {
        return res.status(404).json({ error: err.message });
    }
};
exports.getUser = getUser;
/**
 * Atualizar usuário
 */
const updateUser = async (req, res) => {
    try {
        const user = await service.update(Number(req.params.id), req.body);
        return res.json({
            success: true,
            data: user
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.updateUser = updateUser;
/**
 * Deletar usuário
 */
const deleteUser = async (req, res) => {
    try {
        const result = await service.remove(Number(req.params.id));
        return res.json({
            success: true,
            data: result
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.deleteUser = deleteUser;
