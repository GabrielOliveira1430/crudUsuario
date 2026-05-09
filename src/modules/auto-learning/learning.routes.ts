import { Router } from 'express';
import { LearningController } from './learning.controller';

const router = Router();

/**
 * 🧠 TREINAR SISTEMA
 */
router.post('/learn', LearningController.learn);

/**
 * 📊 RANKING INTELIGENTE
 */
router.post('/ranking', LearningController.ranking);

export default router;