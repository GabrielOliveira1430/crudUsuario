export function generateInversaoMilhar(milhar: string[]) {
  const result = new Set<string>();

  milhar.forEach((num) => {
    const variations = permute(num);
    variations.forEach((v) => result.add(v));
  });

  return Array.from(result);
}

function permute(str: string): string[] {
  if (str.length <= 1) return [str];

  const result: string[] = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const rest = str.slice(0, i) + str.slice(i + 1);

    const perms = permute(rest);

    perms.forEach((p) => {
      result.push(char + p);
    });
  }

  return result;
}