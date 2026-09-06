import Calculator from './calculator';
import { pageMeta } from './meta';
export const metadata = pageMeta(
  '',
  '人生计算器 · 人生周历、整千天纪念日与日期间隔',
  '用人生周历看见走过的时间，发现整千天纪念日，计算日期间隔。免费、无需注册，配有原创计算说明。',
);
export default function Home() {
  return <Calculator lang="zh" />;
}
