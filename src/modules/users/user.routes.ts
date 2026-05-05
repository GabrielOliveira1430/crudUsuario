// src/modules/user/user.routes.ts

import { Router } from "express";
import { Role } from "@prisma/client";

import * as controller from "./user.controller";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { roleMiddleware } from "../../shared/middlewares/role.middleware";
import { permissionMiddleware } from "../../shared/middlewares/permission.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";

import {
  createUserSchema,
  updateUserSchema,
} from "./user.schema";

const router = Router();

/**
 * 🚀 UPGRADE PLAN (🔥 TEM QUE VIR ANTES DO /:id)
 */
router.patch(
  "/upgrade",
  authMiddleware,
  controller.upgradePlan
);

/**
 * Criar usuário
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware("user:create"),
  validate(createUserSchema),
  controller.createUser
);

/**
 * Perfil
 */
router.get("/me", authMiddleware, controller.me);

/**
 * Stats
 */
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware("user:read"),
  controller.stats
);

/**
 * Users
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware("user:read"),
  controller.getUsers
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware("user:read"),
  controller.getUser
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware("user:update"),
  validate(updateUserSchema),
  controller.updateUser
);

router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware("user:update"),
  controller.updateUserRole
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  permissionMiddleware("user:delete"),
  controller.deleteUser
);

export default router;