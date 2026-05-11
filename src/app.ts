import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import auditRoutes from './modules/audit/audit.routes';
import securityRoutes from './modules/security/security.routes';
import stripeRoutes from './modules/stripe/stripe.routes';
import numbersRoutes from './modules/numbers/numbers.routes';

// 🔥 ANALYTICS
import analyticsRoutes from './modules/analytics/analytics.routes';

// 🎰 GENERATOR
import generatorRoutes from './modules/generator/generator.routes';

// 🎯 SIMULATOR
import simulatorRoutes from './modules/simulator/simulator.routes';

// 🧠 STRATEGY ENGINE
import strategyRoutes from './modules/strategy-engine/strategy.routes';

// 🤖 DECISION ENGINE
import decisionRoutes from './modules/decision-engine/decision.routes';

// 🧬 AUTO LEARNING
import learningRoutes from './modules/auto-learning/learning.routes';

// 🧠 AI ORCHESTRATOR
import orchestratorRoutes from './modules/ai-orchestrator/orchestrator.routes';

// ⚽ FOOTBALL
import footballRoutes from './modules/football/football.routes';

// 🧠 LOAD STRATEGIES
import './modules/strategy-engine/strategies';

import { swaggerSetup } from './shared/config/swagger';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { auditMiddleware } from './shared/middlewares/audit.middleware';
import { blockMiddleware } from './shared/middlewares/block.middleware';

const app = express();

// 🔥 ESSENCIAL PARA RAILWAY
app.set('trust proxy', 1);

// ==========================================
// 🔥 STRIPE WEBHOOK (ANTES DE TUDO)
// ==========================================
app.use(
  '/api/v1/stripe/webhook',
  express.raw({ type: 'application/json' })
);

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

// 📘 SWAGGER
swaggerSetup(app);

// ==========================================
// 🛣 ROTAS
// ==========================================
const routes = express.Router();

// 👤 USERS
routes.use('/users', userRoutes);

// 🔐 AUTH
routes.use('/auth', authRoutes);

// 📊 AUDITORIA
routes.use('/audit-logs', auditRoutes);

// 🛡️ SECURITY
routes.use('/security', securityRoutes);

// 💳 STRIPE
routes.use('/stripe', stripeRoutes);

// 🎲 NÚMEROS
routes.use('/numbers', numbersRoutes);

// 🧠 ANALYTICS
routes.use('/analytics', analyticsRoutes);

// 🎰 GENERATOR
routes.use('/generator', generatorRoutes);

// 🎯 SIMULATOR
routes.use('/simulator', simulatorRoutes);

// 🧠 STRATEGIES
routes.use('/strategy', strategyRoutes);

// 🤖 DECISION ENGINE
routes.use('/decision', decisionRoutes);

// 🧬 AUTO LEARNING
routes.use('/learning', learningRoutes);

// 🧠 AI ORCHESTRATOR
routes.use('/orchestrator', orchestratorRoutes);

// ⚽ FOOTBALL
routes.use('/football', footballRoutes);

// ==========================================
// 🚀 API
// ==========================================
app.use('/api/v1', routes);

// 🔍 HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

// 📊 AUDITORIA GLOBAL
app.use(auditMiddleware);

// ❌ ERROR HANDLER
app.use(errorMiddleware);

export default app;