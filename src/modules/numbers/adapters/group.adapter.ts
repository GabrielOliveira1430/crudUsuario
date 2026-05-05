export function generateGrupo(dezenas: string[]) {
  return dezenas.map((d) => {
    const dezena = parseInt(d, 10);

    const grupo = Math.floor(dezena / 4) + 1;

    return {
      dezena: d,
      grupo,
    };
  });
}