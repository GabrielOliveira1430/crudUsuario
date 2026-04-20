"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const audit_routes_1 = __importDefault(require("./modules/audit/audit.routes"));
const security_routes_1 = __importDefault(require("./modules/security/security.routes"));
const swagger_1 = require("./shared/config/swagger");
const error_middleware_1 = require("./shared/middlewares/error.middleware");
const audit_middleware_1 = require("./shared/middlewares/audit.middleware");
const block_middleware_1 = require("./shared/middlewares/block.middleware");
const app = (0, express_1.default)();
// 🔧 Middlewares básicos
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// 📊 Logs
app.use((0, morgan_1.default)('dev'));
// 🚧 Rate limit global (opcional)
// app.use(globalLimiter);
// 🔥 BLOQUEIO GLOBAL (ANTES DAS ROTAS)
app.use(block_middleware_1.blockMiddleware);
// 📘 Swagger
(0, swagger_1.swaggerSetup)(app);
// 🛣 ROTAS (AGRUPADAS)
const routes = express_1.default.Router();
routes.use('/users', user_routes_1.default);
routes.use('/auth', auth_routes_1.default);
routes.use('/audit-logs', audit_routes_1.default);
routes.use('/security', security_routes_1.default);
// base path da API
app.use('/api/v1', routes);
// 🔍 Health check
app.get('/health', (req, res) => {
    return res.json({ status: 'ok' });
});
// 🔥 AUDITORIA GLOBAL (DEPOIS DAS ROTAS)
app.use(audit_middleware_1.auditMiddleware);
// ⚠️ Middleware de erro (SEMPRE O ÚLTIMO)
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
