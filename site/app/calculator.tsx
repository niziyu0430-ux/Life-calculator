'use client';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  lifeStats,
  localToday,
  dateDifference,
  parseDay,
  iso,
  DAY,
} from '../lib/time';
import { guides } from './content';
import WeekExplorer from './week-explorer';
import { calendarEvent } from '../lib/planning';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
export default function Calculator({ lang }: { lang: 'zh' | 'en' }) {
  const en = lang === 'en',
    base = en ? '/en' : '',
    t = (zh: string, english: string) => (en ? english : zh);
  const [birthday, setBirthday] = useState('2000-01-01'),
    [asOf, setAsOf] = useState('2026-09-07'),
    [span, setSpan] = useState(80),
    [tab, setTab] = useState('weeks'),
    [start, setStart] = useState('2026-01-01'),
    [end, setEnd] = useState('2026-12-31'),
    [inclusive, setInclusive] = useState(false),
    [custom, setCustom] = useState(10000),
    [notice, setNotice] = useState('');
  useEffect(() => {
    setAsOf(localToday());
    const tool = new URLSearchParams(location.search).get('tool');
    if (tool && ['weeks', 'milestone', 'difference'].includes(tool))
      setTab(tool);
  }, []);
  useEffect(() => {
    const ctx = (
      document as unknown as {
        modelContext?: {
          registerTool: (tool: unknown, options: unknown) => unknown;
        };
      }
    ).modelContext;
    if (!ctx?.registerTool) return;
    const controller = new AbortController();
    try {
      void Promise.resolve(
        ctx.registerTool(
          {
            name: 'set_life_calendar',
            description:
              'Set the birthday, reference date and display span in the visible life calendar. Dates stay in this page.',
            inputSchema: {
              type: 'object',
              properties: {
                birthday: { type: 'string' },
                asOf: { type: 'string' },
                span: { type: 'integer', minimum: 20, maximum: 120 },
              },
              required: ['birthday', 'asOf', 'span'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute: (input: unknown) => {
              const v = input as {
                birthday: string;
                asOf: string;
                span: number;
              };
              const result = lifeStats(v.birthday, v.asOf, v.span);
              flushSync(() => {
                setBirthday(v.birthday);
                setAsOf(v.asOf);
                setSpan(v.span);
                setTab('weeks');
              });
              return result;
            },
          },
          { signal: controller.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => controller.abort();
  }, []);
  let stats: ReturnType<typeof lifeStats> | null = null;
  try {
    stats = lifeStats(birthday, asOf, span);
  } catch {}
  let difference: number | null = null;
  try {
    difference = dateDifference(start, end, inclusive);
  } catch {}
  let customDate = '';
  try {
    if (Number.isInteger(custom) && custom >= 1 && custom <= 100000)
      customDate = iso(parseDay(birthday) + custom * DAY);
  } catch {}
  const number = (n: number) => n.toLocaleString(en ? 'en-US' : 'zh-CN');
  const downloadMilestone = (date: string, count: number) => {
    const file = calendarEvent(date, count);
    const url = URL.createObjectURL(
      new Blob([file], { type: 'text/calendar;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-milestone.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      t(
        '已生成日历文件。导入你的日历后，可自行设置提醒。',
        'Calendar file generated. Import it into your calendar and choose a reminder.',
      ),
    );
  };
  const exportCalendar = () => {
    if (!stats) return;
    const width = 1100,
      height = 280 + Math.ceil(stats.totalWeeks / 52) * 12;
    const dots = Array.from(
      { length: stats.totalWeeks },
      (_, i) =>
        '<rect x="' +
        (32 + (i % 52) * 20) +
        '" y="' +
        (170 + Math.floor(i / 52) * 12) +
        '" width="14" height="7" rx="1" fill="' +
        (i < stats.weeks
          ? '#32694b'
          : i === stats.weeks
            ? '#b87724'
            : '#e4ebe2') +
        '"/>',
    ).join('');
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      width +
      ' ' +
      height +
      '"><rect width="100%" height="100%" fill="#f7f9f4"/><g fill="#16382f" font-family="Arial,sans-serif"><text x="32" y="58" font-size="30">' +
      t('我的人生周历', 'My life in weeks') +
      '</text><text x="32" y="102" font-size="19">' +
      number(stats.weeks) +
      t(' 个完整周 · 截至 ', ' complete weeks · As of ') +
      asOf +
      '</text><text x="32" y="135" font-size="16">' +
      t('每格 7 天。时间跨度：', '7 days per square. Display span: ') +
      span +
      t(' 年。不是寿命预测。', ' years. Not a lifespan prediction.') +
      '</text>' +
      dots +
      '<text x="32" y="' +
      (height - 35) +
      '" font-size="16">Life Counter · ' +
      t('日子很小，生活很大。', 'A little perspective, every day.') +
      '</text></g></svg>';
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-calendar.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      t(
        '周历已生成，文件包含周数和参考日期，不含生日。',
        'Calendar generated with your week count and reference date, without your birthday.',
      ),
    );
  };
  return (
    <div lang={en ? 'en' : 'zh-CN'}>
      <a className="skip" href="#calendar">
        {t('跳到计算器', 'Skip to calculator')}
      </a>
      <header>
        <a className="brand" href={base || '/'}>
          <span className="brandmark">◷</span>
          {t('人生计算器', 'Life Counter')}
          <small>TIME LAB</small>
        </a>
        <nav>
          <a href={base + '/week-planner/'}>
            {t('168 小时实验室', '168-hour lab')}
          </a>
          <a href="#calendar">{t('人生周历', 'Your calendar')}</a>
          <a href="#reading">{t('时间手记', 'Field notes')}</a>
          <a className="language" href={en ? '/' : '/en'}>
            {en ? '中文' : 'EN'} ↗
          </a>
        </nav>
      </header>
      <main>
        <div className="intro">
          <img
            className="intro-illustration"
            src="/images/time-hourglass.webp"
            width="600"
            height="400"
            alt={t(
              '沙漏与留白日历的纸艺静物',
              'A sculptural hourglass and blank calendar',
            )}
          />
          <p className="eyebrow">
            01 / {t('换个尺度，看见生活', 'A LITTLE PERSPECTIVE')}
          </p>
          <h1>
            {t('你走过的时间，', 'Your time. ')}
            <br />
            <em>{t('有了形状。', 'A bigger picture.')}</em>
          </h1>
          <p>
            {t(
              '每一格，都是你认真生活过的一周。',
              'Every square is a week. Every week is yours.',
            )}
          </p>
        </div>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(String(value));
            setNotice('');
          }}
        >
          <TabsList
            className="tabs"
            aria-label={t('选择工具', 'Choose a tool')}
          >
            {[
              ['weeks', t('人生周历', 'Life in weeks')],
              ['milestone', t('整千天纪念日', 'Day milestones')],
              ['difference', t('日期间隔', 'Days between dates')],
            ].map(([key, label], i) => (
              <TabsTrigger
                key={key}
                value={key}
                className={tab === key ? 'active' : ''}
              >
                <small>0{i + 1}</small> {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tab}>
            {tab !== 'difference' ? (
              <section className="workbench" id="calendar">
                <aside>
                  <span className="eyebrow">YOUR STARTING POINT</span>
                  <h2>{t('从某一天开始', 'Start with a day')}</h2>
                  <label htmlFor="birthday">
                    {t('你的出生日期', 'Your date of birth')}
                  </label>
                  <input
                    id="birthday"
                    type="date"
                    min="1900-01-01"
                    max={asOf}
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                  />
                  <p className="hint">
                    {t(
                      '默认生日是示例。输入后，结果自动更新。',
                      'The default birthday is an example. Results update as you type.',
                    )}
                  </p>
                  <label htmlFor="asof">
                    {t('计算到哪一天', 'Calculate as of')}
                  </label>
                  <input
                    id="asof"
                    type="date"
                    min={birthday || '1900-01-01'}
                    value={asOf}
                    onChange={(e) => setAsOf(e.target.value)}
                  />
                  {tab === 'weeks' && (
                    <>
                      <label htmlFor="span">
                        {t('周历展示跨度', 'Calendar display span')}
                      </label>
                      <Select
                        value={span}
                        onValueChange={(value) => {
                          if (value !== null) setSpan(Number(value));
                        }}
                      >
                        <SelectTrigger id="span" className="span-select">
                          <SelectValue>
                            {span} {t('年', 'years')}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {[20, 40, 60, 80, 100, 120].map((n) => (
                            <SelectItem key={n} value={n}>
                              {n} {t('年', 'years')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  <div className="aside-note">
                    {t(
                      '无需注册。生日只在当前浏览器页面计算，刷新后恢复示例。',
                      'No account needed. Your birthday is calculated in this browser page and resets on refresh.',
                    )}
                  </div>
                </aside>
                <div className="calendar-panel">
                  {!stats ? (
                    <p role="alert">
                      {t(
                        '请输入有效日期，出生日期不能晚于计算日期。',
                        'Enter valid dates. Your birth date must not be after the reference date.',
                      )}
                    </p>
                  ) : (
                    <>
                      {tab === 'weeks' ? (
                        <>
                          <div className="panel-heading">
                            <div>
                              <p className="eyebrow">LIFE IN WEEKS</p>
                              <h2>
                                {t(
                                  '把日子，铺成一张地图',
                                  'The weeks that make a life',
                                )}
                              </h2>
                            </div>
                            <button className="quiet" onClick={exportCalendar}>
                              {t('保存周历', 'Save calendar')} ↓
                            </button>
                          </div>
                          <div className="stats" aria-live="polite">
                            <div>
                              <strong>{number(stats.days)}</strong>
                              <span>
                                {t('个日历日，已经走过', 'calendar days lived')}
                              </span>
                            </div>
                            <div>
                              <strong>
                                {number(stats.weeks)}
                                <small> + {stats.remainder}</small>
                              </strong>
                              <span>
                                {t(
                                  '个完整周 + 余下天数',
                                  'complete weeks + days',
                                )}
                              </span>
                            </div>
                            <div>
                              <strong>{stats.years}</strong>
                              <span>{t('周岁', 'completed years')}</span>
                            </div>
                          </div>
                          <div className="grid-label">
                            <span>
                              {t(
                                '从出生出发 → 每行 52 周',
                                'From birth → 52 weeks per row',
                              )}
                            </span>
                            <span>
                              {span} {t('年跨度', 'year span')}
                            </span>
                          </div>
                          <WeekExplorer
                            key={birthday + span}
                            birthday={birthday}
                            weeks={stats.weeks}
                            totalWeeks={stats.totalWeeks}
                            span={span}
                            en={en}
                          />
                          <div className="legend">
                            <span>
                              <b />
                              {t('已经走过', 'Weeks lived')}
                            </span>
                            <span>
                              <b style={{ background: '#b87724' }} />
                              {t('正在经历', 'Current week')}
                            </span>
                            <span>
                              <b className="future" />
                              {t('尚未展开', 'Open space')}
                            </span>
                            <span>{t('1 格 = 7 天', '1 square = 7 days')}</span>
                          </div>
                          <p className="hint">
                            {stats.beyond
                              ? t(
                                  '你已走过所选跨度，可以选择更长的视图。',
                                  'You have reached this display span. Choose a longer view.',
                                )
                              : t('已走过所选跨度的 ', 'You have lived ') +
                                stats.percent.toFixed(1) +
                                t('%。', '% of the chosen display span.')}{' '}
                            {t(
                              '跨度由你选择，不代表寿命。每行 364 天，不等于一个日历年；末格可能不足 7 天。',
                              'You choose the span; it is not a lifespan estimate. Each row is 364 days, not a calendar year. The last square may be partial.',
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="eyebrow">ANOTHER REASON TO CELEBRATE</p>
                          <h2>
                            {t(
                              '不是生日，也值得庆祝。',
                              'A celebration between birthdays.',
                            )}
                          </h2>
                          <p>
                            {t(
                              '下一个整千天纪念日',
                              'Your next thousand-day milestone',
                            )}
                          </p>
                          <div className="milestone-number">
                            {number(stats.nextThousand)}
                            <small>{t('天', 'days')}</small>
                          </div>
                          <p className="milestone-date">
                            {stats.milestoneDate}
                          </p>
                          <p>
                            {t('距参考日期还有 ', 'That is ')}
                            <b>{number(stats.untilMilestone)}</b>
                            {t(
                              ' 天。出生当天计为第 0 天。',
                              ' days after your reference date. Your birth date is day 0.',
                            )}
                          </p>
                          <button
                            className="quiet"
                            onClick={() =>
                              downloadMilestone(
                                stats.milestoneDate,
                                stats.nextThousand,
                              )
                            }
                          >
                            {t('添加到我的日历', 'Add to my calendar')} ↗
                          </button>
                          <label htmlFor="custom">
                            {t(
                              '也可以找一个特别的天数',
                              'Or choose a meaningful day count',
                            )}
                          </label>
                          <input
                            id="custom"
                            type="number"
                            min="1"
                            max="100000"
                            step="1"
                            value={custom || ''}
                            onChange={(e) => setCustom(Number(e.target.value))}
                          />
                          <output className="custom-result" aria-live="polite">
                            {customDate ||
                              t(
                                '请输入 1–100000 之间的整数',
                                'Enter a whole number from 1 to 100000',
                              )}
                          </output>
                          {customDate && (
                            <button
                              className="quiet"
                              onClick={() =>
                                downloadMilestone(customDate, custom)
                              }
                            >
                              {t('导出这个纪念日', 'Export this milestone')} ↓
                            </button>
                          )}
                          <p className="hint">
                            {t(
                              '例如 10000 天：出生日期加上整整 10000 个日历日，而不是“出生第 10000 天”的包含首日口径。',
                              'For 10,000 days, we add 10,000 calendar days to your birthday. An ordinal “10,000th day of life” that includes your birth date is one day earlier.',
                            )}
                          </p>
                        </>
                      )}
                      <p role="status" className="hint">
                        {notice}
                      </p>
                    </>
                  )}
                </div>
              </section>
            ) : (
              <section className="workbench" id="calendar">
                <aside>
                  <p className="eyebrow">BETWEEN TWO DAYS</p>
                  <h2>{t('两天之间，有多远？', 'How far apart?')}</h2>
                  <label htmlFor="start">{t('开始日期', 'Start date')}</label>
                  <input
                    id="start"
                    type="date"
                    min="1900-01-01"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                  <label htmlFor="end">{t('结束日期', 'End date')}</label>
                  <input
                    id="end"
                    type="date"
                    min={start}
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                  <label className="check">
                    <Checkbox
                      className="include-check"
                      checked={inclusive}
                      onCheckedChange={(checked) =>
                        setInclusive(Boolean(checked))
                      }
                    />
                    {t('首尾两天都算在内', 'Include both start and end dates')}
                  </label>
                </aside>
                <div className="calendar-panel difference">
                  <p className="eyebrow">DATE DISTANCE</p>
                  <h2>
                    {t('把等待，变成具体的天数。', 'Give the wait a number.')}
                  </h2>
                  {difference === null ? (
                    <p role="alert">
                      {t(
                        '请填写有效日期，结束日期不能早于开始日期。',
                        'Enter valid dates with the end on or after the start.',
                      )}
                    </p>
                  ) : (
                    <>
                      <div className="milestone-number" aria-live="polite">
                        {number(difference)}
                        <small>{t('天', 'days')}</small>
                      </div>
                      <p>
                        {Math.floor(difference / 7)} {t('周', 'weeks')} +{' '}
                        {difference % 7} {t('天', 'days')}
                      </p>
                      <p className="hint">
                        {inclusive
                          ? t(
                              '包含首尾日期。同一天的结果为 1 天。',
                              'Includes both dates. The same date gives 1 day.',
                            )
                          : t(
                              '计算经过的日历天数。同一天的结果为 0 天。',
                              'Counts elapsed calendar days. The same date gives 0 days.',
                            )}
                        {t(
                          ' 按公历日期计算，不计算小时差或工作日。',
                          ' Uses Gregorian calendar dates, not elapsed hours or working days.',
                        )}
                      </p>
                    </>
                  )}
                </div>
              </section>
            )}
          </TabsContent>
        </Tabs>
        <div className="under-note">
          <span>
            ↳{' '}
            {t(
              '时间可以被计算，生活不必被评分。',
              'Time can be counted. Life does not need a score.',
            )}
          </span>
          <a href={base + '/guides/date-math'}>
            {t('了解计算方式', 'How the calculations work')} ↗
          </a>
        </div>
        <section className="lab-feature">
          <img
            src="/images/time-garden.webp"
            alt={t(
              '纸艺花园与蜿蜒步道',
              'A sculptural paper garden with a winding path',
            )}
            width="768"
            height="512"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">NEW / THE 168-HOUR LAB</p>
            <h2>
              {t('把时间，留给想做的事。', 'Make room for what matters.')}
            </h2>
            <p>
              {t(
                '拖动你的每周安排，看看时间去了哪里。再试试：每周五次、每次二十分钟，十二周能留给一件小事多少时间？',
                'Adjust your weekly schedule and see where time goes. Then explore what twenty minutes, five times a week, adds up to over twelve weeks.',
              )}
            </p>
            <a className="button-link" href={base + '/week-planner/'}>
              {t('开始我的时间实验', 'Explore my week')} ↗
            </a>
            <span className="hint">
              {t(
                '无需登录 · 可保存草稿 · 数据留在当前页面',
                'No sign-in · Download your draft · Inputs stay in this page',
              )}
            </span>
          </div>
        </section>
        <section id="reading" className="reading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / FIELD NOTES</p>
              <h2>
                {t('让重要的事，有时间发生。', 'Make room for what matters.')}
              </h2>
            </div>
            <span>
              {t(
                '工具背后的方法、案例与小实验',
                'Methods, examples and small experiments',
              )}
            </span>
          </div>
          <div className="article-grid">
            {guides.map((g, i) => (
              <a
                className="article-card"
                key={g.slug}
                href={base + '/guides/' + g.slug}
              >
                <div className="article-art" aria-hidden="true">
                  {i === 2 ? (
                    <span className="art-number">
                      01 — 07
                      <span>
                        {t(
                          '相隔 6 天 · 包含首尾 7 天',
                          '6 DAYS APART · 7 DATES',
                        )}
                      </span>
                    </span>
                  ) : (
                    <img
                      src={
                        i === 1 || i === 5
                          ? '/images/time-hourglass.webp'
                          : '/images/time-garden.webp'
                      }
                      alt=""
                      loading="lazy"
                      width="768"
                      height="512"
                    />
                  )}
                </div>
                <p className="eyebrow">
                  0{i + 1} / {en ? g.en.category : g.zh.category}
                </p>
                <h3>{en ? g.en.title : g.zh.title}</h3>
                <p>{en ? g.en.description : g.zh.description}</p>
                <span className="read-link">
                  {t('阅读手记', 'Read the note')} ↗
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="faq">
          <h2>{t('关于这张时间地图', 'About your time map')}</h2>
          {[
            [
              t('这会预测我的寿命吗？', 'Does this predict my lifespan?'),
              t(
                '不会。80 年只是默认展示跨度，你可以改为 20–120 年。我们不使用健康信息或死亡概率，也不将空白格描述为“剩余生命”。',
                'No. 80 years is a default display span, adjustable from 20 to 120 years. We do not use health information or death probabilities, and blank squares are not a prediction of remaining life.',
              ),
            ],
            [
              t(
                '为什么每行不是完整的一年？',
                'Why is a row not exactly one year?',
              ),
              t(
                '一行有 52 个七天格，总计 364 天。公历年通常有 365 天，闰年 366 天。周历连续排列，所以行与生日周年不会一直对齐。',
                'A row has 52 seven-day squares, totaling 364 days. Calendar years have 365 or 366 days. The weeks run continuously, so row boundaries do not stay aligned with birthdays.',
              ),
            ],
            [
              t('我的生日会被保存吗？', 'Is my birthday saved?'),
              t(
                '当前版本不将生日写入服务器、Cookie 或本地存储。刷新页面后会恢复示例值。下载的周历仅包含完整周数和参考日期，请按自己的意愿分享。',
                'This version does not write your birthday to a server, cookies, or local storage. Refreshing restores the example. A downloaded calendar contains your week count and reference date; share it only if you want to.',
              ),
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
      <footer>
        <span>
          © 2026 Life Counter ·{' '}
          {t('日子很小，生活很大。', 'A little perspective, every day.')}
        </span>
        <div>
          <a href={base + '/about'}>{t('关于本站', 'About')}</a>
          <a href={base + '/privacy'}>{t('隐私说明', 'Privacy')}</a>
          <a href={en ? '/' : '/en'}>{en ? '中文' : 'English'}</a>
        </div>
      </footer>
    </div>
  );
}
