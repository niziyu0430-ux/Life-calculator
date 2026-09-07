import { events, w } from './events.ts';
import type {
  Career,
  Choice,
  Effects,
  Focus,
  GameState,
  LifeEvent,
  Stat,
} from './types.ts';
export const STORE_KEY = 'life-counter.another-chapter.v1';
export const stats: Stat[] = ['health', 'mood', 'knowledge', 'connection'];
export const careers: Record<
  Career,
  { zh: string; en: string; pay: number; entry: number }
> = {
  education: { zh: '教育', en: 'Education', pay: 16, entry: 45 },
  technology: { zh: '技术', en: 'Technology', pay: 20, entry: 60 },
  creative: { zh: '创作', en: 'Creative', pay: 14, entry: 35 },
  service: { zh: '服务', en: 'Service', pay: 12, entry: 10 },
  craft: { zh: '手艺', en: 'Craft', pay: 15, entry: 30 },
  public: { zh: '公共事务', en: 'Public service', pay: 17, entry: 50 },
};
export const focuses: Focus[] = ['career', 'study', 'company', 'rest'];
const choice = (zh: string, en: string, effects: Effects): Choice => ({
  label: w(zh, en),
  effects,
  result: w(`你选择了${zh}。`, `You chose to ${en.toLowerCase()}.`),
});
const special: LifeEvent[] = [
  ...Object.entries(careers).map(([id, c]) => ({
    id: 'job-' + id,
    min: 18,
    max: 64,
    weight: 5,
    knowledge: c.entry,
    requires: 'unemployed' as const,
    text: w(
      `一家${c.zh}团队提供了入门机会。你可以每年获得 ${c.pay} 枚虚构金币的收入。`,
      `A team in ${c.en.toLowerCase()} offers an entry role paying ${c.pay} fictional coins a year.`,
    ),
    choices: [
      choice('接受这份工作', 'Accept this role', {
        career: id as Career,
        mood: 3,
      }),
      choice('继续学习和寻找', 'Keep learning and looking', {
        knowledge: 4,
        mood: 1,
      }),
    ],
  })),
  {
    id: 'relationship-meet',
    min: 22,
    max: 65,
    weight: 5,
    requires: 'single',
    text: w(
      '在共同的活动里，你与一位朋友逐渐亲近。是否让关系向前一步？',
      'Through a shared activity, you grow closer to a friend. Would you like a relationship?',
    ),
    choices: [
      choice('尝试建立伴侣关系', 'Begin a partnership', {
        partner: true,
        connection: 8,
        mood: 5,
      }),
      choice('珍惜目前的友谊', 'Keep the friendship', {
        connection: 5,
        mood: 3,
      }),
    ],
  },
  {
    id: 'relationship-marriage',
    min: 25,
    max: 70,
    weight: 4,
    requires: 'partner',
    text: w(
      '你和伴侣认真谈起未来。你们可以结婚，也可以保留现在的相处方式。',
      'You and your partner discuss the future. Marriage and continuing as you are are both options.',
    ),
    choices: [
      choice('共同决定结婚', 'Choose marriage together', {
        married: true,
        coins: -10,
        connection: 8,
      }),
      choice('继续现在的相处', 'Continue as partners', {
        connection: 6,
        mood: 4,
      }),
    ],
  },
  {
    id: 'relationship-parent',
    min: 27,
    max: 50,
    weight: 4,
    requires: 'married',
    text: w(
      '你们讨论是否成为父母。照护会改变时间与支出，也可以选择不育儿。',
      'You discuss becoming parents. Care changes time and costs; a child-free life is also an option.',
    ),
    choices: [
      choice('共同承担育儿责任', 'Choose parenthood together', {
        child: true,
        connection: 7,
        coins: -12,
      }),
      choice('选择两个人的生活', 'Choose a life as a couple', {
        mood: 5,
        connection: 5,
      }),
    ],
  },
  {
    id: 'family-listen',
    min: 30,
    max: 70,
    weight: 3,
    requires: 'parent',
    text: w(
      '孩子想走一条你不熟悉的道路，主动来和你谈一谈。',
      'Your child wants an unfamiliar path and comes to talk with you.',
    ),
    choices: [
      choice('先认真倾听理由', 'Listen to their reasons', {
        connection: 7,
        knowledge: 2,
      }),
      choice('一起了解实际选择', 'Explore the options together', {
        connection: 5,
        knowledge: 4,
      }),
    ],
  },
  {
    id: 'family-space',
    min: 40,
    max: 80,
    weight: 3,
    requires: 'parent',
    text: w(
      '孩子逐渐拥有独立生活，你的照护角色也需要调整。',
      'Your child becomes more independent, changing your caring role.',
    ),
    choices: [
      choice('尊重边界并保持联系', 'Respect boundaries and stay in touch', {
        connection: 6,
        mood: 4,
      }),
      choice('把空闲还给自己的爱好', 'Return some time to a hobby', {
        health: 3,
        mood: 5,
      }),
    ],
  },
  {
    id: 'work-mentor',
    min: 30,
    max: 64,
    weight: 3,
    requires: 'working',
    text: w(
      '有人希望成为你的学徒。带领别人也会改变你看待工作的方式。',
      'Someone asks to learn from you. Mentoring may change how you see your work.',
    ),
    choices: [
      choice('定期分享一项技能', 'Share a skill regularly', {
        knowledge: 4,
        connection: 5,
      }),
      choice('先完成一次短期合作', 'Try a short collaboration', {
        coins: 5,
        connection: 3,
      }),
    ],
  },
];
export const catalog = [...events, ...special];
const catalogMap = new Map(catalog.map((e) => [e.id, e]));
const clamp = (n: number) => Math.max(0, Math.min(100, n));
function random(s: GameState) {
  s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
  return s.rng / 4294967296;
}
export function eligible(e: LifeEvent, s: GameState) {
  return (
    s.age >= e.min &&
    s.age <= e.max &&
    !s.used.includes(e.id) &&
    (e.knowledge === undefined || s.stats.knowledge >= e.knowledge) &&
    (!e.requires ||
      {
        single: !s.partner,
        partner: s.partner && !s.married,
        married: s.married && s.children === 0,
        parent: s.children > 0,
        working: !!s.career,
        unemployed: !s.career,
      }[e.requires])
  );
}
export function currentEvent(s: GameState): LifeEvent | null {
  if (!s.pending) return null;
  if (s.pending.startsWith('hardship-'))
    return {
      id: s.pending,
      min: s.age,
      max: s.age,
      weight: 1,
      text: w(
        '余额已经不足以应付日常。你可以寻求社区帮助，或接受一项短期任务，生活仍能继续。',
        'Your balance cannot cover daily needs. Community support or a short task can help you continue.',
      ),
      choices: [
        choice(
          '申请过渡帮助并调整支出',
          'Seek temporary help and adjust costs',
          { coins: 15, connection: 3 },
        ),
        choice('完成一项力所能及的短期任务', 'Take a manageable short task', {
          coins: 20,
          health: -2,
          knowledge: 2,
        }),
      ],
    };
  if (s.pending.startsWith('ordinary-'))
    return {
      id: s.pending,
      min: s.age,
      max: s.age,
      weight: 1,
      text: w(
        '这一年没有特别的大事。日常的片段，也构成了完整的生活。',
        'No major event defines this year. Ordinary moments also make a life.',
      ),
      choices: [
        choice('继续这一年的日常', 'Continue with everyday life', { mood: 1 }),
      ],
    };
  return catalogMap.get(s.pending) ?? null;
}
function nextEvent(s: GameState) {
  if (s.ended) {
    s.pending = null;
    return;
  }
  if (s.age >= 18 && s.coins < 8) {
    s.pending = `hardship-${s.age}`;
    return;
  }
  const available = catalog.filter((e) => eligible(e, s));
  if (!available.length) {
    s.pending = `ordinary-${s.age}`;
    return;
  }
  let pick = random(s) * available.reduce((n, e) => n + e.weight, 0);
  s.pending = available[available.length - 1].id;
  for (const e of available) {
    pick -= e.weight;
    if (pick < 0) {
      s.pending = e.id;
      break;
    }
  }
}
export function newGame(
  seed: number,
  appearance: 0 | 1 = 0,
  background: 0 | 1 | 2 = 0,
): GameState {
  const s: GameState = {
    version: 1,
    seed: seed >>> 0,
    rng: seed >>> 0,
    age: 0,
    appearance,
    background,
    stats: {
      health: 78,
      mood: 65,
      knowledge: 15 + (background === 1 ? 8 : 0),
      connection: 55 + (background === 2 ? 8 : 0),
    },
    coins: [65, 50, 40][background],
    career: null,
    partner: false,
    married: false,
    children: 0,
    focus: 'rest',
    used: [],
    pending: null,
    history: [],
    ended: false,
  };
  nextEvent(s);
  return s;
}
export function advance(state: GameState, index: number): GameState {
  if (state.ended) throw new Error('This life is complete');
  const e = currentEvent(state);
  if (!e || !Number.isInteger(index) || !e.choices[index])
    throw new Error('Invalid choice');
  const s: GameState = structuredClone(state),
    option = e.choices[index],
    before = { ...s.stats, coins: s.coins };
  for (const key of stats)
    s.stats[key] = clamp(s.stats[key] + (option.effects[key] ?? 0));
  s.coins = Math.max(0, s.coins + (option.effects.coins ?? 0));
  if (option.effects.career) s.career = option.effects.career;
  if (option.effects.partner) s.partner = true;
  if (option.effects.married) s.married = true;
  if (option.effects.child) s.children = 1;
  const age = s.age;
  if (age >= 18) {
    s.stats.knowledge = clamp(s.stats.knowledge - 1);
    s.stats.connection = clamp(s.stats.connection - 2);
    s.stats.mood = clamp(s.stats.mood - 3);
    if (age >= 40) s.stats.health = clamp(s.stats.health - 1);
    const income =
      age >= 65
        ? 7
        : s.career
          ? careers[s.career].pay + Math.floor(s.stats.knowledge / 25)
          : 4;
    const expenses = age >= 65 ? 6 : 8 + (s.children > 0 && age < 50 ? 3 : 0);
    s.coins = Math.max(0, s.coins + income - expenses);
    const focusEffects: Record<Focus, Effects> = {
      career: { knowledge: 1, coins: s.career && age < 65 ? 4 : 1, health: -1 },
      study: { knowledge: 3, mood: 1 },
      company: { connection: 3, mood: 2 },
      rest: { health: 3, mood: 2 },
    };
    const effect = focusEffects[s.focus];
    for (const key of stats)
      s.stats[key] = clamp(s.stats[key] + (effect[key] ?? 0));
    s.coins += effect.coins ?? 0;
  }
  if (age >= 70) s.stats.health = clamp(s.stats.health - (age >= 80 ? 8 : 6));
  if (age < 18) s.stats.knowledge = clamp(s.stats.knowledge + 1);
  s.stats.mood = clamp(s.stats.mood + Math.floor(random(s) * 3) - 1);
  s.used.push(e.id);
  const delta = {
    health: s.stats.health - before.health,
    mood: s.stats.mood - before.mood,
    knowledge: s.stats.knowledge - before.knowledge,
    connection: s.stats.connection - before.connection,
    coins: s.coins - before.coins,
  };
  s.history.push({
    age,
    eventId: e.id,
    choiceIndex: index,
    focus: s.focus,
    text: e.text,
    choice: option.label,
    result: option.result,
    delta,
  });
  s.age++;
  s.ended = s.age >= 90 || (age >= 70 && s.stats.health === 0);
  nextEvent(s);
  return s;
}
export function setFocus(s: GameState, focus: Focus): GameState {
  if (s.age < 18 || s.ended || !focuses.includes(focus)) return s;
  return { ...s, focus };
}
// Treat browser storage as untrusted. Rebuild from the seed and recorded actions;
// never render user-supplied event text or execute stored effects.
export function restoreGame(raw: string): GameState | null {
  try {
    if (raw.length > 350000) return null;
    const input = JSON.parse(raw);
    if (
      input.version !== 1 ||
      !Number.isInteger(input.seed) ||
      input.seed < 0 ||
      input.seed > 4294967295 ||
      ![0, 1].includes(input.appearance) ||
      ![0, 1, 2].includes(input.background) ||
      !Array.isArray(input.history) ||
      input.history.length > 90 ||
      !focuses.includes(input.focus)
    )
      return null;
    let s = newGame(input.seed, input.appearance, input.background);
    for (const record of input.history) {
      if (
        s.ended ||
        record.age !== s.age ||
        record.eventId !== s.pending ||
        !focuses.includes(record.focus)
      )
        return null;
      s = setFocus(s, record.focus);
      s = advance(s, record.choiceIndex);
    }
    s = setFocus(s, input.focus);
    if (JSON.stringify(s) !== JSON.stringify(input)) return null;
    return s;
  } catch {
    return null;
  }
}
export function recap(s: GameState, en: boolean): string {
  const text = (v: { zh: string; en: string }) => (en ? v.en : v.zh);
  return [
    (en ? 'Another Chapter' : '人生另一页') + ` · ${s.age}`,
    en
      ? 'Fictional life, not a personal prediction.'
      : '虚构人生，不是个人命运预测。',
    ...s.history.map(
      (h) =>
        `${h.age}: ${text(h.text)}\n${text(h.choice)} · ${text(h.result)}\n${Object.entries(
          h.delta,
        )
          .map(([key, n]) => `${key} ${n >= 0 ? '+' : ''}${n}`)
          .join(' / ')}`,
    ),
  ].join('\n\n');
}
