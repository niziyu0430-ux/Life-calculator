'use client';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { weeklyBudget, projectTime } from '../lib/planning';
const palette = [
  '#173e32',
  '#347455',
  '#659071',
  '#94b89c',
  '#b4c9b0',
  '#d9f47c',
];
export default function WeekPlanner({ en = false }: { en?: boolean }) {
  const t = (a: string, b: string) => (en ? b : a);
  const [hours, setHours] = useState([56, 40, 5, 14, 14]);
  const [minutes, setMinutes] = useState(20),
    [days, setDays] = useState(5),
    [weeks, setWeeks] = useState(12),
    [project, setProject] = useState(''),
    [status, setStatus] = useState('');
  const budget = weeklyBudget(hours),
    plan = projectTime(minutes, days, weeks);
  const labels = [
    t('睡眠', 'Sleep'),
    t('工作 / 学习', 'Work / study'),
    t('通勤 / 出行', 'Commuting / travel'),
    t('照护 / 家务', 'Care / chores'),
    t('吃饭 / 日常事务', 'Meals / daily needs'),
  ];
  const f = (n: number) =>
    Number(n.toFixed(1)).toLocaleString(en ? 'en-US' : 'zh-CN');
  const download = () => {
    const lines = [
      t('我的一周时间草稿', 'My week, a working draft'),
      ...hours.map(
        (h, i) => labels[i] + ': ' + f(h) + t(' 小时 / 周', ' hours/week'),
      ),
      t('尚未分配：', 'Unallocated: ') + f(budget.available),
      t('超出：', 'Over budget: ') + f(budget.over),
      t('想留时间给：', 'Make room for: ') +
        (project || t('一件重要的小事', 'one small thing that matters')),
      `${minutes} min × ${days} days × ${weeks} weeks = ${f(plan.totalHours)} hours`,
      t(
        '这是时间安排草稿，不是效果保证。',
        'A schedule estimate, not a promise of results.',
      ),
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-week.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      t(
        '已生成计划文本，可保存或继续编辑。',
        'Your plan is ready to save or edit.',
      ),
    );
  };
  return (
    <section className="planner" id="planner">
      <div className="planner-intro">
        <div>
          <p className="eyebrow">THE 168-HOUR LAB</p>
          <h1>
            {t('不是挤出更多，', 'A little less rush. ')}
            <em>{t('而是留给重要的。', 'A little more room.')}</em>
          </h1>
          <p>
            {t(
              '把一周的时间铺开，再为一件想做的小事留个位置。',
              'Lay out a week, then make room for one small thing you want to do.',
            )}
          </p>
        </div>
        <img
          src="/images/time-garden.webp"
          width="768"
          height="512"
          alt={t(
            '层层纸艺花园中的步道，象征逐周展开的生活',
            'A layered paper garden with a winding path, a metaphor for weeks unfolding',
          )}
        />
      </div>
      <div className="planner-layout">
        <div className="planner-inputs">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">01 / {t('估算日常', 'MAP YOUR WEEK')}</p>
              <h2>{t('你的时间，都去了哪里？', 'Where does your time go?')}</h2>
            </div>
            <button
              className="quiet"
              onClick={() => {
                setHours([56, 40, 5, 14, 14]);
                setStatus('');
              }}
            >
              {t('恢复示例', 'Reset example')}
            </button>
          </div>
          <p className="hint">
            {t(
              '下面是示例，不是建议。所有数字均为每周小时数；避免重复计算同时发生的活动。',
              'These are examples, not recommendations. Enter hours per week and avoid counting simultaneous activities twice.',
            )}
          </p>
          {labels.map((label, i) => (
            <div className="budget-control" key={label}>
              <div>
                <label id={'budget-label-' + i} htmlFor={'budget-' + i}>
                  <b style={{ background: palette[i] }} />
                  {label}
                </label>
                <input
                  id={'budget-' + i}
                  type="number"
                  min="0"
                  max="168"
                  step="0.5"
                  value={hours[i]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v) && v >= 0 && v <= 168)
                      setHours((h) => h.map((x, j) => (i === j ? v : x)));
                  }}
                />
                <span>{t('小时', 'hours')}</span>
              </div>
              <Slider
                className="budget-slider"
                aria-labelledby={'budget-label-' + i}
                value={[hours[i]]}
                onValueChange={(v) => {
                  const n = Array.isArray(v) ? v[0] : v;
                  setHours((h) => h.map((x, j) => (i === j ? n : x)));
                }}
                min={0}
                max={168}
                step={0.5}
              />
            </div>
          ))}
        </div>
        <aside className="budget-result">
          <p className="eyebrow">YOUR WEEK, IN VIEW</p>
          <div
            className={'budget-total ' + (budget.over ? 'over' : '')}
            aria-live="polite"
          >
            <strong>{f(budget.over || budget.available)}</strong>
            <span>
              {budget.over
                ? t('小时超出一周', 'hours over a week')
                : t('小时尚未分配', 'hours unallocated')}
            </span>
          </div>
          <div
            className="budget-bar"
            role="img"
            aria-label={
              t('一周分配：', 'Weekly allocation: ') +
              f(budget.committed) +
              t(' 小时已分配，', ' hours allocated, ') +
              f(budget.available) +
              t(' 小时尚未分配', ' unallocated hours')
            }
          >
            {[...hours, budget.available].map((v, i) => (
              <span
                key={i}
                style={{
                  width: (v / Math.max(168, budget.committed)) * 100 + '%',
                  background: palette[i],
                }}
              />
            ))}
          </div>
          <p>
            {budget.over
              ? t(
                  '同一周只有 168 小时。检查活动是否重复计时，或调整估算；结果不会偷偷缩减其他项目。',
                  'A week only has 168 hours. Check for double counting or revise the estimate; other categories are never silently reduced.',
                )
              : t(
                  '空白不必全部填满。休息、意外与临时变化，也需要空间。',
                  'You do not need to fill every gap. Rest, surprises and changing plans need room too.',
                )}
          </p>
          <dl>
            {[...labels, t('尚未分配', 'Unallocated')].map((label, i) => (
              <div key={label}>
                <dt>
                  <b style={{ background: palette[i] }} />
                  {label}
                </dt>
                <dd>{f(i === 5 ? budget.available : hours[i])} h</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <div className="project-lab">
        <div>
          <p className="eyebrow">
            02 / {t('为一件小事留位置', 'MAKE ONE SMALL SPACE')}
          </p>
          <h2>{t('小块时间，也能慢慢积累。', 'Small sessions add up.')}</h2>
          <label htmlFor="project-name">
            {t('你想把时间留给什么？', 'What would you like to make room for?')}
          </label>
          <input
            id="project-name"
            type="text"
            maxLength={80}
            placeholder={t(
              '例如：读一本书、练琴、散步',
              'For example: reading, piano, a walk',
            )}
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
          <div className="project-inputs">
            {[
              [
                t('每次分钟', 'Minutes per session'),
                minutes,
                5,
                120,
                setMinutes,
              ],
              [t('每周次数', 'Sessions per week'), days, 1, 7, setDays],
              [t('持续周数', 'Number of weeks'), weeks, 1, 52, setWeeks],
            ].map(([label, value, min, max, set], i) => (
              <label key={i}>
                {label as string}
                <input
                  type="number"
                  min={min as number}
                  max={max as number}
                  step={1}
                  value={value as number}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (
                      Number.isInteger(n) &&
                      n >= Number(min) &&
                      n <= Number(max)
                    )
                      (set as (n: number) => void)(n);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="project-result" aria-live="polite">
          <strong>
            {f(plan.totalHours)}
            <small>{t('小时', 'hours')}</small>
          </strong>
          <p>
            {plan.sessions}
            {t(' 次小小的开始', ' small starts')} · {weeks}
            {t(' 周', ' weeks')}
          </p>
          <p className="hint">
            {t('每周需要 ', 'Needs ')}
            {f(plan.weeklyHours)}
            {t(' 小时。', ' hours per week. ')}
            {budget.over || plan.weeklyHours > budget.available
              ? t(
                  '当前草稿没有这么多空余时间，请调整安排。',
                  'This does not fit the current unallocated time. Adjust your schedule.',
                )
              : t(
                  '在当前草稿的空余范围内，尚未自动扣除。',
                  'Fits the current unallocated time; it has not been deducted automatically.',
                )}
          </p>
          <p className="hint">
            {t(
              '只累计投入时长，不预测技能、健康或学习效果。',
              'Counts time invested, not skill, health or learning outcomes.',
            )}
          </p>
          <button onClick={download}>
            {t('保存我的一周草稿', 'Save my weekly draft')} ↓
          </button>
          <p role="status" className="hint">
            {status}
          </p>
        </div>
      </div>
      <div className="planner-method">
        <h2>{t('怎样使用这个实验室', 'How to use this lab')}</h2>
        <ol>
          <li>
            {t(
              '先估计最近一个普通星期。睡眠按每天小时数乘 7；通勤按往返时间乘出行天数。',
              'Start with an ordinary recent week. Multiply nightly sleep by seven and round-trip travel time by travel days.',
            )}
          </li>
          <li>
            {t(
              '把同一小时只记一次。比如通勤时听课程，可按主要活动归类，而不是两项都加一小时。',
              'Count each hour once. Learning during a commute can belong to the main activity rather than both categories.',
            )}
          </li>
          <li>
            {t(
              '给弹性留余量，再试一个小项目。没有空余不代表失败，这张表用来理解限制。',
              'Leave a buffer before trying a small project. No unallocated time is not a failure; this map helps reveal constraints.',
            )}
          </li>
        </ol>
        <a href={(en ? '/en' : '') + '/guides/weekly-time-budget'}>
          {t('阅读完整案例与计算方法', 'Read the worked example and method')} ↗
        </a>
      </div>
    </section>
  );
}
