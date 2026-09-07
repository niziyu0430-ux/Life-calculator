export function parseNumberInput(
  raw: string,
  min: number,
  max: number,
  integer = false,
): number | null {
  if (!raw.trim()) return null;
  const n = Number(raw);
  return Number.isFinite(n) &&
    n >= min &&
    n <= max &&
    (!integer || Number.isInteger(n))
    ? n
    : null;
}
