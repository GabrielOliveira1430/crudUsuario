import { Router } from "express";
import express from "express"; // 🔥 FALTAVA ISSO

import {
  createCheckoutSession,
  handleWebhook,
} from "./stripe.controller";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();

// 🔐 usuário logado
router.post("/checkout", authMiddleware, createCheckoutSession);

// ⚠️ webhook NÃO usa JSON normal (Stripe exige RAW)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;