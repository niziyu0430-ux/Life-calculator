import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advance,
  catalog,
  currentEvent,
  eligible,
  newGame,
  restoreGame,
  setFocus,
  stats,
  recap,
} from '../lib/game/engine.ts';
import type { Focus, GameState } from '../lib/game/types.ts';

test('Bilingual catalog has unique, complete original events', () => {
  assert.ok(catalog.length >= 120);
  assert.equal(new Set(catalog.map((e) => e.id)).size, catalog.length);
  for (const e of catalog) {
    assert.ok(e.text.zh && e.text.en && e.min <= e.max && e.weight > 0);
    assert.ok(e.choices.length >= 2 && e.choices.length <= 3);
    for (const c of e.choices) {
      assert.ok(c.label.zh && c.label.en && c.result.zh && c.result.en);
    }
  }
});
test('One thousand complete reproducible lives have valid boundaries and conditions', () => {
  const reached = new Set<string>();
  let min = 90,
    max = 0;
  for (let seed = 0; seed < 1000; seed++) {
    let a = newGame(seed, (seed % 2) as 0 | 1, (seed % 3) as 0 | 1 | 2),
      b = structuredClone(a);
    while (!a.ended) {
      assert.ok(a.age < 90);
      const event = currentEvent(a)!;
      assert.ok(event && event.choices.length);
      assert.equal(a.used.includes(event.id), false);
      if (
        !event.id.startsWith('hardship-') &&
        !event.id.startsWith('ordinary-')
      )
        assert.ok(eligible(event, a));
      const focus = (['career', 'study', 'company', 'rest'] as Focus[])[
        (seed + a.age) % 4
      ];
      a = setFocus(a, focus);
      b = setFocus(b, focus);
      const index = (seed + a.age) % event.choices.length;
      reached.add(event.id);
      const old = JSON.stringify(a);
      const before = a;
      a = advance(a, index);
      b = advance(b, index);
      assert.equal(JSON.stringify(before), old, 'pure transition');
      assert.deepEqual(a, b);
      for (const k of stats)
        assert.ok(
          Number.isFinite(a.stats[k]) && a.stats[k] >= 0 && a.stats[k] <= 100,
        );
      assert.ok(Number.isFinite(a.coins) && a.coins >= 0);
      assert.equal(a.age, before.age + 1);
      if (a.married) assert.ok(a.partner);
      if (a.children) assert.ok(a.married);
    }
    assert.ok(a.age >= 71 && a.age <= 90);
    assert.equal(a.history.length, a.age);
    assert.equal(a.pending, null);
    assert.throws(() => advance(a, 0));
    assert.deepEqual(restoreGame(JSON.stringify(a)), a);
    min = Math.min(min, a.age);
    max = Math.max(max, a.age);
  }
  for (const id of catalog.map((e) => e.id))
    assert.ok(reached.has(id), `unreached ${id}`);
  console.log(
    `1000 lives: endings ${min}–${max}; every ${catalog.length} catalog event reached.`,
  );
});
test('Save round trips pending choices and rejects damaged, incompatible or tampered data', () => {
  let s = newGame(492, 1, 2);
  for (let i = 0; i < 34; i++) s = advance(setFocus(s, 'study'), 0);
  assert.deepEqual(restoreGame(JSON.stringify(s)), s);
  assert.equal(restoreGame('{'), null);
  assert.equal(restoreGame(JSON.stringify({ ...s, version: 2 })), null);
  assert.equal(restoreGame(JSON.stringify({ ...s, coins: 999999 })), null);
  assert.equal(
    restoreGame(JSON.stringify({ ...s, pending: 'job-technology' })),
    null,
  );
  const fake = structuredClone(s);
  fake.history[0].text.zh = '<script>bad</script>';
  assert.equal(restoreGame(JSON.stringify(fake)), null);
  assert.throws(() => advance(s, -1));
  assert.throws(() => advance(s, 99));
  assert.throws(() => advance(s, 1.5));
  assert.ok(recap(s, true).includes('Another Chapter'));
  assert.ok(recap(s, false).includes('人生另一页'));
});
test('Appearance changes no ability; hardship is recoverable; family choices are optional', () => {
  const a = newGame(22, 0, 1),
    b = newGame(22, 1, 1);
  assert.deepEqual({ ...a, appearance: 1 }, b);
  let s = newGame(81);
  while (s.age < 18) s = advance(s, 0);
  s = { ...s, coins: 0, pending: 'hardship-18' };
  const next = advance(s, 0);
  assert.ok(next.coins > 0 && next.age === 19);
  let single = newGame(90);
  while (!single.ended) {
    const e = currentEvent(single)!;
    single = advance(single, e.id.startsWith('relationship-') ? 1 : 0);
  }
  assert.equal(single.partner, false);
  assert.equal(single.children, 0);
  const low: GameState = {
    ...s,
    age: 40,
    stats: { ...s.stats, health: 0 },
    pending: 'hardship-40',
  };
  assert.equal(advance(low, 1).ended, false);
});
