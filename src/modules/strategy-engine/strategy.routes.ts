import { Router } from 'express';
import { StrategyController } from './strategy.controller';

const router = Router();

/**
 * 🚀 roda todas estratégias
 */
router.post('/run-all', StrategyController.runAll);

/**
 * 🎯 roda estratégia específica
 */
router.post('/run', StrategyController.runOne);

export default router;