export type Words = { zh: string; en: string };
export type Stat = 'health' | 'mood' | 'knowledge' | 'connection';
export type Focus = 'career' | 'study' | 'company' | 'rest';
export type Career =
  | 'education'
  | 'technology'
  | 'creative'
  | 'service'
  | 'craft'
  | 'public';
export type Effects = Partial<Record<Stat | 'coins', number>> & {
  career?: Career;
  partner?: boolean;
  married?: boolean;
  child?: boolean;
};
export type Choice = { label: Words; effects: Effects; result: Words };
export type LifeEvent = {
  id: string;
  min: number;
  max: number;
  text: Words;
  weight: number;
  choices: Choice[];
  requires?:
    | 'single'
    | 'partner'
    | 'married'
    | 'parent'
    | 'working'
    | 'unemployed';
  knowledge?: number;
};
export type RecordEntry = {
  age: number;
  eventId: string;
  choiceIndex: number;
  focus: Focus;
  text: Words;
  choice: Words;
  result: Words;
  delta: Record<Stat | 'coins', number>;
};
export type GameState = {
  version: 1;
  seed: number;
  rng: number;
  age: number;
  appearance: 0 | 1;
  background: 0 | 1 | 2;
  stats: Record<Stat, number>;
  coins: number;
  career: Career | null;
  partner: boolean;
  married: boolean;
  children: number;
  focus: Focus;
  used: string[];
  pending: string | null;
  history: RecordEntry[];
  ended: boolean;
};
