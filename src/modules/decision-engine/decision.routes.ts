import { Router } from 'express';
import { DecisionController } from './decision.controller';

const router = Router();

/**
 * 🧠 DECISOR CENTRAL
 */
router.post('/decide', DecisionController.decide);

export default router;