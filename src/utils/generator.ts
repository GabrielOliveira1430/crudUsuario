import { NumberType } from "../modules/numbers/numbers.types";

export function generateNumbers(
  base: string[],
  type: NumberType,
  amount: number
) {
  if (!base.length) throw new Error("Sem dados da página");

  const uniqueBase = Array.from(new Set(base));
  const generated = new Set<string>();

  let attempts = 0;
  const maxAttempts = 20000;

  while (generated.size < amount) {
    attempts++;

    if (attempts > maxAttempts) {
      break; // 🔥 NÃO trava mais
    }

    let milhar = "";

    for (let i = 0; i < 4; i++) {
      const random =
        uniqueBase[Math.floor(Math.random() * uniqueBase.length)];

      if (!random) continue;

      milhar += random[i];
    }

    if (milhar.length !== 4) continue;

    if (uniqueBase.includes(milhar)) continue;

    if (type === "milhar") generated.add(milhar);
    if (type === "centena") generated.add(milhar.slice(0, 3));
    if (type === "dezena") generated.add(milhar.slice(2, 4));
  }

  return Array.from(generated);
}