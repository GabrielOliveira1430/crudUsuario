// src/modules/numbers/numbers.routes.ts

import { Router } from "express";
import {
  generateNumbersController,
  getUserHistoryController,
  getRankingController,
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

router.get(
  "/ranking",
  authMiddleware,
  getRankingController
);

export default router;