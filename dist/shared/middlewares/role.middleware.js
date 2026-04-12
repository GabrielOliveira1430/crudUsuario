"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado',
            });
        }
        return next();
    };
};
exports.roleMiddleware = roleMiddleware;
