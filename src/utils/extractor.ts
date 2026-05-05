export function extractMilhar(html: string): string[] {
  // ✅ REGEX CORRETO (sem escape duplo)
  const regex = /(\d{3,4})-\d{2}/g;

  const result: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    let milhar = match[1];

    // garante 4 dígitos
    if (milhar.length === 3) {
      milhar = "0" + milhar;
    }

    result.push(milhar);
  }

  // 🔥 DEBUG (pode remover depois)
  console.log("Milhares encontradas:", result);

  // pega apenas 1º ao 5º de cada bloco
  return result.filter((_, index) => index % 7 < 5);
}