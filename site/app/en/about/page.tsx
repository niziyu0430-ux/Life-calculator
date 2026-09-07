import Info from '../../info';
import { pageMeta } from '../../meta';
export const metadata = pageMeta(
  '/about',
  'About & contact · Life Counter',
  'The purpose of Life Counter, our content approach and how to contact us.',
  true,
);
export default function Page() {
  return <Info kind="about" en />;
}
