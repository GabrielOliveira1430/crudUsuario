import { Request, Response } from "express";
import {
  generateNumbersService,
  getUserHistoryService,
  getRankingService,
} from "./numbers.service";
import { NumberType } from "./numbers.types";

export async function generateNumbersController(
  req: Request,
  res: Response
) {
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
      return res.status(400).json({
        error: "Tipo inválido",
      });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "amount deve ser válido",
      });
    }

    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const result = await generateNumbersService(
      type,
      amount,
      user
    );

    return res.json(result);
  } catch (error: any) {
    console.error("ERRO:", error.message);

    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function getUserHistoryController(
  req: Request,
  res: Response
) {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const history = await getUserHistoryService(user);

    return res.json(history);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro interno",
    });
  }
}

export async function getRankingController(
  req: Request,
  res: Response
) {
  try {
    const ranking = await getRankingService();

    return res.json(ranking);
  } catch {
    return res.status(500).json({
      error: "Erro interno",
    });
  }
}