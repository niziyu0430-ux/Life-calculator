'use client';
import { useRef, useState } from 'react';
import { parseDay, iso, DAY, anniversary } from '../lib/time';
export default function WeekExplorer({
  birthday,
  weeks,
  totalWeeks,
  span,
  en,
}: {
  birthday: string;
  weeks: number;
  totalWeeks: number;
  span: number;
  en: boolean;
}) {
  const [selection, setSelection] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const index = Math.min(selection ?? weeks, totalWeeks - 1),
    start = parseDay(birthday) + index * 7 * DAY,
    end = Math.min(start + 6 * DAY, anniversary(birthday, span) - DAY);
  function select(n: number, focus = false) {
    const bounded = Math.max(0, Math.min(totalWeeks - 1, n));
    setSelection(bounded);
    if (focus)
      box.current
        ?.querySelector<HTMLButtonElement>(`[data-week="${bounded}"]`)
        ?.focus();
  }
  return (
    <>
      <div
        className="weekgrid interactive-weeks"
        ref={box}
        role="group"
        aria-label={
          en
            ? 'Explore your life calendar. Arrow keys move between weeks.'
            : '探索人生周历，使用方向键切换周。'
        }
        onKeyDown={(e) => {
          const offsets: Record<string, number> = {
            ArrowRight: 1,
            ArrowLeft: -1,
            ArrowDown: 52,
            ArrowUp: -52,
          };
          if (e.key in offsets) {
            e.preventDefault();
            select(index + offsets[e.key], true);
          } else if (e.key === 'Home') {
            e.preventDefault();
            select(0, true);
          } else if (e.key === 'End') {
            e.preventDefault();
            select(totalWeeks - 1, true);
          }
        }}
      >
        {Array.from({ length: totalWeeks }, (_, i) => (
          <button
            key={i}
            data-week={i}
            type="button"
            tabIndex={i === index ? 0 : -1}
            aria-pressed={i === index}
            aria-label={(en ? 'Week ' : '第 ') + (i + 1) + (en ? '' : ' 周')}
            title={(en ? 'Week ' : '第 ') + (i + 1) + (en ? '' : ' 周')}
            className={
              'week-cell ' +
              (i < weeks ? 'past' : i === weeks ? 'current' : '') +
              (i === index ? ' selected' : '')
            }
            onClick={() => select(i)}
          />
        ))}
      </div>
      <div className="week-inspector" aria-live="polite">
        <div>
          <span className="eyebrow">{en ? 'A CLOSER LOOK' : '放大这一周'}</span>
          <strong>
            {en ? 'Week ' : '第 '}
            {index + 1}
            {en ? '' : ' 周'}
          </strong>
          <span>
            {iso(start)} — {iso(end)}
          </span>
        </div>
        <div className="week-controls">
          <button
            className="quiet"
            aria-label={en ? 'Previous week' : '上一周'}
            disabled={index === 0}
            onClick={() => select(index - 1)}
          >
            ←
          </button>
          <button className="quiet" onClick={() => setSelection(null)}>
            {en ? 'Current week' : '回到现在'}
          </button>
          <button
            className="quiet"
            aria-label={en ? 'Next week' : '下一周'}
            disabled={index === totalWeeks - 1}
            onClick={() => select(index + 1)}
          >
            →
          </button>
        </div>
      </div>
      <label className="week-jump">
        {en ? 'Jump to week' : '跳转到第几周'}
        <input
          type="number"
          min={1}
          max={totalWeeks}
          value={index + 1}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isInteger(n) && n >= 1 && n <= totalWeeks) select(n - 1);
          }}
        />
      </label>
      <p className="hint">
        {en
          ? 'Tap a square, use the arrows, or enter a week number. Each square shows an actual date range.'
          : '点击格子、使用方向键或输入周数，查看这一周对应的真实日期。'}
      </p>
    </>
  );
}
