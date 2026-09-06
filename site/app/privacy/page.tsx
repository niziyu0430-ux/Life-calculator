import Info from '../info';
import { pageMeta } from '../meta';
export const metadata = pageMeta(
  '/privacy',
  '隐私说明 · 人生计算器',
  '了解日期输入、本地计算、托管日志及邮件联系的信息处理方式。',
);
export default function Page() {
  return <Info kind="privacy" />;
}
