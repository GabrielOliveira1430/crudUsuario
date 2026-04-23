import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

type AuthUser = {
  id: number;
  role: Role;
};

export const roleMiddleware = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;

    console.log("ROLE CHECK:", {
      userRole: user?.role,
      allowedRoles,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Não autenticado",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "Sem permissão para este recurso",
      });
    }

    return next();
  };
};