import Calculator from '../calculator';
import { pageMeta } from '../meta';
export const metadata = pageMeta(
  '',
  'Life Counter · Life in weeks & day milestones',
  'See your life in weeks, find your 10,000-day milestone and calculate days between dates. Free tools with clear methods and no account.',
  true,
);
export default function Home() {
  return <Calculator lang="en" />;
}
