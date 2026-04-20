"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const createUser = (data) => {
    return prisma_1.default.user.create({ data });
};
exports.createUser = createUser;
const findByEmail = (email) => {
    return prisma_1.default.user.findUnique({ where: { email } });
};
exports.findByEmail = findByEmail;
