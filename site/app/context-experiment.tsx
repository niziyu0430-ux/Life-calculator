'use client';
import { useState } from 'react';
import { parseDay, iso, DAY } from '../lib/time';
import { weeklyBudget } from '../lib/planning';
import NumberField from './number-field';
export default function ContextExperiment({
  slug,
  en,
}: {
  slug: string;
  en: boolean;
}) {
  const [value, setValue] = useState(1),
    [valid, setValid] = useState(true),
    [example, setExample] = useState(0);
  const t = (a: string, b: string) => (en ? b : a);
  if (slug === 'life-in-weeks') {
    const start = parseDay('2000-01-01') + (value - 1) * 7 * DAY;
    return (
      <aside className="article-experiment">
        <h2>{t('每格都是具体的七天', 'Every square is seven real days')}</h2>
        <label>
          {t(
            '从 2000-01-01 出生开始，查看第几周？',
            'Born January 1, 2000. Which week?',
          )}
          <NumberField
            value={value}
            onValue={setValue}
            onValidity={setValid}
            min={1}
            max={104}
            integer
            en={en}
          />
        </label>
        {valid && (
          <p aria-live="polite">
            {iso(start)} — {iso(start + 6 * DAY)}
          </p>
        )}
        <p>
          {t(
            '第 53 周开始时只经过了 364 天。一行 52 格并不等于一个日历年。',
            'Week 53 starts after 364 days. A row of 52 squares is not a calendar year.',
          )}
        </p>
        <a href={(en ? '/en/' : '/') + '?tool=weeks'}>
          {t('换成我的周历', 'Explore my own calendar')} ↗
        </a>
      </aside>
    );
  }
  if (slug === 'milestone-calendar') {
    const date = ['2028-02-29', '2028-12-31'][example];
    return (
      <aside className="article-experiment">
        <h2>{t('全天事件怎样结束？', 'When does an all-day event end?')}</h2>
        <div className="example-buttons">
          {['2028-02-29', '2028-12-31'].map((d, i) => (
            <button
              key={d}
              className="quiet"
              aria-pressed={example === i}
              onClick={() => setExample(i)}
            >
              {d}
            </button>
          ))}
        </div>
        <ol aria-live="polite">
          <li>
            {t('当天显示：', 'Displayed date: ')}
            {date}
          </li>
          <li>
            {t('文件中的结束日期：', 'Exclusive end in the file: ')}
            {iso(parseDay(date) + DAY)}
          </li>
          <li>
            {t(
              '结束日期不包含在事件内，因此不会多显示一天。',
              'The end date is excluded, so the event still occupies one day.',
            )}
          </li>
        </ol>
        <p>
          {t(
            '导入后检查日期，再自行设置提醒；重复导入可能造成重复事件。',
            'Check the date after importing, then set your reminder. Repeated imports may create duplicates.',
          )}
        </p>
      </aside>
    );
  }
  const hours = example === 0 ? [56, 40, 5, 14, 14] : [56, 70, 12, 20, 14],
    budget = weeklyBudget(hours);
  return (
    <aside className="article-experiment">
      <h2>{t('同样一周，两种草稿', 'One week, two drafts')}</h2>
      <div className="example-buttons">
        {[
          t('普通一周', 'An ordinary week'),
          t('安排过满', 'An overfilled week'),
        ].map((label, i) => (
          <button
            key={i}
            className="quiet"
            aria-pressed={example === i}
            onClick={() => setExample(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <p>
        {hours.join(' + ')} = {budget.committed} h
      </p>
      <p aria-live="polite">
        {budget.over
          ? t('超出', 'Over budget:')
          : t('尚未分配', 'Unallocated:')}{' '}
        <b>{budget.over || budget.available}</b> {t('小时', 'hours')}
      </p>
      <p>
        {t(
          '依次为睡眠、工作学习、通勤、照护家务、日常事务。先排除重复计时，空白不必全部填满。',
          'Sleep, work/study, travel, care/chores, then daily needs. Check double counting first; you do not need to fill every gap.',
        )}
      </p>
      <a href={(en ? '/en' : '') + '/week-planner/'}>
        {t('试试我的安排', 'Try my own week')} ↗
      </a>
    </aside>
  );
}
