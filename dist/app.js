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
const swagger_1 = require("./shared/config/swagger");
const error_middleware_1 = require("./shared/middlewares/error.middleware");
const app = (0, express_1.default)();
// 🔧 Middlewares básicos
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// 📊 Logs
app.use((0, morgan_1.default)('dev'));
// 🚧 Rate limit global (DESATIVADO TEMPORARIAMENTE)
// app.use(globalLimiter);
// 📘 Swagger
(0, swagger_1.swaggerSetup)(app);
// 🛣 Rotas
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
// 🔍 Health check (opcional mas útil)
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// ⚠️ Middleware de erro (SEMPRE O ÚLTIMO)
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
