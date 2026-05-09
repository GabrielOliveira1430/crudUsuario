export function generateTernoGrupo(grupos: number[]) {
  const result: string[] = [];

  for (let i = 0; i < grupos.length; i++) {
    for (let j = i + 1; j < grupos.length; j++) {
      for (let k = j + 1; k < grupos.length; k++) {
        result.push(`🎯 ${grupos[i]} + ${grupos[j]} + ${grupos[k]}`);
      }
    }
  }

  return result;
}