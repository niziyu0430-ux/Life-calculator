import Info from '../info';
import { pageMeta } from '../meta';
export const metadata = pageMeta(
  '/about',
  '关于与联系 · 人生计算器',
  '了解人生计算器的用途、内容维护方式与联系方式。',
);
export default function Page() {
  return <Info kind="about" />;
}
