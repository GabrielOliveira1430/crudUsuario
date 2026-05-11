import { Router } from 'express';

import { FootballController } from './football.controller';

const router = Router();

// ==========================================
// ⚽ LIVE
// ==========================================

router.get(
  '/live',
  FootballController.live.bind(FootballController)
);

// ==========================================
// 📊 ANALYTICS
// ==========================================

router.get(
  '/analytics',
  FootballController.analytics.bind(FootballController)
);

// ==========================================
// 🧠 PREDICTIONS
// ==========================================

router.get(
  '/predictions',
  FootballController.predictions.bind(FootballController)
);

// ==========================================
// 💰 ODDS
// ==========================================

router.get(
  '/odds',
  FootballController.odds.bind(FootballController)
);

export default router;