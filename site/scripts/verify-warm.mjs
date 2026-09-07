import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = 'dist/client';
const targets = {
  'time-garden.webp': '/',
  'life-in-weeks.webp': '/guides/life-in-weeks/',
  'day-milestones.webp': '/guides/day-milestones/',
  'date-math.webp': '/guides/date-math/',
  'weekly-time-budget.webp': '/guides/weekly-time-budget/',
  'small-time-projects.webp': '/guides/small-time-projects/',
  'milestone-calendar.webp': '/guides/milestone-calendar/',
  'planner-priorities.webp': '/week-planner/',
};
const found = {};
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name === 'index.html') {
      const html = fs.readFileSync(p, 'utf8');
      let route =
        '/' + path.relative(root, path.dirname(p)).replaceAll('\\', '/') + '/';
      route = route.replace(/\/+/g, '/');
      for (const m of html.matchAll(/<img\b[^>]*src="\/images\/([^"?]+)"/g)) {
        const name = m[1];
        assert.ok(name in targets);
        const canonical = route.replace(/^\/en\//, '/');
        assert.equal(
          canonical,
          targets[name],
          `Wrong image placement ${name} ${route}`,
        );
        const key = route + name;
        assert.ok(!found[key], `Repeated image ${key}`);
        found[key] = true;
      }
    }
  }
}
walk(root);
assert.equal(Object.keys(found).length, 16, 'Eight placements, two languages');
for (const name of ['sans-400', 'sans-500', 'serif-600']) {
  const data = fs.readFileSync(`${root}/fonts/${name}.woff2`);
  assert.equal(data.subarray(0, 4).toString(), 'wOF2');
  assert.ok(data.length < 750000);
}
const luminance = (hex) => {
  const c = hex
    .match(/\w\w/g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};
for (const [fg, bg] of [
  ['352d28', 'fbf7f2'],
  ['74665d', 'fbf7f2'],
  ['ffffff', '96543e'],
])
  assert.ok(contrast(fg, bg) >= 4.5, `${fg}/${bg}`);
console.log(
  'Warm checks passed: eight unique bilingual image placements, three local WOFF2 fonts, text contrast.',
);
