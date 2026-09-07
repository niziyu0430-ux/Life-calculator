import Game from '../life-game';
import { pageMeta } from '../meta';
export const metadata = pageMeta(
  '/play',
  '人生另一页 · 一局人生，一页选择',
  '从幼年到晚年，体验选择带来的变化。原创双语人生模拟游戏，自动本地存档。',
);
export default function Page() {
  return <Game en={false} />;
}
