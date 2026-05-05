import { Router } from "express";
import {
  generateNumbersController,
  getUserHistoryController,
  getRankingController,
  clearUserHistoryController, // 🔥 NOVO
} from "./numbers.controller";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();

router.get(
  "/generate",
  authMiddleware,
  generateNumbersController
);

router.get(
  "/history",
  authMiddleware,
  getUserHistoryController
);

// 🔥 NOVA ROTA
router.delete(
  "/history",
  authMiddleware,
  clearUserHistoryController
);

router.get(
  "/ranking",
  authMiddleware,
  getRankingController
);

export default router;