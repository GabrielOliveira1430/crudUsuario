import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import userRoutes from './modules/users/user.routes';
import { swaggerSetup } from './shared/config/swagger';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { globalLimiter } from './shared/middlewares/rateLimit.middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// 📊 Logs de requisição
app.use(morgan('dev'));

// 🚧 Rate Limit (proteção global)
app.use(globalLimiter);

// Swagger centralizado
swaggerSetup(app);

// Rotas
app.use('/api/v1/users', userRoutes);

// ⚠️ Middleware de erro (SEMPRE O ÚLTIMO)
app.use(errorMiddleware);

export default app;