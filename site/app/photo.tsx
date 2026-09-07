export const photoRegistry = {
  'weekly-time-budget': {
    src: '/images/balance.webp',
    width: 1200,
    height: 675,
    zh: '海边的平衡石，提醒我们给不同活动留出空间。',
    en: 'Balanced stones by the sea: make room for different parts of your week.',
  },
  'small-time-projects': {
    src: '/images/effort.webp',
    width: 830,
    height: 498,
    zh: '推石上坡的意象：遇到阻力时，缩小下一步，而不是一味增加投入。',
    en: 'Pushing a stone uphill: when progress is hard, make the next step smaller.',
  },
  'planner-priorities': {
    src: '/images/compass.webp',
    width: 678,
    height: 452,
    zh: '先选方向，再安排时间。写下一件你真正想留时间做的事。',
    en: 'Choose a direction before allocating time. Name one thing you want to make room for.',
  },
  'day-milestones': {
    src: '/images/time-hourglass.webp',
    width: 1536,
    height: 1024,
    zh: '沙漏与空白日历：为普通日子找到一个值得记住的坐标。',
    en: 'An hourglass and a blank calendar: a way to mark an otherwise ordinary day.',
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
