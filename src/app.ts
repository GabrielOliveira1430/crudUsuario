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

// 🔥 ESSENCIAL PARA RAILWAY (resolve rate-limit + X-Forwarded-For)
app.set('trust proxy', 1);

// 🔧 CORE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

// 🛡️ SEGURANÇA
app.use(helmet());

// 📊 LOGS
app.use(morgan('dev'));

// 🚧 BLOQUEIO GLOBAL
app.use(blockMiddleware);

// 🏠 ROOT
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

// 📘 SWAGGER (ANTES DAS ROTAS)
swaggerSetup(app);

// 🛣 ROTAS
const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/audit-logs', auditRoutes);
routes.use('/security', securityRoutes);

app.use('/api/v1', routes);

// 🔍 HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 📊 AUDITORIA (depois das rotas)
app.use(auditMiddleware);

// ❌ ERROR HANDLER (SEMPRE O ÚLTIMO)
app.use(errorMiddleware);

export default app;