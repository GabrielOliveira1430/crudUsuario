"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
// 📌 CONFIG PADRÃO
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const ISSUER = 'api-node-prisma';
const AUDIENCE = 'users';
// 🔐 GERAR ACCESS TOKEN
function generateAccessToken(userId, role) {
    return jsonwebtoken_1.default.sign({
        sub: String(userId),
        ...(role && { role }),
        jti: crypto_1.default.randomUUID(),
    }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        issuer: ISSUER,
        audience: AUDIENCE,
    });
}
// 🔐 GERAR REFRESH TOKEN
function generateRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({
        sub: String(userId),
        jti: crypto_1.default.randomUUID(),
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        issuer: ISSUER,
        audience: AUDIENCE,
    });
}
// 🔍 VALIDAR ACCESS TOKEN
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, {
            issuer: ISSUER,
            audience: AUDIENCE,
        });
    }
    catch {
        throw new Error('Token inválido ou expirado');
    }
}
// 🔍 VALIDAR REFRESH TOKEN
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, {
            issuer: ISSUER,
            audience: AUDIENCE,
        });
    }
    catch {
        throw new Error('Refresh token inválido ou expirado');
    }
}
