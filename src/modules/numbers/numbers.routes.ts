import { Router } from "express";
import {
  generateNumbersController,
  getUserHistoryController,
  getRankingController,
  clearUserHistoryController,
  getHotColdController,
} from "./numbers.controller";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();

router.get("/generate", authMiddleware, generateNumbersController);
router.get("/history", authMiddleware, getUserHistoryController);
router.delete("/history", authMiddleware, clearUserHistoryController);
router.get("/ranking", authMiddleware, getRankingController);

// 🔥 NOVO
router.get("/hot-cold", authMiddleware, getHotColdController);

export default router;