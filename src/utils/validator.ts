export function validateAmount(amount: number) {
  if (amount <= 0 || amount > 1000) {
    throw new Error("Quantidade inválida");
  }
} 