import { Request, Response } from "express";
import {
  generateNumbersService,
  getUserHistoryService,
  getRankingService,
  getHotColdNumbers, // 🔥 NOVO
} from "./numbers.service";

import prisma from "../../database/prisma";
import { NumberType } from "./numbers.types";

// 🔢 GERAR
export async function generateNumbersController(req: Request, res: Response) {
  try {
    const type = req.query.type as NumberType;
    const amount = Number(req.query.amount);

    // 🔥 PEGAR PALAVRAS DO SONHO
    const wordsParam = req.query.words as string | undefined;
    const words = wordsParam
      ? wordsParam.split(",").map((w) => w.trim().toLowerCase())
      : [];

    // ✅ VALIDAÇÃO DE TIPO
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
        "sonho",
      ].includes(type)
    ) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    // 🔢 VALIDAÇÃO DE AMOUNT (exceto sonho)
    if (type !== "sonho") {
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "amount inválido" });
      }
    }

    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    // 🧠 SALVAR PALAVRAS DO SONHO (ANALYTICS)
    if (type === "sonho" && words.length > 0) {
      for (const word of words) {
        await prisma.dreamWord.upsert({
          where: {
            userId_word: {
              userId: user.id,
              word,
            },
          },
          update: {
            count: { increment: 1 },
          },
          create: {
            userId: user.id,
            word,
            count: 1,
          },
        });
      }
    }

    // 🔥 GERAR NÚMEROS
    const result = await generateNumbersService(type, amount || 1, {
      ...user,
      words,
    });

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

// 🔥 HOT / COLD (NOVO)
export async function getHotColdController(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const data = await getHotColdNumbers(user.id);

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao buscar números quente/frio",
    });
  }
}