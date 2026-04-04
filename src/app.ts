import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import { swaggerSetup } from './shared/config/swagger';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { globalLimiter } from './shared/middlewares/rateLimit.middleware';

const app = express();

// 🔧 Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// 📊 Logs
app.use(morgan('dev'));

// 🚧 Rate limit global (DESATIVADO TEMPORARIAMENTE)
// app.use(globalLimiter);

// 📘 Swagger
swaggerSetup(app);

// 🛣 Rotas
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

// 🔍 Health check (opcional mas útil)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ⚠️ Middleware de erro (SEMPRE O ÚLTIMO)
app.use(errorMiddleware);

export default app;