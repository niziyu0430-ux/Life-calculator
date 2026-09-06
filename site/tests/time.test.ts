import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dateDifference,
  lifeStats,
  parseDay,
  anniversary,
  iso,
} from '../lib/time.ts';
test('Gregorian leap boundaries and inclusive dates', () => {
  assert.equal(dateDifference('2024-02-28', '2024-03-01'), 2);
  assert.equal(dateDifference('2023-02-28', '2023-03-01'), 1);
  assert.equal(dateDifference('2026-09-07', '2026-09-07'), 0);
  assert.equal(dateDifference('2026-09-07', '2026-09-07', true), 1);
  assert.equal(dateDifference('2026-01-01', '2026-12-31'), 364);
});
test('Birth date is day zero and weeks are consecutive seven-day intervals', () => {
  const zero = lifeStats('2000-01-01', '2000-01-01', 80);
  assert.equal(zero.days, 0);
  assert.equal(zero.years, 0);
  const week = lifeStats('2000-01-01', '2000-01-08', 80);
  assert.equal(week.weeks, 1);
  assert.equal(week.remainder, 0);
});
test('Milestones include leap days and choose a strictly future thousand', () => {
  const m = lifeStats('2000-01-01', '2026-09-07', 80);
  assert.equal(m.days, 9746);
  assert.equal(m.milestoneDate, '2027-05-19');
  assert.equal(m.untilMilestone, 254);
  assert.equal(lifeStats('2000-01-01', '2002-09-27', 80).nextThousand, 2000);
});
test('February 29 anniversary convention is February 28', () => {
  assert.equal(iso(anniversary('2000-02-29', 1)), '2001-02-28');
  assert.equal(lifeStats('2000-02-29', '2001-02-27', 80).years, 0);
  assert.equal(lifeStats('2000-02-29', '2001-02-28', 80).years, 1);
  assert.throws(() => parseDay('2100-02-29'));
  assert.ok(parseDay('2000-02-29'));
});
test('Invalid and reversed dates fail intentionally', () => {
  for (const s of ['', '2026-02-30', '1899-12-31', '2026-9-7'])
    assert.throws(() => parseDay(s));
  assert.throws(() => dateDifference('2026-02-01', '2026-01-01'));
  assert.throws(() => lifeStats('2027-01-01', '2026-01-01', 80));
  assert.throws(() => lifeStats('2000-01-01', '2026-01-01', 0));
});
test('Outgrown span remains bounded and explicit', () => {
  const m = lifeStats('1900-01-01', '2026-09-07', 20);
  assert.equal(m.beyond, true);
  assert.equal(m.percent, 100);
  assert.ok(m.totalWeeks > 1040 && m.totalWeeks < 1050);
});
