"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            return next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    details: err.issues.map((e) => e.message)
                });
            }
            return res.status(500).json({ error: 'Erro interno' });
        }
    };
};
exports.validate = validate;
