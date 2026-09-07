import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNumberInput } from '../lib/input.ts';
import { downloadText } from '../lib/download.ts';
test('draft fields reject blank, nonfinite, fractional whole counts and out of range values', () => {
  for (const text of ['', ' ', 'abc', 'Infinity', '0', '121', '5.5'])
    assert.equal(parseNumberInput(text, 5, 120, true), null);
  assert.equal(parseNumberInput('5', 5, 120, true), 5);
  assert.equal(parseNumberInput('120', 5, 120, true), 120);
  assert.equal(parseNumberInput('0.5', 0, 168), 0.5);
});
test('download helper reports failure without throwing when browser APIs are unavailable', () => {
  assert.equal(downloadText('example', 'test.txt', 'text/plain'), false);
});
