// src/utils/safe-number.ts

export function safeNumber(
  value: any,
  fallback = 0,
  decimals = 2
): number {

  const num = Number(value);

  if (
    Number.isNaN(num) ||
    !Number.isFinite(num)
  ) {
    return fallback;
  }

  return Number(
    num.toFixed(decimals)
  );
}