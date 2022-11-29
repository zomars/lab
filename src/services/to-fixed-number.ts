export function toFixedNumber(number: number, digits = 2): number {
  return +number.toFixed(digits);
}
