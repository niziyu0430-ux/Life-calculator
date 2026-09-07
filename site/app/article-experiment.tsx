'use client';
import { useState } from 'react';
import { dateDifference, parseDay, iso, DAY } from '../lib/time';
export default function Experiment({
  slug,
  en,
}: {
  slug: string;
  en: boolean;
}) {
  const [value, setValue] = useState(slug.includes("milestone") ? 10000 : 20);
  const [example, setExample] = useState(0);
  const t = (a: string, b: string) => (en ? b : a);
  const dateCases = [
    ['2024-02-28', '2024-03-01'],
    ['2023-02-28', '2023-03-01'],
    ['2026-09-07', '2026-09-07'],
  ];
  return (
    <aside className="article-experiment">
      <p className="eyebrow">
        TRY IT / {t('动手算一次', 'A SMALL EXPERIMENT')}
      </p>
      {slug === 'date-math' ? (
        <>
          <h2>
            {t(
              '切换例子，看相差的那一天',
              'Switch examples. Watch the extra day.',
            )}
          </h2>
          <div className="example-buttons">
            {dateCases.map(([a, b], i) => (
              <button
                key={a}
                aria-pressed={i === example}
                className="quiet"
                onClick={() => setExample(i)}
              >
                {a} → {b}
              </button>
            ))}
          </div>
          <p aria-live="polite">
            {t('经过 ', 'Elapsed: ')}
            <b>{dateDifference(...(dateCases[example] as [string, string]))}</b>
            {t(' 天；包含首尾为 ', ' days; including both dates: ')}
            <b>
              {dateDifference(
                ...(dateCases[example] as [string, string]),
                true,
              )}
            </b>
            {t(' 天。', ' days.')}
          </p>
        </>
      ) : slug === 'day-milestones' || slug === 'milestone-calendar' ? (
        <>
          <h2>{t('从 2000-01-01 出发', 'Starting on January 1, 2000')}</h2>
          <div className="example-buttons">
            {[1000, 5000, 10000].map((n) => (
              <button
                className="quiet"
                aria-pressed={value === n}
                key={n}
                onClick={() => setValue(n)}
              >
                {n} {t('天', 'days')}
              </button>
            ))}
          </div>
          <p aria-live="polite">
            {iso(
              parseDay('2000-01-01') +
                ([1000, 5000, 10000].includes(value) ? value : 10000) * DAY,
            )}
          </p>
          <a href={(en ? '/en/' : '/') + '?tool=milestone'}>
            {t('换成我的日期', 'Use my own dates')} ↗
          </a>
        </>
      ) : (
        <>
          <h2>
            {t(
              '一小段时间，持续十二周',
              'A small session, repeated for twelve weeks',
            )}
          </h2>
          <label>
            {t('每次投入多少分钟？', 'Minutes per session?')}
            <input
              type="number"
              min={5}
              max={120}
              value={value}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n) && n >= 5 && n <= 120) setValue(n);
              }}
            />
          </label>
          <p aria-live="polite">
            {value}{' '}
            {t(
              '分钟 × 每周 5 次 × 12 周 = ',
              'min × 5 times a week × 12 weeks = ',
            )}
            <b>
              {value} {t('小时', 'hours')}
            </b>
          </p>
          <p className="hint">
            {t(
              '这是累计投入时间，不代表练习效果。',
              'This is time invested, not a prediction of progress.',
            )}
          </p>
          <a href={(en ? '/en' : '') + '/week-planner/'}>
            {t('放进我的每周安排', 'Fit it into my week')} ↗
          </a>
        </>
      )}
    </aside>
  );
}
