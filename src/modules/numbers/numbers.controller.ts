import { Request, Response } from "express";
import {
  generateNumbersService,
  getUserHistoryService,
  getRankingService,
} from "./numbers.service";

import prisma from "../../database/prisma";
import { NumberType } from "./numbers.types";

// 🔢 GERAR
export async function generateNumbersController(req: Request, res: Response) {
  try {
    const type = req.query.type as NumberType;
    const amount = Number(req.query.amount);

    if (
      !type ||
      ![
        "milhar",
        "centena",
        "dezena",
        "grupo",
        "duque_grupo",
        "terno_grupo",
        "duque_dezena",
        "terno_dezena",
        "inversao_milhar",
        "cercado_dezena",
      ].includes(type)
    ) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "amount inválido" });
    }

    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const result = await generateNumbersService(type, amount, user);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao gerar números",
    });
  }
}

// 📜 HISTÓRICO
export async function getUserHistoryController(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const history = await getUserHistoryService(user);

    return res.json(history);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro interno",
    });
  }
}

// 🗑 LIMPAR HISTÓRICO
export async function clearUserHistoryController(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    await prisma.numberHistory.deleteMany({
      where: { userId: user.id },
    });

    return res.json({
      success: true,
      message: "Histórico apagado com sucesso",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao limpar histórico",
    });
  }
}

// 🏆 RANKING
export async function getRankingController(req: Request, res: Response) {
  try {
    const ranking = await getRankingService();
    return res.json(ranking);
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
}