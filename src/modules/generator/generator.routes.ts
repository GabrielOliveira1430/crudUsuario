import { Router } from 'express';
import { GeneratorController } from './generator.controller';

const router = Router();

/**
 * 🎲 GERADOR DE APOSTAS
 */
router.post('/generate', GeneratorController.generate);

export default router;