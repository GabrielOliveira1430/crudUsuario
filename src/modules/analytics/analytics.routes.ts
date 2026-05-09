import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';

const router = Router();

/**
 * 🔥 ANALYTICS PRINCIPAL
 */
router.post('/analyze', AnalyticsController.analyze);

export default router;