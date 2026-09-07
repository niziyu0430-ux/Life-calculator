import WeekPlanner from '../../week-planner';
import { pageMeta } from '../../meta';
export const metadata = pageMeta(
  '/week-planner',
  '168-hour lab · Weekly time budget & small project planner',
  'Adjust sleep, work, travel and care hours, see the unallocated time in a week and build a small project schedule you can download.',
  true,
);
export default function Page() {
  return (
    <div lang="en">
      <header>
        <a className="brand" href="/en/">
          ◷ Life Counter
        </a>
        <nav>
          <a href="/en/">Life in weeks</a>
          <a href="/week-planner/" className="language">
            中文 ↗
          </a>
        </nav>
      </header>
      <main>
        <WeekPlanner en />
      </main>
      <footer>
        <a href="/en/about/">About & contact</a>
        <a href="/en/privacy/">Privacy</a>
      </footer>
    </div>
  );
}
