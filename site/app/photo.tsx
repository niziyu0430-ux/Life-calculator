export const photoRegistry = {
  'life-in-weeks': {
    src: '/images/life-in-weeks.webp',
    width: 1536,
    height: 1024,
    zh: '七个容器盛放阅读、相聚与休息，让一周成为生活片段的集合。',
    en: 'Seven vessels hold reading, company and rest: a week made of lived moments.',
  },
  'day-milestones': {
    src: '/images/day-milestones.webp',
    width: 1536,
    height: 1024,
    zh: '日历、沙漏与一份小小的庆祝，为普通日子留下纪念。',
    en: 'A calendar, hourglass and small celebration mark an ordinary day.',
  },
  'date-math': {
    src: '/images/date-math.webp',
    width: 1536,
    height: 1024,
    zh: '连续的日历页连接两个标记；准确的计数规则请看下方示例。',
    en: 'Calendar pages connect two markers. See the examples below for exact counting rules.',
  },
  'weekly-time-budget': {
    src: '/images/weekly-time-budget.webp',
    width: 1536,
    height: 1024,
    zh: '休息、工作、照护与兴趣，在有限的时间里寻找平衡。',
    en: 'Rest, work, care and interests find balance within a finite week.',
  },
  'small-time-projects': {
    src: '/images/small-time-projects.webp',
    width: 1536,
    height: 1024,
    zh: '把难以推动的大石头，拆解成今天可以迈出的小台阶。',
    en: 'Turn a difficult climb into a small step you can take today.',
  },
  'milestone-calendar': {
    src: '/images/milestone-calendar.webp',
    width: 1536,
    height: 1024,
    zh: '从桌面日历到手机，让一个值得记住的日子有处安放。',
    en: 'From desk calendar to phone: give a memorable day a place to live.',
  },
  'planner-priorities': {
    src: '/images/planner-priorities.webp',
    width: 1536,
    height: 1024,
    zh: '在不同的小路之间，先选择真正想去的方向。',
    en: 'Among possible paths, first choose the direction that matters to you.',
  },
};
export default function Photo({
  placement,
  en,
}: {
  placement: string;
  en: boolean;
}) {
  const photo = photoRegistry[placement as keyof typeof photoRegistry];
  if (!photo) return null;
  return (
    <figure className="photo-note" data-photo={placement}>
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        alt={en ? photo.en : photo.zh}
      />
      <figcaption>{en ? photo.en : photo.zh}</figcaption>
    </figure>
  );
}
