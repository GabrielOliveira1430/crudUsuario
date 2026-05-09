import { Router } from 'express';
import { OrchestratorController } from './orchestrator.controller';

const router = Router();

/**
 * 🧠 ORQUESTRADOR CENTRAL DO SISTEMA
 */
router.post('/run', OrchestratorController.run);

export default router;