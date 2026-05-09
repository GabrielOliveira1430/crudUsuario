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

import { generateSonho } from "./adapters/sonho.adapter";

import prisma from "../../database/prisma";

type UserPayload = {
  id: number;
  role?: string;
  plan?: string;
  words?: string[];
};

function getUserLimits(plan?: string) {
  const normalizedPlan = (plan || "FREE").toUpperCase();

  if (normalizedPlan === "PRO") {
    return {
      maxAmount: 1000,
      maxHistory: 50,
      maxPerDay: 100,
      plan: "PRO",
    };
  }

  return {
    maxAmount: 5,
    maxHistory: 10,
    maxPerDay: 5,
    plan: "FREE",
  };
}

function getStartOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function normalizeNumbers(numbers: unknown[]): string[] {
  if (!Array.isArray(numbers)) return [];

  return numbers.map((n) => {
    if (typeof n === "string") return n;
    if (Array.isArray(n)) return n.join("-");
    if (typeof n === "object") return JSON.stringify(n);
    return String(n);
  });
}

export async function generateNumbersService(
  type: NumberType,
  amount: number,
  user: UserPayload
) {
  const limits = getUserLimits(user.plan);

  if (amount <= 0) throw new Error("Quantidade inválida");

  if (amount > limits.maxAmount) {
    throw new Error(
      `Plano ${limits.plan}: máximo ${limits.maxAmount} números por geração`
    );
  }

  if (
    user.plan !== "PRO" &&
    !["milhar", "centena", "dezena"].includes(type)
  ) {
    throw new Error("Disponível apenas no plano PRO");
  }

  const today = getStartOfDay();

  const todayUsage = await prisma.usage.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: today,
      },
    },
  });

  if (todayUsage && todayUsage.count >= limits.maxPerDay) {
    throw new Error("Limite diário atingido");
  }

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

      case "sonho":
        result = await generateSonho(user.words || [], user.id);
        break;

      default:
        throw new Error("Tipo inválido");
    }
  }

  if (!Array.isArray(result)) result = [];

  await prisma.numberHistory.create({
    data: {
      userId: user.id,
      numbers: normalizeNumbers(result),
    },
  });

  await prisma.usage.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: today,
      },
    },
    update: { count: { increment: 1 } },
    create: {
      userId: user.id,
      date: today,
      count: 1,
    },
  });

  return {
    numbers: result,
    plan: limits.plan,
    limits,
    usage: {
      today: (todayUsage?.count || 0) + 1,
      max: limits.maxPerDay,
    },
  };
}

// 🔥 HOT / COLD
export async function getHotColdNumbers(userId: number) {
  const allHistory = await prisma.numberHistory.findMany({
    select: { numbers: true, userId: true },
  });

  const globalFreq: Record<string, number> = {};
  const userFreq: Record<string, number> = {};

  for (const item of allHistory) {
    for (const num of item.numbers) {
      globalFreq[num] = (globalFreq[num] || 0) + 1;

      if (item.userId === userId) {
        userFreq[num] = (userFreq[num] || 0) + 1;
      }
    }
  }

  function getTop(freq: Record<string, number>, asc = false) {
    return Object.entries(freq)
      .sort((a, b) => (asc ? a[1] - b[1] : b[1] - a[1]))
      .slice(0, 5)
      .map(([num]) => num);
  }

  return {
    global: {
      hot: getTop(globalFreq),
      cold: getTop(globalFreq, true),
    },
    user: {
      hot: getTop(userFreq),
      cold: getTop(userFreq, true),
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

  return history.map((item) => item.numbers);
}

export async function getRankingService() {
  return await prisma.numberHistory.groupBy({
    by: ["userId"],
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 10,
  });
}