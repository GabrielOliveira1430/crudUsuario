"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    /**
     * 🔴 ERRO DO ZOD
     */
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            error: 'Erro de validação',
            details: err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }
    /**
     * 🔴 ERRO PADRÃO (AppError ou outros)
     */
    const status = err.status || 500;
    return res.status(status).json({
        success: false,
        error: err.message || 'Erro interno do servidor'
    });
};
exports.errorMiddleware = errorMiddleware;
