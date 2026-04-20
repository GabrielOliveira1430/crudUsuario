"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * 🛡 Rate limit global
 */
exports.globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 1000, // 🔥 AUMENTADO TEMPORARIAMENTE
    message: {
        success: false,
        error: 'Muitas requisições, tente novamente mais tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
});
/**
 * 🔐 Rate limit para login (mais restrito)
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100, // 🔥 AUMENTADO TEMPORARIAMENTE PARA TESTES
    message: {
        success: false,
        error: 'Muitas tentativas de login, tente novamente mais tarde'
    }
});
