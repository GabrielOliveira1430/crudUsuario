import { Router } from 'express';
import { SimulatorController } from './simulator.controller';

const router = Router();

/**
 * 🧪 SIMULAÇÃO SIMPLES
 */
router.post('/run', SimulatorController.run);

/**
 * ⚖️ COMPARAÇÃO DE ESTRATÉGIAS
 */
router.post('/compare', SimulatorController.compare);

export default router;