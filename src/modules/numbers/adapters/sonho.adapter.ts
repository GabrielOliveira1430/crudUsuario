import prisma from "../../../database/prisma";

type DreamMap = Record<string, number[]>;

const dreamDictionary: DreamMap = {
  agua: [12, 24, 36],
  cobra: [14, 33, 78],
  dinheiro: [5, 19, 88],
  morte: [13, 44, 90],
  casamento: [7, 21, 66],
  voando: [11, 22, 55],
  dente: [3, 17, 29],
  sangue: [4, 18, 90],
  fogo: [8, 28, 77],
  animal: [1, 10, 25],
  mar: [6, 16, 60],
  casa: [2, 20, 45],
};

// 🔥 FREQUÊNCIA DE NÚMEROS DO USUÁRIO
async function getUserNumberFrequency(userId: number) {
  const history = await prisma.numberHistory.findMany({
    where: { userId },
    select: { numbers: true },
  });

  const freq: Record<string, number> = {};

  for (const item of history) {
    for (const num of item.numbers) {
      freq[num] = (freq[num] || 0) + 1;
    }
  }

  return freq;
}

// 🧠 FREQUÊNCIA DE PALAVRAS DO USUÁRIO (NOVO)
async function getUserWordFrequency(userId: number) {
  const words = await prisma.dreamWord.findMany({
    where: { userId },
    select: { word: true, count: true },
  });

  const freq: Record<string, number> = {};

  for (const w of words) {
    freq[w.word] = w.count;
  }

  return freq;
}

// 🎯 SORTEIO COM PESO INTELIGENTE
function weightedRandom(
  numbers: number[],
  numberFreq: Record<string, number>,
  wordBoost: number
) {
  const weighted = numbers.map((n) => {
    const base = 1;

    // 🔥 peso por histórico de números
    const historyWeight = numberFreq[n.toString()] || 0;

    // 🔥 peso por frequência da palavra
    const totalWeight = base + historyWeight + wordBoost;

    return {
      num: n,
      weight: totalWeight,
    };
  });

  const total = weighted.reduce((sum, i) => sum + i.weight, 0);

  let rand = Math.random() * total;

  for (const item of weighted) {
    if (rand < item.weight) return item.num;
    rand -= item.weight;
  }

  return weighted[0].num;
}

// 🧠 IA DE SONHO
export async function generateSonho(
  words: string[],
  userId: number
): Promise<number[]> {
  if (!words || words.length === 0) {
    throw new Error("Nenhuma palavra informada");
  }

  const numberFreq = await getUserNumberFrequency(userId);
  const wordFreq = await getUserWordFrequency(userId);

  let pool: number[] = [];
  let totalWordBoost = 0;

  for (const word of words) {
    const clean = word.toLowerCase().trim();

    if (dreamDictionary[clean]) {
      pool.push(...dreamDictionary[clean]);

      // 🔥 boost baseado em uso da palavra
      totalWordBoost += wordFreq[clean] || 0;
    }
  }

  if (pool.length === 0) {
    throw new Error("Nenhum sonho reconhecido");
  }

  // remove duplicados
  pool = [...new Set(pool)];

  const result: number[] = [];

  for (let i = 0; i < Math.min(3, pool.length); i++) {
    const chosen = weightedRandom(pool, numberFreq, totalWordBoost);

    result.push(chosen);

    // remove para não repetir
    pool = pool.filter((n) => n !== chosen);
  }

  return result;
}