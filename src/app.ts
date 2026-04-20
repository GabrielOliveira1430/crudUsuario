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
import { auditMiddleware } from './shared/middlewares/audit.middleware';
import { blockMiddleware } from './shared/middlewares/block.middleware';

const app = express();

// 🔧 CORE MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 CORS CORRIGIDO (IMPORTANTE PARA RAILWAY)
app.use(
  cors({
    origin: '*', // depois você pode restringir
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(helmet());
app.use(morgan('dev'));

// 🚧 BLOQUEIO GLOBAL
app.use(blockMiddleware);

// 🏠 ROOT
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

// 📘 SWAGGER
swaggerSetup(app);

// 🛣 ROTAS
const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/audit-logs', auditRoutes);
routes.use('/security', securityRoutes);

// ⚠️ IMPORTANTE: prefixo correto
app.use('/api/v1', routes);

// 🔍 HEALTH
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 📊 AUDITORIA
app.use(auditMiddleware);

// ❌ ERRO HANDLER
app.use(errorMiddleware);

export default app;