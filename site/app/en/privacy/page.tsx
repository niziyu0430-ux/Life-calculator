import Info from '../../info';
import { pageMeta } from '../../meta';
export const metadata = pageMeta(
  '/privacy',
  'Privacy · Life Counter',
  'How calculator inputs, hosting logs and email correspondence are handled.',
  true,
);
export default function Page() {
  return <Info kind="privacy" en />;
}
