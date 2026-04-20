"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockMiddleware = void 0;
const block_service_1 = require("../security/block.service");
const blockMiddleware = async (req, res, next) => {
    const user = req.user;
    const ip = req.ip || 'unknown';
    const blocked = await (0, block_service_1.isBlocked)(ip, user?.id);
    if (blocked) {
        return res.status(403).json({
            success: false,
            error: 'Acesso bloqueado temporariamente'
        });
    }
    return next();
};
exports.blockMiddleware = blockMiddleware;
