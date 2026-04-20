import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import auditRoutes from './modules/audit/audit.routes';
import securityRoutes from './modules/security/security.routes';

import { swaggerSetup } from './shared/config/swagger';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { globalLimiter } from './shared/middlewares/rateLimit.middleware';
import { auditMiddleware } from './shared/middlewares/audit.middleware';
import { blockMiddleware } from './shared/middlewares/block.middleware';

const app = express();

// 🔧 Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// 📊 Logs
app.use(morgan('dev'));

// 🚧 Rate limit global (opcional)
// app.use(globalLimiter);

// 🔥 BLOQUEIO GLOBAL (ANTES DAS ROTAS)
app.use(blockMiddleware);

// ✅ ROTA RAIZ (ADICIONADA AQUI)
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// 📘 Swagger
swaggerSetup(app);

// 🛣 ROTAS (AGRUPADAS)
const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/audit-logs', auditRoutes);
routes.use('/security', securityRoutes);

// base path da API
app.use('/api/v1', routes);

// 🔍 Health check
app.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

// 🔥 AUDITORIA GLOBAL (DEPOIS DAS ROTAS)
app.use(auditMiddleware);

// ⚠️ Middleware de erro (SEMPRE O ÚLTIMO)
app.use(errorMiddleware);

export default app;