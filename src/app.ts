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

// 🔧 CORE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 CORS FIX FINAL
app.use(
  cors({
    origin: '*',
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

// 📊 AUDIT
app.use(auditMiddleware);

// ❌ ERROR HANDLER
app.use(errorMiddleware);

export default app;