export const WEEK_HOURS = 168;
export function weeklyBudget(values: number[]) {
  if (
    values.length !== 5 ||
    values.some((v) => !Number.isFinite(v) || v < 0 || v > 168)
  )
    throw new Error('Invalid weekly hours');
  const committed = values.reduce((a, b) => a + b, 0);
  return {
    committed,
    available: Math.max(0, WEEK_HOURS - committed),
    over: Math.max(0, committed - WEEK_HOURS),
  };
}
export function projectTime(minutes: number, days: number, weeks: number) {
  if (
    !Number.isFinite(minutes) ||
    minutes < 5 ||
    minutes > 120 ||
    !Number.isInteger(days) ||
    days < 1 ||
    days > 7 ||
    !Number.isInteger(weeks) ||
    weeks < 1 ||
    weeks > 52
  )
    throw new Error('Invalid project schedule');
  return {
    weeklyHours: (minutes * days) / 60,
    totalHours: (minutes * days * weeks) / 60,
    sessions: days * weeks,
  };
}
export function calendarEvent(date: string, dayCount: number) {
  const start = Date.parse(date + 'T00:00:00Z');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(start) ||
    new Date(start).toISOString().slice(0, 10) !== date ||
    !Number.isInteger(dayCount) ||
    dayCount < 1 ||
    dayCount > 100000
  )
    throw new Error('Invalid milestone');
  const compact = (n: number) =>
    new Date(n).toISOString().slice(0, 10).replaceAll('-', '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Life Counter//Milestone//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:milestone-${compact(start)}-${dayCount}@life-counter.cn`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART;VALUE=DATE:${compact(start)}`,
    `DTEND;VALUE=DATE:${compact(start + 86400000)}`,
    `SUMMARY:Life Counter - ${dayCount} days`,
    'DESCRIPTION:Calendar milestone. Birth date is day zero.',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
