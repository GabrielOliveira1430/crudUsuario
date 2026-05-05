import { getNumbersFromPage } from "../../utils/scraper";
import { extractMilhar } from "../../utils/extractor";
import { generateNumbers } from "../../utils/generator";
import { NumberType } from "./numbers.types";

import { generateGrupo } from "./adapters/group.adapter";
import { generateDuqueGrupo } from "./adapters/duqueGrupo.adapter";
import { generateTernoGrupo } from "./adapters/ternoGrupo.adapter";

import { generateDuqueDezena } from "./adapters/duqueDezena.adapter";
import { generateTernoDezena } from "./adapters/ternoDezena.adapter";
import { generateInversaoMilhar } from "./adapters/inversaoMilhar.adapter";
import { generateCercadoDezena } from "./adapters/cercadoDezena.adapter";

import prisma from "../../database/prisma";

type UserPayload = {
  id: number;
  role?: string;
  plan?: string;
};

function getUserLimits(plan?: string) {
  const normalizedPlan = (plan || "FREE").toUpperCase();

  if (normalizedPlan === "PRO") {
    return {
      maxAmount: 1000,
      maxHistory: 50,
      plan: "PRO",
    };
  }

  return {
    maxAmount: 5, // 🔥 AGORA BATE COM FRONTEND
    maxHistory: 10,
    plan: "FREE",
  };
}

// 🔥 NORMALIZAÇÃO SEGURA
function normalizeNumbers(numbers: unknown[]): string[] {
  return numbers.map((n) => {
    if (typeof n === "string") return n;
    if (Array.isArray(n)) return n.join("-");
    if (typeof n === "object") return JSON.stringify(n);
    return String(n);
  });
}

// 🔥 BLOQUEIO CENTRAL (ANTI BYPASS)
function validatePlanAccess(
  user: UserPayload,
  type: NumberType,
  amount: number,
  limits: ReturnType<typeof getUserLimits>
) {
  if (!user?.id) {
    throw new Error("Usuário inválido");
  }

  if (amount <= 0) {
    throw new Error("Quantidade inválida");
  }

  // 🔥 LIMITE HARD (segurança real)
  if (amount > limits.maxAmount) {
    throw new Error(
      `Plano ${limits.plan}: máximo de ${limits.maxAmount} números`
    );
  }

  // 🔥 BLOQUEIO DE FEATURES PRO
  if (
    limits.plan === "FREE" &&
    !["milhar", "centena", "dezena"].includes(type)
  ) {
    throw new Error("Função disponível apenas no plano PRO");
  }
}

export async function generateNumbersService(
  type: NumberType,
  amount: number,
  user: UserPayload
) {
  const limits = getUserLimits(user.plan);

  // 🔥 VALIDAÇÃO CENTRAL
  validatePlanAccess(user, type, amount, limits);

  const html = await getNumbersFromPage();
  const milhares = extractMilhar(html);

  if (!milhares.length) {
    throw new Error("Nenhum número encontrado");
  }

  let result: unknown[] = [];

  if (["milhar", "centena", "dezena"].includes(type)) {
    result = generateNumbers(milhares, type, amount);
  } else {
    const dezenas = generateNumbers(milhares, "dezena", amount);
    const milharesGeradas = generateNumbers(milhares, "milhar", amount);

    switch (type) {
      case "grupo":
        result = generateGrupo(dezenas);
        break;

      case "duque_grupo":
        result = generateDuqueGrupo(
          generateGrupo(dezenas).map((g) => g.grupo)
        );
        break;

      case "terno_grupo":
        result = generateTernoGrupo(
          generateGrupo(dezenas).map((g) => g.grupo)
        );
        break;

      case "duque_dezena":
        result = generateDuqueDezena(dezenas);
        break;

      case "terno_dezena":
        result = generateTernoDezena(dezenas);
        break;

      case "inversao_milhar":
        result = generateInversaoMilhar(milharesGeradas);
        break;

      case "cercado_dezena":
        result = generateCercadoDezena(dezenas);
        break;
    }
  }

  // 💾 SALVAR
  await prisma.numberHistory.create({
    data: {
      userId: user.id,
      numbers: normalizeNumbers(result),
    },
  });

  // 🔥 CONTROLE DE HISTÓRICO
  const historyCount = await prisma.numberHistory.count({
    where: { userId: user.id },
  });

  if (historyCount > limits.maxHistory) {
    const toDelete = await prisma.numberHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: historyCount - limits.maxHistory,
    });

    await prisma.numberHistory.deleteMany({
      where: {
        id: {
          in: toDelete.map((item) => item.id),
        },
      },
    });
  }

  return {
    success: true,
    data: {
      numbers: result,
      plan: limits.plan,
      limits,
    },
  };
}

export async function getUserHistoryService(user: UserPayload) {
  const limits = getUserLimits(user.plan);

  const history = await prisma.numberHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limits.maxHistory,
  });

  return {
    success: true,
    data: history.map((item) => item.numbers),
  };
}

export async function getRankingService() {
  return {
    success: true,
    data: [],
  };
}