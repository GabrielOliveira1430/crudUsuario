import { Router } from "express";
import {
  generateNumbersController,
  getUserHistoryController,
  getRankingController,
  clearUserHistoryController,
} from "./numbers.controller";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();

// gerar
router.get("/generate", authMiddleware, generateNumbersController);

// histórico
router.get("/history", authMiddleware, getUserHistoryController);

// limpar histórico
router.delete("/history", authMiddleware, clearUserHistoryController);

// ranking
router.get("/ranking", authMiddleware, getRankingController);

export default router;