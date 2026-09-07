'use client';
import { useEffect, useRef, useState } from 'react';
import AgeScene from './age-scene';
import {
  advance,
  careers,
  currentEvent,
  focuses,
  newGame,
  recap,
  restoreGame,
  setFocus,
  stats,
  STORE_KEY,
} from '../lib/game/engine';
import type { Focus, GameState } from '../lib/game/types';
import { downloadText } from '../lib/download';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
export default function Game({ en }: { en: boolean }) {
  const [state, setState] = useState<GameState | null>(null),
    [ready, setReady] = useState(false),
    [person, setPerson] = useState<0 | 1>(0),
    [background, setBackground] = useState<0 | 1 | 2>(0),
    [notice, setNotice] = useState(''),
    [confirm, setConfirm] = useState<'new' | 'clear' | null>(null),
    [fullHistory, setFullHistory] = useState(false);
  const [storageOK, setStorageOK] = useState(true);
  const active = useRef<GameState | null>(null);
  const t = (zh: string, english: string) => (en ? english : zh);
  const labels = {
    health: t('健康', 'Health'),
    mood: t('心情', 'Mood'),
    knowledge: t('学识', 'Knowledge'),
    connection: t('关系', 'Connection'),
    coins: t('金币', 'Coins'),
  };
  const focusLabels: Record<Focus, string> = {
    career: t('事业', 'Career'),
    study: t('学习', 'Study'),
    company: t('陪伴', 'Company'),
    rest: t('休息', 'Rest'),
  };
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const restored = restoreGame(raw);
        if (restored) {
          active.current = restored;
          setState(restored);
          setPerson(restored.appearance);
          setBackground(restored.background);
        } else
          setNotice(
            t(
              '存档损坏或版本不兼容，未载入。可以开始新的一局。',
              'The save is damaged or incompatible and was not loaded. You can begin a new life.',
            ),
          );
      }
    } catch {
      setStorageOK(false);
      setNotice(
        t(
          '浏览器存储不可用，这一局只保留在当前页面。',
          'Browser storage is unavailable. This life will stay in the current page.',
        ),
      );
    }
    setReady(true);
  }, [en]);
  function commit(next: GameState) {
    active.current = next;
    setState(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
      setStorageOK(true);
    } catch {
      setStorageOK(false);
    }
  }
  function start() {
    const data = new Uint32Array(1);
    crypto.getRandomValues(data);
    commit(newGame(data[0], person, background));
    setNotice('');
    setConfirm(null);
    setFullHistory(false);
  }
  function choose(index: number, eventId: string) {
    const old = active.current;
    if (!old || old.pending !== eventId) return;
    try {
      commit(advance(old, index));
      setNotice('');
    } catch {
      setNotice(
        t(
          '这个选择已更新，请查看当前事件。',
          'The choice has changed. Please use the current event.',
        ),
      );
    }
  }
  function clear() {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      setNotice(
        t(
          '未能清除浏览器中的存档，请通过浏览器设置清除。',
          'Could not remove the stored save. Use your browser settings to clear it.',
        ),
      );
      setConfirm(null);
      return;
    }
    active.current = null;
    setState(null);
    setConfirm(null);
    setNotice(t('本地存档已清除。', 'Local save cleared.'));
  }
  const event = state ? currentEvent(state) : null;
  const last = state?.history.at(-1);
  return (
    <div className="game-page">
      <header>
        <a className="brand" href={en ? '/en/' : '/'}>
          <span className="brandmark">◷</span>
          {t('人生计算器', 'Life Counter')}
        </a>
        <nav>
          <a href={en ? '/en/' : '/'}>{t('返回工具', 'Back to tools')}</a>
          <a className="language" href={en ? '/play/' : '/en/play/'}>
            {en ? '中文' : 'English'}
          </a>
        </nav>
      </header>
      <main className="game-main">
        <div className="game-heading">
          <div>
            <p className="eyebrow">
              {t('一次开始，许多可能', 'One beginning, many possibilities')}
            </p>
            <h1>{t('人生另一页', 'Another Chapter')}</h1>
            <p>
              {t(
                '走过普通日子，看看选择留下了什么。',
                'Live ordinary days. See what your choices leave behind.',
              )}
            </p>
          </div>
          <span className="game-badge">
            {t(
              '原创人生模拟 · 约 10–15 分钟',
              'Original life simulation · about 10–15 minutes',
            )}
          </span>
        </div>
        {!ready ? (
          <p role="status">
            {t('正在读取本地进度…', 'Reading local progress…')}
          </p>
        ) : !state ? (
          <section className="game-start">
            <div>
              <h2>{t('这次，从谁开始？', 'Who begins this time?')}</h2>
              <p>
                {t(
                  '人物外形不影响能力。家庭背景只是故事的起点，没有标准答案。',
                  'Appearance does not affect ability. Background is a starting point, not a right answer.',
                )}
              </p>
              <fieldset>
                <legend>{t('人物外形', 'Appearance')}</legend>
                <div className="choice-row">
                  {[0, 1].map((i) => (
                    <button
                      key={i}
                      className="quiet"
                      aria-pressed={person === i}
                      onClick={() => setPerson(i as 0 | 1)}
                    >
                      {t('人物', 'Character')} {i + 1}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>{t('家庭背景', 'Family background')}</legend>
                {[
                  [
                    t('安稳的小家', 'A steady home'),
                    t(
                      '65 金币 · 平常的生活起点',
                      '65 coins · an ordinary beginning',
                    ),
                  ],
                  [
                    t('书香的小屋', 'A book-filled home'),
                    t('50 金币 · 学识 +8', '50 coins · knowledge +8'),
                  ],
                  [
                    t('热闹的街坊', 'A close neighborhood'),
                    t('40 金币 · 关系 +8', '40 coins · connection +8'),
                  ],
                ].map(([name, description], i) => (
                  <button
                    key={i}
                    className="background-choice quiet"
                    aria-pressed={background === i}
                    onClick={() => setBackground(i as 0 | 1 | 2)}
                  >
                    <b>{name}</b>
                    <span>{description}</span>
                  </button>
                ))}
              </fieldset>
              <button className="start-life" onClick={start}>
                {t('翻开我的人生', 'Begin my chapter')} →
              </button>
              <p className="hint">
                {t(
                  '自动保存在此浏览器，可随时清除；不上传服务器。',
                  'Saved automatically in this browser, never uploaded. You can clear it at any time.',
                )}
              </p>
            </div>
            <AgeScene en={en} gameAge={1} character={person} />
          </section>
        ) : (
          <>
            <div className="game-layout">
              <aside className="game-person">
                <AgeScene
                  en={en}
                  gameAge={state.age}
                  character={state.appearance}
                />
                <div className="game-identity">
                  <strong>
                    {state.age >= 65
                      ? t('退休生活', 'Retired')
                      : state.career
                        ? en
                          ? careers[state.career].en
                          : careers[state.career].zh
                        : state.age < 18
                          ? t('成长中', 'Growing up')
                          : t('探索职业方向', 'Exploring work')}
                  </strong>
                  <span>
                    {state.age < 18
                      ? t('家庭与成长', 'Family and growing up')
                      : state.children
                        ? t('有孩子的家庭', 'A family with a child')
                        : state.married
                          ? t('已婚', 'Married')
                          : state.partner
                            ? t('伴侣关系', 'In a partnership')
                            : t(
                                '独立生活与友谊',
                                'Individual life and friendships',
                              )}
                  </span>
                </div>
              </aside>
              <div className="game-working">
                <div className="game-stats">
                  {stats.map((key) => (
                    <div key={key}>
                      <span>{labels[key]}</span>
                      <strong>{state.stats[key]}</strong>
                      <meter
                        min={0}
                        max={100}
                        value={state.stats[key]}
                        aria-label={labels[key]}
                      />
                    </div>
                  ))}
                  <div className="coins">
                    <span>{labels.coins}</span>
                    <strong>{state.coins}</strong>
                    <small>{t('虚构单位', 'Fictional units')}</small>
                  </div>
                </div>
                {!state.ended && state.age >= 18 && (
                  <fieldset className="game-focus">
                    <legend>
                      {t(
                        '年度侧重 · 将持续生效',
                        'Annual focus · stays until changed',
                      )}
                    </legend>
                    <div className="choice-row">
                      {focuses.map((f) => (
                        <button
                          key={f}
                          className="quiet"
                          aria-pressed={state.focus === f}
                          onClick={() => commit(setFocus(active.current!, f))}
                        >
                          {focusLabels[f]}
                        </button>
                      ))}
                    </div>
                    <p className="hint">
                      {t(
                        '每年统一结算收入、生活开支与侧重效果。学识、关系与心情需要持续维护，40 岁后健康也有日常消耗。65 岁后领取固定虚构养老金；70 岁后加入年龄带来的健康消耗。',
                        'Income, costs and focus are settled yearly. Knowledge, connection and mood need upkeep; health also has a yearly cost after 40. A fictional pension starts at 65; age-related health costs begin at 70.',
                      )}
                    </p>
                  </fieldset>
                )}
                {last && (
                  <aside className="game-feedback" role="status">
                    <span>
                      {last.age}{' '}
                      {t(
                        '岁 · 上一页留下的变化',
                        'years · changes from the last page',
                      )}
                    </span>
                    <p>{en ? last.result.en : last.result.zh}</p>
                    <div>
                      {Object.entries(last.delta)
                        .filter(([, n]) => n !== 0)
                        .map(([k, n]) => (
                          <b key={k} className={n < 0 ? 'negative' : ''}>
                            {labels[k as keyof typeof labels]}{' '}
                            {n > 0 ? '+' : ''}
                            {n}
                          </b>
                        ))}
                    </div>
                    <small>
                      {t(
                        '包括选择结果、年度结算与年龄变化。',
                        'Includes the choice, yearly settlement and aging.',
                      )}
                    </small>
                  </aside>
                )}
                {state.ended ? (
                  <section className="life-ending">
                    <p className="eyebrow">
                      {t(
                        '这一局，写到了这里',
                        'This chapter reaches its close',
                      )}
                    </p>
                    <h2>
                      {t(
                        '日子留下的，不只有数字。',
                        'A life leaves more than numbers.',
                      )}
                    </h2>
                    <p>
                      {t(
                        `你走过了 ${state.age} 年，留下 ${state.history.length} 页记录。回看学到的事、建立的关系，以及为自己留出的空间。`,
                        `You lived ${state.age} years and left ${state.history.length} entries. Look back at what you learned, the people you met and the room you made for yourself.`,
                      )}
                    </p>
                    <div className="ending-grid">
                      {stats.map((k) => (
                        <div key={k}>
                          <span>{labels[k]}</span>
                          <b>{state.stats[k]}</b>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setConfirm('new')}>
                      {t('再翻开一页', 'Begin another chapter')}
                    </button>
                    <button
                      className="quiet"
                      onClick={() => setFullHistory(true)}
                    >
                      {t('回看完整时间线', 'Read the full timeline')}
                    </button>
                  </section>
                ) : (
                  event && (
                    <section className="life-event" key={event.id}>
                      <p className="eyebrow">
                        {t('这一年', 'This year')} · {state.age}
                      </p>
                      <h2>{en ? event.text.en : event.text.zh}</h2>
                      <div className="event-choices">
                        {event.choices.map((choice, i) => (
                          <button key={i} onClick={() => choose(i, event.id)}>
                            <span>
                              {en ? choice.label.en : choice.label.zh}
                            </span>
                            <span aria-hidden="true">→</span>
                          </button>
                        ))}
                      </div>
                      <p className="hint">
                        {t(
                          '做出选择后进入下一年。没有单一的正确人生。',
                          'A choice moves you to the next year. There is no single correct life.',
                        )}
                      </p>
                    </section>
                  )
                )}
              </div>
            </div>
            <section className="life-history">
              <div className="section-heading">
                <h2>{t('我的人生记录', 'My life, in pages')}</h2>
                <button
                  className="quiet"
                  disabled={!state.history.length}
                  onClick={() => {
                    const ok = downloadText(
                      recap(state, en),
                      'another-chapter.txt',
                      'text/plain;charset=utf-8',
                    );
                    setNotice(
                      ok
                        ? t(
                            '回顾文件已生成，可自行保存。',
                            'Your recap file is ready to save.',
                          )
                        : t(
                            '文件生成失败，请重试。',
                            'Could not generate the file. Please retry.',
                          ),
                    );
                  }}
                >
                  {t('下载回顾', 'Download recap')} ↓
                </button>
              </div>
              {!state.history.length ? (
                <p>
                  {t(
                    '第一段故事等待你的选择。',
                    'Your first story awaits a choice.',
                  )}
                </p>
              ) : (
                <ol>
                  {(fullHistory
                    ? state.history
                    : [...state.history].slice(-5)
                  ).map((h) => (
                    <li key={h.eventId}>
                      <b>{h.age}</b>
                      <div>
                        <p>{en ? h.text.en : h.text.zh}</p>
                        <span>{en ? h.choice.en : h.choice.zh}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              {state.history.length > 5 && (
                <button
                  className="quiet"
                  onClick={() => setFullHistory((v) => !v)}
                >
                  {fullHistory
                    ? t('收起记录', 'Show recent entries')
                    : t('展开完整时间线', 'Show full timeline')}
                </button>
              )}
              <div className="save-actions">
                <span>
                  {storageOK
                    ? t('已自动保存到此浏览器', 'Saved in this browser')
                    : t(
                        '本地存储不可用，刷新会丢失此局。',
                        'Local storage unavailable; refreshing loses this life.',
                      )}
                </span>
                <button className="quiet" onClick={() => setConfirm('new')}>
                  {t('重新开始', 'Start again')}
                </button>
                <button className="quiet" onClick={() => setConfirm('clear')}>
                  {t('清除存档', 'Clear save')}
                </button>
              </div>
            </section>
          </>
        )}
        {notice && (
          <p role="status" className="game-notice">
            {notice}
          </p>
        )}
        <details className="game-rules">
          <summary>{t('游戏规则与隐私', 'Game rules and privacy')}</summary>
          <p>
            {t(
              '这是虚构的人生叙事，不是医学、财富或寿命预测。70 岁前不会因健康归零结束；70 岁后健康归零或到达 90 岁时结束。外形不决定能力，恋爱、婚姻和育儿都可以不选择。',
              'This is fictional storytelling, not a health, wealth or lifespan prediction. A life cannot end from zero health before 70; after 70, zero health or reaching 90 ends the chapter. Appearance does not determine ability; relationships, marriage and parenthood are optional.',
            )}
          </p>
          <p>
            {t(
              '每局使用随机种子生成事件，普通事件不重复。存档只保留在当前浏览器，跨设备不会同步。网站原有日期计算器仍不保存生日。',
              'Each life uses a random seed; ordinary events do not repeat. Saves stay in this browser and do not sync between devices. The existing date calculators still do not store birthdays.',
            )}
          </p>
        </details>
      </main>
      <footer>
        <span>Life Counter · {t('人生另一页', 'Another Chapter')}</span>
        <div>
          <a href={(en ? '/en' : '') + '/privacy/'}>
            {t('隐私说明', 'Privacy')}
          </a>
          <a href={(en ? '/en' : '') + '/about/'}>
            {t('关于与联系', 'About & contact')}
          </a>
        </div>
      </footer>
      <Dialog
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm === 'clear'
                ? t('清除这段人生？', 'Clear this life?')
                : t('重新翻开一页？', 'Begin again?')}
            </DialogTitle>
            <DialogDescription>
              {t(
                '这会删除当前浏览器保存的进度。可以先取消并下载回顾。',
                'This replaces the progress saved in this browser. Cancel to download your recap first.',
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button className="quiet" onClick={() => setConfirm(null)}>
              {t('保留当前人生', 'Keep this life')}
            </button>
            <button onClick={clear}>
              {confirm === 'clear'
                ? t('清除存档', 'Clear save')
                : t('开始新的一局', 'Start a new life')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
