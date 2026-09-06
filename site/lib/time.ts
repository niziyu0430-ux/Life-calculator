export const DAY = 86400000;
export function parseDay(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid date');
  const n = Date.parse(value + 'T00:00:00Z');
  if (
    !Number.isFinite(n) ||
    new Date(n).toISOString().slice(0, 10) !== value ||
    Number(value.slice(0, 4)) < 1900
  )
    throw new Error('Invalid date');
  return n;
}
export function iso(n: number) {
  return new Date(n).toISOString().slice(0, 10);
}
export function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function anniversary(birthday: string, years: number) {
  const d = new Date(parseDay(birthday));
  const year = d.getUTCFullYear() + years;
  const month = d.getUTCMonth();
  const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Date.UTC(year, month, Math.min(d.getUTCDate(), last));
}
export function lifeStats(birthday: string, asOf: string, span: number) {
  const start = parseDay(birthday),
    end = parseDay(asOf);
  if (end < start) throw new Error('Birth date is after reference date');
  if (!Number.isInteger(span) || span < 20 || span > 120)
    throw new Error('Invalid span');
  const days = (end - start) / DAY,
    weeks = Math.floor(days / 7),
    remainder = days % 7;
  let years = new Date(end).getUTCFullYear() - new Date(start).getUTCFullYear();
  if (anniversary(birthday, years) > end) years--;
  const totalDays = (anniversary(birthday, span) - start) / DAY;
  const nextThousand = (Math.floor(days / 1000) + 1) * 1000;
  return {
    days,
    weeks,
    remainder,
    years,
    totalWeeks: Math.ceil(totalDays / 7),
    percent: Math.min(100, (days / totalDays) * 100),
    beyond: end >= anniversary(birthday, span),
    nextThousand,
    milestoneDate: iso(start + nextThousand * DAY),
    untilMilestone: nextThousand - days,
  };
}
export function dateDifference(start: string, end: string, inclusive = false) {
  const d = (parseDay(end) - parseDay(start)) / DAY;
  if (d < 0) throw new Error('End before start');
  return d + (inclusive ? 1 : 0);
}
