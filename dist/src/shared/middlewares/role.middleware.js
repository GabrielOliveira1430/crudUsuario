"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        // 🔍 DEBUG (pode remover depois)
        console.log("ROLE MIDDLEWARE:", {
            userRole: user?.role,
            allowedRoles,
        });
        // 🚫 não autenticado
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Não autenticado",
            });
        }
        // 🚫 role inválida
        if (!user.role) {
            return res.status(403).json({
                success: false,
                error: "Acesso negado (sem role)",
            });
        }
        // 🚫 role não permitida
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                error: "Você não tem permissão para acessar este recurso",
            });
        }
        // ✅ autorizado
        return next();
    };
};
exports.roleMiddleware = roleMiddleware;
