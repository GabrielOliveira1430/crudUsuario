"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("../../docs/swagger");
const auth_docs_1 = require("../../docs/schemas/auth.docs");
const auth_path_1 = require("../../docs/paths/auth.path");
const swaggerSetup = (app) => {
    const document = {
        ...swagger_1.swaggerDocument,
        // ✅ Junta TODAS as rotas (users + auth)
        paths: {
            ...swagger_1.swaggerDocument.paths,
            ...auth_path_1.authPaths,
        },
        // ✅ Junta TODOS os schemas sem sobrescrever
        components: {
            ...swagger_1.swaggerDocument.components,
            schemas: {
                ...(swagger_1.swaggerDocument.components?.schemas || {}),
                ...auth_docs_1.authSchemas,
            },
        },
    };
    // 🚀 Swagger UI
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(document));
};
exports.swaggerSetup = swaggerSetup;
