export function generateTernoDezena(dezenas: string[]) {
  const result: string[] = [];

  for (let i = 0; i < dezenas.length; i++) {
    for (let j = i + 1; j < dezenas.length; j++) {
      for (let k = j + 1; k < dezenas.length; k++) {
        result.push(`${dezenas[i]} + ${dezenas[j]} + ${dezenas[k]}`);
      }
    }
  }

  return result;
}