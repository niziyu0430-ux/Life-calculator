import Game from '../../life-game';
import { pageMeta } from '../../meta';
export const metadata = pageMeta(
  '/play',
  'Another Chapter · A life of small choices',
  'An original life simulation from childhood to later life. Make choices, explore their effects, and continue with a local save.',
  true,
);
export default function Page() {
  return <Game en />;
}
