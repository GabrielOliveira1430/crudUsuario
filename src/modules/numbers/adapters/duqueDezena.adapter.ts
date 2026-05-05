export function generateDuqueDezena(dezenas: string[]) {
  const result: string[][] = [];

  for (let i = 0; i < dezenas.length; i++) {
    for (let j = i + 1; j < dezenas.length; j++) {
      result.push([dezenas[i], dezenas[j]]);
    }
  }

  return result;
}