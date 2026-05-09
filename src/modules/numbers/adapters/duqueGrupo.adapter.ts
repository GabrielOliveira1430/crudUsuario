export function generateDuqueGrupo(grupos: number[]) {
  const result: string[] = [];

  for (let i = 0; i < grupos.length; i++) {
    for (let j = i + 1; j < grupos.length; j++) {
      result.push(`🎯 ${grupos[i]} + ${grupos[j]}`);
    }
  }

  return result;
}