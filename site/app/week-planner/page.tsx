import WeekPlanner from '../week-planner';
import { pageMeta } from '../meta';
export const metadata = pageMeta(
  '/week-planner',
  '168 小时实验室 · 每周时间分配与小项目计算',
  '调整每周睡眠、工作、通勤与照护时间，查看尚未分配的小时，为一个小项目安排可执行的时间，并下载计划草稿。',
);
export default function Page() {
  return (
    <>
      <header>
        <a className="brand" href="/">
          ◷ 人生计算器
        </a>
        <nav>
          <a href="/">人生周历</a>
          <a href="/en/week-planner/" className="language">
            EN ↗
          </a>
        </nav>
      </header>
      <main>
        <WeekPlanner />
      </main>
      <footer>
        <a href="/about/">关于与联系</a>
        <a href="/privacy/">隐私说明</a>
      </footer>
    </>
  );
}
